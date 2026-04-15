import { useState } from 'react';
import { Calendar, Search } from 'lucide-react';
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

function CountdownBadge({ days }) {
  if (days < 0) return <span className="text-xs text-gray-400">Passée</span>;
  if (days === 0) return <span className="text-xs font-bold text-danger">Aujourd'hui !</span>;
  const color = days <= 7 ? 'text-danger' : days <= 21 ? 'text-amber' : 'text-success';
  return (
    <span className={`text-xs font-semibold tabular-nums ${color}`}>
      J−{days}
    </span>
  );
}

export function DeadlineCard() {
  const [dept, setDept] = useState('');
  const activeZone = getDeptZone(dept);

  const paperDays = daysUntil(DATES_LIMITES.papier.date);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-6">
      {/* En-tête */}
      <div className="flex items-center gap-2 px-4 py-3 bg-navy/5 border-b border-gray-100">
        <Calendar size={15} className="text-navy" />
        <span className="text-xs font-semibold text-navy uppercase tracking-wider">
          Dates limites — Déclaration {DATES_LIMITES.anneeDeclaration}
        </span>
      </div>

      <div className="px-4 py-3 space-y-1">
        {/* Ligne papier */}
        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              📄
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">
                {DATES_LIMITES.papier.label}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {DATES_LIMITES.papier.departements}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 text-right ml-3">
            <p className="text-xs font-bold text-gray-700">{DATES_LIMITES.papier.dateLabel}</p>
            <CountdownBadge days={paperDays} />
          </div>
        </div>

        {/* Lignes internet par zone */}
        {DATES_LIMITES.internet.map((zone) => {
          const days = daysUntil(zone.date);
          const isActive = activeZone === zone.zone;

          return (
            <div
              key={zone.zone}
              className={`flex items-center justify-between py-2 rounded-xl px-2 -mx-2 transition-colors ${
                isActive ? 'bg-navy/5 ring-1 ring-navy/20' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`flex-shrink-0 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-navy text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {zone.zone}
                </span>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${isActive ? 'text-navy' : 'text-gray-700'}`}>
                    {zone.departements}
                  </p>
                  {isActive && (
                    <p className="text-xs text-navy/60">Votre zone</p>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 text-right ml-3">
                <p className={`text-xs font-bold ${isActive ? 'text-navy' : 'text-gray-700'}`}>
                  {zone.dateLabel}
                </p>
                <CountdownBadge days={days} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chercher mon département */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            placeholder="Mon département (ex : 75, 2A, 971…)"
            maxLength={3}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-navy bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        {dept.length > 0 && activeZone === null && (
          <p className="text-xs text-gray-400 mt-1.5 pl-1">Département non reconnu</p>
        )}
      </div>

      {/* Note source */}
      <p className="text-xs text-gray-300 px-4 pb-3">
        {DATES_LIMITES.note}
      </p>
    </div>
  );
}
