/**
 * AI-Powered Meal Recommendation System
 * Uses OpenAI GPT to provide personalized meal recommendations based on:
 * - User's dosha (Ayurvedic constitution)
 * - Dietary preferences and restrictions
 * - Health goals
 * - Seasonal considerations
 * - Previous order history
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface UserProfile {
  dosha?: 'vata' | 'pitta' | 'kapha' | 'balanced';
  dietaryRestrictions?: string[];
  healthGoals?: string[];
  allergies?: string[];
  preferences?: string[];
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  doshaBalance: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: string[];
}

interface Recommendation {
  item: MenuItem;
  score: number;
  reason: string;
  ayurvedicBenefit: string;
}

/**
 * Generate personalized meal recommendations using AI
 */
export async function generateMealRecommendations(
  userProfile: UserProfile,
  availableItems: MenuItem[],
  season: string = getCurrentSeason(),
  count: number = 5
): Promise<Recommendation[]> {
  try {
    const prompt = buildRecommendationPrompt(userProfile, availableItems, season);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert Ayurvedic nutritionist and Satvic food specialist. 
          You understand doshas, seasonal eating, and the principles of plant-based nutrition. 
          Provide personalized meal recommendations that balance health, taste, and Ayurvedic wisdom.
          Always respond in valid JSON format.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return parseRecommendations(result, availableItems);
  } catch (error) {
    console.error('AI recommendation error:', error);
    // Fallback to rule-based recommendations
    return getRuleBasedRecommendations(userProfile, availableItems, count);
  }
}

/**
 * Build the prompt for AI recommendations
 */
function buildRecommendationPrompt(
  userProfile: UserProfile,
  items: MenuItem[],
  season: string
): string {
  const itemsJson = items.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    ingredients: item.ingredients,
    doshaBalance: item.doshaBalance,
    nutrition: item.nutritionInfo,
    tags: item.tags,
  }));

  return `
Based on the following user profile and available menu items, recommend the top 5 meals:

User Profile:
- Dosha: ${userProfile.dosha || 'unknown'}
- Dietary Restrictions: ${userProfile.dietaryRestrictions?.join(', ') || 'none'}
- Health Goals: ${userProfile.healthGoals?.join(', ') || 'general wellness'}
- Allergies: ${userProfile.allergies?.join(', ') || 'none'}
- Preferences: ${userProfile.preferences?.join(', ') || 'none'}

Current Season: ${season}

Available Menu Items:
${JSON.stringify(itemsJson, null, 2)}

Please recommend 5 meals that:
1. Balance the user's dosha
2. Align with their health goals
3. Respect dietary restrictions and allergies
4. Are appropriate for the current season
5. Follow Satvic and Ayurvedic principles

Return a JSON object with this structure:
{
  "recommendations": [
    {
      "itemId": number,
      "score": number (0-100),
      "reason": "Brief explanation of why this meal is recommended",
      "ayurvedicBenefit": "Specific Ayurvedic benefit for this user"
    }
  ]
}
`;
}

/**
 * Parse AI response into recommendations
 */
