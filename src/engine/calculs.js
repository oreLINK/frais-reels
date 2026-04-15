import {
  ABATTEMENT,
  BAREME_KM,
  MAJORATION_ELECTRIQUE,
  LIMITE_DISTANCE_ALLER_KM,
  REPAS,
  MATERIEL,
} from '../config/fiscalite.js';

// =============================================================================
// CALCUL ABATTEMENT 10%
// =============================================================================
export function calcAbattement10(sni) {
  const montantBrut = Math.floor(sni * ABATTEMENT.taux);
  const montant = Math.max(ABATTEMENT.plancher, Math.min(montantBrut, ABATTEMENT.plafond));

  return {
    montant,
    estPlancher: montant === ABATTEMENT.plancher,
    estPlafond: montant === ABATTEMENT.plafond,
  };
}

// =============================================================================
// CALCUL BARÈME KILOMÉTRIQUE
// =============================================================================
export function calcBaremeKm(typeVehicule, puissance, distanceAller, joursAn, estElectrique) {
  const distanceAnnuelle = distanceAller * 2 * joursAn;
  let taux = 1;
  if (estElectrique) taux *= (1 + MAJORATION_ELECTRIQUE.taux);

  const typeIndex = typeVehicule === 'voiture' ? 'voiture' : typeVehicule === 'moto' ? 'moto' : 'cyclo';
  const cle = typeIndex === 'cyclo' ? 'unique' : puissance;
  const bareme = BAREME_KM[typeIndex][cle];

  let montantKm;
  if (distanceAnnuelle <= bareme.seuil1) {
    montantKm = distanceAnnuelle * bareme.tranches[0];
  } else if (distanceAnnuelle <= bareme.seuil2) {
    montantKm = (distanceAnnuelle * bareme.tranches[1]) + bareme.tranches[2];
  } else {
    montantKm = distanceAnnuelle * bareme.tranches[3];
  }

  montantKm *= taux;

  const alerteDistance = distanceAller > LIMITE_DISTANCE_ALLER_KM.valeur;
  const messageAlerte = alerteDistance
    ? `Distance > ${LIMITE_DISTANCE_ALLER_KM.valeur} km : justification requise`
    : '';

  return {
    distanceAnnuelle,
    montantKm: Math.round(montantKm),
    alerteDistance,
    messageAlerte,
  };
}

// =============================================================================
// CALCUL REPAS
// =============================================================================
export function calcRepas(typeRepas, coutRepas, joursRepas, aTicketResto = false, partPatronaleAnnuelle = 0) {
  let deductionBrute;

  if (typeRepas === 'cantine') {
    deductionBrute = REPAS.plafondDeduction;
  } else {
    deductionBrute = Math.min(coutRepas, REPAS.plafondExcessif) - REPAS.forfaitDomicile;
  }

  // Déduction de la part patronale des tickets restaurant (par jour)
  const partPatronaleJour = joursRepas > 0 ? partPatronaleAnnuelle / joursRepas : 0;
  const deductionUnitaire = Math.max(0, deductionBrute - partPatronaleJour);

  const totalNet = Math.round(deductionUnitaire * joursRepas);

  return {
    deductionUnitaire: Math.round(deductionUnitaire * 100) / 100,
    totalNet: Math.max(0, totalNet),
  };
}

// =============================================================================
// CALCUL LOGEMENT (TÉLÉTRAVAIL)
// =============================================================================
export function calcLogement(surfaceTotale, surfaceBureau, charges) {
  if (surfaceTotale === 0) return { ratio: 0, totalLogement: 0 };

  const ratio = (surfaceBureau / surfaceTotale) * 100;
  const totalCharges = Object.values(charges).reduce((a, b) => a + b, 0);
  const totalLogement = Math.round((ratio / 100) * totalCharges);

  return {
    ratio: Math.round(ratio * 100) / 100,
    totalLogement,
  };
}

// =============================================================================
// CALCUL MATÉRIEL
// =============================================================================
export function calcMateriel(articlesPlus500, totalMoins500, abonnements) {
  let totalAmortissements = 0;

  articlesPlus500.forEach((article) => {
    totalAmortissements += Math.round(article.prix / MATERIEL.dureeAmortissement);
  });

  const totalFournitures = totalMoins500;

  let totalAbonnements = 0;
  Object.values(abonnements).forEach((abonnement) => {
    totalAbonnements += Math.round((abonnement.montant * abonnement.pctPro) / 100);
  });

  return {
    totalAmortissements,
    totalFournitures,
    totalAbonnements,
    totalMateriel: totalAmortissements + totalFournitures + totalAbonnements,
  };
}

// =============================================================================
// CALCUL SYNTHÈSE GLOBALE
// =============================================================================
export function calcSynthese(state) {
  const transport = calcBaremeKm(
    state.typeVehicule, state.puissance,
    state.distanceAller, state.joursTravailSite, state.estElectrique
  );
  const totalTransport = transport.montantKm + state.peages + state.parking;

  const repas = calcRepas(
    state.typeRepas, state.coutRepas, state.joursRepas,
    state.aTicketResto, state.aTicketResto ? state.partPatronale : 0
  );

  const logement = calcLogement(state.surfaceTotale, state.surfaceBureau, state.charges);

  const materiel = calcMateriel(state.articlesPlus500, state.totalMoins500, state.abonnements);

  const abattement10 = calcAbattement10(state.sni);

  let fraisSecurisesTotal = 0;
  let fraisRisquesTotal = 0;

  if (state.justif_transport) fraisSecurisesTotal += totalTransport;
  else fraisRisquesTotal += totalTransport;

  if (state.justif_repas) fraisSecurisesTotal += repas.totalNet;
  else fraisRisquesTotal += repas.totalNet;

  if (state.justif_logement) fraisSecurisesTotal += logement.totalLogement;
  else fraisRisquesTotal += logement.totalLogement;

  if (state.justif_materiel) fraisSecurisesTotal += materiel.totalMateriel;
  else fraisRisquesTotal += materiel.totalMateriel;

  const superieurAbattement = fraisSecurisesTotal > abattement10.montant;
  const ecart = Math.abs(fraisSecurisesTotal - abattement10.montant);
  const verdict = superieurAbattement
    ? `Les frais réels dépassent l'abattement de ${ecart.toLocaleString()} €`
    : `L'abattement 10 % est plus avantageux de ${ecart.toLocaleString()} €`;

  const economie = superieurAbattement ? Math.round(ecart * 0.30) : 0;

  return {
    totalTransport,
    totalRepas: repas.totalNet,
    totalLogement: logement.totalLogement,
    totalMateriel: materiel.totalMateriel,
    fraisSecurisesTotal,
    fraisRisquesTotal,
    abattement10: abattement10.montant,
    superieurAbattement,
    verdict,
    economie,
    transport,
    repas,
    logement,
    materiel,
  };
}
