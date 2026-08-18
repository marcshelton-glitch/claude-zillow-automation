import Anthropic from "@anthropic-ai/sdk";

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

const client = new Anthropic();

// Mock Zillow property data
const mockProperties: Property[] = [
  {
    id: "prop-001",
    address: "123 Oak Street, San Francisco, CA 94102",
    price: 1500000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    description:
      "Victorian home with original hardwood floors and modern updates",
    imageUrl: "https://example.com/prop1.jpg",
  },
  {
    id: "prop-002",
    address: "456 Maple Avenue, Los Angeles, CA 90012",
    price: 2200000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    description: "Contemporary luxury home with smart home features and pool",
    imageUrl: "https://example.com/prop2.jpg",
  },
  {
    id: "prop-003",
    address: "789 Pine Ridge Road, Austin, TX 78704",
    price: 850000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    description: "Modern home in established neighborhood near downtown",
    imageUrl: "https://example.com/prop3.jpg",
  },
];

async function generateMarketingContent(
  property: Property
): Promise<GeneratedContent> {
  console.log(`\n🏠 Processing: ${property.address}`);

  // Use Claude to generate marketing content
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

  const message = await client.messages.create({
    model: "claude-opus-4-1-20250805",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Extract the text content from the response
  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Parse the JSON response
  let generatedData;
  try {
    generatedData = JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse Claude response:", responseText);
    throw new Error("Invalid JSON response from Claude");
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
  // This would be the actual command to use Viewmax MCP
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
  console.log("🚀 Claude + Zillow Automation Tool");
  console.log("===================================\n");
  console.log("📊 Processing properties with Claude + Viewmax MCP...\n");

  const allContent: GeneratedContent[] = [];

  for (const property of mockProperties) {
    try {
      const content = await generateMarketingContent(property);
      allContent.push(content);

      console.log(`✅ Generated content for: ${property.address}`);
      console.log(`💰 Price: $${property.price.toLocaleString()}`);
      console.log(`📝 Marketing: ${content.marketingDescription.substring(0, 100)}...`);
      console.log(
        `🎬 Video: ${content.videoPrompt.substring(0, 80)}...`
      );
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
