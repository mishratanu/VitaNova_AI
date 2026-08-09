// Combined Production & Development Server
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { triageHandler } from '../lib/triageHandler';
import type { TriageRequest } from '../src/types/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// API Routes
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

// Serve static frontend files in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all route to serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🏥 VitaNova AI API server running on port ${PORT}`);
  console.log(`   API key loaded: ${!!process.env.GEMINI_API_KEY}\n`);
});
