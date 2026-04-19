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
    texte: 'Arrêté du 27 mars 2023 fixant le barème forfaitaire (JO du 7 avril 2023)',
    article: 'Arrêté ministériel – barème kilométrique voitures (BOI-BAREME-000001) et deux-roues (BOI-BAREME-000002)',
    citation: 'Barème non revalorisé depuis 2023, reconduit à l\'identique pour les revenus 2024 et 2025. Confirmé par service-public.gouv.fr : « comme en 2025, les barèmes kilométriques ne sont pas revalorisés ».',
    url: 'https://www.service-public.gouv.fr/particuliers/actualites/A14686',
    chemin: 'service-public.gouv.fr → Actualités → Barèmes kilométriques 2026 · BOFiP : BOI-BAREME-000001 (automobiles) et BOI-BAREME-000002 (deux-roues motorisés)',
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
    texte: 'impots.gouv.fr – Fiche pratique salariés + BOFiP BOI-RSA-BASE-30-50-30-20 § 550',
    article: 'Valeur du repas pris au foyer – revenus 2025',
    citation: 'Pour l\'imposition des revenus 2025, la valeur d\'un repas pris au foyer est de 5,45 €. Le montant déductible est égal à la différence entre le prix effectivement payé et cette valeur forfaitaire.',
    url: 'https://www.impots.gouv.fr/particulier/frais-de-repas',
    chemin: 'impots.gouv.fr → Particulier → Frais de repas · Pour les montants annuels : BOFiP → BOI-BAREME-000014',
    dateConsultation: '2026-04-15',
  },

  repas_plafond: {
    texte: 'BOFiP – doctrine administrative appliquée aux salariés',
    article: 'BOI-BNC-BASE-40-60-60 § 30 (valeur de référence) + impots.gouv.fr frais de repas',
    citation: 'Le seuil au-delà duquel une dépense de repas est réputée excessive est fixé à 21,10 € pour 2025. Ce montant, issu de la doctrine BNC, est retenu en pratique par l\'administration comme plafond de raisonnabilité pour les salariés en frais réels.',
    url: 'https://www.impots.gouv.fr/particulier/frais-de-repas',
    chemin: 'impots.gouv.fr → Particulier → Frais de repas (référence pratique) · Doctrine : BOFiP → BOI-BNC-BASE-40-60-60 § 30',
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
    texte: 'impots.gouv.fr – FAQ + service-public.gouv.fr',
    article: 'FAQ « Comment déclarer mes frais de télétravail » – revenus 2025',
    citation: 'Vous pouvez déduire des frais professionnels liés au télétravail à hauteur de 2,70 € par jour de télétravail (59,40 € par mois, soit 626,40 € pour une année complète). Ce forfait s\'applique uniquement si aucune allocation employeur n\'a été perçue à ce titre.',
    url: 'https://www.impots.gouv.fr/particulier/questions/comment-declarer-mes-frais-engages-au-titre-du-teletravail-domicile-en-2020',
    chemin: 'impots.gouv.fr → Particulier → Questions → Rechercher « télétravail » → Section « Vous optez pour les frais réels » · Confirmé par service-public.gouv.fr/particuliers/actualites/A14686',
    dateConsultation: '2026-04-15',
  },

  teletravail_local_bofip: {
    texte: 'BOFiP',
    article: 'BOI-RSA-BASE-30-50-30-30 (frais de local professionnel à domicile)',
    citation: 'Les charges fixes (loyer ou intérêts d\'emprunt, électricité, chauffage, taxe foncière pour les propriétaires) se calculent au prorata de la surface dédiée exclusivement au travail par rapport à la superficie totale du logement. Note : la taxe d\'habitation a été supprimée pour les résidences principales depuis 2023 et n\'est plus déductible à ce titre.',
    url: 'https://bofip.impots.gouv.fr/bofip/2161-PGP.html/identifiant=BOI-RSA-BASE-30-50-30-30',
    chemin: 'BOFiP → RSA → Base d\'imposition → Charges déductibles → Frais réels → Section III – Frais de local professionnel → BOI-RSA-BASE-30-50-30-30',
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

  // --------------------------------------------------------------------------
  // SANCTIONS – DÉCLARATION TARDIVE OU ABSENCE DE DÉCLARATION
  // --------------------------------------------------------------------------
  sanctions_retard_declaration: {
    texte: 'Code Général des Impôts',
    article: 'Article 1728',
    citation: 'Le défaut de production dans les délais prescrits d\'une déclaration ou d\'un acte entraîne l\'application, sur le montant des droits mis à la charge du contribuable, d\'une majoration de : a. 10 % en l\'absence de mise en demeure ou en cas de dépôt de la déclaration dans les trente jours suivant la réception d\'une mise en demeure ; b. 40 % lorsque la déclaration n\'a pas été déposée dans les trente jours suivant la réception d\'une mise en demeure.',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006303356',
    chemin: 'Légifrance → CGI → Partie législative → Titre IV → Chapitre I → Section I → Article 1728',
    dateConsultation: '2026-04-15',
  },

  interets_retard: {
    texte: 'Code Général des Impôts',
    article: 'Article 1727, I',
    citation: 'Toute créance de nature fiscale [...] qui n\'a pas été acquittée dans le délai légal donne lieu au versement d\'un intérêt de retard. [...] Le taux de l\'intérêt de retard est de 0,20 % par mois.',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041471645',
    chemin: 'Légifrance → CGI → Partie législative → Titre IV → Chapitre I → Article 1727',
    dateConsultation: '2026-04-15',
  },
};

export { REFERENCES };
