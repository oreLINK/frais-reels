// =============================================================================
//  RÉFÉRENCES LÉGALES – Sources officielles de chaque paramètre fiscal
//  Chaque entrée contient :
//    texte    : nom du texte de loi ou document administratif
//    article  : article, alinéa, paragraphe précis
//    citation : extrait court du passage pertinent
//    url      : lien direct vers le texte en ligne
//    chemin   : comment retrouver le passage dans le document
//    dateConsultation : date à laquelle le lien a été vérifié
// =============================================================================

const REFERENCES = {

  // --------------------------------------------------------------------------
  // ABATTEMENT 10%
  // --------------------------------------------------------------------------
  abattement_base: {
    texte: 'Code Général des Impôts',
    article: 'Article 83, 3° alinéas 2 à 4',
    citation: 'La déduction à effectuer du chef des frais professionnels est calculée forfaitairement en fonction du revenu brut [...] elle est fixée à 10 % du montant de ce revenu.',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051765287',
    chemin: 'Légifrance → CGI → Article 83 → 3° → alinéas 2 à 4',
    dateConsultation: '2026-04-15',
  },

  abattement_plafond: {
    texte: 'Code Général des Impôts',
    article: 'Article 83, 3° alinéa 4',
    citation: 'Elle est limitée à [...] chaque année, le plafond est relevé dans la même proportion que la limite supérieure de la première tranche du barème de l\'impôt sur le revenu.',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051765287',
    chemin: 'Légifrance → CGI → Article 83 → 3° → avant-dernier alinéa',
    dateConsultation: '2026-04-15',
  },

  abattement_plancher: {
    texte: 'Code Général des Impôts',
    article: 'Article 83, 3° alinéa 5',
    citation: 'Le montant de la déduction forfaitaire pour frais professionnels ne peut être inférieur à [montant] €.',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051765287',
    chemin: 'Légifrance → CGI → Article 83 → 3° → 5ème alinéa',
    dateConsultation: '2026-04-15',
  },

  abattement_montants_annuels: {
    texte: 'BOFiP – Bulletin Officiel des Finances Publiques',
    article: 'BOI-RSA-BASE-30-50-20 § 60 et § 190',
    citation: 'Le minimum de déduction est révisé chaque année [...] La déduction forfaitaire de 10 % est plafonnée.',
    url: 'https://bofip.impots.gouv.fr/bofip/2287-PGP.html/identifiant=BOI-RSA-BASE-30-50-20-20190301',
    chemin: 'BOFiP → RSA → Base d\'imposition → Charges déductibles → Déduction forfaitaire 10% → IV-C § 60 (plancher) et IV-D § 190 (plafond)',
    dateConsultation: '2026-04-15',
  },

  // --------------------------------------------------------------------------
  // BARÈME KILOMÉTRIQUE
  // --------------------------------------------------------------------------
  bareme_km_base_legale: {
    texte: 'Code Général des Impôts',
    article: 'Article 83, 3° alinéas 8 et 9',
    citation: 'L\'évaluation des frais de déplacement [...] peut s\'effectuer sur le fondement d\'un barème forfaitaire fixé par arrêté du ministre chargé du budget en fonction de la puissance administrative du véhicule, retenue dans la limite maximale de sept chevaux.',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051765287',
    chemin: 'Légifrance → CGI → Article 83 → 3° → 8ème alinéa',
    dateConsultation: '2026-04-15',
  },

  bareme_km_arrete: {
    texte: 'Arrêté du 27 mars 2023 fixant le barème forfaitaire',
    article: 'Arrêté du 27 mars 2023 (JO du 7 avril 2023)',
    citation: 'Barème non revalorisé depuis 2023, reconduit pour les revenus 2024 et 2025.',
    url: 'https://bofip.impots.gouv.fr/bofip/2095-PGP.html/identifiant=BOI-BAREME-000003-20260218',
    chemin: 'BOFiP → Barèmes → BOI-BAREME-000001 (voitures) et BOI-BAREME-000002 (2-roues)',
    dateConsultation: '2026-04-15',
  },

  bareme_km_brochure: {
    texte: 'Brochure pratique 2026 – Déclaration des revenus 2025',
    article: 'Section « Barème kilométrique »',
    citation: 'Exemple : pour 4 000 km parcourus à titre professionnel en 2025 avec un véhicule de 5 CV, montant de frais réels = 2 544 € (4 000 km × 0,636).',
    url: 'https://www.service-public.fr/particuliers/actualites/A14686',
    chemin: 'service-public.fr → Particuliers → Actualités → « Frais professionnels : les barèmes kilométriques 2026 »',
    dateConsultation: '2026-04-15',
  },

  // --------------------------------------------------------------------------
  // LIMITE 40 KM
  // --------------------------------------------------------------------------
  limite_40km: {
    texte: 'Code Général des Impôts',
    article: 'Article 83, 3° alinéa 7',
    citation: 'Lorsque la distance est supérieure [à 40 km], la déduction admise porte sur les quarante premiers kilomètres, sauf circonstances particulières notamment liées à l\'emploi justifiant une prise en compte complète.',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051765287',
    chemin: 'Légifrance → CGI → Article 83 → 3° → 7ème alinéa',
    dateConsultation: '2026-04-15',
  },

  limite_40km_bofip: {
    texte: 'BOFiP',
    article: 'BOI-RSA-BASE-30-50-30-20 § 1 à 80',
    citation: 'Les frais correspondants sont de plein droit déductibles [...] dans la limite des quarante premiers kilomètres séparant le domicile et le lieu de travail.',
    url: 'https://bofip.impots.gouv.fr/bofip/2161-PGP.html/identifiant=BOI-RSA-BASE-30-50-30-20-20170224',
    chemin: 'BOFiP → RSA → Base d\'imposition → Charges déductibles → Frais réels → Frais de déplacement → I.',
    dateConsultation: '2026-04-15',
  },

  // --------------------------------------------------------------------------
  // VÉHICULES ÉLECTRIQUES +20%
  // --------------------------------------------------------------------------
  majoration_electrique: {
    texte: 'Arrêté du 15 février 2021, article 1',
    article: 'Article 1 de l\'arrêté du 15/02/2021 + CGI art. 83 3° alinéa 8',
    citation: 'Le montant des frais de déplacement calculé en application du barème forfaitaire [...] est majoré de 20 % pour les véhicules fonctionnant exclusivement à l\'énergie électrique.',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051765287',
    chemin: 'Légifrance → CGI → Article 83 → 3° → 8ème alinéa (dernière phrase)',
    dateConsultation: '2026-04-15',
  },

  // --------------------------------------------------------------------------
  // FRAIS DE REPAS
  // --------------------------------------------------------------------------
  repas_forfait_domicile: {
    texte: 'BOFiP',
    article: 'BOI-BNC-BASE-40-60-60 § 20',
    citation: 'Pour l\'année 2025, la valeur du repas pris au domicile est évaluée forfaitairement à 5,45 € toutes taxes comprises.',
    url: 'https://bofip.impots.gouv.fr/bofip/4628-PGP.html/identifiant=BOI-BNC-BASE-40-60-60-20250219',
    chemin: 'BOFiP → BNC → Base d\'imposition → Dépenses → Frais divers de gestion → § 20',
    dateConsultation: '2026-04-15',
  },

  repas_plafond: {
    texte: 'BOFiP',
    article: 'BOI-BNC-BASE-40-60-60 § 30',
    citation: 'Cette limite au-delà de laquelle la dépense est considérée comme excessive [...] est de 21,10 € pour 2025.',
    url: 'https://bofip.impots.gouv.fr/bofip/4628-PGP.html/identifiant=BOI-BNC-BASE-40-60-60-20250219',
    chemin: 'BOFiP → BNC → Base d\'imposition → Dépenses → Frais divers de gestion → § 30',
    dateConsultation: '2026-04-15',
  },

  repas_salaries_impots: {
    texte: 'impots.gouv.fr – Fiche pratique',
    article: 'Fiche « Frais de repas » pour les salariés',
    citation: 'Pour l\'imposition des revenus 2025, la valeur d\'un repas pris au foyer est de 5,45 €.',
    url: 'https://www.impots.gouv.fr/particulier/frais-de-repas',
    chemin: 'impots.gouv.fr → Particulier → Gérer mon patrimoine/budget → Frais de repas',
    dateConsultation: '2026-04-15',
  },

  repas_calcul_detail: {
    texte: 'impots.gouv.fr – FAQ',
    article: 'FAQ « Je suis salarié et obligé de prendre mes repas à l\'extérieur »',
    citation: 'Montant des frais de repas déductibles par jour : [Coût réel] − 5,45 € − [Part patronale tickets restaurant]. À multiplier par le nombre de jours travaillés.',
    url: 'https://www.impots.gouv.fr/particulier/questions/je-suis-salarie-et-oblige-de-prendre-mes-repas-lexterieur-de-mon-domicile-que',
    chemin: 'impots.gouv.fr → Particulier → Questions → Rechercher « repas » → Fiche détaillée',
    dateConsultation: '2026-04-15',
  },

  // --------------------------------------------------------------------------
  // TÉLÉTRAVAIL & LOGEMENT
  // --------------------------------------------------------------------------
  teletravail_forfait: {
    texte: 'impots.gouv.fr – Fiche pratique',
    article: 'FAQ « Comment déclarer mes frais de télétravail »',
    citation: 'Vous pouvez déduire des frais professionnels liés au télétravail à hauteur de 2,70 € par jour de télétravail (59,40 € par mois et 712,80 € pour l\'année).',
    url: 'https://www.impots.gouv.fr/particulier/questions/comment-declarer-mes-frais-engages-au-titre-du-teletravail-domicile-en-2020',
    chemin: 'impots.gouv.fr → Particulier → Questions → Rechercher « télétravail » → Section « Vous optez pour les frais réels »',
    dateConsultation: '2026-04-15',
  },

  teletravail_local_bofip: {
    texte: 'BOFiP',
    article: 'BOI-RSA-BASE-30-50-30-30',
    citation: 'Les charges fixes (loyer, taxe d\'habitation, électricité, chauffage) se calculent au prorata de la surface dédiée au télétravail par rapport à la superficie totale du logement.',
    url: 'https://bofip.impots.gouv.fr/bofip/2161-PGP.html/identifiant=BOI-RSA-BASE-30-50-30-20-20170224',
    chemin: 'BOFiP → RSA → Base d\'imposition → Charges déductibles → Frais réels → Frais de local → BOI-RSA-BASE-30-50-30-30',
    dateConsultation: '2026-04-15',
  },

  // --------------------------------------------------------------------------
  // MATÉRIEL & AMORTISSEMENT
  // --------------------------------------------------------------------------
  materiel_amortissement: {
    texte: 'Code Général des Impôts',
    article: 'Article 83, 3° alinéa 6',
    citation: 'Le montant des frais réels à prendre en compte au titre de l\'acquisition [...] des biens dont la durée d\'utilisation est supérieure à un an s\'entend de la dépréciation que ces biens ont subie au cours de l\'année d\'imposition.',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051765287',
    chemin: 'Légifrance → CGI → Article 83 → 3° → 6ème alinéa',
    dateConsultation: '2026-04-15',
  },

  // --------------------------------------------------------------------------
  // CONTRÔLE FISCAL & JUSTIFICATIFS
  // --------------------------------------------------------------------------
  obligation_justificatifs: {
    texte: 'Code Général des Impôts',
    article: 'Article 83, 3° alinéa 5',
    citation: 'Les bénéficiaires de traitements et salaires sont admis à justifier du montant de leurs frais réels, soit dans la déclaration [...] soit sous forme de réclamation.',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051765287',
    chemin: 'Légifrance → CGI → Article 83 → 3° → 5ème alinéa',
    dateConsultation: '2026-04-15',
  },

  delai_reprise: {
    texte: 'Livre des Procédures Fiscales',
    article: 'Article L169',
    citation: 'Le droit de reprise de l\'administration s\'exerce jusqu\'à la fin de la troisième année qui suit celle au titre de laquelle l\'imposition est due.',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006315060',
    chemin: 'Légifrance → LPF → Partie législative → Titre II → Chapitre IV → Section I → Article L169',
    dateConsultation: '2026-04-15',
  },

  case_declaration: {
    texte: 'Formulaire 2042 (Cerfa n°10330)',
    article: 'Cases 1AK à 1DK',
    citation: 'Inscrivez le montant de vos frais réels. Indiquez le détail dans la rubrique « Informations complémentaires ».',
    url: 'https://www.impots.gouv.fr/formulaire/2042/declaration-des-revenus',
    chemin: 'impots.gouv.fr → Formulaires → 2042 → Page 3 → Section « Traitements et salaires » → Cases 1AK à 1DK',
    dateConsultation: '2026-04-15',
  },
};

export { REFERENCES };
