import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketAPI } from '../services/api';
import { Ticket } from '../../../shared/types';
import './TicketList.css';

function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    loadTickets();
  }, [filterStatus]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketAPI.getAllTickets(filterStatus || undefined);
      setTickets(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tickets');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const classes: Record<string, string> = {
      'open': 'badge-open',
      'in-progress': 'badge-progress',
      'waiting-parts': 'badge-waiting',
      'completed': 'badge-completed',
    };
    return `status-badge ${classes[status] || ''}`;
  };

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="ticket-list">
      <div className="ticket-list-header">
        <h2>Job Tickets</h2>
        <div className="filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="waiting-parts">Waiting Parts</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <p>No tickets found.</p>
          <Link to="/create" className="btn btn-primary">Create Your First Ticket</Link>
        </div>
      ) : (
        <div className="ticket-grid">
          {tickets.map((ticket) => (
            <Link 
              key={ticket.id} 
              to={`/ticket/${ticket.id}`} 
              className="ticket-card"
            >
              <div className="ticket-card-header">
                <span className={getStatusBadgeClass(ticket.status)}>
                  {ticket.status.replace('-', ' ')}
                </span>
                <span className="ticket-date">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="ticket-vehicle">
                <h3>{ticket.vehicle.year} {ticket.vehicle.make} {ticket.vehicle.model}</h3>
                <p className="vin">VIN: {ticket.vehicle.vin}</p>
              </div>

              <div className="ticket-concern">
                <p><strong>Concern:</strong> {ticket.customerConcern}</p>
              </div>

              <div className="ticket-stats">
                <span>📋 {ticket.diagnosticSteps.length} steps</span>
                <span>🔍 {ticket.findings.length} findings</span>
                <span>🔧 {ticket.parts.length} parts</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;
