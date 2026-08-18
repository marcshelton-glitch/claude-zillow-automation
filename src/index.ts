import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  imageUrl?: string;
}

interface GeneratedContent {
  property: Property;
  marketingDescription: string;
  videoPrompt: string;
  imagePrompt: string;
  voiceoverScript: string;
  provider: string;
}

type APIProvider = "gemini" | "mistral" | "groq";

// API Key validation
const geminiKey = process.env.GOOGLE_API_KEY;
const mistralKey = process.env.MISTRAL_API_KEY;
const groqKey = process.env.GROQ_API_KEY;

const availableProviders: APIProvider[] = [];
// Mistral: Unlimited free tier - PRIMARY API
if (mistralKey) availableProviders.push("mistral");
// Gemini: Limited to 20 requests/day (quota exhausted today - resets tomorrow)
// Groq: Models decommissioned - awaiting account tier upgrade
// TODO: Add Gemini back when quota resets (24h cycle)
// TODO: Fix Groq when account tier supports current models

if (availableProviders.length === 0) {
  console.error("❌ Error: No API keys configured!");
  console.error("Set at least one of:");
  console.error("  - GOOGLE_API_KEY for Gemini: https://aistudio.google.com/app/apikey");
  console.error("  - MISTRAL_API_KEY for Mistral: https://console.mistral.ai/api-keys");
  console.error("  - GROQ_API_KEY for Groq: https://console.groq.com/keys");
  process.exit(1);
}

const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// Rotation counter
let currentProviderIndex = 0;

function getNextProvider(): APIProvider {
  const provider = availableProviders[currentProviderIndex];
  currentProviderIndex = (currentProviderIndex + 1) % availableProviders.length;
  return provider;
}

// Mock Zillow property data - Moreno Valley, CA comps
const mockProperties: Property[] = [
  {
    id: "prop-001",
    address: "12205 Deerwood Ln, Moreno Valley, CA 92557",
    price: 559500,
    bedrooms: 4,
    bathrooms: 2,
    sqft: 1394,
    description:
      "Spacious family home with updated kitchen and bright living spaces",
    imageUrl: "https://photos.zillowstatic.com/fp/af2879b7ae8d3fd308a42e3d7bd4d9ba-cc_ft_960.jpg",
  },
  {
    id: "prop-002",
    address: "23711 Redbark Dr, Moreno Valley, CA 92557",
    price: 580000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2004,
    description: "Well-maintained home with open floor plan and finished backyard",
    imageUrl: "https://photos.zillowstatic.com/fp/ef978ff8b90d1ef8b67c261c21f7c639-cc_ft_960.jpg",
  },
  {
    id: "prop-003",
    address: "21250 Tennyson Rd, Moreno Valley, CA 92557",
    price: 689000,
    bedrooms: 5,
    bathrooms: 3,
    sqft: 2567,
    description: "Premium property with modern amenities and spacious master suite",
    imageUrl: "https://photos.zillowstatic.com/fp/7af760fc969161baf23204e2bb971ed7-cc_ft_960.jpg",
  },
  {
    id: "prop-004",
    address: "11948 Kevin St, Moreno Valley, CA 92557",
    price: 545000,
    bedrooms: 4,
    bathrooms: 2,
    sqft: 1422,
    description: "Excellent opportunity coming soon in desirable neighborhood",
    imageUrl: "https://photos.zillowstatic.com/fp/8f2f7c71795a5c75b6425cfe0224a7f5-cc_ft_960.jpg",
  },
  {
    id: "prop-005",
    address: "12044 Champlain St, Moreno Valley, CA 92557",
    price: 519900,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1385,
    description: "Charming home with upgraded fixtures and move-in ready condition",
    imageUrl: "https://photos.zillowstatic.com/fp/f20ac8a6e9fdbb0bcf7043b235f9e44a-cc_ft_960.jpg",
  },
  {
    id: "prop-006",
    address: "11820 Bayless St, Moreno Valley, CA 92557",
    price: 575000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1600,
    description: "Modern home with contemporary design and excellent flow",
    imageUrl: "https://photos.zillowstatic.com/fp/PLACEHOLDER-cc_ft_960.jpg",
  },
];

