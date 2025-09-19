
# Spikra Assist for Zoho (SAZ)

## Project Overview

This is a lightweight prototype demonstrating AI + Zoho CRM integration for the Spikra interview assignment.
It showcases how AI-generated content can be embedded into Zoho workflows for sales, support, and productivity.


## 🚀 Features

Express server (ESM) – simple Node.js server to simulate Zoho webhook handling.

AI Drafting – generates a contextual draft email using a mock LLM (can be swapped with OpenAI).

Zoho CRM-ready – accepts incoming lead data in Zoho webhook format.

Future-ready – designed for extension into OpenAI + Zoho Notes integration.

## 📌 Tech Stack

Node.js + Express (ES Modules).

OpenAI API.

Zoho CRM REST APIs.





## 📂 Project Structure

```bash
├── app.js         # Express server
├── package.json   # Dependencies & scripts
├── .env           # Secrets: OpenAI + Zoho tokens
└── README.md      # Project documentation
```

## Running Locally

1. Clone the repo

```bash
git clone https://github.com/RajatRathore123-github/Spikra_assignment.git

cd "to the main directory"
```

2. Install Dependencies

```bash
npm install
```

3. Configure environment
Create .env file with:

```bash
OPENAI_API_KEY=your_openai_api_key
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token
```

4. Start the server

```bash
node app.js
```

##  Example Flow

Step 1: Zoho CRM triggers webhook

Whenever a new Lead is created or updated in Zoho, it can send a webhook payload to your prototype server:

```bash
curl -X POST http://localhost:3000/zoho/webhook/lead \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "id": "1234567890",
      "full_name": "Asha Sharma",
      "interested_in": "Spikra CRM integration",
      "last_note": "Met at webinar"
    }
  }'
```

Step 2: Express server processes payload

Extracts full_name, interested_in, and last_note.

Sends prompt to OpenAI API to generate a contextual draft email.

Calls Zoho CRM API → attaches that draft as a Note to the Lead.

Step 3: Response from server

Prototype server replies with JSON (draft + Zoho confirmation):
```bash
{
  "status": "ok",
  "lead_id": "1234567890",
  "draft": "Hi Asha Sharma,\n\nThanks for connecting. I saw you're interested in Spikra CRM integration. I'd love to discuss next steps.\n\nBest,\nSpikra Sales",
  "zoho_status": "Note created successfully"
}

```

