import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketAPI } from '../services/api';
import { Vehicle } from '../../../shared/types';
import './CreateTicket.css';

function CreateTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vehicle, setVehicle] = useState<Vehicle>({
    vin: '',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    engine: '',
  });

  const [customerConcern, setCustomerConcern] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehicle.vin || !vehicle.make || !vehicle.model || !customerConcern) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const ticket = await ticketAPI.createTicket(vehicle, customerConcern);
      navigate(`/ticket/${ticket.id}`);
    } catch (err) {
      setError('Failed to create ticket');
      console.error('Error creating ticket:', err);
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket">
      <h2>Create New Ticket</h2>

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-section">
          <h3>Vehicle Information</h3>
          
          <div className="form-group">
            <label htmlFor="vin">VIN *</label>
            <input
              type="text"
              id="vin"
              value={vehicle.vin}
              onChange={(e) => setVehicle({ ...vehicle, vin: e.target.value })}
              placeholder="Enter 17-digit VIN"
              maxLength={17}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year *</label>
              <input
                type="number"
                id="year"
                value={vehicle.year}
                onChange={(e) => setVehicle({ ...vehicle, year: parseInt(e.target.value) })}
                min={1900}
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="make">Make *</label>
              <input
                type="text"
                id="make"
                value={vehicle.make}
                onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                placeholder="e.g., Toyota"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Model *</label>
              <input
                type="text"
                id="model"
                value={vehicle.model}
                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                placeholder="e.g., Camry"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="engine">Engine (Optional)</label>
            <input
              type="text"
              id="engine"
              value={vehicle.engine}
              onChange={(e) => setVehicle({ ...vehicle, engine: e.target.value })}
              placeholder="e.g., 2.5L 4-cyl"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Customer Concern</h3>
          
          <div className="form-group">
            <label htmlFor="concern">What is the customer's concern? *</label>
            <textarea
              id="concern"
              value={customerConcern}
              onChange={(e) => setCustomerConcern(e.target.value)}
              placeholder="Describe the customer's complaint or concern..."
              rows={4}
              required
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTicket;
