import { Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { TEXTES, ANNEE_REVENUS, ANNEE_DECLARATION, REPAS, BAREME_KM, MATERIEL } from '../../config/fiscalite';

// ─── Helpers couleurs ──────────────────────────────────────────────────────────
const C = {
  navy:      [30,  58,  95],
  navyLight: [237, 242, 248],
  white:     [255, 255, 255],
  green:     [22,  163,  74],
  greenBg:   [240, 253, 244],
  amber:     [180,  90,   0],
  amberBg:   [255, 251, 235],
  dark:      [30,   30,  30],
  gray:      [100, 100, 100],
  lightGray: [180, 180, 180],
};

// ─── Timestamp filename ────────────────────────────────────────────────────────
function buildFilename() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `impots-fr-${ANNEE_DECLARATION}-${ts}.pdf`;
}

// ─── Texte copier ──────────────────────────────────────────────────────────────
function buildTexteCopier(state, synthese) {
  const { recommendation, fraisReelsTotal, abattement10, totalTransport, totalRepas, totalLogement, totalMateriel } = synthese;
  const lines = [
    `FRAIS REELS — Revenus ${ANNEE_REVENUS} · Declaration ${ANNEE_DECLARATION}`,
    '',
    `Salaire Net Imposable : ${state.sni.toLocaleString('fr-FR')} €`,
    `Abattement 10 % : ${abattement10.toLocaleString('fr-FR')} €`,
    '',
    `Transport   : ${totalTransport.toLocaleString('fr-FR')} € ${state.justif_transport ? '[OK]' : '[!]'}`,
    `Repas       : ${totalRepas.toLocaleString('fr-FR')} € ${state.justif_repas ? '[OK]' : '[!]'}`,
    `Logement    : ${totalLogement.toLocaleString('fr-FR')} € ${state.justif_logement ? '[OK]' : '[!]'}`,
    `Materiel    : ${totalMateriel.toLocaleString('fr-FR')} € ${state.justif_materiel ? '[OK]' : '[!]'}`,
    '',
    `Total frais réels : ${fraisReelsTotal.toLocaleString('fr-FR')} €`,
    '',
  ];
  if (recommendation === 'frais_reels') {
    lines.push(`=> RECOMMANDATION : Frais réels (Case ${TEXTES.caseDeclaration} = ${synthese.fraisSecurisesTotal.toLocaleString('fr-FR')} €)`);
  } else if (recommendation === 'abattement') {
    lines.push(`=> RECOMMANDATION : Abattement 10 % automatique (${abattement10.toLocaleString('fr-FR')} €)`);
  } else {
    lines.push(`=> RECOMMANDATION : Abattement 10 % cette année (justificatifs incomplets)`);
    lines.push(`   Preparez votre dossier ${ANNEE_REVENUS + 1} pour opter l'an prochain.`);
  }
  return lines.join('\n');
}

