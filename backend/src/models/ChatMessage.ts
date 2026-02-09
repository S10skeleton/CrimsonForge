import mongoose, { Schema, Document } from 'mongoose';
import { ChatMessage } from '../../../shared/types';

export interface ChatMessageDocument extends Omit<ChatMessage, 'id'>, Document {}

const ChatMessageSchema = new Schema<ChatMessageDocument>(
  {
    ticketId: { type: String, required: true, index: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    metadata: {
      toolCalls: [{ type: Schema.Types.Mixed }],
      sourceData: { type: Schema.Types.Mixed },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient retrieval of conversation history
ChatMessageSchema.index({ ticketId: 1, timestamp: 1 });

export const ChatMessageModel = mongoose.model<ChatMessageDocument>(
  'ChatMessage',
  ChatMessageSchema
);
