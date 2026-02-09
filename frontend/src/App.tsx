import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TicketList from './pages/TicketList';
import TicketDetail from './pages/TicketDetail';
import CreateTicket from './pages/CreateTicket';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                🔧 Mechanic AI Helper
              </Link>
            </h1>
            <nav>
              <Link to="/" className="nav-link">Tickets</Link>
              <Link to="/create" className="nav-link">New Ticket</Link>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<TicketList />} />
              <Route path="/create" element={<CreateTicket />} />
              <Route path="/ticket/:id" element={<TicketDetail />} />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>Mechanic AI Helper - Your workflow copilot for repair work</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
