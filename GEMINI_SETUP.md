# Google Gemini FREE Setup Guide

This tool uses **Google Gemini Flash 3.0** - completely free, no credit card required!

## Why Google Gemini?

✅ **100% FREE** - No credit card, no billing  
✅ **Fast** - Gemini 2.0 Flash is one of the fastest models  
✅ **Powerful** - Excellent at text generation and analysis  
✅ **Generous** - Free tier has high request quotas  
✅ **Easy** - Simple API key setup  

## Step-by-Step Setup

### Step 1: Get Your Free API Key (2 minutes)

1. Go to: **https://aistudio.google.com/app/apikey**
2. Click **"Create API key"**
3. Select your project (or create a new one)
4. Copy your API key
5. Done! No credit card needed

### Step 2: Set Environment Variable

```bash
export GOOGLE_API_KEY=your_copied_api_key_here
```

Or add to your `.bashrc` or `.zshrc`:
```bash
echo 'export GOOGLE_API_KEY=your_api_key_here' >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Install Dependencies

```bash
cd ~/Projects/claude-zillow-automation
npm install
```

### Step 4: Run the Tool

```bash
npm run dev
```

That's it! You're using a free AI model to generate real estate marketing content.

## Using the Demo (No Setup Required)

Want to see what it does without getting an API key first?

```bash
npx tsx src/demo.ts
```

## Free Tier Limits

Google Gemini API free tier includes:

- ✅ **60 requests per minute** - More than enough for batch processing
- ✅ **1.5M tokens per day** - Thousands of properties per day
- ✅ **No credit card** - Truly free
- ✅ **No expiration** - Use indefinitely

For most real estate automation workflows, this is plenty!

## FAQ

### Q: Do I need a credit card?
**A:** No! The free tier is completely unrestricted - no credit card required.

### Q: How many properties can I process per day?
**A:** With the free tier, you can process ~1000-2000 properties per day (depending on property description length).

### Q: Can I upgrade to paid if I need more?
**A:** Yes, you can add billing anytime if you need higher limits. But for most use cases, free is enough.

### Q: Is the API key safe to share?
**A:** No, keep your API key secret. It's like a password. Treat it with the same security as any credential.

### Q: What if I exceed the free tier limits?
**A:** Your requests will be rate-limited. Upgrade your account to increase limits.

## Model Used

- **Model:** `gemini-2.0-flash`
- **Speed:** Ultra-fast inference
- **Cost:** Free
- **Performance:** Excellent for marketing copy generation

## Troubleshooting

### "GOOGLE_API_KEY not set"
```bash
export GOOGLE_API_KEY=your_key_here
npm run dev
```

### "Failed to parse Gemini response"
- Make sure your API key is valid
- Check that you're under rate limits (60 req/min)
- Try again after a few seconds

### "Permission denied / Invalid API key"
- Go back to https://aistudio.google.com/app/apikey
- Make sure you copied the full key
- Try creating a new key

## Upgrading to Paid (Optional)

If you hit the free tier limits and want more capacity:

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Set up billing
3. Your limits automatically increase to paid tiers

But honestly, for real estate automation, free is usually enough!

## API Documentation

Full Google Gemini API docs:
https://ai.google.dev/gemini-api/docs

## Cost Comparison

| Model | Cost | Speed | Quality |
|-------|------|-------|---------|
| Gemini Flash (Free) | FREE | ⚡⚡⚡ Fast | ✅ Excellent |
| Claude | $3-20 per 1M tokens | ⚡⚡ Medium | ✅ Excellent |
| GPT-4o | $5-15 per 1M tokens | ⚡ Slower | ✅ Excellent |

**Winner for this use case: Google Gemini (FREE!) 🏆**

## Example Run

```bash
$ export GOOGLE_API_KEY=AIzaSy...
$ npm run dev

🚀 Claude + Zillow Automation Tool (Google Gemini - FREE)
========================================================

📊 Processing properties with Google Gemini 2.0 Flash + Viewmax MCP...

🏠 Processing: 123 Oak Street, San Francisco, CA 94102
✅ Generated content for: 123 Oak Street, San Francisco, CA 94102
💰 Price: $1,500,000
📝 Marketing: Charming Victorian gem in prestigious Pacific Heights! ...
🎬 Video: Create a cinematic property showcase video starting ...

[... more properties ...]

✅ Successfully generated content for 3 properties!
Next step: Use the Viewmax MCP commands above to generate videos, images, and voiceovers.
```

## Ready? Start Here!

```bash
# 1. Get free API key (2 min)
# 👉 https://aistudio.google.com/app/apikey

# 2. Set it
export GOOGLE_API_KEY=your_key_here

# 3. Run
cd ~/Projects/claude-zillow-automation
npm run dev

# 4. Deploy generated content to Zillow!
```

**That's it! You're automating real estate marketing for FREE! 🚀**
