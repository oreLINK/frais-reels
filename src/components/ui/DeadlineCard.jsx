import { useState } from 'react';
import { Search } from 'lucide-react';
import { DATES_LIMITES } from '../../config/fiscalite';

function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function getDeptZone(input) {
  if (!input) return null;
  const normalized = input.trim().toUpperCase();

  // Corse
  if (['2A', '2B', '20'].includes(normalized)) return 2;

  const n = parseInt(normalized, 10);
  if (isNaN(n)) return null;

  // Non-résidents (code 99)
  if (n === 99) return 1;

  for (const zone of DATES_LIMITES.internet) {
    const [min, max] = zone.departementsRange;
    if (n >= min && n <= max) return zone.zone;
    if (zone.departementsSpeciaux.includes(n)) return zone.zone;
  }
  return null;
}

function CountdownBadge({ days, large = false }) {
  if (days < 0) {
    return <span className={`${large ? 'text-base' : 'text-sm'} text-gray-400 font-medium`}>Passée</span>;
  }
  if (days === 0) {
    return <span className={`${large ? 'text-base' : 'text-sm'} font-bold text-danger`}>Aujourd'hui !</span>;
  }
  const color = days <= 7 ? 'text-danger' : days <= 21 ? 'text-amber-500' : 'text-success';
  return (
    <span className={`${large ? 'text-lg' : 'text-sm'} font-bold tabular-nums ${color}`}>
      J−{days}
    </span>
  );
}

export function DeadlineCard() {
  const [dept, setDept] = useState('');
  const activeZone = getDeptZone(dept);

  const paperDays = daysUntil(DATES_LIMITES.papier.date);

  return (
    <div className="bg-white">
      <div className="px-4 pt-4 pb-2 space-y-2">

        {/* Déclaration papier */}
        <div className="flex items-center justify-between px-3 py-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-lg flex-shrink-0">📄</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-700 truncate">
                {DATES_LIMITES.papier.label}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {DATES_LIMITES.papier.departements}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 text-right ml-3">
            <p className="text-sm font-bold text-gray-700">{DATES_LIMITES.papier.dateLabel}</p>
            <CountdownBadge days={paperDays} />
          </div>
        </div>

        {/* Zones internet */}
        {DATES_LIMITES.internet.map((zone) => {
          const days = daysUntil(zone.date);
          const isActive = activeZone === zone.zone;

          return (
            <div
              key={zone.zone}
              className={`flex items-center justify-between px-3 py-3 rounded-xl border transition-colors ${
                isActive
                  ? 'bg-navy/5 border-navy/20'
                  : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isActive ? 'bg-navy text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {zone.zone}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-navy' : 'text-gray-700'}`}>
                    {zone.departements}
                  </p>
                  {isActive && (
                    <p className="text-xs text-navy/60">Votre zone</p>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 text-right ml-3">
                <p className={`text-sm font-bold ${isActive ? 'text-navy' : 'text-gray-700'}`}>
                  {zone.dateLabel}
                </p>
                <CountdownBadge days={days} large={isActive} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chercher mon département */}
      <div className="px-4 pb-3 pt-1">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            placeholder="Mon département (ex : 75, 2A, 971…)"
            maxLength={3}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-navy bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        {dept.length > 0 && activeZone === null && (
          <p className="text-sm text-gray-500 mt-1.5 pl-1">Département non reconnu</p>
        )}
      </div>

      <p className="text-xs text-gray-400 px-4 pb-3">
        Dates officielles · Source :{' '}
        <a
          href="https://www.info.gouv.fr/actualite/impot-2026-quelles-nouveautes-pour-la-declaration-des-revenus-2025#:~:text=19%20mai%20%3A%20date%20limite%20de,numérotés%20de%2020%20à%2054"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-navy transition-colors"
        >
          info.gouv.fr
        </a>
      </p>
    </div>
  );
}
