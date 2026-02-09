import { Request, Response } from 'express';
import { ticketService } from '../services/ticket';
import { getClaudeService } from '../services/claude';

export class TicketController {
  /**
   * POST /api/tickets - Create a new ticket
   */
  async createTicket(req: Request, res: Response) {
    try {
      const { vehicle, customerConcern } = req.body;

      if (!vehicle || !customerConcern) {
        return res.status(400).json({ error: 'Vehicle and customer concern are required' });
      }

      const ticket = await ticketService.createTicket(vehicle, customerConcern);
      res.status(201).json(ticket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  }

  /**
   * GET /api/tickets - Get all tickets
   */
  async getAllTickets(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const tickets = await ticketService.getAllTickets(status as string);
      res.json(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }

  /**
   * GET /api/tickets/:id - Get a specific ticket
   */
  async getTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await ticketService.getTicketById(id);

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.json(ticket);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      res.status(500).json({ error: 'Failed to fetch ticket' });
    }
  }

  /**
   * POST /api/tickets/:id/diagnostic-step - Add a diagnostic step
   */
  async addDiagnosticStep(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { description, result, dtcCodes } = req.body;

      if (!description) {
        return res.status(400).json({ error: 'Description is required' });
      }

      const ticket = await ticketService.addDiagnosticStep(id, description, result, dtcCodes);
      res.json(ticket);
    } catch (error) {
      console.error('Error adding diagnostic step:', error);
      res.status(500).json({ error: 'Failed to add diagnostic step' });
    }
  }

  /**
   * POST /api/tickets/:id/finding - Add a finding
   */
  async addFinding(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { finding } = req.body;

      if (!finding) {
        return res.status(400).json({ error: 'Finding is required' });
      }

      const ticket = await ticketService.addFinding(id, finding);
      res.json(ticket);
    } catch (error) {
      console.error('Error adding finding:', error);
      res.status(500).json({ error: 'Failed to add finding' });
    }
  }

  /**
   * POST /api/tickets/:id/part - Add a part
   */
  async addPart(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const part = req.body;

      if (!part.partNumber || !part.description || !part.source || !part.status) {
        return res.status(400).json({ error: 'Missing required part fields' });
      }

      const ticket = await ticketService.addPart(id, part);
      res.json(ticket);
    } catch (error) {
      console.error('Error adding part:', error);
      res.status(500).json({ error: 'Failed to add part' });
    }
  }

  /**
   * PATCH /api/tickets/:id/status - Update ticket status
   */
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const ticket = await ticketService.updateStatus(id, status, note);
      res.json(ticket);
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  }

  /**
   * GET /api/tickets/:id/conversation - Get conversation history
   */
  async getConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const messages = await ticketService.getConversationHistory(id);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ error: 'Failed to fetch conversation' });
    }
  }

  /**
   * POST /api/tickets/:id/chat - Send a chat message
   */
  async sendChatMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Get ticket and conversation history
      const ticket = await ticketService.getTicketById(id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      const history = await ticketService.getConversationHistory(id);

      // Save user message
      await ticketService.addChatMessage(id, 'user', message);

      // Get AI response
      const claudeService = getClaudeService();
      const response = await claudeService.processMessage(message, ticket, history);

      // Save AI response
      const aiMessage = await ticketService.addChatMessage(id, 'assistant', response);

      res.json({ message: aiMessage });
    } catch (error) {
      console.error('Error processing chat message:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  }

  /**
   * POST /api/tickets/:id/suggest-next-step - Get AI suggestion for next diagnostic step
   */
  async suggestNextStep(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const ticket = await ticketService.getTicketById(id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      const claudeService = getClaudeService();
      const suggestion = await claudeService.suggestNextDiagnosticStep(ticket);

      res.json({ suggestion });
    } catch (error) {
      console.error('Error generating suggestion:', error);
      res.status(500).json({ error: 'Failed to generate suggestion' });
    }
  }

  /**
   * POST /api/tickets/:id/generate-parts-list - Generate parts list
   */
  async generatePartsList(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const ticket = await ticketService.getTicketById(id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      const claudeService = getClaudeService();
      const partsList = await claudeService.generatePartsList(ticket);

      res.json({ partsList });
    } catch (error) {
      console.error('Error generating parts list:', error);
      res.status(500).json({ error: 'Failed to generate parts list' });
    }
  }

  /**
   * POST /api/tickets/:id/generate-documentation - Generate final documentation
   */
  async generateDocumentation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const ticket = await ticketService.getTicketById(id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      const claudeService = getClaudeService();
      const documentation = await claudeService.generateDocumentation(ticket);

      res.json(documentation);
    } catch (error) {
      console.error('Error generating documentation:', error);
      res.status(500).json({ error: 'Failed to generate documentation' });
    }
  }
}

export const ticketController = new TicketController();
