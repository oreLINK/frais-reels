// =============================================================================
//  PARAMÈTRES FISCAUX – Revenus 2025 / Déclaration 2026
//  Source : bofip.impots.gouv.fr
//  ⚠️  Modifier UNIQUEMENT ce fichier quand les barèmes changent.
//  📋  Chaque valeur a un champ `ref` pointant vers references.js
// =============================================================================

const ANNEE_REVENUS = 2025;
const ANNEE_DECLARATION = 2026;

// -----------------------------------------------------------------------------
// 1. ABATTEMENT FORFAITAIRE 10%
// -----------------------------------------------------------------------------
const ABATTEMENT = {
  taux: 0.10,
  plancher: 509,
  plafond: 14_555,
  ref: ['abattement_base', 'abattement_plafond', 'abattement_plancher', 'abattement_montants_annuels'],
};

// -----------------------------------------------------------------------------
// 2. BARÈME KILOMÉTRIQUE
//    Structure : { seuil1, seuil2, tranches: [coeff_bas, coeff_mid, fixe_mid, coeff_haut] }
//    Formules :
//      D ≤ seuil1        → D × tranches[0]
//      seuil1 < D ≤ seuil2 → (D × tranches[1]) + tranches[2]
//      D > seuil2         → D × tranches[3]
// -----------------------------------------------------------------------------
const BAREME_KM = {
  voiture: {
    '3CV':  { seuil1: 5000, seuil2: 20000, tranches: [0.529, 0.316, 1065, 0.370] },
    '4CV':  { seuil1: 5000, seuil2: 20000, tranches: [0.606, 0.340, 1330, 0.407] },
    '5CV':  { seuil1: 5000, seuil2: 20000, tranches: [0.636, 0.357, 1395, 0.427] },
    '6CV':  { seuil1: 5000, seuil2: 20000, tranches: [0.665, 0.374, 1457, 0.447] },
    '7CV+': { seuil1: 5000, seuil2: 20000, tranches: [0.697, 0.394, 1515, 0.470] },
  },
  moto: {
    '1-2CV': { seuil1: 3000, seuil2: 6000, tranches: [0.395, 0.099, 891,  0.248] },
    '3-5CV': { seuil1: 3000, seuil2: 6000, tranches: [0.468, 0.082, 1158, 0.275] },
    '5CV+':  { seuil1: 3000, seuil2: 6000, tranches: [0.606, 0.079, 1583, 0.343] },
  },
  cyclo: {
    unique: { seuil1: 3000, seuil2: 6000, tranches: [0.315, 0.079, 711, 0.198] },
  },
  ref: ['bareme_km_base_legale', 'bareme_km_arrete', 'bareme_km_brochure'],
};

// Majoration véhicules électriques (+20%)
const MAJORATION_ELECTRIQUE = {
  taux: 0.20,
  ref: ['majoration_electrique'],
};

// Limite distance aller (au-delà → justification obligatoire)
const LIMITE_DISTANCE_ALLER_KM = {
  valeur: 40,
  ref: ['limite_40km', 'limite_40km_bofip'],
};

// -----------------------------------------------------------------------------
// 3. FRAIS DE REPAS
// -----------------------------------------------------------------------------
const REPAS = {
  forfaitDomicile: 5.45,      // Valeur du repas à domicile – déduite systématiquement
  plafondExcessif: 21.10,     // Au-delà, la dépense est considérée excessive
  get plafondDeduction() { return this.plafondExcessif - this.forfaitDomicile; }, // 15.65 max
  ref: ['repas_forfait_domicile', 'repas_plafond', 'repas_salaries_impots', 'repas_calcul_detail'],
};

// -----------------------------------------------------------------------------
// 4. TÉLÉTRAVAIL (forfait alternatif au prorata)
// -----------------------------------------------------------------------------
const TELETRAVAIL = {
  forfaitJour: 2.70,
  forfaitMois: 59.40,
  forfaitAn: 626.40,  // 2,70 € × 232 jours ouvrés max – source : service-public.gouv.fr 2025
  ref: ['teletravail_forfait', 'teletravail_local_bofip'],
};

// -----------------------------------------------------------------------------
// 5. MATÉRIEL & AMORTISSEMENT
// -----------------------------------------------------------------------------
const MATERIEL = {
  seuilAmortissement: 500,    // Au-dessus → amortissement sur N années
  dureeAmortissement: 3,      // Nombre d'années d'amortissement
  ref: ['materiel_amortissement'],
};

// -----------------------------------------------------------------------------
// 6. DATES LIMITES DE DÉCLARATION
//    Source : impots.gouv.fr – calendrier campagne déclarative
//    ⚠️  Mettre à jour chaque année en mars quand les dates sont publiées.
//    Zones internet basées sur le numéro de département du déclarant.
// -----------------------------------------------------------------------------
const DATES_LIMITES = {
  anneeDeclaration: 2026,
  source: 'info.gouv.fr – calendrier campagne déclarative 2026',
  note: 'Dates officielles publiées par le gouvernement.',

  ouverture: {
    date: '2026-04-09',
    dateLabel: '9 avril 2026',
  },

  papier: {
    label: 'Déclaration papier',
    departements: 'Tous départements',
    date: '2026-05-19',
    dateLabel: '19 mai 2026',
    description: 'Date de dépôt ou cachet postal faisant foi',
  },

  internet: [
    {
      zone: 1,
      departements: 'N° 01 à 19 · Non-résidents',
      departementsRange: [1, 19],
      departementsSpeciaux: [99],          // 99 = non-résidents
      date: '2026-05-21',
      dateLabel: '21 mai 2026',
    },
    {
      zone: 2,
      departements: 'N° 20 à 54 · Corse (2A, 2B)',
      departementsRange: [20, 54],
      departementsSpeciaux: [],            // 2A/2B gérés séparément dans l'UI
      date: '2026-05-28',
      dateLabel: '28 mai 2026',
    },
    {
      zone: 3,
      departements: 'N° 55 à 95 · DOM (971–974, 976)',
      departementsRange: [55, 95],
      departementsSpeciaux: [971, 972, 973, 974, 976],
      date: '2026-06-04',
      dateLabel: '4 juin 2026',
    },
  ],
};

// -----------------------------------------------------------------------------
// 7. TEXTES LÉGAUX & AVERTISSEMENTS
// -----------------------------------------------------------------------------
const TEXTES = {
  alerteDistance: `Au-delà de ${LIMITE_DISTANCE_ALLER_KM.valeur} km, vous devez justifier de circonstances particulières (éloignement contraint, absence d'emploi similaire à proximité, scolarisation des enfants…).`,
  avertissementControle: "En cas de contrôle, l'administration peut remonter sur 3 ans. Absence de justificatif = Redressement + 10 % de majoration + 0,20 % d'intérêt de retard par mois.",
  mentionDonnees: "Aucune donnée n'est collectée, transmise ou stockée. Tout est calculé dans votre navigateur.",
  caseDeclaration: "1AK",
  ref: {
    alerteDistance: ['limite_40km'],
    avertissementControle: ['delai_reprise'],
    caseDeclaration: ['case_declaration'],
    justificatifs: ['obligation_justificatifs'],
  },
};

export {
  ANNEE_REVENUS,
  ANNEE_DECLARATION,
  ABATTEMENT,
  BAREME_KM,
  MAJORATION_ELECTRIQUE,
  LIMITE_DISTANCE_ALLER_KM,
  REPAS,
  TELETRAVAIL,
  MATERIEL,
  TEXTES,
  DATES_LIMITES,
};
