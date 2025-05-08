// src/app/api/ai/route.js

import axios from "axios";
import { parseStringPromise } from "xml2js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPEN_AI_KEY) {
  console.error("Missing OPEN_AI_KEY in .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

// Handle GET requests (e.g., DevTools preflight) with a 405
export async function GET(request) {
  return new Response(
    JSON.stringify({ error: "Method GET not allowed. Please use POST." }),
    {
      status: 405,
      headers: {
        'Allow': 'POST',
        'Content-Type': 'application/json',
      },
    }
  );
}

// Handle POST requests: fetch, parse, and predict aid areas
export async function POST(request) {
  try {
    // 1) Fetch raw XML from GDACS
    const { data: xml } = await axios.get(
      "https://www.gdacs.org/xml/rss_eq_24h.xml"
    );

    // 2) Sanitize unescaped ampersands
    const sanitizedXml = xml.replace(/&(?!#?[\w]+;)/g, "&amp;");

    // 3) Parse XML into JSON
    const jsonData = await parseStringPromise(sanitizedXml);
    const jsonString = JSON.stringify(jsonData);

    // 4) Build AI prompt
    const userPrompt =
      `Here is the latest 24-hour earthquake feed data as JSON:\n${jsonString}\n` +
      `Predict which regions are most likely to need aid next based on this information.`;

    // 5) Call OpenAI Chat Completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: userPrompt }],
    });
    const botResponse = completion.choices[0].message.content;
    console.log("OpenAI response:", botResponse);

    // 6) Return AI response
    return new Response(
      JSON.stringify({ message: botResponse }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=60',
        },
      }
    );
  } catch (error) {
    console.error("GDACS API or OpenAI error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch or process earthquake data." }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
