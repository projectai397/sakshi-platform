import OpenAI from 'openai';

/**
 * Sakshi Platform Smart Search
 * AI-powered natural language product search
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface SearchQuery {
  query: string;
  userId?: string;
}

export interface SearchFilters {
  categories?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  condition?: string[];
  sortBy?: 'price' | 'date' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Analyze search query and extract filters
 */
export async function analyzeSearchQuery(query: string): Promise<SearchFilters> {
  try {
    const prompt = `Analyze this product search query and extract filters: "${query}"

Extract:
- categories: Array of relevant categories (Clothing, Books, Electronics, Home & Garden, Sports, Accessories)
- priceRange: {min: number, max: number} if price mentioned
- condition: Array of conditions (New, Like New, Good, Fair) if mentioned
- sortBy: 'price', 'date', or 'relevance'
- sortOrder: 'asc' or 'desc'

Examples:
"yoga mat under 500" → {"categories": ["Sports"], "priceRange": {"max": 500}, "sortBy": "price", "sortOrder": "asc"}
"excellent condition books" → {"categories": ["Books"], "condition": ["Like New", "New"], "sortBy": "relevance"}
"cheap electronics" → {"categories": ["Electronics"], "sortBy": "price", "sortOrder": "asc"}

Respond with only valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    const filters = JSON.parse(response);

    return filters;
  } catch (error: any) {
    console.error('Search query analysis failed:', error);
    return {};
  }
}

/**
 * Generate search keywords from natural language
 */
export async function generateSearchKeywords(query: string): Promise<string[]> {
  try {
    const prompt = `Extract search keywords from this query: "${query}"

Generate 3-5 relevant keywords that would help find products.

Example:
"looking for yoga equipment" → ["yoga", "mat", "equipment", "fitness", "exercise"]

Respond with only a JSON array of keywords.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 100,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    const keywords = JSON.parse(response);

    return keywords;
  } catch (error: any) {
    console.error('Keyword generation failed:', error);
    // Fallback: split query into words
    return query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  }
}

/**
 * Enhance search results with AI ranking
 */
export async function rankSearchResults(
  query: string,
  products: any[]
): Promise<any[]> {
  try {
    if (products.length === 0) return products;

    // Create a simplified product list for AI
    const productSummaries = products.map((p, idx) => ({
      index: idx,
      name: p.name,
      description: p.description?.substring(0, 100),
      category: p.category,
      price: p.price,
    }));

    const prompt = `Given this search query: "${query}"

Rank these products by relevance (most relevant first):
${JSON.stringify(productSummaries, null, 2)}

Respond with only a JSON array of indices in order of relevance.
Example: [2, 0, 4, 1, 3]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 100,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    const rankedIndices = JSON.parse(response);

    // Reorder products based on AI ranking
    const rankedProducts = rankedIndices.map((idx: number) => products[idx]).filter(Boolean);
    
    // Add any products that weren't ranked at the end
    const unrankedProducts = products.filter((_, idx) => !rankedIndices.includes(idx));
    
    return [...rankedProducts, ...unrankedProducts];
  } catch (error: any) {
    console.error('Result ranking failed:', error);
    return products; // Return original order on error
  }
}

/**
 * Generate search suggestions
 */
export async function generateSearchSuggestions(
  partialQuery: string
): Promise<string[]> {
  try {
    const prompt = `Given this partial search query: "${partialQuery}"

Generate 5 relevant search suggestions for a conscious commerce platform.

Categories available: Clothing, Books, Electronics, Home & Garden, Sports, Accessories

Respond with only a JSON array of suggestions.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    const suggestions = JSON.parse(response);

    return suggestions.slice(0, 5);
  } catch (error: any) {
    console.error('Suggestion generation failed:', error);
    return [];
  }
}

/**
 * Understand user intent for search
 */
export async function understandSearchIntent(query: string) {
  try {
    const prompt = `Analyze this search query intent: "${query}"

Determine:
1. Primary intent (browse, buy, compare, learn)
2. Urgency (low, medium, high)
3. Budget consciousness (budget, moderate, premium, any)
4. Sustainability focus (yes/no)

Respond with only valid JSON.
Example: {"intent": "buy", "urgency": "high", "budget": "budget", "sustainability": true}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 100,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    const intent = JSON.parse(response);

    return {
      success: true,
      intent,
    };
  } catch (error: any) {
    console.error('Intent understanding failed:', error);
    return {
      success: false,
      intent: {
        intent: 'browse',
        urgency: 'low',
        budget: 'any',
        sustainability: false,
      },
    };
  }
}

/**
 * Generate "no results" suggestions
 */
export async function generateNoResultsSuggestions(query: string): Promise<string[]> {
  try {
    const prompt = `User searched for "${query}" but no results were found.

Generate 3 alternative search suggestions that might help them find what they're looking for.

Respond with only a JSON array of suggestions.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    const suggestions = JSON.parse(response);

    return suggestions;
  } catch (error: any) {
    console.error('No results suggestions failed:', error);
    return [
      'Try using different keywords',
      'Browse all categories',
      'Check our featured products',
    ];
  }
}

/**
 * Perform smart search with AI enhancements
 */
export async function performSmartSearch(
  query: string,
  products: any[]
) {
  try {
    // 1. Analyze query to extract filters
    const filters = await analyzeSearchQuery(query);

    // 2. Generate search keywords
    const keywords = await generateSearchKeywords(query);

    // 3. Filter products based on extracted filters
    let filteredProducts = products;

    if (filters.categories && filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        filters.categories!.includes(p.category)
      );
    }

    if (filters.priceRange) {
      if (filters.priceRange.min) {
        filteredProducts = filteredProducts.filter(
          p => p.price >= filters.priceRange!.min!
        );
      }
      if (filters.priceRange.max) {
        filteredProducts = filteredProducts.filter(
          p => p.price <= filters.priceRange!.max!
        );
      }
    }

    if (filters.condition && filters.condition.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        filters.condition!.includes(p.condition)
      );
    }

    // 4. Search by keywords
    const keywordRegex = new RegExp(keywords.join('|'), 'i');
    filteredProducts = filteredProducts.filter(
      p =>
        keywordRegex.test(p.name) ||
        keywordRegex.test(p.description || '') ||
        keywordRegex.test(p.category)
    );

    // 5. Rank results with AI
    const rankedProducts = await rankSearchResults(query, filteredProducts);

    // 6. Sort if specified
    if (filters.sortBy) {
      rankedProducts.sort((a, b) => {
        let comparison = 0;
        
        if (filters.sortBy === 'price') {
          comparison = a.price - b.price;
        } else if (filters.sortBy === 'date') {
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return {
      success: true,
      products: rankedProducts,
      filters,
      keywords,
      count: rankedProducts.length,
    };
  } catch (error: any) {
    console.error('Smart search failed:', error);
    return {
      success: false,
      products: [],
      error: error.message,
    };
  }
}

export default {
  analyzeQuery: analyzeSearchQuery,
  generateKeywords: generateSearchKeywords,
  rankResults: rankSearchResults,
  generateSuggestions: generateSearchSuggestions,
  understandIntent: understandSearchIntent,
  generateNoResultsSuggestions,
  performSmartSearch,
};
