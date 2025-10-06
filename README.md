# Space Biology AI Chat Application

A conversational AI application focused on space biology research, powered by Azure OpenAI and LlamaCloud for retrieval-augmented generation (RAG). The application provides real-time streaming responses to questions about biological studies in space environments, microgravity effects, and astrobiology discoveries.

## AI Architecture

### Core AI Components

**Azure OpenAI Integration**
- **Model**: Azure OpenAI deployed model
- **API Version**: 2024-10-21
- **Streaming**: Real-time token streaming using Server-Sent Events (SSE)
- **Temperature**: 1.0 for balanced creativity and accuracy
- **Purpose**: Primary language model for generating conversational responses

**LlamaCloud Retrieval System**
- **Provider**: LlamaCloud Index API
- **Index**: "INDEX_NAME"
- **Retrieval Method**: REST API-based similarity search
- **Top-K**: Configurable (default: 5 documents)
- **Purpose**: Retrieves relevant context from space biology knowledge base

### RAG Pipeline

The application implements a sophisticated retrieval-augmented generation pipeline:

1. **User Query Processing**
   - User submits a question about space biology
   - Message is validated and persisted to storage

2. **Context Retrieval** (LlamaCloud)
   ```
   POST https://api.cloud.llamaindex.ai/api/v1/pipelines/search
   ```
   - Query is sent to LlamaCloud index
   - Top-K relevant documents are retrieved using similarity search
   - Retrieved context is extracted from response nodes

3. **Conversation History Assembly**
   - Previous messages are fetched from storage
   - Conversation context is maintained for coherent multi-turn dialogue

4. **System Prompt Construction**
   - Retrieved context is integrated into system message
   - System prompt instructs the AI to use provided context
   - Formatted as: "Use this context to answer: [retrieved documents]"

5. **Response Generation** (Azure OpenAI)
   - Complete message history + system prompt sent to Azure OpenAI
   - Response is streamed token-by-token
   - Each token is sent via SSE to the client

6. **Real-time Display**
   - Frontend receives SSE stream
   - Messages are rendered character-by-character
   - Assistant response is persisted upon completion

### Environment Variables (AI Configuration)

```bash
# Azure OpenAI
AZURE_OPENAI_API_KEY=your_azure_api_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name

# LlamaCloud
LLAMA_CLOUD_API_KEY=your_llama_cloud_api_key
LLAMA_INDEX_NAME=your_index_name
LLAMA_PROJECT_NAME=your_project_name
LLAMA_PROJECT_ID=your_project_id  # Optional
LLAMA_ORGANIZATION_ID=your_org_id  # Optional
LLAMA_SIMILARITY_TOP_K=5  # Number of documents to retrieve
```

## Technical Stack

### Frontend

**Core Framework**
- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Wouter** - Lightweight client-side routing

**UI & Styling**
- **shadcn/ui** - Component library built on Radix UI primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Custom Design System** - Minimalist, conversation-first interface

**State Management**
- **TanStack Query (React Query v5)** - Server state management
- **React Hook Form** - Form state and validation
- **Zod** - Schema validation

**Key Libraries**
- `framer-motion` - Animations
- `date-fns` - Date formatting
- `react-markdown` - Markdown rendering (if applicable)

### Backend

**Core Framework**
- **Express.js** with TypeScript
- **Node.js** with ESM modules
- **tsx** - TypeScript execution in development
- **esbuild** - Production bundling

**AI Integration**
- **openai** - Azure OpenAI SDK
- **llamaindex** - LlamaCloud integration

**Data Layer**
- **Drizzle ORM** - Type-safe SQL toolkit
- **@neondatabase/serverless** - PostgreSQL driver (prepared)
- **In-memory storage** - Current implementation using Map

### Development Tools

