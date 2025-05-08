https://devpost.com/software/crisismapper

## What we made
We built CrisisMapper, a small web app that:
Shows recent earthquakes on an interactive map.
Uses AI to read the raw earthquake feed and suggest which regions might need help next.

## Its impact
Real‑time situational awareness: Anyone can see where quakes just happened.
Early aid predictions: The AI highlights areas likely to be hardest hit, so responders can plan ahead.

## How we built it
# Data fetching
We pull the last 24 hours of quake data as XML from GDACS.
We clean up any bad characters (like stray “&” signs).
We parse the XML into JSON with xml2js.

# AI prediction
We send that JSON to OpenAI’s GPT‑4o via our Next.js API route.
The model returns a short text saying which regions may need aid next.

# Front end
A Next.js page fetches both the map data and the AI’s message (using POST).
We show the quakes on a MapClient component (e.g., Mapbox or Leaflet).
We show the AI’s prediction in an AiInfo panel below the map.

