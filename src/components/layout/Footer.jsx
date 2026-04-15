import { Lock } from 'lucide-react';

const NAV_LINKS = [
  { label: 'v2026.4.1', screen: 'versions' },
  { label: 'Mentions légales', screen: 'mentions-legales' },
  { label: 'Confidentialité', screen: 'confidentialite' },
  { label: 'Accessibilité', screen: 'accessibilite' },
];

export function Footer({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-gray-100 py-4 px-4 mt-auto">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-2.5">

        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Lock size={11} />
          <span>Vos données restent dans votre navigateur et ne sont jamais transmises.</span>
        </div>

        <div className="flex items-center flex-wrap justify-center gap-x-3 gap-y-1">
          {NAV_LINKS.map(({ label, screen }, i) => (
            <span key={screen} className="flex items-center gap-3">
              {i > 0 && <span className="text-gray-200">·</span>}
              <button
                type="button"
                onClick={() => onNavigate(screen)}
                className="text-xs text-gray-400 hover:text-navy transition-colors"
              >
                {label}
              </button>
            </span>
          ))}
        </div>

      </div>
    </footer>
  );
}
