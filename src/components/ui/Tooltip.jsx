import { Info } from 'lucide-react';
import { useState } from 'react';
import { SourceLegale } from './SourceLegale';

export function Tooltip({ text, refKeys }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="ml-1 text-gray-400 hover:text-navy transition-colors"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        aria-label="Aide"
      >
        <Info size={16} />
      </button>
      {show && (
        <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-200 text-gray-700 text-sm p-3 rounded-xl shadow-lg z-20">
          {text && <p>{text}</p>}
          {refKeys && <SourceLegale refKeys={refKeys} />}
        </div>
      )}
    </div>
  );
}