- **TypeScript** - Type safety across the stack
- **Drizzle Kit** - Database migration tool
- **Replit Plugins** - Enhanced development experience
  - Cartographer - Code mapping
  - Runtime error modal
  - Dev banner

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # shadcn/ui base components
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── pages/        # Page components
│   │   │   ├── Chat.tsx
│   │   │   └── not-found.tsx
│   │   ├── lib/          # Utilities and configurations
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── App.tsx       # Main app component
│   │   ├── main.tsx      # Entry point
│   │   └── index.css     # Global styles
│   └── index.html        # HTML template
│
├── server/                # Backend Express application
│   ├── index.ts          # Server setup and middleware
│   ├── routes.ts         # API endpoints and AI logic
│   ├── storage.ts        # Storage interface and implementation
│   └── vite.ts           # Vite integration
│
├── shared/               # Shared code between client/server
│   └── schema.ts         # Database schema and types
│
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind configuration
├── drizzle.config.ts     # Drizzle ORM configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Data Models

### Message Schema

```typescript
interface Message {
  id: string;           // UUID, auto-generated
  role: string;         // "user" | "assistant"
  content: string;      // Message text
  timestamp: Date;      // Auto-generated timestamp
}
```

### Storage Interface

```typescript
interface IStorage {
  getMessage(id: string): Promise<Message | undefined>;
  getAllMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  clearMessages(): Promise<void>;
}
```

**Current Implementation**: `MemStorage` using in-memory Map
**Future Ready**: PostgreSQL via Drizzle ORM with Neon serverless driver

## API Endpoints

### GET `/api/messages`
Retrieve all conversation messages in chronological order.

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "role": "user",
    "content": "What are the effects of microgravity on bone density?",
    "timestamp": "2024-01-01T12:00:00Z"
  },
  {
    "id": "uuid",
    "role": "assistant",
    "content": "Microgravity has significant effects on bone density...",
    "timestamp": "2024-01-01T12:00:01Z"
  }
]
```

### POST `/api/messages/stream`
Send a user message and receive an AI-generated streaming response.

**Request Body**:
```json
{
  "role": "user",
  "content": "How do plants grow in space?"
}
```

**Response**: `200 OK` with Server-Sent Events
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"chunk":"Plants"}
data: {"chunk":" in"}
data: {"chunk":" space"}
...
data: [DONE]
```

## Development Workflow

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server (frontend + backend)
npm run dev

# Server runs on http://localhost:5000
# - Backend API: http://localhost:5000/api
# - Frontend: http://localhost:5000
```

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

### Database Migration (when ready)

```bash
# Generate migration
npx drizzle-kit generate

# Run migration
npx drizzle-kit push
```

## Key Features

### Real-time Streaming
- Server-Sent Events (SSE) for token-by-token delivery
- Character-by-character rendering in UI
- Immediate response feedback with typing indicator

### Context-Aware Conversations
- Full conversation history maintained
- Multi-turn dialogue support
- Context integration from LlamaCloud knowledge base

### Responsive Design
- Dark mode primary with light mode support
- Mobile-friendly interface
- Auto-expanding message input
- Generous whitespace for readability

### Minimalist UI
- Conversation-first design philosophy
- Zero distractions
- Clean, modern aesthetic inspired by Linear, ChatGPT, and Claude
- Custom color palette optimized for chat interfaces

## Design Philosophy

The application follows a minimalist, conversation-first design approach:

- **Typography**: Inter for UI, JetBrains Mono for code
- **Colors**: Subtle visual hierarchy without heavy decoration
- **Layout**: Generous whitespace for maximum readability
- **Interactions**: Smooth animations and transitions
- **Accessibility**: Semantic HTML and ARIA labels

## Security Considerations

- API keys stored in environment variables (never committed)
- Input validation using Zod schemas
- Error handling and graceful degradation
- CORS and security headers (production recommended)

## Performance Optimizations

- Vite for fast HMR in development
- esbuild for rapid production builds
- TanStack Query for efficient data fetching and caching
- Lazy loading and code splitting
- In-memory storage for low latency (development)

## Future Enhancements

- [ ] Migrate to PostgreSQL for persistent storage
- [ ] Add user authentication
- [ ] Implement message editing and deletion
- [ ] Export conversation history
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Custom index management
- [ ] Advanced retrieval strategies (hybrid search, reranking)

## License

This project is built on Replit with open-source technologies.

## Credits

Built with:
- Azure OpenAI for language generation
- LlamaCloud for knowledge retrieval
- React, TypeScript, and modern web technologies
- shadcn/ui for beautiful, accessible components
