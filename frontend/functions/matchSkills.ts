import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Tokenize a string into lowercase words, stripping punctuation
function tokenize(str) {
  return (str || '').toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
}

// Compute keyword overlap boost: how many query words appear in the post text
function keywordBoost(queryTokens, postText) {
  const postTokens = new Set(tokenize(postText));
  const querySet = new Set(queryTokens);
  let matches = 0;
  for (const t of querySet) {
    if (postTokens.has(t)) matches++;
  }
  return querySet.size > 0 ? matches / querySet.size : 0;
}

// Phrase match boost: how many consecutive word pairs from the query appear in the post
function phraseBoost(query, postText) {
  const q = query.toLowerCase();
  const p = postText.toLowerCase();
  // Check if the entire query phrase is a substring
  if (p.includes(q)) return 1.0;
  // Check bigrams
  const words = tokenize(query);
  if (words.length < 2) return 0;
  let bigrams = 0;
  let found = 0;
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = words[i] + ' ' + words[i + 1];
    bigrams++;
    if (p.includes(bigram)) found++;
  }
  return bigrams > 0 ? found / bigrams : 0;
}

// Category keyword map for boosting category relevance
const CATEGORY_KEYWORDS = {
  teaching: ['teach', 'tutor', 'lesson', 'learn', 'class', 'course', 'education', 'school', 'study'],
  tech_support: ['tech', 'computer', 'software', 'code', 'programming', 'website', 'app', 'it', 'developer', 'react', 'javascript', 'html', 'css'],
  repair: ['repair', 'fix', 'maintenance', 'broken', 'install', 'mechanic', 'plumbing', 'electrical'],
  caregiving: ['care', 'elderly', 'childcare', 'babysit', 'disability', 'aged', 'kids', 'children'],
  cooking: ['cook', 'meal', 'food', 'bake', 'recipe', 'kitchen', 'dinner', 'lunch'],
  transport: ['transport', 'drive', 'car', 'ride', 'pickup', 'delivery', 'moving'],
  creative: ['design', 'art', 'music', 'photo', 'video', 'creative', 'draw', 'paint'],
  physical_help: ['move', 'lift', 'garden', 'clean', 'physical', 'labour', 'labor', 'furniture'],
  professional: ['legal', 'accounting', 'tax', 'finance', 'business', 'resume', 'cv', 'professional', 'advice'],
};

function categoryBoost(queryTokens, category) {
  const keywords = CATEGORY_KEYWORDS[category] || [];
  for (const token of queryTokens) {
    for (const kw of keywords) {
      if (token.includes(kw) || kw.includes(token)) return 0.15;
    }
  }
  return 0;
}

// Blend semantic score with keyword signals to push accuracy higher
function blendScores(semanticScore, kwBoost, phraseBoostScore, catBoost) {
  // Base: semantic score from the model (0-1)
  // Boost with keyword/phrase signals, capped at 0.95
  let score = semanticScore;

  // Exact phrase match is a very strong signal
  score += phraseBoostScore * 0.30;

  // Keyword overlap adds up to 0.20
  score += kwBoost * 0.20;

  // Category relevance adds small boost
  score += catBoost;

  // Clamp: max 0.95, min 0
  return Math.min(0.95, Math.max(0, score));
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { query, posts } = await req.json();

    if (!query || !posts || posts.length === 0) {
      return Response.json({ ranked: [] });
    }

    const queryTokens = tokenize(query);
    const sentences = posts.map(p => `${p.title}. ${p.description || ''}`);

    // Fetch semantic similarity scores from HuggingFace
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('HUGGINGFACE_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            source_sentence: query,
            sentences,
          },
        }),
      }
    );

    const rawText = await response.text();
    let scores;
    try {
      scores = JSON.parse(rawText);
    } catch {
      return Response.json({ error: 'HuggingFace returned unexpected response', raw: rawText.slice(0, 300), status: response.status }, { status: 503 });
    }

    if (!Array.isArray(scores)) {
      return Response.json({ error: 'Model not ready, try again shortly', raw: scores }, { status: 503 });
    }

    const ranked = posts
      .map((post, i) => {
        const postText = sentences[i];
        const kw = keywordBoost(queryTokens, postText);
        const phrase = phraseBoost(query, postText);
        const cat = categoryBoost(queryTokens, post.category);
        const blended = blendScores(scores[i], kw, phrase, cat);
        return { ...post, similarity: blended };
      })
      .sort((a, b) => b.similarity - a.similarity);

    return Response.json({ ranked });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});