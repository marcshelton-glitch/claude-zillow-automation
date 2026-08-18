# Claude + Zillow Automation Tool

Automatically generate real estate marketing content using Claude AI and Viewmax MCP.

## What This Does

1. **Analyzes Property Listings** - Processes real estate properties
2. **Generates Marketing Content** - Uses Claude to create compelling descriptions
3. **Creates Media Prompts** - Generates instructions for Viewmax to create:
   - Promotional videos
   - Hero images
   - Voiceover scripts

## Features

- 🤖 Claude AI-powered content generation
- 🎬 Viewmax MCP integration for media creation
- 📊 Batch processing of multiple properties
- 💰 Real estate focused marketing copy
- 🔄 Automated workflow from data to content

## Installation

```bash
npm install
```

## Configuration

Set your Claude API key:
```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

## Usage

```bash
npm run dev
```

This will:
1. Load sample Zillow properties
2. Generate marketing descriptions using Claude
3. Create Viewmax prompts for video, image, and voiceover generation
4. Output ready-to-use Viewmax commands

## Output

The tool generates:
- **Marketing Descriptions** - Engaging property descriptions
- **Video Prompts** - Instructions for Viewmax to generate property showcase videos
- **Image Prompts** - Instructions for Viewmax to generate hero images
- **Voiceover Scripts** - 30-second scripts for video narration

## Next Steps

After running the tool:

1. Copy the Viewmax commands from the output
2. Use them to generate actual media files
3. Combine with property listings on Zillow
4. Automate the entire marketing pipeline

## Architecture

```
Property Data
    ↓
Claude API (Generate descriptions & prompts)
    ↓
Viewmax MCP (Generate media)
    ↓
Marketing Materials (Videos, Images, Voiceovers)
    ↓
Automated Real Estate Marketing
```

## API Integration Points

### Claude
- Analyzes property features
- Generates compelling marketing copy
- Creates media generation prompts

### Viewmax MCP
- Generates promotional videos
- Creates property images
- Produces voiceover scripts

## Real-World Use Cases

- **Real Estate Agents** - Automate listing content creation
- **Property Management** - Generate bulk marketing materials
- **Real Estate Platforms** - Enhance listing presentations
- **Investment Analysis** - Quick property showcase generation

## License

MIT
