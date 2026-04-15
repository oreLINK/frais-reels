import { useState } from 'react';
import { BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { REFERENCES } from '../../config/references';

export function SourceLegale({ refKeys }) {
  const [open, setOpen] = useState(false);
  if (!refKeys || refKeys.length === 0) return null;

  const refs = refKeys.map((k) => REFERENCES[k]).filter(Boolean);
  if (refs.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy transition-colors"
        type="button"
      >
        <BookOpen size={12} />
        <span>Sources légales</span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {open && (
        <div className="mt-2 space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
          {refs.map((ref, i) => (
            <div key={i} className={i > 0 ? 'pt-4 border-t border-slate-200' : ''}>
              <p className="text-xs font-semibold text-navy">{ref.texte}</p>
              <p className="text-xs text-gray-500 mb-1">{ref.article}</p>
              <blockquote className="text-xs text-gray-700 italic border-l-2 border-navy/30 pl-2.5 my-1.5 leading-relaxed">
                « {ref.citation} »
              </blockquote>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                Voir le texte officiel <ExternalLink size={11} />
              </a>
              <p className="text-xs text-gray-400 mt-1.5">
                📍 {ref.chemin}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
