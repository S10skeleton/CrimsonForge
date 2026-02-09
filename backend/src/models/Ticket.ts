import mongoose, { Schema, Document } from 'mongoose';
import { Ticket, Vehicle, DiagnosticStep, Part } from '../../../shared/types';

export interface TicketDocument extends Omit<Ticket, 'id'>, Document {}

const VehicleSchema = new Schema<Vehicle>({
  vin: { type: String, required: true },
  year: { type: Number, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  engine: { type: String },
});

const DiagnosticStepSchema = new Schema<DiagnosticStep>({
  id: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  description: { type: String, required: true },
  result: { type: String },
  testType: { type: String },
  dtcCodes: [{ type: String }],
});

const PartSchema = new Schema<Part>({
  partNumber: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  source: { type: String, enum: ['mitchell', 'oem', 'aftermarket'], required: true },
  status: { type: String, enum: ['confirmed', 'verify', 'ordered'], required: true },
  price: { type: Number },
});

const TicketSchema = new Schema<TicketDocument>(
  {
    vehicle: { type: VehicleSchema, required: true },
    customerConcern: { type: String, required: true },
    diagnosticSteps: [DiagnosticStepSchema],
    findings: [{ type: String }],
    pendingActions: [{ type: String }],
    parts: [PartSchema],
    statusNotes: [{ type: String }],
    status: {
      type: String,
      enum: ['open', 'in-progress', 'waiting-parts', 'completed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

export const TicketModel = mongoose.model<TicketDocument>('Ticket', TicketSchema);
