# LlamaIndex RAG Chat Application - Design Guidelines

## Design Approach

**Selected Approach:** Design System - Minimalist Utility Pattern  
**Justification:** Chat applications require clarity, efficiency, and focus. Drawing inspiration from Linear, ChatGPT, and Claude's minimal interfaces while maintaining excellent readability and conversation flow.

**Core Principles:**
- Conversation-first design with zero distractions
- Maximum readability through generous whitespace
- Subtle visual hierarchy without heavy decoration
- Instant visual feedback for all interactions

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: `220 15% 8%` - Deep neutral base
- Surface: `220 12% 12%` - Subtle card elevation
- Border: `220 10% 18%` - Minimal separation lines
- Text Primary: `220 10% 95%` - High contrast
- Text Secondary: `220 8% 65%` - Metadata/timestamps
- AI Message: `220 12% 14%` - Slight distinction from user messages
- User Message: `220 15% 18%` - Darker for contrast
- Accent: `210 100% 55%` - Sparingly for send button and active states

**Light Mode (Secondary):**
- Background: `0 0% 100%` - Pure white
- Surface: `220 15% 98%` - Off-white cards
- Border: `220 10% 88%` - Subtle dividers
- Text Primary: `220 15% 15%` - Deep readable text
- Text Secondary: `220 8% 45%` - Supporting text
- AI Message: `220 15% 96%` - Light gray
- User Message: `210 100% 96%` - Subtle blue tint

---

### B. Typography

**Font Stack:**
- Primary: 'Inter', system-ui, -apple-system, sans-serif
- Code: 'JetBrains Mono', 'Courier New', monospace

**Hierarchy:**
- Message Text: text-sm (14px) leading-relaxed - Optimal readability
- Input Field: text-base (16px) - Comfortable typing
- Timestamps: text-xs (12px) text-secondary
- System Messages: text-xs italic text-secondary

---

### C. Layout System

**Spacing Primitives:** Use Tailwind units of **2, 3, 4, 6, 8** for consistency
- Message padding: `p-4` 
- Container gaps: `gap-4`
- Section spacing: `space-y-6`
- Input area padding: `p-6`

**Layout Structure:**
- Full viewport height (h-screen)
- Chat messages: Scrollable flex-1 container with overflow-auto
- Input fixed at bottom with backdrop-blur for depth
- Max message width: `max-w-3xl mx-auto` for optimal reading

---

### D. Component Library

**Chat Messages:**
- AI Messages: Left-aligned, subtle background, rounded-lg, icon avatar
- User Messages: Right-aligned, darker background, rounded-lg  
- Message bubbles: `rounded-2xl` with `px-4 py-3`
- Timestamp: Subtle, text-xs below each message
- Streaming indicator: Pulsing dot animation during AI response

**Input Area:**
- Textarea: Auto-resize, minimal border, `rounded-xl`
- Send button: Accent color, icon-only (paper plane), `rounded-lg`
- Container: Fixed bottom, `backdrop-blur-md` with subtle border-top
- Layout: Flex row with gap-3, button aligned to bottom

**Loading States:**
- Typing indicator: Three animated dots in AI message position
- Disabled state: Reduced opacity on input during processing
- No loading overlays - inline feedback only

**Empty State:**
- Centered vertically in chat area
- Welcome message with subtle icon
- Example prompts as suggested chips (optional, minimal)

**Conversation History (Sidebar - Collapsible):**
- Minimal width sidebar (280px) - collapsible on mobile
- List of past conversations with timestamps
- Current conversation highlighted
- Delete/rename actions on hover
- Stored conversations load seamlessly

---

### E. Interactions & Animations

**Minimal Animation Budget:**
- Message appear: Subtle fade-in + slide-up (150ms ease-out)
- Send button: Scale on click (95%) with 100ms duration
- Typing indicator: Pulse animation on dots only
- NO page transitions, NO scroll effects, NO hover transforms

**Responsive Behavior:**
- Desktop (lg+): Sidebar visible, messages max-width centered
- Tablet (md): Sidebar collapsible, full-width messages
- Mobile: Hidden sidebar (drawer), full viewport messages

---

## Special Considerations

**Markdown Rendering:**
- Support code blocks with syntax highlighting
- Inline code: Monospace font, subtle background
- Lists and formatting: Preserve spacing, minimal decoration

**Auto-Scroll:**
- Messages auto-scroll to bottom on new content
- Maintain scroll position when viewing history
- Smooth scroll behavior for better UX

**Focus Management:**
- Input auto-focus on page load
- Return focus to input after sending message
- Keyboard shortcuts: Enter to send, Shift+Enter for new line

---

## Technical Notes

- Use relative time displays ("2 minutes ago") for recency
- Store conversations in server memory with session persistence
- Stream responses character-by-character for real-time feel
- Maintain conversation context across messages
- Ensure WCAG AA contrast ratios for all text