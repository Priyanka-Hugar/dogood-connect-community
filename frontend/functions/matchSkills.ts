import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { query, posts } = await req.json();

    if (!query || !posts || posts.length === 0) {
      return Response.json({ scores: [] });
    }

    const sentences = posts.map(p => `${p.title}. ${p.description || ''}`);

    const response = await fetch(
      'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
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

    const scores = await response.json();

    if (!Array.isArray(scores)) {
      return Response.json({ error: 'Model not ready, try again shortly', raw: scores }, { status: 503 });
    }

    // Return posts sorted by similarity score descending
    const ranked = posts
      .map((post, i) => ({ ...post, similarity: scores[i] }))
      .sort((a, b) => b.similarity - a.similarity);

    return Response.json({ ranked });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});