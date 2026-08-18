# Complete Usage Guide

## Overview

This tool automates real estate marketing by:
1. Taking property data (address, price, beds, baths, sqft, description)
2. Using Google Gemini AI to generate professional marketing content
3. Creating Viewmax MCP commands to generate videos, images, and voiceovers
4. Outputting everything ready to deploy to Zillow

**Cost:** Completely FREE using Google's Gemini API free tier.

---

## Quick Start (You're Already Done!)

Your API key is already set in `~/.zshrc`. Just run:

```bash
cd ~/Projects/claude-zillow-automation
npm run dev
```

---

## What Happens When You Run It

### Step 1: Input
The tool loads 3 sample properties:
- 123 Oak Street, San Francisco, CA - Victorian, $1.5M
- 456 Maple Avenue, Los Angeles, CA - Luxury, $2.2M
- 789 Pine Ridge Road, Austin, TX - Modern, $850K

### Step 2: AI Generation
For each property, Google Gemini generates:
- **Marketing Description** - Compelling 2-3 sentence listing copy
- **Video Prompt** - Detailed scene-by-scene directions for video generation
- **Image Prompt** - Photography specifications for hero images
- **Voiceover Script** - 30-second narration for property videos

### Step 3: Output
The tool outputs:
- Formatted marketing content for each property
- Ready-to-execute Viewmax commands
- Instructions for next steps

---

## Understanding the Output

```
✨ VIEWMAX COMMAND:

viewmax generate \
  --type "property-showcase" \
  --property-address "123 Oak Street, San Francisco, CA 94102" \
  --price "$1,500,000" \
  --video-prompt "A cinematic, 4K property tour..." \
  --image-prompt "A stunning architectural hero photograph..." \
  --voiceover-script "Welcome to 123 Oak Street..."
```

This command tells Viewmax MCP to:
1. Generate a professional property showcase video
2. Create a hero image
3. Produce a voiceover narration

---

## How to Customize It

### Option A: Change Sample Properties
Edit `src/index.ts` and modify the `mockProperties` array:

```typescript
const mockProperties: Property[] = [
  {
    id: "prop-001",
    address: "456 Your Street, Your City, ST 12345",
    price: 950000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    description: "Your property description here",
    imageUrl: "https://example.com/image.jpg",
  },
  // Add more properties...
];
```

Then run:
```bash
npm run dev
```

### Option B: Add Real Zillow Integration
Currently, the tool uses sample data. To integrate with real Zillow data:

1. Get Zillow API access (rapidapi.com has free tier)
2. Modify the property fetching in `src/index.ts`
3. Replace `mockProperties` with API call

Example:
```typescript
async function fetchZillowListings(zipcode: string): Promise<Property[]> {
  // Fetch from Zillow API
  // Transform into Property objects
  // Return array
}
```

---

## Full Workflow: From Property to Zillow

### 1. **Generate Content** (What You Just Did ✅)
```bash
npm run dev
```
Output: Marketing descriptions, video/image/voiceover prompts

### 2. **Generate Media with Viewmax**
Copy a Viewmax command and run:
```bash
viewmax generate \
  --type "property-showcase" \
  --property-address "123 Oak Street, San Francisco, CA 94102" \
  --price "$1,500,000" \
  --video-prompt "A cinematic, 4K property tour..." \
  --image-prompt "A stunning architectural hero photograph..." \
  --voiceover-script "Welcome to 123 Oak Street..."
```

This generates:
- 📹 Professional video tour (MP4)
- 🖼️ Hero image (JPG/PNG)
- 🎙️ Voiceover audio (MP3)

### 3. **Upload to Zillow**
1. Go to your Zillow listing
2. Upload the generated:
   - Video → Property video section
   - Image → Hero/primary image
   - Voiceover → Audio narration (if supported)
3. Update listing with generated marketing description
4. Publish!

### 4. **Repeat for More Properties**
```bash
# Edit src/index.ts to add more properties
npm run dev

# For each property, run viewmax command
# Upload results to Zillow
# 💰 Watch leads roll in
```

---

## Example: Real Usage Scenario

### Scenario: You Have 10 Properties to Market

**Step 1: Prepare Property Data**
```typescript
// Add all 10 properties to mockProperties in src/index.ts
```

**Step 2: Generate All Marketing Content**
```bash
npm run dev
```
Output: Marketing copy + Viewmax commands for all 10 properties

**Step 3: Generate Media for Each**
```bash
# Property 1
viewmax generate --type "property-showcase" --property-address "..." ...

# Property 2
viewmax generate --type "property-showcase" --property-address "..." ...

# ... repeat for all 10
```

**Step 4: Upload to Zillow**
- For each property, upload video, image, description
- Takes ~5 minutes per property
- Total time: 50 minutes for 10 properties

**Result:** 10 professionally marketed listings, all automated, zero marketing budget beyond your time.

---

## Pricing & Cost Comparison

### This Tool (FREE 🎉)
- Google Gemini: $0 (free tier)
- Viewmax MCP: Depends on your setup (can be free)
- Total: **$0-minimal**

### Traditional Marketing
- Professional photographer: $300-500 per property
- Video production: $500-2000 per property
- Copywriting: $100-300 per property
- **Total per property: $900-2800**

**Savings:** For 10 properties: **$9,000-28,000**

---

## Troubleshooting

### "API Key Not Set"
```bash
# Verify it's set
echo $GOOGLE_API_KEY

# If empty, set it temporarily
export GOOGLE_API_KEY=your_key_here
npm run dev

# Or reload shell config
source ~/.zshrc
```

### "Model Not Available"
Google occasionally deprecates older models. Update `src/index.ts`:
```typescript
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
```

### "Service Unavailable (503)"
Google API is experiencing high demand. Just try again in a few seconds.

### "Failed to Parse Response"
Gemini returned unexpected format. Usually temporary. Try again.

---

## Next Steps

1. **Test with your own properties:**
   - Edit `src/index.ts`
   - Add your properties
   - Run `npm run dev`

2. **Generate actual media:**
   - Copy Viewmax commands
   - Run them to create videos/images

3. **Deploy to Zillow:**
   - Upload marketing materials
   - Update listings with AI-generated copy

4. **Scale up:**
   - Integrate real Zillow API
   - Batch process 50+ properties
   - Automate uploads

---

## Questions?

- **Setup issues?** → See `GEMINI_SETUP.md`
- **API questions?** → See `README.md`
- **Integration?** → See `INTEGRATION.md`
- **Architecture?** → See code comments in `src/index.ts`

**You're all set! 🚀**
