# Space Biology AI Chat Application

## Overview

This is a conversational AI chat application focused on space biology research, powered by LLamaIndex. The application provides a minimalist, conversation-first interface where users can ask questions about biological studies in space environments, microgravity effects, and astrobiology discoveries. Built with React, Express, and TypeScript, it features real-time streaming responses and a polished UI using shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite
- **UI Component Library**: shadcn/ui (Radix UI primitives with Tailwind CSS)
- **Styling**: Tailwind CSS with custom design system following minimalist utility patterns
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Design Philosophy**: Conversation-first design with zero distractions, inspired by Linear, ChatGPT, and Claude interfaces

**Key Design Decisions**:
- Dark mode primary with light mode support
- Generous whitespace for maximum readability
- Subtle visual hierarchy without heavy decoration
- Custom color palette optimized for chat interfaces (separate AI and user message backgrounds)
- Typography using Inter for UI and JetBrains Mono for code
- Auto-expanding textarea for message input
- Real-time streaming message display

### Backend Architecture

**Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Development**: tsx for TypeScript execution in development
- **Production Build**: esbuild for fast bundling

**API Design**:
- RESTful endpoints under `/api` prefix
- Server-Sent Events (SSE) for streaming AI responses
- JSON-based request/response format

**Key Routes**:
- `GET /api/messages` - Retrieve conversation history
- `POST /api/messages/stream` - Send message and stream AI response

**Storage Strategy**:
- In-memory storage (`MemStorage`) for message persistence during runtime
- Interface-based design (`IStorage`) allows easy swap to database implementation
- Message schema includes id, role, content, and timestamp

### Data Storage Solutions

**Current Implementation**: In-memory storage with Map data structure
- Suitable for development and single-instance deployments
- Messages cleared on server restart

**Database Schema** (Prepared for PostgreSQL via Drizzle ORM):
```typescript
messages table:
- id: varchar (primary key, auto-generated UUID)
- role: text (user/assistant)
- content: text
- timestamp: timestamp (auto-generated)
```

**Migration Ready**:
- Drizzle ORM configured with PostgreSQL dialect
- Schema defined in `shared/schema.ts`
- Database credentials via `DATABASE_URL` environment variable
- Neon Database Serverless driver for edge deployment compatibility

### AI Integration

**Provider**: Azure OpenAI with LlamaCloud Retrieval
- **LLM**: Azure OpenAI (deployed model)
- **Retrieval**: LlamaCloud Index ("INDEX_NAME")
- **Authentication**: 
  - `AZURE_OPENAI_API_KEY` - Azure OpenAI API key
  - `AZURE_OPENAI_ENDPOINT` - Azure OpenAI endpoint URL
  - `AZURE_OPENAI_DEPLOYMENT_NAME` - Deployment name
  - `LLAMA_CLOUD_API_KEY` - LlamaCloud API key
- **Response Mode**: Streaming with Server-Sent Events
- **Context**: RAG (Retrieval-Augmented Generation) using LlamaCloud
- **Retrieval Settings**: Top-K similarity search (5 results)

**Streaming Implementation**:
- SSE for real-time token delivery to client
- LlamaCloud REST API for document retrieval
- Retrieved context integrated into system prompt
- Conversation history maintained for context-aware responses
- User message persisted before AI response generation
- Character-by-character streaming for fluid UX

### Authentication & Authorization

**Current State**: No authentication implemented
- Open access to chat interface
- No user session management
- Suitable for demo/prototype environments

**Prepared Infrastructure**:
- Session management with `connect-pg-simple` package installed
- Ready for PostgreSQL-backed sessions when database is added

### Development Workflow

**Development Mode**:
- Vite dev server with HMR
- Vite middleware mode integrated with Express
- Replit-specific plugins for runtime error handling and cartographer
- TypeScript type checking without emit

**Production Build**:
- Vite builds client to `dist/public`
- esbuild bundles server to `dist`
- Static file serving from built assets
- Environment-based configuration (NODE_ENV)

**Code Organization**:
- `client/` - React frontend application
- `server/` - Express backend services  
- `shared/` - Shared types and schemas (Drizzle)
- Path aliases configured (`@/`, `@shared/`, `@assets/`)

## External Dependencies

### AI Services
- **OpenAI SDK** (`openai`): Azure OpenAI integration for chat completions
- **LlamaIndex** (`llamaindex`): Framework for building RAG applications
- Requires: 
  - `AZURE_OPENAI_API_KEY` - Azure OpenAI API key
  - `AZURE_OPENAI_ENDPOINT` - Azure OpenAI endpoint URL  
  - `AZURE_OPENAI_DEPLOYMENT_NAME` - Deployment name
  - `LLAMA_CLOUD_API_KEY` - LlamaCloud API key for retrieval

### Database Services
- **Neon Database Serverless** (`@neondatabase/serverless`): PostgreSQL driver for edge environments
- **Drizzle ORM** (`drizzle-orm`): Type-safe database queries and migrations
- Requires: `DATABASE_URL` environment variable (PostgreSQL connection string)

### UI Component Libraries
- **Radix UI**: Unstyled, accessible component primitives (accordion, dialog, dropdown, etc.)
- **shadcn/ui**: Pre-built component patterns with Tailwind CSS
- **Lucide React**: Icon library for UI elements

### Styling & Utilities
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **tailwind-merge & clsx**: Class name merging utilities

### Build Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Fast JavaScript/TypeScript bundler for backend
- **tsx**: TypeScript execution for development

### State Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation with Drizzle integration

### Fonts
- **Google Fonts**: Inter (UI), JetBrains Mono (code blocks)
- Preconnected for performance optimization