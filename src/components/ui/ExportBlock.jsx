import { Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { TEXTES, ANNEE_REVENUS, ANNEE_DECLARATION } from '../../config/fiscalite';
import { REFERENCES } from '../../config/references';

export function ExportBlock({ state, synthese }) {
  const [copied, setCopied] = useState(false);

  const buildTexteCopier = () => `OPTION POUR LES FRAIS RÉELS – DÉTAIL DES CALCULS
Revenus ${ANNEE_REVENUS} · Déclaration ${ANNEE_DECLARATION}

Salaire Net Imposable : ${state.sni.toLocaleString('fr-FR')} €
Abattement forfaitaire 10 % : ${synthese.abattement10.toLocaleString('fr-FR')} €

– Transports : ${state.typeVehicule} ${state.puissance}${state.estElectrique ? ' électrique' : ''} – ${state.distanceAller * 2} km/j × ${state.joursTravailSite} j = ${synthese.totalTransport.toLocaleString('fr-FR')} €
– Repas : ${state.joursRepas} jours = ${synthese.totalRepas.toLocaleString('fr-FR')} €
– Logement/télétravail : prorata ${synthese.logement.ratio.toFixed(1)} % = ${synthese.totalLogement.toLocaleString('fr-FR')} €
– Matériel & abonnements = ${synthese.totalMateriel.toLocaleString('fr-FR')} €

TOTAL FRAIS RÉELS SÉCURISÉS : ${synthese.fraisSecurisesTotal.toLocaleString('fr-FR')} €
${synthese.fraisRisquesTotal > 0 ? `Frais sans justificatifs (risque) : ${synthese.fraisRisquesTotal.toLocaleString('fr-FR')} €\n` : ''}
Case ${TEXTES.caseDeclaration} : ${synthese.fraisSecurisesTotal.toLocaleString('fr-FR')} €`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildTexteCopier());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const navy = [30, 58, 95];
    const green = [22, 163, 74];
    const red = [220, 38, 38];
    let y = 20;

    const line = (txt, x = 20, size = 10, color = [50, 50, 50], bold = false) => {
      doc.setFontSize(size);
      doc.setTextColor(...color);
      if (bold) doc.setFont('helvetica', 'bold');
      else doc.setFont('helvetica', 'normal');
      doc.text(txt, x, y);
      y += size * 0.5 + 2;
    };

    const sep = () => {
      doc.setDrawColor(220, 220, 220);
      doc.line(20, y, 190, y);
      y += 6;
    };

    // En-tête
    line('Frais Réels – Liste des Justificatifs', 20, 16, navy, true);
    line(`Revenus ${ANNEE_REVENUS} · Déclaration ${ANNEE_DECLARATION}`, 20, 10, [100, 100, 100]);
    y += 4;
    sep();

    // Résumé chiffré
    line('RÉSUMÉ', 20, 11, navy, true);
    y += 2;
    line(`Frais sécurisés : ${synthese.fraisSecurisesTotal.toLocaleString('fr-FR')} €`, 20, 10, green);
    if (synthese.fraisRisquesTotal > 0)
      line(`Frais à risque : ${synthese.fraisRisquesTotal.toLocaleString('fr-FR')} €`, 20, 10, red);
    line(`Abattement 10 % : ${synthese.abattement10.toLocaleString('fr-FR')} €`, 20, 10);
    line(`Case ${TEXTES.caseDeclaration} : ${synthese.fraisSecurisesTotal.toLocaleString('fr-FR')} €`, 20, 11, navy, true);
    y += 4;
    sep();

    // Justificatifs par catégorie
    line('DOCUMENTS À CONSERVER', 20, 11, navy, true);
    y += 4;

    if (state.justif_transport || synthese.totalTransport > 0) {
      line('Transports', 20, 10, navy, true);
      line('☐ Carte grise du véhicule', 25, 10);
      line('☐ Relevé kilométrique ou factures garage / révisions', 25, 10);
      line('☐ Calendrier de présence sur site (bulletins de salaire, agenda)', 25, 10);
      y += 2;
    }

    if (state.justif_repas || synthese.totalRepas > 0) {
      line('Repas', 20, 10, navy, true);
      line(
        state.typeRepas === 'cantine'
          ? '☐ Relevés badge cantine nominatifs'
          : '☐ Notes de restaurant datées et nominatives',
        25, 10
      );
      y += 2;
    }

    if (state.justif_logement || synthese.totalLogement > 0) {
      line('Logement / Télétravail', 20, 10, navy, true);
      line('☐ Bail ou titre de propriété', 25, 10);
      line('☐ Factures EDF + Gaz (annuelles)', 25, 10);
      line('☐ Taxe foncière', 25, 10);
      line('☐ Photo du bureau dédié (pièce ou coin identifié)', 25, 10);
      y += 2;
    }

    if (state.justif_materiel || synthese.totalMateriel > 0) {
      line('Matériel & Abonnements', 20, 10, navy, true);
      state.articlesPlus500.forEach((art) => {
        line(`☐ Facture "${art.nom}" du ${art.date} (${art.prix.toLocaleString('fr-FR')} €)`, 25, 10);
      });
      line('☐ Factures internet (box) nominatives', 25, 10);
      line('☐ Factures mobile nominatives', 25, 10);
      y += 2;
    }

    sep();

    // Références légales
    line('RÉFÉRENCES LÉGALES', 20, 11, navy, true);
    y += 2;

    const refsToPrint = [
      'abattement_base',
      'bareme_km_arrete',
      'repas_forfait_domicile',
      'teletravail_local_bofip',
      'materiel_amortissement',
      'delai_reprise',
      'case_declaration',
    ];

    refsToPrint.forEach((key) => {
      const ref = REFERENCES[key];
      if (!ref) return;
      if (y > 260) { doc.addPage(); y = 20; }
      line(`${ref.texte} – ${ref.article}`, 20, 9, navy, true);
      line(ref.url, 20, 8, [100, 100, 200]);
      y += 1;
    });

    // Avertissement final
    y += 4;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(TEXTES.mentionDonnees, 20, y);

    doc.save('justificatifs-frais-reels.pdf');
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleCopy}
          type="button"
          className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all ${
            copied
              ? 'bg-success text-white'
              : 'bg-navy text-white hover:bg-blue-900'
          }`}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copié !' : 'Copier le détail'}
        </button>
        <button
          onClick={generatePDF}
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white border-2 border-navy text-navy rounded-2xl font-semibold text-sm hover:bg-slate-50 transition-all"
        >
          <Download size={18} />
          PDF justificatifs
        </button>
      </div>

      <p className="text-xs text-center text-gray-400">
        🔒 {TEXTES.mentionDonnees}
      </p>
    </>
  );
}
