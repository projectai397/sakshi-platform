# Sakshi Platform - AI Features Guide

**Date**: November 9, 2025  
**AI Provider**: OpenAI GPT-4  
**Purpose**: Intelligent features for personalized user experience

---

## Overview

The Sakshi platform integrates advanced AI capabilities to provide personalized meal recommendations, recipe suggestions, health insights, and customer support. All AI features are built using OpenAI's GPT-4 models with Ayurvedic and Satvic food expertise.

---

## Features Implemented

### 1. AI-Powered Meal Recommendations

**Purpose**: Provide personalized meal suggestions based on user's Ayurvedic constitution, health goals, and preferences.

**How It Works**:
1. User profile includes dosha, dietary restrictions, health goals, allergies
2. AI analyzes available menu items
3. Considers current season for seasonal eating
4. Generates top 5 personalized recommendations with explanations

**API Usage**:
```typescript
import { generateMealRecommendations } from './services/ai/meal-recommendations';

const recommendations = await generateMealRecommendations(
  {
    dosha: 'vata',
    healthGoals: ['improve digestion', 'increase energy'],
    dietaryRestrictions: ['gluten-free'],
    allergies: ['nuts'],
    preferences: ['spicy', 'warm foods'],
  },
  menuItems,
  'winter',
  5
);
```

**Response Format**:
```typescript
[
  {
    item: MenuItem,
    score: 85,
    reason: "This warming kitchari is perfect for balancing Vata dosha in winter",
    ayurvedicBenefit: "Grounding and nourishing, improves digestion and energy"
  },
  ...
]
```

**Fallback**: If AI fails, uses rule-based algorithm with dosha matching and preference scoring.

---

### 2. Recipe Suggestions from Ingredients

**Purpose**: Help users create Satvic recipes from ingredients they have at home.

**How It Works**:
1. User inputs available ingredients
2. AI generates complete recipe following Satvic principles
3. Includes measurements, instructions, timing, nutrition estimate

**API Usage**:
```typescript
import { suggestRecipeFromIngredients } from './services/ai/meal-recommendations';

const recipe = await suggestRecipeFromIngredients(
  ['quinoa', 'spinach', 'tomatoes', 'ginger', 'turmeric'],
  ['gluten-free', 'high-protein']
);
```

**Response Format**:
```typescript
{
  name: "Turmeric Quinoa Bowl with Sautéed Spinach",
  description: "A nourishing, anti-inflammatory bowl...",
  ingredients: [
    { name: "quinoa", amount: "1 cup" },
    { name: "spinach", amount: "2 cups" },
    ...
  ],
  instructions: [
    "Rinse quinoa thoroughly...",
    "Heat a pan with ghee...",
    ...
  ],
  prepTime: 10,
  cookTime: 20,
  servings: 2,
  nutritionEstimate: {
    calories: 350,
    protein: 12,
    carbs: 45,
    fat: 8
  },
  ayurvedicProperties: "Balances all doshas, especially good for Pitta"
}
```

---

### 3. Meal Photo Analysis

**Purpose**: Analyze photos of meals to identify foods and provide nutritional insights.

**How It Works**:
1. User uploads photo of their meal
2. AI vision model identifies food items
3. Estimates nutritional content
4. Provides Ayurvedic analysis and suggestions

**API Usage**:
```typescript
import { analyzeMealPhoto } from './services/ai/meal-recommendations';

const analysis = await analyzeMealPhoto(imageUrl);
```

**Response Format**:
```typescript
{
  identifiedItems: ["dal", "rice", "sabzi", "roti", "salad"],
  estimatedNutrition: {
    calories: 650,
    protein: 18,
    carbs: 95,
    fat: 15,
    fiber: 12
  },
  ayurvedicAnalysis: "Well-balanced Satvic meal, good for all doshas",
  healthScore: 85,
  suggestions: [
    "Add more raw vegetables for better digestion",
    "Consider adding ginger for improved metabolism"
  ]
}
```

---

### 4. Personalized Health Insights

**Purpose**: Analyze user's nutrition logs and health metrics to provide actionable insights.

**How It Works**:
1. Collects 30 days of nutrition logs
2. Analyzes health metrics (weight, energy, digestion, etc.)
3. Identifies trends and patterns
4. Generates personalized recommendations

**API Usage**:
```typescript
import { generateHealthInsights } from './services/ai/meal-recommendations';

const insights = await generateHealthInsights(nutritionLogs, healthMetrics);
```

