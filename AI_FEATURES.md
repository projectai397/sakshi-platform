# AI-Powered Features Documentation

**Sakshi Platform**  
**Author:** Manus AI  
**Last Updated:** November 2025

---

## Overview

The Sakshi platform integrates four sophisticated AI-powered features that enhance user experience, provide intelligent assistance, and promote environmental awareness. These features leverage large language models (LLMs) to deliver personalized, context-aware interactions that align with the platform's mission of accessibility, sustainability, and community building.

## Implemented AI Features

### 1. Smart Natural Language Search

**Purpose:** Enable users to find products using conversational queries instead of traditional keyword matching, making product discovery intuitive and accessible.

**Location:** Shop page (enhanced search bar with Smart Search button)

**How It Works:**

The smart search system uses LLM-powered natural language understanding to interpret user queries and match them with relevant products. When a user types a query like "toys for 5 year old" or "red jacket for winter," the AI analyzes the intent, extracts attributes (age, color, type, season), and returns products that satisfy the underlying needs rather than just matching keywords. The system provides transparent results by displaying an AI-generated interpretation explaining what it understood from the query.

**Technical Implementation:**

The backend API endpoint `ai.smartSearch` accepts a natural language query string and retrieves all products from the database. The system sends the query along with complete product information (name, description, category, condition, pricing, color, size, brand) to the LLM with a structured prompt instructing it to analyze user intent and match products. The LLM returns a JSON response containing matched product IDs ordered by relevance and a user-friendly interpretation. The frontend displays results in the standard product grid with a prominent interpretation box showing the AI's understanding and match count.

**User Experience:**

Users see an enhanced search bar with contextual placeholder text suggesting natural language queries. When they type a query, a "Smart Search" button with sparkles icon appears. Clicking this button (or pressing Enter) triggers the AI search, displaying results with a soft green interpretation box explaining what the AI understood. A "Regular Search" button allows switching back to keyword matching. The interface provides immediate feedback during search execution and clearly distinguishes AI-powered results from regular searches.

**Benefits:**

This feature dramatically improves product discovery by understanding user intent beyond literal keywords. It helps users find age-appropriate items, seasonal products, and items matching specific attributes without knowing exact product names or categories. The transparent interpretations build trust and help users refine queries when needed. Smart search makes the platform more accessible to users unfamiliar with e-commerce conventions or those who prefer conversational interfaces.

### 2. AI Product Recommendations

**Purpose:** Provide intelligent product suggestions based on similarity analysis to enhance discovery and increase engagement.

**Location:** Product detail pages (below the main product information)

**How It Works:**

The recommendation system analyzes the current product's characteristics including category, condition, price range, and description to identify similar items that might interest the user. When a user views a product, the backend sends the product details along with all available products to the LLM, which performs semantic analysis to determine relevance and similarity. The system returns three to four carefully selected recommendations that match the user's browsing context.

**Technical Implementation:**

The backend API endpoint `ai.getProductRecommendations` accepts a product ID and queries the database for the current product and all other available items. The system constructs a prompt that instructs the LLM to analyze product attributes and recommend similar items based on multiple factors. The LLM returns a structured JSON response containing product IDs, which the backend uses to fetch complete product details. The frontend displays these recommendations in an attractive card layout with the heading "You Might Also Love" followed by product cards showing images, names, conditions, and pricing options.

**User Experience:**

Users browsing a product see a dedicated recommendations section that feels natural and helpful rather than intrusive. Each recommended product displays its full information including the triple pricing system options, making it easy for users to explore alternatives or complementary items. The recommendations maintain the Studio Ghibli design aesthetic with smooth animations and responsive layouts.

**Benefits:**

This feature increases product discovery by surfacing items users might not have found through manual browsing. It helps users find alternatives when their desired item is unavailable and encourages exploration of different categories. The intelligent matching considers both practical factors like price and condition as well as thematic elements from product descriptions, creating a more personalized shopping experience.

### 2. Environmental Impact Predictor

**Purpose:** Visualize the positive environmental impact of shopping choices to reinforce sustainable behavior and community values.

**Location:** Shopping cart page (above the order summary)

**How It Works:**

The impact predictor calculates aggregate environmental savings across all items in the user's cart using standardized metrics for secondhand goods. For each item, the system estimates water saved (2,700 liters per clothing item), carbon dioxide emissions prevented (5.5 kilograms per item), and items diverted from landfills. These calculations are based on research showing that purchasing secondhand items significantly reduces environmental footprint compared to buying new products.

**Technical Implementation:**

The cart page component calculates total impact by multiplying per-item metrics by the number of items in the cart. The frontend displays these metrics in a beautiful gradient card with color-coded icons representing water (blue droplet), carbon dioxide (green leaf), and waste reduction (orange shopping bag). The card uses the sage green to sky blue gradient that matches the platform's Studio Ghibli aesthetic and includes an encouraging message about extending product lifecycles.

**User Experience:**

