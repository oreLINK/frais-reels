# Simulateur Frais Réels

> Calculez vos frais réels pour salariés français et comparez avec l'abattement forfaitaire 10 %.
> Revenus 2025 / Déclaration 2026. Hébergé en statique sur GitHub Pages. Zéro collecte de données.

**[→ Accéder au simulateur](https://orelink.github.io/frais-reels/)**

---

## Stack technique

| Outil | Version | Rôle |
|---|---|---|
| React | 19 | SPA, composants, état global via `useReducer` |
| Vite | 8 | Build + HMR dev |
| Tailwind CSS | 4 | Styles utility-first (config via `@theme` dans le CSS) |
| jsPDF | — | Génération PDF complet côté client |
| Lucide React | — | Icônes |
| Google Fonts | — | DM Sans (corps) + Merriweather (titres) |
| gh-pages | — | Déploiement manuel (fallback) |

Aucun backend. Aucun cookie. Aucun `localStorage`. Tout calcul dans le navigateur.

---

## Flux utilisateur

```
Page d'accueil          →  Checklist documents   →  Simulateur (5 étapes)  →  Synthèse + PDF
(LandingPage.jsx)          (DocumentChecklist.jsx)   (Step1 … Step5)           (Synthese.jsx)
Dates limites + CTA        Liste des pièces           Une question à la fois    3 scénarios
                           à avoir sous la main        wizard par étape          + export PDF
```

---

## Architecture

```
frais-reels/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # CI/CD : push main → build → gh-pages (auto)
│       └── ci.yml              # CI : build check sur toute PR → main ou release
├── index.html                  # Google Fonts preconnect + DM Sans + Merriweather
├── vite.config.js              # base: '/frais-reels/' pour GitHub Pages
├── postcss.config.js
├── package.json
├── public/favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx                         # Orchestrateur : 3 écrans (landing/checklist/simulator)
    ├── config/
    │   ├── fiscalite.js                # ⭐ FICHIER CENTRAL — tous les barèmes fiscaux
    │   └── references.js              # Base de données des références légales (BOFIP)
    ├── engine/
    │   └── calculs.js                  # Fonctions pures de calcul (aucun effet de bord)
    ├── hooks/
    │   └── useSimulator.js             # useReducer — état global de la simulation
    ├── components/
    │   ├── LandingPage.jsx             # Page d'accueil : présentation + DeadlineCard + CTA
    │   ├── DocumentChecklist.jsx       # Checklist des pièces à préparer (5 catégories)
    │   ├── layout/
    │   │   ├── Header.jsx
    │   │   ├── Stepper.jsx             # Barre de progression (visible uniquement en simulation)
    │   │   └── Footer.jsx              # Liens GitHub + LinkedIn
    │   ├── steps/
    │   │   ├── Step1_Revenus.jsx       # SNI (salaire net imposable)
    │   │   ├── Step2_Deplacements.jsx  # Véhicule, distance, jours, péages, parking
    │   │   ├── Step3_Repas.jsx         # Type repas, coût, jours, tickets restaurant
    │   │   ├── Step4_Logement.jsx      # Surfaces, charges annuelles (loyer, EDF, gaz…)
    │   │   ├── Step5_Materiel.jsx      # Articles >500 €, fournitures, internet, mobile
    │   │   └── Synthese.jsx            # Verdict 3 scénarios + export
    │   └── ui/
    │       ├── QuestionCard.jsx        # Wrapper wizard : 1 question par écran, progression, CTA
    │       ├── DeadlineCard.jsx        # Dates limites déclaration 2026 par zone département
    │       ├── Jauge.jsx               # Barre de comparaison animée frais réels vs abattement
    │       ├── AlertBox.jsx            # Alertes conditionnelles (distance > 40 km, etc.)
    │       ├── CheckboxJustif.jsx      # Case justificatif avec impact sur le verdict
    │       ├── SourceLegale.jsx        # Panneau références légales BOFIP (dépliable)
    │       ├── ExportBlock.jsx         # Copier résumé + Générer PDF complet (9 sections)
    │       ├── Tooltip.jsx
    │       ├── InputField.jsx
    │       ├── SelectField.jsx
    │       └── SliderInput.jsx
    └── styles/
        └── index.css                   # @import "tailwindcss" + @theme (couleurs, polices)
```

### Règle d'or

**`fiscalite.js` est le seul fichier à modifier chaque année.** Aucun chiffre fiscal n'est codé en dur ailleurs dans l'application.

---

## Commandes

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (HMR)
npm run dev
# → http://localhost:5173

# Build de production
npm run build
# → génère dist/

# Prévisualiser le build final (simule GitHub Pages)
npm run preview
# → http://localhost:4173/frais-reels/

# Déploiement manuel (fallback uniquement — préférer le CI/CD)
npm run deploy
# → build + push dist/ sur la branche gh-pages
```

---

## CI/CD et stratégie de branches

```
feature/XXX ──PR──► release ──PR──► main ──(auto)──► gh-pages
fix/XXX     ──PR──►                                   (GitHub Pages)
```

| Branche | Rôle | Règles |
|---------|------|--------|
| `feature/XXX` | Développement d'une fonctionnalité | Créée depuis `release`, supprimée après merge |
| `fix/XXX` | Correction de bug | Créée depuis `release`, supprimée après merge |
| `release` | Intégration / UAT | Permanente — PR obligatoire + build CI doit passer |
| `main` | Production | Protégée — PR obligatoire + build CI doit passer |
| `gh-pages` | Site hébergé | Jamais éditée manuellement — peuplée uniquement par le CI/CD |

**Déploiement automatique** : tout push sur `main` déclenche `.github/workflows/deploy.yml` qui build et pousse le résultat sur `gh-pages`. GitHub Pages sert la branche `gh-pages`.

**Build check** : toute PR vers `main` ou `release` déclenche `.github/workflows/ci.yml` qui vérifie que `npm run build` passe.

---

## Logique de recommandation (Synthèse)

La synthèse compare le **total des frais réels déclarés** (toutes catégories) à l'**abattement 10 %** et produit l'un des 3 verdicts suivants :

| Scénario | Condition | Recommandation |
|----------|-----------|----------------|
| **A** | Frais réels ≤ abattement | Abattement 10 % (appliqué automatiquement) |
| **B** | Frais réels > abattement ET tous justificatifs présents | Frais réels — case 1AK à remplir |
| **C** | Frais réels > abattement MAIS justificatifs manquants | Abattement cette année + préparer le dossier N+1 |

Pour chaque catégorie : si `justif_xxx === true` → montant inclus dans les frais réels. Sinon → poste affiché comme "sans justificatif" et signalé en avertissement.

---

## Mise à jour annuelle des barèmes

Chaque année en mars/avril, quand les nouveaux barèmes et dates sont publiés sur [impots.gouv.fr](https://www.impots.gouv.fr) et [bofip.impots.gouv.fr](https://bofip.impots.gouv.fr) :

**Ouvrir uniquement [`src/config/fiscalite.js`](src/config/fiscalite.js)**

- [ ] `ANNEE_REVENUS` et `ANNEE_DECLARATION`
- [ ] `ABATTEMENT.plancher` et `ABATTEMENT.plafond`
- [ ] Tous les coefficients dans `BAREME_KM` (voiture / moto / cyclo) — parution au Journal Officiel
- [ ] `REPAS.forfaitDomicile` et `REPAS.plafondExcessif`
- [ ] `TELETRAVAIL.forfaitJour`, `forfaitMois`, `forfaitAn`
- [ ] `MATERIEL.seuilAmortissement` si changé
- [ ] `MAJORATION_ELECTRIQUE.taux` si changé
- [ ] `DATES_LIMITES` — dates papier + 3 zones internet (publiées chaque année par la DGFiP)
- [ ] Vérifier les `ref` dans `references.js` si les URLs BOFIP ont changé

Rien d'autre à toucher.

---

## Notes techniques

**Tailwind v4** : la configuration du thème (couleurs navy/success/danger/amber, polices display/body) se fait via la directive `@theme` dans [`src/styles/index.css`](src/styles/index.css). Le fichier `tailwind.config.js` est conservé mais inutilisé en v4.

**Wizard UX** : chaque étape gère localement un index `qIdx` pour afficher une question à la fois. Le composant `QuestionCard` centralise la mise en page, la progression et la validation. La liste `questions[]` est filtrée selon l'état (ex : skip `puissance` pour les cyclomoteurs).

**Calculs** : toutes les valeurs dérivées (totaux, verdict, recommandation) sont recalculées à chaque render via les fonctions pures de `calculs.js`. Elles ne sont jamais stockées dans le state du reducer.

**PDF** : généré entièrement côté client via jsPDF (police Helvetica WinAnsi). Le PDF contient 9 sections : revenus, transports (formule barème), repas, logement, matériel, comparaison, recommandation, ce que vous déclarez, justificatifs. Nommé `impots-fr-{annee}-{timestamp}.pdf`. Attention : les caractères Unicode hors WinAnsi (✓, →, ☐…) ne sont pas rendus par Helvetica — utiliser uniquement des équivalents ASCII dans la génération PDF.

**Références légales** : [`src/config/references.js`](src/config/references.js) contient une base de données de 18 références BOFIP, chacune avec `texte`, `article`, `citation`, `url`. Chaque constante de `fiscalite.js` possède un champ `ref` listant les clés correspondantes. Le composant `SourceLegale` les affiche en panneau dépliable.
