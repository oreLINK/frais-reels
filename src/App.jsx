import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Stepper } from './components/layout/Stepper';
import { LandingPage } from './components/LandingPage';
import { DocumentChecklist } from './components/DocumentChecklist';
import { useSimulator } from './hooks/useSimulator';
import { VersionsPage } from './components/VersionsPage';
import { MentionsLegalesPage } from './components/MentionsLegalesPage';
import { PolitiqueConfidentialitePage } from './components/PolitiqueConfidentialitePage';
import { AccessibilitePage } from './components/AccessibilitePage';

import { Step1_Revenus } from './components/steps/Step1_Revenus';
import { Step2_Deplacements } from './components/steps/Step2_Deplacements';
import { Step3_Repas } from './components/steps/Step3_Repas';
import { Step4_Logement } from './components/steps/Step4_Logement';
import { Step5_Materiel } from './components/steps/Step5_Materiel';
import { Synthese } from './components/steps/Synthese';

import './styles/index.css';

const STEPS = ['Revenus', 'Transports', 'Repas', 'Logement', 'Matériel', 'Synthèse'];

const STEP_COMPONENTS = [
  Step1_Revenus,
  Step2_Deplacements,
  Step3_Repas,
  Step4_Logement,
  Step5_Materiel,
  Synthese,
];

function App() {
  const [state, dispatch] = useSimulator();
  // 'landing' | 'checklist' | 'simulator' | 'versions' | 'mentions-legales' | 'confidentialite' | 'accessibilite'
  const [screen, setScreen] = useState('landing');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (window.goatcounter?.count) {
      window.goatcounter.count({
        path: screen === 'landing' ? '/frais-reels/' : `/frais-reels/${screen}`,
        title: screen,
      });
    }
  }, [screen]);

  const navigate = (s) => { setScreen(s); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goHome = () => { setScreen('landing'); setCurrentStep(0); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const CurrentStepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header onHome={goHome} />
      {screen === 'simulator' && (
        <Stepper
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
        />
      )}
      <main className="flex-1 py-6">
        {screen === 'landing' && (
          <LandingPage onStart={() => navigate('checklist')} />
        )}
        {screen === 'checklist' && (
          <DocumentChecklist onStart={() => navigate('simulator')} />
        )}
        {screen === 'simulator' && (
          <CurrentStepComponent
            state={state}
            dispatch={dispatch}
            onNext={currentStep < STEPS.length - 1 ? handleNext : null}
            onPrev={currentStep > 0 ? handlePrev : null}
          />
        )}
        {screen === 'versions' && <VersionsPage onHome={goHome} />}
        {screen === 'mentions-legales' && <MentionsLegalesPage onHome={goHome} />}
        {screen === 'confidentialite' && <PolitiqueConfidentialitePage onHome={goHome} />}
        {screen === 'accessibilite' && <AccessibilitePage onHome={goHome} />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
