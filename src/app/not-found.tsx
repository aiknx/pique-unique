export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold text-hunter-green mb-4">404 – Puslapis nerastas</h1>
        <p className="text-gray-700 mb-8">Atsiprašome, bet šio puslapio nėra. Grįžkite į pradžią arba susisiekite.</p>
        <a href="/" className="btn-primary" aria-label="Grįžti į pagrindinį puslapį">Į pradžią</a>
      </div>
    </main>
  );
}


