# Simulateur Frais Réels

> Simulateur de frais réels pour salariés français.
> Revenus 2025 / Déclaration 2026. Hébergé en statique sur GitHub Pages. Zéro collecte de données.

---

## Stack technique

| Outil | Version | Rôle |
|---|---|---|
| React | 19 | SPA, composants, état global via `useReducer` |
| Vite | 8 | Build + HMR dev |
| Tailwind CSS | 4 | Styles utility-first (config via `@theme` dans le CSS) |
| jsPDF | 4 | Génération PDF côté client |
| Lucide React | — | Icônes |
| gh-pages | — | Déploiement GitHub Pages |

Aucun backend. Aucun cookie. Aucun `localStorage`. Tout calcul dans le navigateur.

---

## Architecture

```
frais-reels/
├── index.html
├── vite.config.js          # base: '/frais-reels/' pour GitHub Pages
├── postcss.config.js       # @tailwindcss/postcss (Tailwind v4)
├── tailwind.config.js      # inutilisé en v4, conservé pour référence
├── package.json
├── public/favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx                       # Stepper principal (6 écrans)
    ├── config/
    │   └── fiscalite.js              # ⭐ FICHIER CENTRAL — tous les barèmes fiscaux
    ├── engine/
    │   └── calculs.js                # Fonctions pures de calcul
    ├── hooks/
    │   └── useSimulator.js           # useReducer — état global
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx
    │   │   ├── Stepper.jsx           # Barre de progression + navigation
    │   │   └── Footer.jsx
    │   ├── steps/
    │   │   ├── Step1_Revenus.jsx
    │   │   ├── Step2_Deplacements.jsx
    │   │   ├── Step3_Repas.jsx
    │   │   ├── Step4_Logement.jsx
    │   │   ├── Step5_Materiel.jsx
    │   │   └── Synthese.jsx
    │   └── ui/
    │       ├── Tooltip.jsx           # Icône (i) avec explication fiscale
    │       ├── Jauge.jsx             # Barre de comparaison animée
    │       ├── AlertBox.jsx          # Alertes conditionnelles
    │       ├── CheckboxJustif.jsx    # Case justificatif avec impact audit
    │       ├── ExportBlock.jsx       # Copier détail + Générer PDF
    │       ├── InputField.jsx
    │       ├── SelectField.jsx
    │       └── SliderInput.jsx
    └── styles/
        └── index.css                 # @import "tailwindcss" + @theme custom
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

# Déployer sur GitHub Pages
npm run deploy
# → build + push dist/ sur la branche gh-pages
```

---

## Mise à jour annuelle des barèmes

Chaque année en janvier/février, quand les nouveaux barèmes sont publiés sur [bofip.impots.gouv.fr](https://bofip.impots.gouv.fr) :

**Ouvrir uniquement [`src/config/fiscalite.js`](src/config/fiscalite.js)**

- [ ] Mettre à jour `ANNEE_REVENUS` et `ANNEE_DECLARATION`
- [ ] Mettre à jour `ABATTEMENT.plancher` et `ABATTEMENT.plafond`
- [ ] Mettre à jour tous les coefficients dans `BAREME_KM` (voiture / moto / cyclo)
- [ ] Mettre à jour `REPAS.forfaitDomicile` et `REPAS.plafondRestaurant`
- [ ] Mettre à jour `MATERIEL.seuilAmortissement` si changé
- [ ] Mettre à jour `MAJORATION_ELECTRIQUE` si changé
- [ ] Vérifier les textes légaux dans `TEXTES`
- [ ] `npm run build && npm run deploy`

Rien d'autre à toucher.

---

## Règles de l'audit sécurisé / risqué

Pour chaque catégorie (transport, repas, logement, matériel) :
- Si `justif_xxx === true` → montant ajouté aux **frais sécurisés**
- Si `justif_xxx === false` → montant ajouté aux **frais à risque**

Le verdict compare uniquement les frais sécurisés à l'abattement 10%. Les frais à risque sont affichés en avertissement séparé.

---

## Notes techniques

**Tailwind v4** : la configuration du thème (couleurs, polices) se fait via la directive `@theme` dans [`src/styles/index.css`](src/styles/index.css), pas dans `tailwind.config.js`.

**Calculs** : toutes les valeurs dérivées (totaux, verdict) sont recalculées à chaque render via les fonctions de `calculs.js`. Elles ne sont jamais stockées dans le state du reducer.

**PDF** : généré entièrement côté client via jsPDF. La liste de justificatifs est dynamique selon les catégories actives (cases cochées).
