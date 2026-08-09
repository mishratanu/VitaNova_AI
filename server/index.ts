// Local development API server
// Runs on port 3001, proxied via Vite at /api
import 'dotenv/config';
import express from 'express';
import { triageHandler } from '../lib/triageHandler';
import type { TriageRequest } from '../src/types/index';

const app = express();
app.use(express.json());

app.post('/api/triage', async (req, res) => {
  try {
    const body = req.body as TriageRequest;
    const result = await triageHandler(body);
    res.json(result);
  } catch (err: any) {
    console.error('[server] Triage error:', err);
    res.status(500).json({ error: err.message || 'Service temporarily unavailable. Please try again.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🏥 VitaNova AI API server running at http://localhost:${PORT}`);
  console.log('   Proxied via Vite at /api/triage');
  console.log(`   API key loaded: ${!!process.env.GEMINI_API_KEY}\n`);
});