function parseRecommendations(
  aiResponse: any,
  items: MenuItem[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  if (!aiResponse.recommendations || !Array.isArray(aiResponse.recommendations)) {
    return [];
  }

  for (const rec of aiResponse.recommendations) {
    const item = items.find(i => i.id === rec.itemId);
    if (item) {
      recommendations.push({
        item,
        score: rec.score || 0,
        reason: rec.reason || 'Recommended for you',
        ayurvedicBenefit: rec.ayurvedicBenefit || 'Supports overall wellness',
      });
    }
  }

  return recommendations.sort((a, b) => b.score - a.score);
}

/**
 * Fallback rule-based recommendations
 */
function getRuleBasedRecommendations(
  userProfile: UserProfile,
  items: MenuItem[],
  count: number
): Recommendation[] {
  const scored = items.map(item => {
    let score = 50; // Base score

    // Dosha matching
    if (userProfile.dosha && item.doshaBalance) {
      const doshaScore = item.doshaBalance[userProfile.dosha];
      score += doshaScore * 20;
    }

    // Dietary restrictions
    if (userProfile.dietaryRestrictions) {
      const hasRestriction = userProfile.dietaryRestrictions.some(restriction =>
        item.ingredients.some(ing => ing.toLowerCase().includes(restriction.toLowerCase()))
      );
      if (hasRestriction) score -= 50;
    }

    // Allergies
    if (userProfile.allergies) {
      const hasAllergen = userProfile.allergies.some(allergen =>
        item.ingredients.some(ing => ing.toLowerCase().includes(allergen.toLowerCase()))
      );
      if (hasAllergen) score = 0;
    }

    // Preferences
    if (userProfile.preferences) {
      const matchesPreference = userProfile.preferences.some(pref =>
        item.tags.includes(pref) || item.name.toLowerCase().includes(pref.toLowerCase())
      );
      if (matchesPreference) score += 15;
    }

    return {
      item,
      score: Math.max(0, Math.min(100, score)),
      reason: `Matches your ${userProfile.dosha || 'dietary'} profile`,
      ayurvedicBenefit: `Balances ${userProfile.dosha || 'all doshas'}`,
    };
  });

  return scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

/**
 * Get current season for seasonal recommendations
 */
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  
  // Northern hemisphere seasons (adjust for location)
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

/**
 * Generate AI-powered recipe suggestions based on available ingredients
 */
export async function suggestRecipeFromIngredients(
  ingredients: string[],
  dietaryPreferences: string[] = []
): Promise<{
  name: string;
  description: string;
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  nutritionEstimate: any;
  ayurvedicProperties: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert Satvic chef. Create delicious, healthy plant-based recipes 
          following Ayurvedic principles. No onion, no garlic, focus on sattvic ingredients.
          Always respond in valid JSON format.`,
        },
        {
          role: 'user',
          content: `Create a Satvic recipe using these ingredients: ${ingredients.join(', ')}
          
          Dietary preferences: ${dietaryPreferences.join(', ') || 'none'}
          
          Return a JSON object with: name, description, ingredients (with amounts), 
          step-by-step instructions, prepTime, cookTime, servings, nutritionEstimate, 
          and ayurvedicProperties.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Recipe suggestion error:', error);
    throw new Error('Failed to generate recipe suggestion');
  }
}

/**
 * Analyze meal photo and provide nutritional insights
 */
export async function analyzeMealPhoto(
  imageUrl: string
): Promise<{
  identifiedItems: string[];
  estimatedNutrition: any;
  ayurvedicAnalysis: string;
  healthScore: number;
  suggestions: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this meal photo from an Ayurvedic and nutritional perspective. 
              Identify the foods, estimate nutrition, assess Ayurvedic properties, 
              and provide suggestions. Return as JSON.`,
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Meal photo analysis error:', error);
    throw new Error('Failed to analyze meal photo');
  }
}

/**
 * Generate personalized health insights based on nutrition logs
 */
export async function generateHealthInsights(
  nutritionLogs: any[],
  healthMetrics: any[]
): Promise<{
  summary: string;
  trends: string[];
  recommendations: string[];
  doshaBalance: string;
  nextSteps: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an Ayurvedic health coach analyzing nutrition and health data. 
          Provide personalized insights and actionable recommendations.`,
        },
        {
          role: 'user',
          content: `Analyze this health data and provide insights:
          
          Nutrition Logs (last 30 days):
          ${JSON.stringify(nutritionLogs, null, 2)}
          
          Health Metrics:
          ${JSON.stringify(healthMetrics, null, 2)}
          
          Provide: summary, trends, recommendations, dosha balance assessment, and next steps.
          Return as JSON.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Health insights error:', error);
    throw new Error('Failed to generate health insights');
  }
}

/**
 * AI chatbot for customer support
 */
export async function chatbotResponse(
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<string> {
  try {
    const messages = [
      {
        role: 'system',
        content: `You are a helpful customer support assistant for Sakshi Cafe, 
        a Satvic plant-based restaurant. You can answer questions about:
        - Menu items and ingredients
        - Ayurvedic principles and doshas
        - Triple pricing system (Community/Fair/Supporter)
        - Cooking classes and workshops
        - Seva token rewards
        - Orders and delivery
        
        Be warm, knowledgeable, and helpful. If you don't know something, 
        direct them to contact support@sakshi.org.`,
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 500,
    });

    return response.choices[0].message.content || 'I apologize, I could not generate a response.';
  } catch (error) {
    console.error('Chatbot error:', error);
    return 'I apologize, I am experiencing technical difficulties. Please contact support@sakshi.org for assistance.';
  }
}
