export function Jauge({ label1, montant1, label2, montant2 }) {
  const total = montant1 + montant2;
  const pct1 = total > 0 ? (montant1 / total) * 100 : 50;
  const pct2 = 100 - pct1;
  const avantage = montant1 >= montant2;

  return (
    <div className="my-2">
      <div className="flex justify-between mb-3">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm mb-0.5">{label1}</p>
          <p className={`text-2xl sm:text-3xl font-bold tabular-nums ${avantage ? 'text-success' : 'text-navy'}`}>
            {montant1.toLocaleString('fr-FR')} €
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs sm:text-sm mb-0.5">{label2}</p>
          <p className="text-2xl sm:text-3xl font-bold text-navy tabular-nums">
            {montant2.toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>
      <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
        <div
          className={`transition-all duration-500 ${avantage ? 'bg-success' : 'bg-navy/60'}`}
          style={{ width: `${pct1}%` }}
        />
        <div
          className="bg-navy/20 transition-all duration-500"
          style={{ width: `${pct2}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-1.5 text-center">
        {pct1.toFixed(0)} % vs {pct2.toFixed(0)} %
      </p>
    </div>
  );
}
