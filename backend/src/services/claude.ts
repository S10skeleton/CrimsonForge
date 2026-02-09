import Anthropic from '@anthropic-ai/sdk';
import { Ticket, ChatMessage } from '../../../shared/types';
import { getMitchellClient } from '../api/mitchell';

export class ClaudeService {
  private client: Anthropic;
  private model: string = 'claude-sonnet-4-20250514';

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Generate a system prompt that includes ticket context
   */
  private generateSystemPrompt(ticket: Ticket): string {
    return `You are an AI assistant helping automotive technicians with repair work. You have access to Mitchell ProDemand data and this ticket's persistent memory.

CURRENT TICKET CONTEXT:
Vehicle: ${ticket.vehicle.year} ${ticket.vehicle.make} ${ticket.vehicle.model}
VIN: ${ticket.vehicle.vin}
${ticket.vehicle.engine ? `Engine: ${ticket.vehicle.engine}` : ''}

Customer Concern: ${ticket.customerConcern}

Diagnostic Steps Performed:
${ticket.diagnosticSteps.map(step => `- ${step.description}${step.result ? `: ${step.result}` : ''}`).join('\n')}

Current Findings:
${ticket.findings.map(f => `- ${f}`).join('\n')}

Pending Actions:
${ticket.pendingActions.map(a => `- ${a}`).join('\n')}

Parts Status:
${ticket.parts.map(p => `- ${p.description} (${p.partNumber}): ${p.status}`).join('\n')}

CRITICAL RULES:
1. NEVER invent specifications - always use Mitchell ProDemand tool calls to retrieve verified data
2. If you can't fetch a specification, explicitly say so and explain what data you need
3. Track what diagnostics have already been performed to avoid repetition
4. When suggesting next steps, consider what's already been tested
5. Cite Mitchell/OEM as the source when providing technical specifications
6. Maintain continuity - reference previous conversation context from this ticket

When the technician asks for technical information (torque specs, procedures, diagrams, etc.), use the appropriate Mitchell tool to fetch verified data.`;
  }

  /**
   * Process a chat message and generate a response
   */
  async processMessage(
    userMessage: string,
    ticket: Ticket,
    conversationHistory: ChatMessage[]
  ): Promise<string> {
    const systemPrompt = this.generateSystemPrompt(ticket);
    
    // Build message history for Claude
    const messages: Anthropic.MessageParam[] = conversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
    
    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages,
        // TODO: Add tool definitions for Mitchell API when ready
        // tools: this.getMitchellTools(),
      });

      // Extract text content from response
      const textContent = response.content
        .filter(block => block.type === 'text')
        .map(block => ('text' in block ? block.text : ''))
        .join('\n');

      return textContent;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw new Error('Failed to process message with AI');
    }
  }

  /**
   * Generate a guided diagnostic flow recommendation
   */
  async suggestNextDiagnosticStep(ticket: Ticket): Promise<string> {
    const systemPrompt = this.generateSystemPrompt(ticket);
    
    const message = `Based on the current diagnostic state, what should the technician check next? Consider:
1. What has already been tested
2. The customer's original concern
3. Current findings and DTCs
4. Logical diagnostic progression

Provide a clear, specific next step with the reasoning behind it.`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      });

      const textContent = response.content
        .filter(block => block.type === 'text')
        .map(block => ('text' in block ? block.text : ''))
        .join('\n');

      return textContent;
    } catch (error) {
      console.error('Error generating diagnostic suggestion:', error);
      throw new Error('Failed to generate diagnostic suggestion');
    }
  }

  /**
   * Generate parts list based on confirmed diagnostics
   */
  async generatePartsList(ticket: Ticket): Promise<string> {
    const systemPrompt = this.generateSystemPrompt(ticket);
    
    const message = `Based on the confirmed diagnostics and findings, generate a parts list. Separate into:
1. Confirmed needed parts (based on verified failures)
2. Parts to verify before ordering (based on likely causes)

For each part, specify what it addresses and why it's needed.`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      });

      const textContent = response.content
        .filter(block => block.type === 'text')
        .map(block => ('text' in block ? block.text : ''))
        .join('\n');

      return textContent;
    } catch (error) {
      console.error('Error generating parts list:', error);
      throw new Error('Failed to generate parts list');
    }
  }

  /**
   * Generate final documentation (Concern/Cause/Correction)
   */
  async generateDocumentation(ticket: Ticket): Promise<{
    concern: string;
    cause: string;
    correction: string;
  }> {
    const systemPrompt = this.generateSystemPrompt(ticket);
    
    const message = `Generate a professional repair order documentation in the standard Concern/Cause/Correction format:

CONCERN: [Customer's original complaint in clear language]
CAUSE: [Root cause identified through diagnostics]
CORRECTION: [Repairs performed and parts replaced]

Base this entirely on the ticket's stored information. Be concise and professional.`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      });

      const textContent = response.content
        .filter(block => block.type === 'text')
        .map(block => ('text' in block ? block.text : ''))
        .join('\n');

      // Parse the response to extract concern, cause, correction
      // This is a simple parser - could be enhanced
      const concernMatch = textContent.match(/CONCERN:(.+?)(?=CAUSE:|$)/s);
      const causeMatch = textContent.match(/CAUSE:(.+?)(?=CORRECTION:|$)/s);
      const correctionMatch = textContent.match(/CORRECTION:(.+?)$/s);

      return {
        concern: concernMatch?.[1]?.trim() || '',
        cause: causeMatch?.[1]?.trim() || '',
        correction: correctionMatch?.[1]?.trim() || '',
      };
    } catch (error) {
      console.error('Error generating documentation:', error);
      throw new Error('Failed to generate documentation');
    }
  }

  // TODO: Implement tool definitions for Mitchell API
  // private getMitchellTools() {
  //   return [
  //     {
  //       name: 'get_torque_specs',
  //       description: 'Retrieve torque specifications from Mitchell ProDemand',
  //       input_schema: {
  //         type: 'object',
  //         properties: {
  //           component: { type: 'string', description: 'Component name' }
  //         }
  //       }
  //     },
  //     // ... other tool definitions
  //   ];
  // }
}

// Export singleton instance
let claudeService: ClaudeService | null = null;

export function getClaudeService(): ClaudeService {
  if (!claudeService) {
    const apiKey = process.env.ANTHROPIC_API_KEY || '';
    
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    
    claudeService = new ClaudeService(apiKey);
  }
  
  return claudeService;
}
