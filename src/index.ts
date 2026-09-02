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

interface ContentResult {
  marketingDescription?: string;
  videoPrompt?: string;
  imagePrompt?: string;
  voiceoverScript?: string;
}

interface GeneratedContent {
  property: Property;
  marketingDescription: string;
  videoPrompt: string;
  imagePrompt: string;
  voiceoverScript: string;
  provider: string;
}

const PROVIDER = "mistral";

const mistralKey = process.env.MISTRAL_API_KEY;

if (!mistralKey) {
  console.error("❌ Error: MISTRAL_API_KEY not configured!");
  console.error("Get a free API key at: https://console.mistral.ai/api-keys");
  console.error("Then run: export MISTRAL_API_KEY=your_key_here");
  process.exit(1);
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

function cleanJsonResponse(text: string): string {
  return text.replace(/^```json\s*/g, "").replace(/\s*```$/g, "").trim();
}

function validateContentResult(result: unknown): ContentResult {
  if (!result || typeof result !== "object") {
    throw new Error("Invalid response: expected an object");
  }

  const obj = result as Record<string, unknown>;
  const validated: ContentResult = {};

  if (typeof obj.marketingDescription === "string") {
    validated.marketingDescription = obj.marketingDescription;
  }
  if (typeof obj.videoPrompt === "string") {
    validated.videoPrompt = obj.videoPrompt;
  }
  if (typeof obj.imagePrompt === "string") {
    validated.imagePrompt = obj.imagePrompt;
  }
  if (typeof obj.voiceoverScript === "string") {
    validated.voiceoverScript = obj.voiceoverScript;
  }

  if (!validated.marketingDescription || !validated.videoPrompt || !validated.imagePrompt || !validated.voiceoverScript) {
    throw new Error("Response missing required fields: marketingDescription, videoPrompt, imagePrompt, voiceoverScript");
  }

  return validated as Required<ContentResult>;
}

async function generateWithMistral(prompt: string): Promise<ContentResult> {
  try {
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-large-latest",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: { Authorization: `Bearer ${mistralKey}` },
        timeout: 30000,
      }
    );

    const text = cleanJsonResponse(response.data.choices[0].message.content);
    const parsed = JSON.parse(text);
    return validateContentResult(parsed);
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(`Mistral API error: ${JSON.stringify(error.response.data)}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse JSON response: ${error.message}`);
    }
    throw error;
  }
}

function buildMarketingPrompt(property: Property): string {
  return `You are a real estate marketing expert. Generate engaging marketing content for this property.

Property Details:
- Address: ${property.address}
- Price: $${property.price.toLocaleString()}
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}
- Square Feet: ${property.sqft.toLocaleString()}
- Description: ${property.description}

INSTRUCTIONS:
1. All content MUST be specific to this property, not generic
2. Reference the actual bedroom/bathroom count, square footage, and description details
3. Video and image prompts should be detailed enough for a media generation tool to act on

Generate the following in JSON format:
{
  "marketingDescription": "A compelling 2-3 sentence marketing description",
  "videoPrompt": "VIEWMAX INSTRUCTION: Detailed video tour prompt that references the ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, and the property's described features. Include property address ${property.address}. Describe camera movements and highlighted features.",
  "imagePrompt": "VIEWMAX INSTRUCTION: Hero image prompt for ${property.address}. Must reference the ${property.bedrooms}-bedroom, ${property.bathrooms}-bathroom home and its described style.",
  "voiceoverScript": "A 30-second voiceover for ${property.address} mentioning ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, ${property.sqft.toLocaleString()} square feet, and key property features."
}

Return ONLY valid JSON, with no markdown code fences.`;
}

async function generateMarketingContent(
  property: Property
): Promise<GeneratedContent> {
  console.log(`  Using: ${PROVIDER.toUpperCase()}`);

  const prompt = buildMarketingPrompt(property);

  try {
    const result = await generateWithMistral(prompt);

    return {
      property,
      marketingDescription: result.marketingDescription!,
      videoPrompt: result.videoPrompt!,
      imagePrompt: result.imagePrompt!,
      voiceoverScript: result.voiceoverScript!,
      provider: PROVIDER,
    };
  } catch (error: any) {
    console.error(`  ❌ ${PROVIDER.toUpperCase()} failed:`, error.message);
    throw error;
  }
}

function escapeShellArg(value: string): string {
  return value.replace(/(["\\$`])/g, "\\$1");
}

function generateViewmaxCommand(content: GeneratedContent): string {
  return `viewmax generate --type "property-showcase" \\
  --property-address "${escapeShellArg(content.property.address)}" \\
  --price "$${content.property.price.toLocaleString()}" \\
  --video-prompt "${escapeShellArg(content.videoPrompt)}" \\
  --image-prompt "${escapeShellArg(content.imagePrompt)}" \\
  --voiceover-script "${escapeShellArg(content.voiceoverScript)}"`;
}

async function processZillowListings(): Promise<void> {
  console.log("🚀 Claude + Zillow Automation Tool");
  console.log("========================================================\n");
  console.log("📊 Processing properties...\n");

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
