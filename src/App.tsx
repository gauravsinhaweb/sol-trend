
import { TopNav, BottomNav, HeroSection, TradingTable } from './components';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav />
      <main className="pb-20">
        <HeroSection />
        <TradingTable />
      </main>
      <BottomNav className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
}

export default App;
