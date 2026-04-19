import { useReducer } from 'react';

const initialState = {
  // Étape 1 – Revenus
  sni: 0,

  // Étape 2 – Transports
  typeVehicule: 'voiture',
  puissance: '5CV',
  estElectrique: false,
  distanceAller: 0,
  joursTravailSite: 220,
  peages: 0,
  parking: 0,
  justif_transport: false,
  justifDistance40: false,    // true = circonstances particulières attestées (>40 km)

  // Étape 3 – Repas
  typeRepas: 'restaurant',
  coutRepas: 0,
  joursRepas: 0,
  aTicketResto: false,
  partPatronale: 0,
  justif_repas: false,

  // Étape 4 – Logement
  surfaceTotale: 0,
  surfaceBureau: 0,
  charges: {
    loyer: 0,
    interets: 0,
    edf: 0,
    gaz: 0,
    taxeFonciere: 0,
    copro: 0,
  },
  justif_logement: false,

  // Étape 5 – Matériel
  articlesPlus500: [],
  totalMoins500: 0,
  abonnements: {
    internet: { montant: 0, pctPro: 50 },
    mobile: { montant: 0, pctPro: 50 },
  },
  justif_materiel: false,
};

function reducer(state, action) {
  switch (action.type) {
    // Étape 1
    case 'SET_SNI':
      return { ...state, sni: action.payload };

    // Étape 2
    case 'SET_TYPE_VEHICULE':
      return { ...state, typeVehicule: action.payload, puissance: '5CV' };
    case 'SET_PUISSANCE':
      return { ...state, puissance: action.payload };
    case 'SET_ELECTRIQUE':
      return { ...state, estElectrique: action.payload };
    case 'SET_DISTANCE_ALLER':
      return { ...state, distanceAller: action.payload };
    case 'SET_JOURS_TRAVAIL':
      return { ...state, joursTravailSite: action.payload };
    case 'SET_PEAGES':
      return { ...state, peages: action.payload };
    case 'SET_PARKING':
      return { ...state, parking: action.payload };
    case 'SET_JUSTIF_TRANSPORT':
      return { ...state, justif_transport: action.payload };
    case 'SET_JUSTIF_DISTANCE_40':
      return { ...state, justifDistance40: action.payload };

    // Étape 3
    case 'SET_TYPE_REPAS':
      return { ...state, typeRepas: action.payload };
    case 'SET_COUT_REPAS':
      return { ...state, coutRepas: action.payload };
    case 'SET_JOURS_REPAS':
      return { ...state, joursRepas: action.payload };
    case 'SET_A_TICKET_RESTO':
      return { ...state, aTicketResto: action.payload };
    case 'SET_PART_PATRONALE':
      return { ...state, partPatronale: action.payload };
    case 'SET_JUSTIF_REPAS':
      return { ...state, justif_repas: action.payload };

    // Étape 4
    case 'SET_SURFACE_TOTALE':
      return { ...state, surfaceTotale: action.payload };
    case 'SET_SURFACE_BUREAU':
      return { ...state, surfaceBureau: action.payload };
    case 'SET_CHARGE':
      return {
        ...state,
        charges: { ...state.charges, [action.key]: action.payload },
      };
    case 'SET_JUSTIF_LOGEMENT':
      return { ...state, justif_logement: action.payload };

    // Étape 5
    case 'ADD_ARTICLE':
      return {
        ...state,
        articlesPlus500: [...state.articlesPlus500, action.payload],
      };
    case 'REMOVE_ARTICLE':
      return {
        ...state,
        articlesPlus500: state.articlesPlus500.filter((_, i) => i !== action.payload),
      };
    case 'SET_TOTAL_MOINS_500':
      return { ...state, totalMoins500: action.payload };
    case 'SET_ABONNEMENT':
      return {
        ...state,
        abonnements: {
          ...state.abonnements,
          [action.key]: action.payload,
        },
      };
    case 'SET_JUSTIF_MATERIEL':
      return { ...state, justif_materiel: action.payload };

    default:
      return state;
  }
}

export function useSimulator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state, dispatch];
}