When users add items to their cart, they immediately see the cumulative environmental impact of their shopping choices. The visual presentation makes abstract environmental benefits concrete and measurable, creating a sense of accomplishment and reinforcing the value of choosing secondhand items. The metrics update dynamically as users add or remove items, providing real-time feedback on their positive impact.

**Benefits:**

This feature transforms shopping from a purely transactional activity into a meaningful environmental action. Users gain tangible evidence of their contribution to sustainability, which can motivate continued engagement with the platform. The impact metrics also serve as social proof that can be shared with others, helping to spread awareness about the benefits of circular economy practices. By quantifying environmental savings, the feature makes the abstract concept of sustainability more accessible and emotionally resonant.

### 3. AI Customer Assistance Chatbot

**Purpose:** Provide instant, intelligent customer support to answer questions, explain platform features, and guide users through their journey.

**Location:** Floating widget accessible from all pages (bottom-right corner)

**How It Works:**

The chatbot widget appears as a circular green button with a message icon that users can click to open a chat interface. When opened, the chat displays a welcome message from "Sakshi Assistant" along with four suggested prompts covering common questions about the triple pricing system, seva tokens, Repair Café, and free item requests. Users can click a suggested prompt or type their own question in the input field.

The chatbot uses a carefully crafted system prompt that defines its personality, knowledge base, and response style. The system prompt instructs the AI to be warm, encouraging, and helpful while explaining the platform's unique features including the triple pricing system, seva token economy, circular economy programs, Silent Village community, Silent Retreats, and AI Meditation Assistant. The AI is instructed to keep responses concise (two to three paragraphs maximum) and emphasize community impact and environmental benefits.

**Technical Implementation:**

The frontend component `ChatbotWidget.tsx` manages the chat state including message history and loading indicators. When a user sends a message, the component calls the `ai.customerChat` mutation endpoint with the complete message history including the system prompt, previous messages, and the new user message. The backend invokes the LLM with these messages and returns the AI's response as a string. The frontend receives the response and appends it to the message history, displaying it in a formatted chat bubble with markdown rendering support.

The chat interface uses the pre-built `AIChatBox` component from the template, which provides message display, auto-scrolling, loading states, and markdown rendering through the Streamdown library. The widget maintains conversation context across multiple messages, allowing for natural back-and-forth dialogue. The chat modal features a gradient green header with the Sakshi Assistant branding, a scrollable message area, and an input field with a send button.

**User Experience:**

Users can access help at any time without leaving their current page or searching through documentation. The floating button is unobtrusive but easily discoverable, positioned in a standard location for chat widgets. When opened, the chat provides immediate value through suggested prompts that address the most common questions. The AI responds quickly with helpful, contextual information that feels personalized and conversational rather than robotic or scripted.

The chat interface maintains the Studio Ghibli design aesthetic with warm colors, rounded corners, and smooth animations. User messages appear in green bubbles on the right side, while AI responses appear in gray bubbles on the left with a sparkle icon indicating the AI assistant. The markdown rendering ensures that formatted responses with lists, bold text, and paragraphs display correctly, making information easy to scan and understand.

**Benefits:**

The chatbot significantly reduces friction in the user journey by providing instant answers to questions that might otherwise require searching through multiple pages or contacting support. It helps users understand the unique aspects of the platform, particularly the triple pricing system and seva token economy, which may be unfamiliar concepts. The AI can handle a wide variety of questions and provide consistent, accurate information based on the comprehensive system prompt.

By offering 24/7 availability and immediate responses, the chatbot improves user satisfaction and reduces support burden. It can guide users through complex processes like applying to Silent Village or booking retreats, explain how to earn and spend seva tokens, and clarify the differences between payment methods. The conversational interface makes the platform feel more approachable and human, reinforcing the community-focused values of the Sakshi organization.

## Technical Architecture

### Backend API Structure

All AI features are organized under the `ai` router in `server/routers.ts`:

**Customer Chat Endpoint:**
- **Route:** `ai.customerChat`
- **Type:** Mutation (POST request)
- **Input:** Array of message objects with role and content
- **Output:** String containing AI response
- **Authentication:** Public (no login required)

**Product Recommendations Endpoint:**
- **Route:** `ai.getProductRecommendations`
- **Type:** Query (GET request)
- **Input:** Product ID number
- **Output:** Array of recommended product objects
- **Authentication:** Public (no login required)

**Smart Search Endpoint:**
- **Route:** `ai.smartSearch`
- **Type:** Mutation (POST request)
- **Input:** Natural language query string
- **Output:** Object containing matched products array, interpretation string, and total results count
- **Authentication:** Public (no login required)

### LLM Integration

The platform uses the built-in LLM service provided by the Manus infrastructure through the `invokeLLM` function imported from `server/_core/llm.ts`. This function handles authentication, request formatting, and response parsing automatically. The LLM service uses a state-of-the-art language model that supports both conversational chat and structured JSON output through the `response_format` parameter.

