export function Header({ onHome }) {
  return (
    <header className="bg-navy shadow-lg">
      <div className="flex items-center justify-center py-5 sm:py-6 px-4">
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); onHome?.(); }}
          className="group select-none"
        >
          <h1
            className="text-4xl sm:text-5xl leading-none text-white"
            style={{ fontFamily: "'Pacifico', Georgia, serif" }}
          >
            Frais Réels
          </h1>
        </a>
      </div>
    </header>
  );
}
