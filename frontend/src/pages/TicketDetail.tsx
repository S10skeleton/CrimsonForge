import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketAPI } from '../services/api';
import { Ticket, ChatMessage } from '../../../shared/types';
import './TicketDetail.css';

function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadTicketData();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadTicketData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [ticketData, conversationData] = await Promise.all([
        ticketAPI.getTicket(id),
        ticketAPI.getConversation(id),
      ]);
      
      setTicket(ticketData);
      setMessages(conversationData);
      setError(null);
    } catch (err) {
      setError('Failed to load ticket');
      console.error('Error loading ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !id) return;

    const userMessage = messageInput.trim();
    setMessageInput('');
    setSending(true);

    try {
      const response = await ticketAPI.sendChatMessage(id, userMessage);
      
      // Reload conversation to get both user and AI messages
      const updatedConversation = await ticketAPI.getConversation(id);
      setMessages(updatedConversation);
      
      // Reload ticket data to get updated context
      const updatedTicket = await ticketAPI.getTicket(id);
      setTicket(updatedTicket);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSuggestNextStep = async () => {
    if (!id) return;

    try {
      setSending(true);
      const suggestion = await ticketAPI.suggestNextStep(id);
      
      // Add suggestion as an assistant message
      const updatedConversation = await ticketAPI.getConversation(id);
      setMessages(updatedConversation);
    } catch (err) {
      console.error('Error getting suggestion:', err);
      setError('Failed to get suggestion');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading ticket...</div>;
  }

  if (error || !ticket) {
    return (
      <div className="error">
        {error || 'Ticket not found'}
        <button onClick={() => navigate('/')} className="btn">
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-detail">
      <div className="ticket-sidebar">
        <div className="ticket-info">
          <button onClick={() => navigate('/')} className="back-button">
            ← Back
          </button>

          <h2>Ticket Details</h2>

          <div className="info-section">
            <h3>Vehicle</h3>
            <p><strong>{ticket.vehicle.year} {ticket.vehicle.make} {ticket.vehicle.model}</strong></p>
            <p className="small">VIN: {ticket.vehicle.vin}</p>
            {ticket.vehicle.engine && <p className="small">Engine: {ticket.vehicle.engine}</p>}
          </div>

          <div className="info-section">
            <h3>Customer Concern</h3>
            <p>{ticket.customerConcern}</p>
          </div>

          <div className="info-section">
            <h3>Status</h3>
            <p className="status-badge">{ticket.status}</p>
          </div>

          {ticket.diagnosticSteps.length > 0 && (
            <div className="info-section">
              <h3>Diagnostic Steps ({ticket.diagnosticSteps.length})</h3>
              <ul className="diagnostic-list">
                {ticket.diagnosticSteps.map((step) => (
                  <li key={step.id}>
                    <div>{step.description}</div>
                    {step.result && <div className="small">Result: {step.result}</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ticket.findings.length > 0 && (
            <div className="info-section">
              <h3>Findings ({ticket.findings.length})</h3>
              <ul>
                {ticket.findings.map((finding, i) => (
                  <li key={i}>{finding}</li>
                ))}
              </ul>
            </div>
          )}

          {ticket.parts.length > 0 && (
            <div className="info-section">
              <h3>Parts ({ticket.parts.length})</h3>
              <ul>
                {ticket.parts.map((part, i) => (
                  <li key={i}>
                    <div>{part.description}</div>
                    <div className="small">
                      {part.partNumber} - {part.status}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <h2>AI Assistant</h2>
          <button 
            onClick={handleSuggestNextStep} 
            className="btn btn-secondary"
            disabled={sending}
          >
            Suggest Next Step
          </button>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <p>Start a conversation with the AI assistant to help with diagnostics, 
                 parts lookup, and documentation.</p>
              <p className="small">Try asking:
                <br />• "What are the torque specs for the cylinder head bolts?"
                <br />• "Show me the procedure for timing belt replacement"
                <br />• "What should I check next?"
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`message message-${message.role}`}
              >
                <div className="message-content">
                  {message.content}
                </div>
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Ask the AI assistant anything..."
            disabled={sending}
            className="chat-input"
          />
          <button 
            type="submit" 
            disabled={sending || !messageInput.trim()}
            className="btn btn-primary"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TicketDetail;
