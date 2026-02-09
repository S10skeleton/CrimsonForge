import { Router } from 'express';
import { ticketController } from '../controllers/ticket';

const router = Router();

// Ticket routes
router.post('/tickets', (req, res) => ticketController.createTicket(req, res));
router.get('/tickets', (req, res) => ticketController.getAllTickets(req, res));
router.get('/tickets/:id', (req, res) => ticketController.getTicket(req, res));

// Ticket updates
router.post('/tickets/:id/diagnostic-step', (req, res) => ticketController.addDiagnosticStep(req, res));
router.post('/tickets/:id/finding', (req, res) => ticketController.addFinding(req, res));
router.post('/tickets/:id/part', (req, res) => ticketController.addPart(req, res));
router.patch('/tickets/:id/status', (req, res) => ticketController.updateStatus(req, res));

// Chat routes
router.get('/tickets/:id/conversation', (req, res) => ticketController.getConversation(req, res));
router.post('/tickets/:id/chat', (req, res) => ticketController.sendChatMessage(req, res));

// AI assistance routes
router.post('/tickets/:id/suggest-next-step', (req, res) => ticketController.suggestNextStep(req, res));
router.post('/tickets/:id/generate-parts-list', (req, res) => ticketController.generatePartsList(req, res));
router.post('/tickets/:id/generate-documentation', (req, res) => ticketController.generateDocumentation(req, res));

export default router;