async function generateWithGemini(property: Property, prompt: string): Promise<any> {
  if (!genAI) throw new Error("Gemini API key not set");
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

async function generateWithMistral(property: Property, prompt: string): Promise<any> {
  if (!mistralKey) throw new Error("Mistral API key not set");
  const response = await axios.post("https://api.mistral.ai/v1/chat/completions", {
    model: "mistral-large-latest",
    messages: [{ role: "user", content: prompt }],
  }, {
    headers: { Authorization: `Bearer ${mistralKey}` },
  });
  let text = response.data.choices[0].message.content;
  text = text.replace(/^```json\s*/g, "").replace(/\s*```$/g, "").trim();
  return JSON.parse(text);
}

async function generateWithGroq(property: Property, prompt: string): Promise<any> {
  if (!groqKey) throw new Error("Groq API key not set");
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "gemma-7b-it",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );
    let text = response.data.choices[0].message.content;
    text = text.replace(/^```json\s*/g, "").replace(/\s*```$/g, "").trim();
    return JSON.parse(text);
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(`Groq API error: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

async function generateMarketingContent(
  property: Property
): Promise<GeneratedContent> {
  const provider = getNextProvider();
  console.log(`  Using: ${provider.toUpperCase()}`);

  const prompt = `You are a real estate marketing expert. Analyze this property and its photo, then generate engaging marketing content.

Property Details:
- Address: ${property.address}
- Price: $${property.price.toLocaleString()}
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}
- Square Feet: ${property.sqft.toLocaleString()}
- Description: ${property.description}

CRITICAL INSTRUCTIONS:
1. Analyze the property photo provided to identify specific architectural features, color schemes, and design elements
2. Reference ACTUAL visible features from the photo in all prompts (e.g., "the blue shutters," "the brick facade," "the stone entryway")
3. All prompts MUST be property-specific, not generic
4. Video and image prompts MUST reference what you see in the actual photo

Generate the following in JSON format:
{
  "marketingDescription": "A compelling 2-3 sentence marketing description referencing specific photo features",
  "videoPrompt": "VIEWMAX INSTRUCTION: Detailed video tour prompt that references the ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, and specific architectural features visible in the property photo. Include property address ${property.address}. Describe exact camera movements and specific visible features.",
  "imagePrompt": "VIEWMAX INSTRUCTION: Hero image prompt for ${property.address} that references the style and features seen in the property photo. Must include ${property.bedrooms}-bedroom, ${property.bathrooms}-bathroom home and reference specific colors/materials visible.",
  "voiceoverScript": "A 30-second voiceover for ${property.address} mentioning ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, ${property.sqft.toLocaleString()} square feet, and specific property features from the photo."
}

Ensure all content is PROPERTY-SPECIFIC based on the actual photo. Return ONLY valid JSON.`;

  try {
    let result;
    switch (provider) {
      case "gemini":
        result = await generateWithGemini(property, prompt);
        break;
      case "mistral":
        result = await generateWithMistral(property, prompt);
        break;
      case "groq":
        result = await generateWithGroq(property, prompt);
        break;
    }

    return {
      property,
      marketingDescription: result.marketingDescription,
      videoPrompt: result.videoPrompt,
      imagePrompt: result.imagePrompt,
      voiceoverScript: result.voiceoverScript,
      provider,
    };
  } catch (error: any) {
    console.error(`  ❌ ${provider.toUpperCase()} failed:`, error.message);
    throw error;
  }
}

function generateViewmaxCommand(content: GeneratedContent): string {
  return `viewmax generate --type "property-showcase" \\
  --property-address "${content.property.address}" \\
  --price "$${content.property.price.toLocaleString()}" \\
  --video-prompt "${content.videoPrompt}" \\
  --image-prompt "${content.imagePrompt}" \\
  --voiceover-script "${content.voiceoverScript}"`;
}

async function processZillowListings(): Promise<void> {
  console.log("🚀 Claude + Zillow Automation Tool (Multi-API)");
  console.log("========================================================\n");
  console.log(`📊 Available APIs: ${availableProviders.join(", ").toUpperCase()}`);
  console.log("📊 Processing properties with API rotation...\n");

  const allContent: GeneratedContent[] = [];

  for (const property of mockProperties) {
    try {
      console.log(`🏠 Processing: ${property.address}`);
      const content = await generateMarketingContent(property);
      allContent.push(content);

      console.log(`✅ Generated content for: ${property.address}`);
      console.log(`💰 Price: $${property.price.toLocaleString()}`);
      console.log(
        `📝 Marketing: ${content.marketingDescription.substring(0, 80)}...`
      );
      console.log(`🎬 Video: ${content.videoPrompt.substring(0, 60)}...`);
    } catch (error) {
      console.error(`❌ Error processing ${property.address}:`, error);
    }

    // Add delay between requests to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Output results summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 SUMMARY - Generated Content Ready for Viewmax");
  console.log("=".repeat(60) + "\n");

  for (const content of allContent) {
    console.log(`📍 Property: ${content.property.address}`);
    console.log(`💰 Price: $${content.property.price.toLocaleString()}`);
    console.log(`🤖 Provider: ${content.provider.toUpperCase()}`);
    console.log(`\n📝 Marketing Description:\n   ${content.marketingDescription}`);
    console.log(`\n🎬 Video Generation Prompt:\n   ${content.videoPrompt}`);
    console.log(`\n🖼️  Image Generation Prompt:\n   ${content.imagePrompt}`);
    console.log(`\n🎙️  Voiceover Script:\n   ${content.voiceoverScript}`);
    console.log(`\n✨ Viewmax Command:\n\n${generateViewmaxCommand(content)}\n`);
    console.log("-".repeat(60) + "\n");
  }

  console.log(
    `\n✅ Successfully generated content for ${allContent.length} properties!`
  );
  console.log(
    "Next step: Use the Viewmax MCP commands above to generate videos, images, and voiceovers."
  );
}

// Run the automation
processZillowListings().catch(console.error);
