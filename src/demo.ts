// Demo version showing the full output without API key requirement

interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
}

interface GeneratedContent {
  property: Property;
  marketingDescription: string;
  videoPrompt: string;
  imagePrompt: string;
  voiceoverScript: string;
}

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
  },
  {
    id: "prop-002",
    address: "456 Maple Avenue, Los Angeles, CA 90012",
    price: 2200000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    description: "Contemporary luxury home with smart home features and pool",
  },
  {
    id: "prop-003",
    address: "789 Pine Ridge Road, Austin, TX 78704",
    price: 850000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    description: "Modern home in established neighborhood near downtown",
  },
];

// Demo-generated content (what Claude would generate)
const demoContent: GeneratedContent[] = [
  {
    property: mockProperties[0],
    marketingDescription:
      "Charming Victorian gem in prestigious Pacific Heights! This meticulously restored 3-bed, 2-bath beauty showcases original hardwood floors, soaring ceilings, and premium modern amenities. Perfect for discerning buyers seeking classic elegance with contemporary comfort.",
    videoPrompt:
      "Create a cinematic property showcase video starting with an aerial drone shot of the Victorian house, pan down to the front entrance, walk through the elegant foyer with original hardwood floors, showcase the bright living areas with modern updates, highlight the chef's kitchen, beautiful bedrooms, and finish with a sunset view from the back patio. Include smooth transitions and upbeat background music.",
    imagePrompt:
      "Professional real estate photograph of a stunning Victorian home at golden hour, featuring the grand facade with bay windows, manicured front garden, warm lighting from interior windows, professional color grading, shot from street level with slight upward angle to emphasize architectural details",
    voiceoverScript:
      "Welcome to 123 Oak Street, a rare Victorian treasure in San Francisco's most desirable neighborhood. This three-bedroom, two-bath home features original hardwood floors and seamless modern updates. From the elegant foyer to the chef's kitchen and spacious bedrooms, every detail exudes character and sophistication. The serene back patio offers the perfect retreat. Listed at 1.5 million. Your dream home awaits.",
  },
  {
    property: mockProperties[1],
    marketingDescription:
      "Luxury redefined! This stunning 4-bed, 3-bath contemporary masterpiece features state-of-the-art smart home technology, resort-style pool, and floor-to-ceiling windows framing breathtaking views. The epitome of modern California living.",
    videoPrompt:
      "Produce a luxury property video opening with an aerial drone shot of the modern house and sparkling pool, transition to exterior showcase highlighting architecture and landscaping, move through elegant entry, showcase open-concept living spaces with smart home displays, feature the gourmet kitchen with professional appliances, tour bedrooms and spa-like bathrooms, highlight the resort pool and outdoor entertainment area, finish with sunset over the valley",
    imagePrompt:
      "Ultra-modern luxury home photography at dusk, featuring illuminated contemporary architecture, sparkling infinity pool in foreground, interior warm lighting visible through floor-to-ceiling windows, professional real estate photography, HDR processing, shot from elevated position showing landscaping and surrounding views",
    voiceoverScript:
      "Presenting unparalleled luxury in the heart of Los Angeles. This four-bedroom, three-bath contemporary estate features cutting-edge smart home integration, a resort-quality swimming pool, and panoramic city views. Every room flows seamlessly through floor-to-ceiling windows, natural light, and premium finishes. The chef's kitchen opens to entertainer's lounge. Five thousand square feet of pure sophistication. Welcome home to 456 Maple Avenue.",
  },
  {
    property: mockProperties[2],
    marketingDescription:
      "Smart living in vibrant Austin! This modern 3-bed, 2-bath home perfectly balances style and functionality. Walk to downtown restaurants and entertainment, or relax in your contemporary retreat. Austin lifestyle starts here.",
    videoPrompt:
      "Create an engaging property video showcasing the modern Austin home, starting with street-level approach, highlight clean contemporary architecture, tour the open-concept living and kitchen area, showcase three bedrooms with natural lighting, feature the updated bathrooms, show the backyard entertaining space, include neighborhood walk-through showing proximity to downtown Austin restaurants and entertainment, vibrant neighborhood feel",
    imagePrompt:
      "Modern contemporary home in Austin, bright midday photography, clean architectural lines, native landscaping, street-level shot with downtown skyline visible in background, professional real estate photography, warm natural tones reflecting Austin's vibrant character",
    voiceoverScript:
      "Discover modern living in one of Austin's hottest neighborhoods. This three-bedroom, two-bath contemporary home offers sixteen hundred square feet of sophisticated comfort. Open-concept design, energy-efficient features, and stylish finishes throughout. Located just minutes from downtown's best restaurants, live music venues, and cultural attractions. Your Austin adventure awaits at 789 Pine Ridge Road.",
  },
];

