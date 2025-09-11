import { Navigation } from "../components/Navigation";
import { navigationItems } from "../data/navigation";

export function ActionPage() {
  return (
    <div className="min-h-screen w-full">
      <Navigation items={navigationItems} />
      <main className="min-h-screen bg-black text-white p-8" role="main">
        <h1 className="text-4xl font-bold mb-8">Que faire contre la tromperie ?</h1>
        <p className="text-lg">Cette page explique les actions à entreprendre contre la tromperie de contenu.</p>
      </main>
    </div>
  );
}