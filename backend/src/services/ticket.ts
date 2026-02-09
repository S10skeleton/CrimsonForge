import { v4 as uuidv4 } from 'uuid';
import { TicketModel } from '../models/Ticket';
import { ChatMessageModel } from '../models/ChatMessage';
import { Ticket, Vehicle, DiagnosticStep, Part, ChatMessage } from '../../../shared/types';

export class TicketService {
  /**
   * Create a new ticket
   */
  async createTicket(vehicle: Vehicle, customerConcern: string): Promise<Ticket> {
    const ticket = new TicketModel({
      vehicle,
      customerConcern,
      diagnosticSteps: [],
      findings: [],
      pendingActions: [],
      parts: [],
      statusNotes: [],
      status: 'open',
    });

    const saved = await ticket.save();
    return this.toTicket(saved);
  }

  /**
   * Get ticket by ID
   */
  async getTicketById(ticketId: string): Promise<Ticket | null> {
    const ticket = await TicketModel.findById(ticketId);
    return ticket ? this.toTicket(ticket) : null;
  }

  /**
   * Get all tickets
   */
  async getAllTickets(status?: string): Promise<Ticket[]> {
    const query = status ? { status } : {};
    const tickets = await TicketModel.find(query).sort({ updatedAt: -1 });
    return tickets.map(t => this.toTicket(t));
  }

  /**
   * Add a diagnostic step to a ticket
   */
  async addDiagnosticStep(
    ticketId: string,
    description: string,
    result?: string,
    dtcCodes?: string[]
  ): Promise<Ticket> {
    const step: DiagnosticStep = {
      id: uuidv4(),
      timestamp: new Date(),
      description,
      result,
      dtcCodes,
    };

    const ticket = await TicketModel.findByIdAndUpdate(
      ticketId,
      { $push: { diagnosticSteps: step } },
      { new: true }
    );

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return this.toTicket(ticket);
  }

  /**
   * Add a finding to a ticket
   */
  async addFinding(ticketId: string, finding: string): Promise<Ticket> {
    const ticket = await TicketModel.findByIdAndUpdate(
      ticketId,
      { $push: { findings: finding } },
      { new: true }
    );

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return this.toTicket(ticket);
  }

  /**
   * Add a part to a ticket
   */
  async addPart(ticketId: string, part: Part): Promise<Ticket> {
    const ticket = await TicketModel.findByIdAndUpdate(
      ticketId,
      { $push: { parts: part } },
      { new: true }
    );

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return this.toTicket(ticket);
  }

  /**
   * Update ticket status
   */
  async updateStatus(
    ticketId: string,
    status: 'open' | 'in-progress' | 'waiting-parts' | 'completed',
    note?: string
  ): Promise<Ticket> {
    const update: any = { status };
    
    if (note) {
      update.$push = { statusNotes: note };
    }

    const ticket = await TicketModel.findByIdAndUpdate(ticketId, update, { new: true });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return this.toTicket(ticket);
  }

  /**
   * Get conversation history for a ticket
   */
  async getConversationHistory(ticketId: string): Promise<ChatMessage[]> {
    const messages = await ChatMessageModel.find({ ticketId })
      .sort({ timestamp: 1 })
      .limit(50); // Limit to last 50 messages

    return messages.map(m => ({
      id: m._id.toString(),
      ticketId: m.ticketId,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
      metadata: m.metadata,
    }));
  }

  /**
   * Add a chat message to a ticket's conversation
   */
  async addChatMessage(
    ticketId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: any
  ): Promise<ChatMessage> {
    const message = new ChatMessageModel({
      ticketId,
      role,
      content,
      timestamp: new Date(),
      metadata,
    });

    const saved = await message.save();

    return {
      id: saved._id.toString(),
      ticketId: saved.ticketId,
      role: saved.role,
      content: saved.content,
      timestamp: saved.timestamp,
      metadata: saved.metadata,
    };
  }

  /**
   * Helper to convert Mongoose document to Ticket type
   */
  private toTicket(doc: any): Ticket {
    return {
      id: doc._id.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      vehicle: doc.vehicle,
      customerConcern: doc.customerConcern,
      diagnosticSteps: doc.diagnosticSteps,
      findings: doc.findings,
      pendingActions: doc.pendingActions,
      parts: doc.parts,
      statusNotes: doc.statusNotes,
      status: doc.status,
    };
  }
}

// Export singleton
export const ticketService = new TicketService();