function generateViewmaxCommand(content: GeneratedContent): string {
  return `viewmax generate \\
  --type "property-showcase" \\
  --address "${content.property.address}" \\
  --price $${content.property.price.toLocaleString()} \\
  --beds ${content.property.bedrooms} \\
  --baths ${content.property.bathrooms} \\
  --sqft ${content.property.sqft} \\
  --video-prompt "${content.videoPrompt}" \\
  --image-prompt "${content.imagePrompt}" \\
  --voiceover-script "${content.voiceoverScript}"`;
}

async function main() {
  console.log("🚀 Claude + Zillow Automation Tool (Demo)");
  console.log("=========================================\n");
  console.log(
    "📊 Demonstrating automated real estate marketing content generation...\n"
  );

  console.log("=" + "=".repeat(59));
  console.log("📋 GENERATED CONTENT - Ready for Viewmax MCP");
  console.log("=" + "=".repeat(59) + "\n");

  for (const content of demoContent) {
    console.log(`📍 PROPERTY: ${content.property.address}`);
    console.log(`💰 PRICE: $${content.property.price.toLocaleString()}`);
    console.log(
      `🏠 SIZE: ${content.property.bedrooms} bed, ${content.property.bathrooms} bath | ${content.property.sqft.toLocaleString()} sqft\n`
    );

    console.log(`📝 MARKETING DESCRIPTION:`);
    console.log(`   "${content.marketingDescription}"\n`);

    console.log(`🎬 VIDEO GENERATION PROMPT:`);
    console.log(`   "${content.videoPrompt}"\n`);

    console.log(`🖼️  IMAGE GENERATION PROMPT:`);
    console.log(`   "${content.imagePrompt}"\n`);

    console.log(`🎙️  VOICEOVER SCRIPT (30 seconds):`);
    console.log(`   "${content.voiceoverScript}"\n`);

    console.log(`✨ VIEWMAX COMMAND:`);
    console.log(`${generateViewmaxCommand(content)}\n`);

    console.log("-" + "-".repeat(59) + "\n");
  }

  console.log("=" + "=".repeat(59));
  console.log("✅ SUMMARY");
  console.log("=" + "=".repeat(59));
  console.log(
    `\n✓ Generated marketing content for ${demoContent.length} properties`
  );
  console.log(`✓ Each property has 4 content pieces:`);
  console.log(`  - Marketing Description (for listing)`);
  console.log(`  - Video Generation Prompt (for Viewmax)`);
  console.log(`  - Image Generation Prompt (for Viewmax)`);
  console.log(`  - Voiceover Script (for Viewmax audio)\n`);
  console.log(`🔄 WORKFLOW:`);
  console.log(`  1. Feed property data → Claude API`);
  console.log(`  2. Claude generates prompts → Viewmax MCP`);
  console.log(`  3. Viewmax creates media → Marketing materials`);
  console.log(`  4. Materials → Real estate platforms → Sales! 💰\n`);
  console.log(
    `📚 Ready to connect to the real Mistral API and Viewmax MCP? Set MISTRAL_API_KEY and run: npm run dev`
  );
}

main();
