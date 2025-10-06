import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { ContextChatEngine, Settings } from "llamaindex";
import { AzureOpenAI } from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages/stream", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid message format" });
      }

      const llamaApiKey = process.env.LLAMA_CLOUD_API_KEY;
      const llamaIndexName = process.env.LLAMA_INDEX_NAME;
      const llamaProjectName = process.env.LLAMA_PROJECT_NAME;
      const llamaProjectId = process.env.LLAMA_PROJECT_ID;
      const llamaOrganizationId = process.env.LLAMA_ORGANIZATION_ID;
      const llamaSimilarityTopK = parseInt(process.env.LLAMA_SIMILARITY_TOP_K || "5");
      
      const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
      const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
      const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

      if (!llamaApiKey || !llamaIndexName || !llamaProjectName || !azureApiKey || !azureEndpoint || !azureDeployment) {
        return res
          .status(500)
          .json({ error: "API credentials not configured" });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Initialize Azure OpenAI client
      const openai = new AzureOpenAI({
        apiKey: azureApiKey,
        endpoint: azureEndpoint,
        apiVersion: "2024-10-21",
      });

      // Persist the user message
      await storage.createMessage(result.data);

      // Get conversation history
      const allMessages = await storage.getAllMessages();

      // Retrieve relevant context from LlamaCloud using REST API
      const llamaCloudResponse = await fetch(
        `https://api.cloud.llamaindex.ai/api/v1/pipelines/search`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${llamaApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index_name: llamaIndexName,
            project_name: llamaProjectName,
            ...(llamaProjectId && { project_id: llamaProjectId }),
            ...(llamaOrganizationId && { organization_id: llamaOrganizationId }),
            query: result.data.content,
            similarity_top_k: llamaSimilarityTopK,
          }),
        },
      );

      let contextText = "";
      if (llamaCloudResponse.ok) {
        const retrievalData = await llamaCloudResponse.json();
        if (retrievalData.retrieval_nodes) {
          contextText = retrievalData.retrieval_nodes
            .map((node: any) => node.text || node.node?.text || "")
            .join("\n\n");
        }
      }

      // Build messages for Azure OpenAI
      const messages: any[] = [];

      if (contextText) {
        messages.push({
          role: "system",
          content: `You are a helpful assistant. Use the following context to answer the user's questions:\n\n${contextText}`,
        });
      } else {
        messages.push({
          role: "system",
          content: "You are a helpful assistant.",
        });
      }

      allMessages.forEach((msg) => {
        messages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        });
      });

      // Stream response from Azure OpenAI
      const stream = await openai.chat.completions.create({
        model: azureDeployment,
        messages: messages,
        stream: true,
        temperature: 1,
      });

      let fullContent = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullContent += content;
          res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
        }
      }

      await storage.createMessage({
        role: "assistant",
        content: fullContent,
      });

      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      console.error("Streaming error:", error);
      res.write(
        `data: ${JSON.stringify({ error: error.message || "Stream failed" })}\n\n`,
      );
      res.end();
    }
  });

  app.delete("/api/messages", async (_req, res) => {
    try {
      await storage.clearMessages();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear messages" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
