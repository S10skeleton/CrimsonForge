// Shared types for Mechanic AI Helper

export interface Vehicle {
  vin: string;
  year: number;
  make: string;
  model: string;
  engine?: string;
}

export interface DiagnosticStep {
  id: string;
  timestamp: Date;
  description: string;
  result?: string;
  testType?: string;
  dtcCodes?: string[];
}

export interface Part {
  partNumber: string;
  description: string;
  quantity: number;
  source: 'mitchell' | 'oem' | 'aftermarket';
  status: 'confirmed' | 'verify' | 'ordered';
  price?: number;
}

export interface Ticket {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  vehicle: Vehicle;
  customerConcern: string;
  diagnosticSteps: DiagnosticStep[];
  findings: string[];
  pendingActions: string[];
  parts: Part[];
  statusNotes: string[];
  status: 'open' | 'in-progress' | 'waiting-parts' | 'completed';
}

export interface ChatMessage {
  id: string;
  ticketId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    toolCalls?: any[];
    sourceData?: any;
  };
}

export interface MitchellSpec {
  type: 'torque' | 'fluid' | 'gap' | 'procedure' | 'diagram' | 'component_location' | 'tsb';
  data: any;
  source: string;
}