For the chatbot, the system sends conversational messages and receives natural language responses. For product recommendations, the system uses structured output with a JSON schema that enforces a specific format containing an array of product IDs. This ensures reliable parsing and prevents errors from malformed responses.

### Frontend Components

**ChatbotWidget Component:**
- **File:** `client/src/components/ChatbotWidget.tsx`
- **Dependencies:** AIChatBox, tRPC client, UI components
- **State Management:** React useState for message history
- **Styling:** Tailwind CSS with custom Ghibli design tokens

**Product Recommendations Section:**
- **File:** `client/src/pages/ProductDetail.tsx`
- **Integration:** Embedded in product detail page layout
- **Data Fetching:** tRPC useQuery hook with product ID
- **Rendering:** Grid layout with product cards

**Environmental Impact Card:**
- **File:** `client/src/pages/Cart.tsx`
- **Calculation:** Client-side multiplication of per-item metrics
- **Styling:** Gradient background with color-coded icons

**Smart Search Interface:**
- **File:** `client/src/pages/Shop.tsx`
- **Integration:** Enhanced search bar with Smart Search button
- **Data Fetching:** tRPC useMutation hook with query string
- **State Management:** React useState for search mode and results
- **Rendering:** AI interpretation box and product grid

## Design Principles

### Consistency with Brand Aesthetic

All AI features maintain the Studio Ghibli-inspired design language established throughout the platform. The chatbot widget uses the sage green to forest green gradient that appears in navigation elements and call-to-action buttons. The impact predictor card uses the sage green to sky blue gradient that evokes natural landscapes. Product recommendation cards match the existing product card design with rounded corners, soft shadows, and hover animations.

### Non-Intrusive Integration

The AI features enhance the user experience without disrupting the core shopping flow. The chatbot appears as a small floating button that users can ignore if they prefer to browse independently. Product recommendations appear below the main product information, providing value without cluttering the primary content. The environmental impact card sits above the order summary where it provides context for the purchase decision without blocking critical information.

### Mobile Responsiveness

All AI features adapt seamlessly to mobile devices. The chatbot modal adjusts its width to fit smaller screens while maintaining readability. Product recommendations stack vertically on mobile with full-width cards. The environmental impact card maintains its visual hierarchy on narrow screens by adjusting icon sizes and text layout. Touch targets meet accessibility standards with adequate spacing and size.

### Performance Optimization

AI features are implemented with performance in mind. Product recommendations load asynchronously without blocking the main product page render. The chatbot initializes only when the user clicks the floating button, avoiding unnecessary API calls. The environmental impact calculation happens client-side using simple arithmetic, eliminating server round trips. All components use React best practices including proper dependency arrays and memoization where appropriate.

## Future Enhancements

### AI-Assisted Product Story Generation

To help donors and staff create compelling product descriptions, the platform could integrate an AI writing assistant that generates product stories based on basic information. Users would input facts about an item's history, condition, and features, and the AI would craft an engaging narrative that highlights the item's unique character and potential for a new life. This feature would maintain consistency in storytelling quality while reducing the time required to list new products.

### Personalized Seva Token Earning Suggestions

The platform could use AI to analyze user behavior and preferences to suggest personalized ways to earn seva tokens. For users who frequently browse children's items, the system might recommend volunteering at the Children's Free Zone. For users interested in sustainability, it might highlight upcoming Repair Café events. The AI would learn from user interactions to provide increasingly relevant suggestions over time.

### Automated Item Categorization

When donors submit items through the donation form, AI could analyze photos and descriptions to automatically suggest appropriate categories, conditions, and pricing. This would streamline the donation processing workflow for staff while ensuring consistent categorization across the inventory. The system would use computer vision to assess item condition and text analysis to extract relevant details from donor descriptions.

## Conclusion

The four AI-powered features implemented in the Sakshi platform demonstrate how artificial intelligence can enhance user experience while supporting the organization's mission of accessibility, sustainability, and community building. The smart natural language search makes product discovery intuitive and accessible, the product recommendation system helps users discover items they'll love, the environmental impact predictor makes sustainability tangible and rewarding, and the customer assistance chatbot provides instant support that scales effortlessly.

These features work together to create a more engaging, informative, and supportive shopping experience. They reduce friction in the user journey, reinforce positive behaviors, and make the platform's unique features more accessible to new users. As the platform continues to evolve, additional AI capabilities will further enhance the experience while maintaining the warm, community-focused character that defines the Sakshi brand.

The successful implementation of these features establishes a foundation for future AI integration across the platform. The technical architecture is modular and extensible, making it straightforward to add new AI capabilities as needs arise. The design patterns established through these initial features provide templates for consistent, user-friendly AI interactions throughout the platform.

---

**Technical Stack:**
- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Backend:** Express 4, tRPC 11
- **AI Service:** Manus built-in LLM via `invokeLLM`
- **Database:** MySQL/TiDB with Drizzle ORM
- **Deployment:** Auto-scaling infrastructure with global CDN
