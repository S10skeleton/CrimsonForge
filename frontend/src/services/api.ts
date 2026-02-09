import axios from 'axios';
import { Ticket, Vehicle, ChatMessage, Part } from '../../../shared/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ticketAPI = {
  // Create a new ticket
  createTicket: async (vehicle: Vehicle, customerConcern: string): Promise<Ticket> => {
    const response = await api.post('/tickets', { vehicle, customerConcern });
    return response.data;
  },

  // Get all tickets
  getAllTickets: async (status?: string): Promise<Ticket[]> => {
    const response = await api.get('/tickets', { params: { status } });
    return response.data;
  },

  // Get a specific ticket
  getTicket: async (id: string): Promise<Ticket> => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Add diagnostic step
  addDiagnosticStep: async (
    id: string,
    description: string,
    result?: string,
    dtcCodes?: string[]
  ): Promise<Ticket> => {
    const response = await api.post(`/tickets/${id}/diagnostic-step`, {
      description,
      result,
      dtcCodes,
    });
    return response.data;
  },

  // Add finding
  addFinding: async (id: string, finding: string): Promise<Ticket> => {
    const response = await api.post(`/tickets/${id}/finding`, { finding });
    return response.data;
  },

  // Add part
  addPart: async (id: string, part: Part): Promise<Ticket> => {
    const response = await api.post(`/tickets/${id}/part`, part);
    return response.data;
  },

  // Update status
  updateStatus: async (
    id: string,
    status: 'open' | 'in-progress' | 'waiting-parts' | 'completed',
    note?: string
  ): Promise<Ticket> => {
    const response = await api.patch(`/tickets/${id}/status`, { status, note });
    return response.data;
  },

  // Get conversation history
  getConversation: async (id: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/tickets/${id}/conversation`);
    return response.data;
  },

  // Send chat message
  sendChatMessage: async (id: string, message: string): Promise<ChatMessage> => {
    const response = await api.post(`/tickets/${id}/chat`, { message });
    return response.data.message;
  },

  // Get AI suggestion for next diagnostic step
  suggestNextStep: async (id: string): Promise<string> => {
    const response = await api.post(`/tickets/${id}/suggest-next-step`);
    return response.data.suggestion;
  },

  // Generate parts list
  generatePartsList: async (id: string): Promise<string> => {
    const response = await api.post(`/tickets/${id}/generate-parts-list`);
    return response.data.partsList;
  },

  // Generate final documentation
  generateDocumentation: async (
    id: string
  ): Promise<{ concern: string; cause: string; correction: string }> => {
    const response = await api.post(`/tickets/${id}/generate-documentation`);
    return response.data;
  },
};