// ─── Génération PDF ────────────────────────────────────────────────────────────
function generatePDF(state, synthese) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const {
    recommendation, fraisReelsTotal, abattement10,
    totalTransport, totalRepas, totalLogement, totalMateriel,
    transport, repas, logement, materiel,
  } = synthese;

  const LM = 18;
  const RM = 192;
  const W  = 174;
  let y = 0;

  // ── Formateur nombres : espace ASCII, pas U+202F ─────────────
  const fmt = (n) => {
    const s = String(Math.round(Number(n) || 0));
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €';
  };
  const fmtN = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // ── Layout helpers ────────────────────────────────────────────
  const checkPage = () => { if (y > 268) { doc.addPage(); y = 16; } };
  const sp = (h = 5) => { y += h; };

  const hline = (color = C.lightGray) => {
    doc.setDrawColor(...color);
    doc.line(LM, y, RM, y);
    y += 4;
  };

  const sectionHeader = (title) => {
    checkPage();
    doc.setFillColor(...C.navyLight);
    doc.rect(LM, y - 2, W, 7.5, 'F');
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.navy);
    doc.text(title, LM + 3, y + 3.5);
    y += 9;
  };

  // row : label gauche, valeur droite — tronque le label si trop long
  const row = (label, value, opts = {}) => {
    checkPage();
    const { indent = 0, labelColor = C.gray, valueColor = C.dark, bold = false, fs = 9.5 } = opts;
    const valStr = String(value);

    doc.setFontSize(fs);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const valW = doc.getTextWidth(valStr);
    const maxLabel = W - indent - valW - 6;

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...labelColor);
    let lbl = label;
    while (doc.getTextWidth(lbl) > maxLabel && lbl.length > 5) lbl = lbl.slice(0, -1);
    if (lbl !== label) lbl = lbl.trimEnd() + '...';
    doc.text(lbl, LM + indent, y);

    doc.setFontSize(fs);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(...valueColor);
    doc.text(valStr, RM, y, { align: 'right' });
    y += 5.5;
  };

  // note : texte petit en italique avec retour à la ligne automatique
  const note = (text, indent = 5, color = C.lightGray) => {
    checkPage();
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, W - indent - 4);
    lines.forEach((l) => { doc.text(l, LM + indent, y); y += 4; });
  };

  // subtotal : ligne de séparation + montant en couleur + statut justificatifs
  const subtotalRow = (label, value, securise) => {
    hline();
    checkPage();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.navy);
    doc.text(label, LM, y);
    const col = securise === undefined ? C.navy : securise ? C.green : C.amber;
    doc.setTextColor(...col);
    doc.text(value, RM, y, { align: 'right' });
    y += 5;
    if (securise !== undefined) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...(securise ? C.green : C.amber));
      // Uniquement ASCII — pas de checkmark Unicode
      doc.text(securise ? 'Justificatifs confirmes' : '(!) Justificatifs manquants', LM + 2, y);
      y += 5;
    }
    sp(3);
  };

  // coloredBox : titre + lignes de corps avec calcul de hauteur correct
  const coloredBox = (lines, bgColor, textColor, borderColor) => {
    checkPage();
    const LH = 4.8;

    // Pré-calculer AVEC la bonne taille de police par ligne
    const allWrapped = lines.map((l, i) => {
      doc.setFontSize(i === 0 ? 10 : 9);
      doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
      return doc.splitTextToSize(l, W - 12);
    });

    const totalLineCount = allWrapped.reduce((s, ls) => s + ls.length, 0);
    const interLineGaps = lines.length - 1;
    const boxH = totalLineCount * LH + interLineGaps * 1.5 + 13;

    doc.setFillColor(...bgColor);
    doc.setDrawColor(...borderColor);
    doc.roundedRect(LM, y, W, boxH, 2, 2, 'FD');

    let ty = y + 7;
    allWrapped.forEach((ls, i) => {
      doc.setFontSize(i === 0 ? 10 : 9);
      doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
      doc.setTextColor(...textColor);
      ls.forEach((l) => { doc.text(l, LM + 5, ty); ty += LH; });
      if (i < allWrapped.length - 1) ty += 1.5;
    });

    y = ty + 5;
  };

  // ════════════════════════════════════════════════════════════
  // HEADER
  // ════════════════════════════════════════════════════════════
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.white);
  doc.text('Frais Reels - Recapitulatif complet', LM, 13);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 200, 230);
  doc.text(`Revenus ${ANNEE_REVENUS}  -  Declaration ${ANNEE_DECLARATION}`, LM, 21);
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  doc.text(`Genere le ${dateStr} a ${timeStr}`, RM, 21, { align: 'right' });
  y = 40;

  // ════════════════════════════════════════════════════════════
  // 1. REVENUS
  // ════════════════════════════════════════════════════════════
  sectionHeader('1 - REVENUS');
  row('Salaire Net Imposable (SNI)', fmt(state.sni), { bold: true, valueColor: C.navy });
  note('Champ "Net imposable" de votre derniere fiche de paie annuelle.');
  row('Abattement forfaitaire 10 %', fmt(abattement10), { valueColor: C.green });
  note('Deduction automatique plafonnee entre 509 € et 14 555 €.');
  row('Seuil a depasser pour que les frais reels soient interessants', fmt(abattement10), { labelColor: C.navy, valueColor: C.navy, bold: true });
  sp(3);

  // ════════════════════════════════════════════════════════════
  // 2. TRANSPORTS
  // ════════════════════════════════════════════════════════════
  sectionHeader('2 - TRANSPORTS');
  const vehiculeLabel = state.typeVehicule === 'voiture' ? 'Voiture' : state.typeVehicule === 'moto' ? 'Moto / scooter' : 'Cyclomoteur';
  row('Vehicule', `${vehiculeLabel}${state.typeVehicule !== 'cyclo' ? ` - ${state.puissance}` : ''}${state.estElectrique ? ' (electrique)' : ''}`, { bold: true, valueColor: C.navy });
  row('Distance aller domicile - travail', `${state.distanceAller} km`);
  row('Distance aller-retour par jour', `${state.distanceAller * 2} km`);
  row('Jours travailles sur site par an', `${state.joursTravailSite} j`);
  row('Distance annuelle totale', `${fmtN(transport.distanceAnnuelle)} km`, { bold: true, valueColor: C.navy });
  sp(1);

  const typeIdx = state.typeVehicule === 'voiture' ? 'voiture' : state.typeVehicule === 'moto' ? 'moto' : 'cyclo';
  const cle = typeIdx === 'cyclo' ? 'unique' : state.puissance;
  const bareme = BAREME_KM[typeIdx]?.[cle];
  const kmBrut = Math.round(transport.montantKm / (state.estElectrique ? 1.20 : 1));
  if (bareme) {
    const D = transport.distanceAnnuelle;
    if (D <= bareme.seuil1) {
      note(`Formule : ${fmtN(D)} km x ${bareme.tranches[0]} €/km = ${fmt(kmBrut)}`, 5, C.gray);
    } else if (D <= bareme.seuil2) {
      note(`Formule : (${fmtN(D)} km x ${bareme.tranches[1]}) + ${fmtN(bareme.tranches[2])} = ${fmt(kmBrut)}`, 5, C.gray);
    } else {
      note(`Formule : ${fmtN(D)} km x ${bareme.tranches[3]} €/km = ${fmt(kmBrut)}`, 5, C.gray);
    }
  }
  if (state.estElectrique) {
    row('Majoration electrique (+20 %)', `+ ${fmt(transport.montantKm - kmBrut)}`, { indent: 5, valueColor: C.green });
  }
  row('Total bareme kilometrique', fmt(transport.montantKm));
  if (state.peages > 0)  row('Peages annuels', fmt(state.peages));
  if (state.parking > 0) row('Stationnement annuel', fmt(state.parking));
  if (transport.alerteDistance) {
    sp(1);
    note(`(!) Distance > ${state.distanceAller} km : justification de circonstances particulieres requise.`, 3, C.amber);
  }
  subtotalRow('Sous-total transports', fmt(totalTransport), state.justif_transport);

  // ════════════════════════════════════════════════════════════
  // 3. REPAS
  // ════════════════════════════════════════════════════════════
  sectionHeader('3 - REPAS');
  row('Type de repas', state.typeRepas === 'cantine' ? 'Cantine / ticket restaurant' : 'Restaurant / exterieur');
  row('Jours de repas hors domicile', `${state.joursRepas} j`);
  if (state.typeRepas === 'restaurant') {
    row('Cout moyen d\'un repas', fmt(state.coutRepas));
    row('Plafond reglementaire (depense excessive)', fmt(REPAS.plafondExcessif));
    const coutPlaf = Math.min(state.coutRepas, REPAS.plafondExcessif);
    note(`Formule : min(${state.coutRepas} €, ${REPAS.plafondExcessif} €) - ${REPAS.forfaitDomicile} € = ${(coutPlaf - REPAS.forfaitDomicile).toFixed(2)} €/repas`, 5, C.gray);
  } else {
    note(`Formule : plafond legal - valeur repas domicile = ${REPAS.plafondDeduction.toFixed(2)} €/repas`, 5, C.gray);
  }
  row('Valeur repas domicile deduite (reglementaire)', `- ${fmt(REPAS.forfaitDomicile)}`);
  row('Deduction nette par repas', fmt(repas.deductionUnitaire), { bold: true, valueColor: C.navy });
  if (state.aTicketResto) {
    const ppJour = state.joursRepas > 0 ? Math.round((state.partPatronale / state.joursRepas) * 100) / 100 : 0;
    row('Part patronale ticket restaurant (annuelle)', `- ${fmt(state.partPatronale)}`, { valueColor: [180, 50, 50] });
    note(`Soit ${ppJour.toFixed(2)} €/jour deduits (part versee par l'employeur).`);
  }
  subtotalRow('Sous-total repas', fmt(totalRepas), state.justif_repas);

  // ════════════════════════════════════════════════════════════
  // 4. LOGEMENT / TELETRAVAIL
  // ════════════════════════════════════════════════════════════
  sectionHeader('4 - LOGEMENT / TELETRAVAIL');
  row('Surface totale du logement', `${state.surfaceTotale} m2`);
  row('Surface du bureau dedie', `${state.surfaceBureau} m2`);
  row('Ratio de deduction', `${logement.ratio.toFixed(1)} %`, { bold: true, valueColor: C.navy });
  note(`Formule : ${state.surfaceBureau} m2 / ${state.surfaceTotale} m2 = ${logement.ratio.toFixed(1)} %`);
  sp(2);

  const charges = [
    ['Loyer annuel', state.charges.loyer],
    ["Interets d'emprunt", state.charges.interets],
    ['Electricite', state.charges.edf],
    ['Gaz', state.charges.gaz],
    ['Taxe fonciere', state.charges.taxeFonciere],
    ['Charges de copropriete', state.charges.copro],
  ];
  charges.forEach(([label, val]) => {
    if (val > 0) {
      const part = Math.round((logement.ratio / 100) * val);
      checkPage();
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.gray);
      doc.text(`  ${label}`, LM, y);
      doc.text(`${fmt(val)} total`, LM + 90, y, { align: 'right' });
      doc.setTextColor(...C.dark);
      doc.text(`= ${fmt(part)}`, RM, y, { align: 'right' });
      y += 5;
    }
  });
  subtotalRow('Sous-total logement', fmt(totalLogement), state.justif_logement);

  // ════════════════════════════════════════════════════════════
  // 5. MATERIEL & ABONNEMENTS
  // ════════════════════════════════════════════════════════════
  sectionHeader('5 - MATERIEL & ABONNEMENTS');
  if (state.articlesPlus500.length > 0) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.navy);
    doc.text(`Articles > ${MATERIEL.seuilAmortissement} € (amortis sur ${MATERIEL.dureeAmortissement} ans)`, LM, y);
    y += 5;
    state.articlesPlus500.forEach((art) => {
      const annuel = Math.round(art.prix / MATERIEL.dureeAmortissement);
      row(`  ${art.nom} (${art.date}) - ${fmt(art.prix)} / ${MATERIEL.dureeAmortissement} ans`, `${fmt(annuel)}/an`, { valueColor: C.gray });
    });
    row('Total amortissements', fmt(materiel.totalAmortissements), { valueColor: C.navy });
    sp(1);
  }
  if (state.totalMoins500 > 0) {
    row(`Fournitures & achats < ${MATERIEL.seuilAmortissement} €`, fmt(state.totalMoins500));
  }
  const abo = state.abonnements;
  if (abo.internet.montant > 0) {
    row(`  Internet : ${fmt(abo.internet.montant)} x ${abo.internet.pctPro} % pro`, `= ${fmt(Math.round(abo.internet.montant * abo.internet.pctPro / 100))}`, { valueColor: C.gray });
  }
  if (abo.mobile.montant > 0) {
    row(`  Mobile : ${fmt(abo.mobile.montant)} x ${abo.mobile.pctPro} % pro`, `= ${fmt(Math.round(abo.mobile.montant * abo.mobile.pctPro / 100))}`, { valueColor: C.gray });
  }
  subtotalRow('Sous-total materiel', fmt(totalMateriel), state.justif_materiel);

  // ════════════════════════════════════════════════════════════
  // 6. COMPARAISON
  // ════════════════════════════════════════════════════════════
  sectionHeader('6 - COMPARAISON DES OPTIONS');
  const ecart = Math.abs(fraisReelsTotal - abattement10);
  const fraisGagne = fraisReelsTotal > abattement10;

  doc.setFillColor(...C.navyLight);
  doc.rect(LM, y, W, 7, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text('Option', LM + 4, y + 4.5);
  doc.text('Montant deductible', LM + 82, y + 4.5);
  doc.text('Difference', RM, y + 4.5, { align: 'right' });
  y += 9;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.dark);
  doc.text('Frais reels (total declare)', LM + 4, y + 3.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...(fraisGagne ? C.green : C.dark));
  doc.text(fmt(fraisReelsTotal), LM + 82, y + 3.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.lightGray);
  doc.text(fraisGagne ? `+ ${fmt(ecart)}` : '-', RM, y + 3.5, { align: 'right' });
  y += 7;

  doc.setTextColor(...C.dark);
  doc.text('Abattement 10 %', LM + 4, y + 3.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...(!fraisGagne ? C.green : C.dark));
  doc.text(fmt(abattement10), LM + 82, y + 3.5);
  doc.setTextColor(...C.lightGray);
  doc.text(!fraisGagne ? `+ ${fmt(ecart)}` : '-', RM, y + 3.5, { align: 'right' });
  y += 10;
  sp(2);

  // ════════════════════════════════════════════════════════════
  // 7. RECOMMANDATION
  // ════════════════════════════════════════════════════════════
  sectionHeader('7 - RECOMMANDATION');

  if (recommendation === 'abattement') {
    coloredBox([
      'Abattement 10 % recommande',
      `L'abattement forfaitaire (${fmt(abattement10)}) est plus avantageux que vos frais reels (${fmt(fraisReelsTotal)}).`,
      `Ecart : ${fmt(ecart)} en faveur de l'abattement.`,
      "Aucune demarche supplementaire - la deduction s'applique automatiquement.",
    ], C.greenBg, C.green, C.green);

  } else if (recommendation === 'frais_reels') {
    coloredBox([
      'Frais reels recommandes - dossier complet',
      `Vos frais reels (${fmt(fraisReelsTotal)}) depassent l'abattement (${fmt(abattement10)}) de ${fmt(ecart)}.`,
      `Economie estimee : ~${fmt(Math.round(ecart * 0.30))} (a 30 % de TMI).`,
      'Tous vos justificatifs sont en ordre. Optez pour les frais reels.',
    ], C.greenBg, C.green, C.green);

  } else {
    coloredBox([
      '(!) Abattement 10 % recommande cette annee (prudence)',
      `Vos frais reels (${fmt(fraisReelsTotal)}) depassent theoriquement l'abattement (${fmt(abattement10)}), mais certains justificatifs sont manquants.`,
      "Sans dossier complet, l'administration peut rejeter la deduction et appliquer des penalites (10 % + 0,20 %/mois).",
      "Utilisez l'abattement cette annee pour eviter tout risque.",
    ], C.amberBg, C.amber, C.amber);
    sp(2);
    coloredBox([
      `> Pour l'annee prochaine : constituez votre dossier ${ANNEE_REVENUS + 1} des maintenant`,
      `Si vous reconstituez ce dossier l'an prochain, economie potentielle : ~${fmt(Math.round(ecart * 0.30))} (a 30 % de TMI).`,
      'Conservez tickets de restaurant, factures, releves badge cantine au fil de l\'eau.',
    ], C.navyLight, C.navy, C.navy);
  }

  // ════════════════════════════════════════════════════════════
  // 8. CE QUE VOUS DECLAREZ
  // ════════════════════════════════════════════════════════════
  sectionHeader('8 - CE QUE VOUS DECLAREZ');

  if (recommendation === 'frais_reels') {
    row('Case a remplir', TEXTES.caseDeclaration, { bold: true, valueColor: C.navy, fs: 14 });
    row('Libelle', 'Traitements et salaires - frais reels', { valueColor: C.gray });
    row('Montant a inscrire', fmt(synthese.fraisSecurisesTotal), { bold: true, valueColor: C.navy, fs: 12 });
    note('Ce montant correspond aux frais pour lesquels vous avez confirme avoir les justificatifs.');
    sp(2);
    row('Revenu imposable apres deduction', fmt(state.sni - synthese.fraisSecurisesTotal), { bold: true, valueColor: C.dark });
    note(`SNI ${fmt(state.sni)} - frais reels ${fmt(synthese.fraisSecurisesTotal)}`);
  } else {
    row('Demarche', 'Aucune case supplementaire a remplir', { bold: true, valueColor: C.green });
    note("L'abattement 10 % s'applique automatiquement sur votre declaration de revenus.");
    sp(2);
    row('Revenu imposable apres deduction', fmt(state.sni - abattement10), { bold: true, valueColor: C.dark });
    note(`SNI ${fmt(state.sni)} - abattement ${fmt(abattement10)}`);
  }
  sp(3);

  // ════════════════════════════════════════════════════════════
  // 9. JUSTIFICATIFS A CONSERVER (si frais reels choisis)
  // ════════════════════════════════════════════════════════════
  if (recommendation === 'frais_reels') {
    sectionHeader('9 - JUSTIFICATIFS A CONSERVER');
    note("Conservez tous ces documents pendant 3 ans (delai de reprise de l'administration fiscale).", 2, C.gray);
    sp(2);

    const checkItem = (text) => {
      checkPage();
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.dark);
      doc.text(`[ ]  ${text}`, LM + 4, y);
      y += 5;
    };

    const subTitle = (text) => {
      checkPage();
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...C.navy);
      doc.text(text, LM, y);
      y += 5.5;
    };

    if (totalTransport > 0 && state.justif_transport) {
      subTitle('Transports');
      checkItem('Carte grise du vehicule');
      checkItem('Releve kilometrique ou factures garage / revisions');
      checkItem('Calendrier de presence sur site (bulletins de salaire, planning)');
      sp(2);
    }
    if (totalRepas > 0 && state.justif_repas) {
      subTitle('Repas');
      if (state.typeRepas === 'cantine') {
        checkItem('Releves badge cantine nominatifs');
        checkItem("Justificatif de l'employeur si cantine subventionnee");
      } else {
        checkItem('Notes de restaurant datees et nominatives (ticket + recu)');
      }
      sp(2);
    }
    if (totalLogement > 0 && state.justif_logement) {
      subTitle('Logement / Teletravail');
      checkItem('Bail ou titre de propriete (surface totale)');
      checkItem('Factures EDF + Gaz annuelles nominatives');
      checkItem('Avis de taxe fonciere');
      checkItem('Photo du bureau dedie (piece ou coin identifie)');
      sp(2);
    }
    if (totalMateriel > 0 && state.justif_materiel) {
      subTitle('Materiel & Abonnements');
      state.articlesPlus500.forEach((art) => {
        checkItem(`Facture "${art.nom}" du ${art.date} - ${fmt(art.prix)}`);
      });
      checkItem('Factures internet (box) nominatives - 12 mois');
      checkItem('Factures telephone mobile nominatives - 12 mois');
    }
  }

  // ════════════════════════════════════════════════════════════
  // FOOTER SUR TOUTES LES PAGES
  // ════════════════════════════════════════════════════════════
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.lightGray);
    doc.text('Aucune donnee collectee - tout est calcule dans votre navigateur.', LM, 289);
    doc.text(`Page ${i} / ${pageCount}`, RM, 289, { align: 'right' });
  }

  doc.save(buildFilename());
}

// ─── Composant React ───────────────────────────────────────────────────────────
export function ExportBlock({ state, synthese }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildTexteCopier(state, synthese));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleCopy}
          type="button"
          className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all ${
            copied ? 'bg-success text-white' : 'bg-navy text-white hover:bg-blue-900'
          }`}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copié !' : 'Copier le résumé'}
        </button>
        <button
          onClick={() => generatePDF(state, synthese)}
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white border-2 border-navy text-navy rounded-2xl font-semibold text-sm hover:bg-slate-50 transition-all"
        >
          <Download size={18} />
          PDF complet
        </button>
      </div>

      <p className="text-xs text-center text-gray-400">
        🔒 {TEXTES.mentionDonnees}
      </p>
    </>
  );
}