**Response Format**:
```typescript
{
  summary: "Over the past month, your diet has been well-balanced...",
  trends: [
    "Increased protein intake by 15%",
    "More consistent meal timing",
    "Reduced processed foods"
  ],
  recommendations: [
    "Add more leafy greens for iron",
    "Increase water intake to 8 glasses daily",
    "Try intermittent fasting for better digestion"
  ],
  doshaBalance: "Your Vata is slightly elevated. Focus on warm, grounding foods.",
  nextSteps: [
    "Book a cooking class on Vata-balancing meals",
    "Try our Ayurvedic Kitchari for one week",
    "Schedule a consultation with our Ayurvedic nutritionist"
  ]
}
```

---

### 5. AI Chatbot for Customer Support

**Purpose**: Provide instant, intelligent customer support 24/7.

**How It Works**:
1. User asks question via chat interface
2. AI understands context and provides helpful response
3. Maintains conversation history for context
4. Escalates to human support when needed

**API Usage**:
```typescript
import { chatbotResponse } from './services/ai/meal-recommendations';

const response = await chatbotResponse(
  "What's the difference between the three pricing tiers?",
  conversationHistory
);
```

**Chatbot Capabilities**:
- Answer questions about menu items and ingredients
- Explain Ayurvedic principles and doshas
- Clarify triple pricing system
- Provide information about classes and workshops
- Explain Seva token rewards
- Help with orders and delivery
- Direct to human support when needed

**Example Conversation**:
```
User: "What's good for Pitta dosha?"
Bot: "For Pitta dosha, I recommend cooling, calming foods. Our Buddha Bowl 
with cucumber, mint, and coconut is perfect! It's naturally cooling and 
helps balance excess heat. Would you like to see our full Pitta-balancing menu?"

User: "Yes please!"
Bot: "Great! Here are our top Pitta-balancing items:
1. Buddha Bowl - cooling vegetables with coconut
2. Green Goddess Smoothie - mint and cucumber
3. Coconut Rice with Cilantro - naturally cooling
All are available with our triple pricing. Would you like to order?"
```

---

## Configuration

### Environment Variables

Add to `.env`:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-...your-api-key...

# Optional: Custom model selection
OPENAI_CHAT_MODEL=gpt-4-turbo-preview
OPENAI_VISION_MODEL=gpt-4-vision-preview

# Optional: Rate limiting
OPENAI_MAX_REQUESTS_PER_MINUTE=60
OPENAI_MAX_TOKENS_PER_REQUEST=2000
```

### Installation

```bash
# Install OpenAI SDK
pnpm add openai

# Install types
pnpm add -D @types/node
```

---

## Integration with tRPC

Create tRPC routes for AI features:

```typescript
// server/routes/ai.ts
import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as aiService from '../services/ai/meal-recommendations';

