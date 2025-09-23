import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { BottomNav, HeroSection, TopNav, TradingTable } from './components';

function HomePage() {
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;