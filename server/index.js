import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRouter from './routes.js';
import { db } from './db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Uploads static directory
app.use('/uploads', express.static(path.join(__dirname, '../data/uploads')));

// API Routes
app.use('/api', apiRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    stats: {
      influencers: db.get('influencers').length,
      briefs: db.get('brandBriefs').length,
      proposals: db.get('proposals').length,
      campaigns: db.get('campaigns').length
    }
  });
});

// Serve frontend dist build if it exists (for Hostinger full-stack deployment)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 CreatorDeck Platform running on http://localhost:${PORT}`);
});
