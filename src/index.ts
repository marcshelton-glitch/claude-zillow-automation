import { GoogleGenerativeAI } from "@google/generative-ai";

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
}

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Error: GOOGLE_API_KEY environment variable not set");
  console.error(
    "Get a free API key at: https://aistudio.google.com/app/apikey"
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

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
    imageUrl: "https://example.com/prop1.jpg",
  },
  {
    id: "prop-002",
    address: "23711 Redbark Dr, Moreno Valley, CA 92557",
    price: 580000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2004,
    description: "Well-maintained home with open floor plan and finished backyard",
    imageUrl: "https://example.com/prop2.jpg",
  },
  {
    id: "prop-003",
    address: "21250 Tennyson Rd, Moreno Valley, CA 92557",
    price: 689000,
    bedrooms: 5,
    bathrooms: 3,
    sqft: 2567,
    description: "Premium property with modern amenities and spacious master suite",
    imageUrl: "https://example.com/prop3.jpg",
  },
  {
    id: "prop-004",
    address: "11948 Kevin St, Moreno Valley, CA 92557",
    price: 545000,
    bedrooms: 4,
    bathrooms: 2,
    sqft: 1422,
    description: "Excellent opportunity coming soon in desirable neighborhood",
    imageUrl: "https://example.com/prop4.jpg",
  },
  {
    id: "prop-005",
    address: "12044 Champlain St, Moreno Valley, CA 92557",
    price: 519900,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1385,
    description: "Charming home with upgraded fixtures and move-in ready condition",
    imageUrl: "https://example.com/prop5.jpg",
  },
  {
    id: "prop-006",
    address: "11820 Bayless St, Moreno Valley, CA 92557",
    price: 575000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1600,
    description: "Modern home with contemporary design and excellent flow",
    imageUrl: "https://example.com/prop6.jpg",
  },
];

async function generateMarketingContent(
  property: Property
): Promise<GeneratedContent> {
  console.log(`\n🏠 Processing: ${property.address}`);

  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const prompt = `You are a real estate marketing expert. Generate engaging marketing content for this property:

Property Details:
- Address: ${property.address}
- Price: $${property.price.toLocaleString()}
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}
- Square Feet: ${property.sqft.toLocaleString()}
- Description: ${property.description}

Generate the following in JSON format:
{
  "marketingDescription": "A compelling 2-3 sentence marketing description for the listing",
  "videoPrompt": "A prompt for generating a property showcase video using Viewmax (describe what the video should show)",
  "imagePrompt": "A prompt for generating a hero image of the property using Viewmax",
  "voiceoverScript": "A 30-second voiceover script for the property video"
}

Make it engaging, professional, and focus on selling points. Return ONLY valid JSON.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Parse the JSON response
  let generatedData;
  try {
    generatedData = JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse Gemini response:", responseText);
    throw new Error("Invalid JSON response from Gemini");
  }

  return {
    property,
    marketingDescription: generatedData.marketingDescription,
    videoPrompt: generatedData.videoPrompt,
    imagePrompt: generatedData.imagePrompt,
    voiceoverScript: generatedData.voiceoverScript,
  };
}

function generateViewmaxCommand(content: GeneratedContent): string {
  return `
viewmax generate --type "property-showcase" \\
  --property-address "${content.property.address}" \\
  --price "$${content.property.price.toLocaleString()}" \\
  --video-prompt "${content.videoPrompt}" \\
  --image-prompt "${content.imagePrompt}" \\
  --voiceover-script "${content.voiceoverScript}"
  `;
}

async function processZillowListings(): Promise<void> {
  console.log("🚀 Claude + Zillow Automation Tool (Google Gemini - FREE)");
  console.log("========================================================\n");
  console.log(
    "📊 Processing properties with Google Gemini 2.0 Flash + Viewmax MCP...\n"
  );

  const allContent: GeneratedContent[] = [];

  for (const property of mockProperties) {
    try {
      const content = await generateMarketingContent(property);
      allContent.push(content);

      console.log(`✅ Generated content for: ${property.address}`);
      console.log(`💰 Price: $${property.price.toLocaleString()}`);
      console.log(
        `📝 Marketing: ${content.marketingDescription.substring(0, 100)}...`
      );
      console.log(`🎬 Video: ${content.videoPrompt.substring(0, 80)}...`);
    } catch (error) {
      console.error(`❌ Error processing ${property.address}:`, error);
    }
  }

  // Output results summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 SUMMARY - Generated Content Ready for Viewmax");
  console.log("=".repeat(60) + "\n");

  for (const content of allContent) {
    console.log(`📍 Property: ${content.property.address}`);
    console.log(`💰 Price: $${content.property.price.toLocaleString()}`);
    console.log(`\n📝 Marketing Description:`);
    console.log(`   ${content.marketingDescription}`);
    console.log(`\n🎬 Video Generation Prompt:`);
    console.log(`   ${content.videoPrompt}`);
    console.log(`\n🖼️  Image Generation Prompt:`);
    console.log(`   ${content.imagePrompt}`);
    console.log(`\n🎙️  Voiceover Script:`);
    console.log(`   ${content.voiceoverScript}`);
    console.log(`\n✨ Viewmax Command:`);
    console.log(generateViewmaxCommand(content));
    console.log("\n" + "-".repeat(60) + "\n");
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
