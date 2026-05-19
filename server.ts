import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import { Customer, Segment, Campaign, SegmentFilter } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Mock Database
let customers: Customer[] = Array.from({ length: 500 }).map((_, i) => ({
  id: `cust_${i}`,
  name: `Customer ${i}`,
  email: `customer${i}@example.com`,
  age: Math.floor(Math.random() * 50) + 18,
  location: ['New York', 'London', 'Berlin', 'Tokyo', 'Paris', 'Sydney'][Math.floor(Math.random() * 6)],
  income: Math.floor(Math.random() * 150000) + 30000,
  profession: ['Engineer', 'Designer', 'Teacher', 'Doctor', 'Artist', 'Marketer'][Math.floor(Math.random() * 6)],
  behaviorScore: Math.floor(Math.random() * 100),
  lastPurchaseDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}));

let segments: Segment[] = [
  {
    id: 'seg_1',
    name: 'High Performance Tech',
    filters: {
      ageRange: [25, 45],
      geographicRegion: ['Tokyo', 'New York'],
      incomeLevel: [80000, 200000],
      professions: ['Engineer', 'Designer'],
      behaviorMin: 70
    },
    customerCount: 45,
    createdAt: new Date().toISOString(),
  }
];

let campaigns: Campaign[] = [
  {
    id: 'camp_1',
    name: 'Summer Tech Gear Promo',
    segmentId: 'seg_1',
    status: 'active',
    type: 'email',
    performance: {
      sent: 1000,
      opened: 450,
      clicked: 120,
      converted: 32
    },
    abTest: {
      variantA: { subject: 'Exclusive Tech Deals Inside!', conversionRate: 0.03 },
      variantB: { subject: 'Upgrade Your Workspace Now', conversionRate: 0.045 }
    },
    automatedAdjustments: true
  }
];

// API Routes
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.get('/api/segments', (req, res) => {
  res.json(segments);
});

app.post('/api/segments', (req, res) => {
  const { name, websiteUrl, filters } = req.body;
  
  // Filter logic
  const filtered = customers.filter(c => {
    let match = true;
    if (filters.ageRange) {
      match = match && c.age >= filters.ageRange[0] && c.age <= filters.ageRange[1];
    }
    if (filters.geographicRegion && filters.geographicRegion.length > 0) {
      match = match && filters.geographicRegion.includes(c.location);
    }
    if (filters.incomeLevel) {
      match = match && c.income >= filters.incomeLevel[0] && c.income <= filters.incomeLevel[1];
    }
    if (filters.professions && filters.professions.length > 0) {
      match = match && filters.professions.includes(c.profession);
    }
    if (filters.behaviorMin !== undefined) {
      match = match && c.behaviorScore >= filters.behaviorMin;
    }
    return match;
  });

  const newSegment: Segment = {
    id: `seg_${Date.now()}`,
    name,
    websiteUrl,
    filters,
    customerCount: filtered.length,
    createdAt: new Date().toISOString()
  };
  segments.push(newSegment);
  res.json(newSegment);
});

app.get('/api/campaigns', (req, res) => {
  res.json(campaigns);
});

// Gemini-powered Automated Campaign Adjustments
app.post('/api/campaigns/:id/optimize', async (req, res) => {
  const campaign = campaigns.find(c => c.id === req.params.id);
  if (!campaign) return res.status(404).send('Campaign not found');

  try {
    const prompt = `
      As a marketing expert, analyze this campaign performance and suggest an automated adjustment.
      Campaign Name: ${campaign.name}
      Current Stats: Sent: ${campaign.performance.sent}, Opened: ${campaign.performance.opened}, Clicked: ${campaign.performance.clicked}, Converted: ${campaign.performance.converted}
      A/B Test Results: 
      Variant A: ${campaign.abTest?.variantA.subject} (Rate: ${campaign.abTest?.variantA.conversionRate})
      Variant B: ${campaign.abTest?.variantB.subject} (Rate: ${campaign.abTest?.variantB.conversionRate})
      
      Respond with a JSON object:
      {
        "adjustmentReason": "string explaining why",
        "recommendedAction": "string action taken",
        "newSubjectLine": "string if modified",
        "estimatedImpact": "string percentage"
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const recommendation = JSON.parse(result.text || '{}');
    
    // Simulate adjustment
    if (campaign.abTest && campaign.abTest.variantB.conversionRate > campaign.abTest.variantA.conversionRate) {
      campaign.name += ' (Optimized)';
      // Realistically we'd swap traffic to Variant B
    }

    res.json({ campaign, recommendation });
  } catch (error) {
    console.error('Gemini Optimization Error:', error);
    res.status(500).json({ error: 'Failed to optimize campaign' });
  }
});

// Analytics Data
app.get('/api/analytics', (req, res) => {
  const data = Array.from({ length: 30 }).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    impressions: 1200 + Math.random() * 400,
    clicks: 100 + Math.random() * 50,
    conversions: 10 + Math.random() * 10
  }));
  res.json(data);
});

// Gemini-powered website analysis for segmentation
app.post('/api/analyze-site', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const prompt = `
      As a marketing data scientist, analyze the brand and audience likely associated with this website URL: ${url}
      
      Generate 3 distinct customer segmentation models for this brand based on:
      1. Age Range (18-65)
      2. Geographic Regions (Must pick from: New York, London, Berlin, Tokyo, Paris, Sydney)
      3. Global Professions (Pick from: Engineer, Designer, Teacher, Doctor, Artist, Marketer)
      4. Behavior/Engagement Score threshold (0-100)
      
      Respond with ONLY a JSON array of 3 objects, each following this exact structure:
      {
        "name": "Creative name for the segment",
        "rationale": "One sentence explaining why this group fits the site",
        "filters": {
          "ageRange": [min, max],
          "geographicRegion": ["RegionName"],
          "professions": ["ProfessionName"],
          "behaviorMin": number
        }
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const suggestions = JSON.parse(result.text || '[]');
    res.json(suggestions);
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze site' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
