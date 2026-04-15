import { Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-4 px-4 mt-auto">
      <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 text-xs text-gray-400">
        <Lock size={12} />
        <span>Vos données restent dans votre navigateur et ne sont jamais transmises.</span>
      </div>
    </footer>
  );
}