export const aiRouter = router({
  // Get meal recommendations
  getMealRecommendations: protectedProcedure
    .input(z.object({
      count: z.number().optional().default(5),
    }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      const menuItems = await getAvailableMenuItems();
      
      return aiService.generateMealRecommendations(
        {
          dosha: user.dosha,
          healthGoals: user.healthGoals,
          dietaryRestrictions: user.dietaryRestrictions,
          allergies: user.allergies,
          preferences: user.preferences,
        },
        menuItems,
        getCurrentSeason(),
        input.count
      );
    }),

  // Suggest recipe from ingredients
  suggestRecipe: protectedProcedure
    .input(z.object({
      ingredients: z.array(z.string()),
      preferences: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      return aiService.suggestRecipeFromIngredients(
        input.ingredients,
        input.preferences
      );
    }),

  // Analyze meal photo
  analyzeMeal: protectedProcedure
    .input(z.object({
      imageUrl: z.string().url(),
    }))
    .mutation(async ({ input }) => {
      return aiService.analyzeMealPhoto(input.imageUrl);
    }),

  // Get health insights
  getHealthInsights: protectedProcedure
    .query(async ({ ctx }) => {
      const nutritionLogs = await getNutritionLogs(ctx.user.id, 30);
      const healthMetrics = await getHealthMetrics(ctx.user.id);
      
      return aiService.generateHealthInsights(nutritionLogs, healthMetrics);
    }),

  // Chatbot
  chat: protectedProcedure
    .input(z.object({
      message: z.string(),
      conversationId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const history = await getConversationHistory(input.conversationId);
      const response = await aiService.chatbotResponse(input.message, history);
      
      // Save conversation
      await saveConversation(ctx.user.id, input.message, response);
      
      return { response };
    }),
});
```

---

## Frontend Integration

### Meal Recommendations Component

```typescript
// components/ai/MealRecommendations.tsx
import { trpc } from '@/utils/trpc';

export function MealRecommendations() {
  const { data: recommendations, isLoading } = trpc.ai.getMealRecommendations.useQuery({
    count: 5,
  });

  if (isLoading) return <div>Loading recommendations...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recommended For You</h2>
      {recommendations?.map((rec) => (
        <div key={rec.item.id} className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold">{rec.item.name}</h3>
          <p className="text-gray-600">{rec.reason}</p>
          <p className="text-sm text-green-600 mt-2">
            🌿 {rec.ayurvedicBenefit}
          </p>
          <div className="mt-2">
            <span className="text-sm font-semibold">Match Score: </span>
            <span className="text-green-600">{rec.score}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Recipe Suggestion Component

```typescript
// components/ai/RecipeSuggestion.tsx
import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export function RecipeSuggestion() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const suggestRecipe = trpc.ai.suggestRecipe.useMutation();

  const handleSuggest = async () => {
    const recipe = await suggestRecipe.mutateAsync({ ingredients });
    // Display recipe
  };

  return (
    <div>
      <h2>What's in your kitchen?</h2>
      <input
        type="text"
        placeholder="Add ingredient..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            setIngredients([...ingredients, e.currentTarget.value]);
            e.currentTarget.value = '';
          }
        }}
      />
      <button onClick={handleSuggest}>Get Recipe Suggestion</button>
    </div>
  );
}
```

### AI Chatbot Component

```typescript
// components/ai/Chatbot.tsx
import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export function Chatbot() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const chat = trpc.ai.chat.useMutation();

  const handleSend = async () => {
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');

    const response = await chat.mutateAsync({ message: input });
    setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

---

## Cost Management

### OpenAI API Pricing (as of Nov 2025)

**GPT-4 Turbo**
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

**GPT-4 Vision**
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens
- Images: $0.01 per image

### Estimated Monthly Costs

**For 1,000 active users:**
- Meal recommendations: ~5,000 requests/month = $50
- Recipe suggestions: ~1,000 requests/month = $20
- Photo analysis: ~500 requests/month = $15
- Health insights: ~1,000 requests/month = $20
- Chatbot: ~10,000 messages/month = $100

**Total: ~$205/month for 1,000 users**

### Cost Optimization Strategies

1. **Caching**: Cache common recommendations for 24 hours
2. **Rate Limiting**: Limit AI features to premium users or token holders
3. **Fallback**: Use rule-based algorithms when AI quota exceeded
4. **Batch Processing**: Process multiple requests together
5. **Token Limits**: Set max_tokens to control costs
6. **Model Selection**: Use GPT-3.5 for simpler tasks

---

## Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 AI requests per hour per user
  message: 'Too many AI requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
```

---

## Error Handling

Always implement graceful fallbacks:

```typescript
try {
  const recommendations = await generateMealRecommendations(...);
  return recommendations;
} catch (error) {
  console.error('AI error:', error);
  
  // Fallback to rule-based recommendations
  return getRuleBasedRecommendations(...);
}
```

---

## Privacy & Security

**Data Privacy**:
- Never send personally identifiable information to OpenAI
- Anonymize user data before AI processing
- Don't include email addresses, phone numbers, or names

**API Key Security**:
- Store API key in environment variables
- Never commit API key to version control
- Rotate API keys regularly
- Use separate keys for development and production

**User Consent**:
- Inform users that AI features are used
- Allow users to opt-out of AI recommendations
- Provide transparency about data usage

---

## Testing

### Unit Tests

```typescript
// __tests__/ai/meal-recommendations.test.ts
import { generateMealRecommendations } from '@/services/ai/meal-recommendations';

describe('Meal Recommendations', () => {
  it('should generate recommendations for Vata dosha', async () => {
    const recommendations = await generateMealRecommendations(
      { dosha: 'vata' },
      mockMenuItems,
      'winter',
      5
    );
    
    expect(recommendations).toHaveLength(5);
    expect(recommendations[0].score).toBeGreaterThan(0);
  });

  it('should respect dietary restrictions', async () => {
    const recommendations = await generateMealRecommendations(
      { dietaryRestrictions: ['gluten'] },
      mockMenuItems,
      'summer',
      5
    );
    
    recommendations.forEach(rec => {
      expect(rec.item.ingredients).not.toContain('wheat');
    });
  });
});
```

---

## Future Enhancements

1. **Voice Interface**: Add speech-to-text for voice orders
2. **Predictive Ordering**: Predict what user will order based on patterns
3. **Inventory Optimization**: AI-powered inventory management
4. **Dynamic Pricing**: Adjust prices based on demand and supply
5. **Sentiment Analysis**: Analyze customer reviews for insights
6. **Personalized Marketing**: AI-generated marketing messages
7. **Recipe Generation**: Create new recipes based on trending ingredients

---

## Support

For issues or questions about AI features:
- Email: ai-support@sakshi.org
- Documentation: https://docs.sakshi.org/ai-features
- OpenAI Status: https://status.openai.com

---

**AI features make Sakshi Platform intelligent, personalized, and delightful!** 🤖🌿

*Last updated: November 9, 2025*
