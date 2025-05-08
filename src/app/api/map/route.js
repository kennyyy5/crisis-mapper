// src/app/api/map/route.js
import axios from "axios";
import { parseStringPromise } from "xml2js";

export async function GET() {
  try {
    // 1) Fetch raw XML from GDACS
    const { data: xml } = await axios.get(
      "https://www.gdacs.org/xml/rss_eq_24h.xml"
    );

    // 2) Sanitize unescaped ampersands and invalid entities
    //    Replace any '&' not followed by alphanumeric or '#' and ending with ';'
    const sanitizedXml = xml.replace(/&(?!#?[\w]+;)/g, "&amp;");
    // console.log("sanitizedXml: ",sanitizedXml.substring(0, 350));

    // 3) Parse sanitized XML to JS object (non-strict to allow some malformed content)
    const parsed = await parseStringPromise(sanitizedXml, {
      explicitArray: true,
      strict: false,
      normalizeTags: true
    });
    // console.log("parsed: ",parsed);
    // 4) Extract items (ensure it's always an array)
    const items = parsed.rss?.channel?.[0]?.item || [];

    // 5) Normalize into simple JSON
    // console.log("items: ",items[0].title);
    const disasters = items.map((item, index) => ({
        
      id: index,
      title: item.title?.[0] || "",
      description: item.description?.[0] || "",
      pubDate: item.pubDate?.[0] || "",
      link: item.link?.[0] || "",
      lat: parseFloat(item['geo:point'][0]['geo:lat']?.[0] || "0"),
      lon: parseFloat(item['geo:point'][0]['geo:long']?.[0] || "0")
    }));
    // console.log("disasters: ",disasters);

    // 6) Return JSON response
    return new Response(JSON.stringify(disasters), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60'
      }
    });
  } catch (error) {
    console.error('GDACS API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to parse GDACS XML' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
