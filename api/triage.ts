import { triageHandler } from '../lib/triageHandler';
import type { TriageRequest } from '../src/types/index';

// Vercel Serverless Function — API key stays server-side only
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body as TriageRequest;
    const result = await triageHandler(body);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('[/api/triage] Error:', err);
    return res.status(500).json({ error: err.message || 'Service temporarily unavailable. Please try again.' });
  }
}
