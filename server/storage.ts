import { type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getMessage(id: string): Promise<Message | undefined>;
  getAllMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  clearMessages(): Promise<void>;
}

export class MemStorage implements IStorage {
  private messages: Map<string, Message>;

  constructor() {
    this.messages = new Map();
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getAllMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async clearMessages(): Promise<void> {
    this.messages.clear();
  }
}

export const storage = new MemStorage();
