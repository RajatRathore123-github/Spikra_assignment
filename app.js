// Minimal Express prototype: receives Zoho lead webhook, builds prompt, returns draft
import express from "express";
import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();

app.use(express.json());

// --- OpenAI setup ---
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- Zoho config (use static token for prototype) ---
const ZOHO_AUTH_TOKEN = process.env.ZOHO_AUTH_TOKEN;
const ZOHO_BASE_URL = 'https://www.zohoapis.in/crm/v2';


// --- Function: Generate draft with OpenAI ---
async function generateDraft(lead) {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful sales assistant who writes polite, concise drafts.' },
      { role: 'user', content: `Draft a polite email to ${lead.full_name}, who is interested in ${lead.interested_in}. Last note: ${lead.last_note}` }
    ],
    max_tokens: 200
  });

  return completion.choices[0].message.content.trim();
}

// --- Route: Zoho webhook simulation ---
app.post('/zoho/webhook/lead', async (req, res) => {
  try {
    const lead = req.body.data;

    const draft = await generateDraft(lead);

    // (Optional) Save the draft back to Zoho Notes
    if (ZOHO_AUTH_TOKEN && lead.id) {
      await axios.post(
        `${ZOHO_BASE_URL}/Leads/${lead.id}/Notes`,
        {
          data: [
            {
              Note_Title: 'AI Draft',
              Note_Content: draft
            }
          ]
        },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${ZOHO_AUTH_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return res.json({ status: 'ok', draft });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ status: 'error', error: err.message });
  }
});

// --- Health check ---
app.get('/', (req, res) => res.send('Spikra Assist prototype with OpenAI + Zoho integration running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Prototype running on http://localhost:${PORT}`));



