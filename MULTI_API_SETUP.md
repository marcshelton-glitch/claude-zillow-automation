# Multi-API Setup Guide

This tool now supports **automatic rotation** through 3 different FREE APIs to avoid rate limits.

## Available APIs

| API | Free Tier | Speed | Setup |
|-----|-----------|-------|-------|
| **Google Gemini** | 20 requests/day | ⚡⚡ | 2 min |
| **Mistral** | Very generous | ⚡⚡ | 3 min |
| **Groq** | Practically unlimited | ⚡⚡⚡ | 2 min |

## How It Works

The tool automatically rotates through available APIs:
- Property 1 → Gemini
- Property 2 → Mistral  
- Property 3 → Groq
- Property 4 → Gemini (cycles back)
- etc.

This spreads requests across APIs so **you never hit rate limits**!

---

## Setup Instructions

### 1️⃣ Google Gemini (Keep Existing)

You already have this! It's already in `~/.zshrc`:
```bash
export GOOGLE_API_KEY=your_key_here
```

**Get key:** https://aistudio.google.com/app/apikey

---

### 2️⃣ Mistral AI (NEW)

**Get free API key:**
1. Go to https://console.mistral.ai/api-keys
2. Click "Create API Key"
3. Copy the key

**Add to shell:**
```bash
export MISTRAL_API_KEY=your_mistral_key_here
```

**Add to `~/.zshrc`:**
```bash
echo 'export MISTRAL_API_KEY=your_mistral_key_here' >> ~/.zshrc
source ~/.zshrc
```

**Free tier limits:** Very generous (perfect for this use case)

---

### 3️⃣ Groq (NEW - RECOMMENDED)

**Why Groq?**
- ⚡ **Fastest inference** - extremely fast responses
- 💰 **Unlimited free tier** - no hard quota
- 🔥 **Best for batch processing** - ideal for multiple properties

**Get free API key:**
1. Go to https://console.groq.com/keys
2. Click "Create API Key"  
3. Copy the key

**Add to shell:**
```bash
export GROQ_API_KEY=your_groq_key_here
```

**Add to `~/.zshrc`:**
```bash
echo 'export GROQ_API_KEY=your_groq_key_here' >> ~/.zshrc
source ~/.zshrc
```

---

## Complete Setup (All 3 APIs)

Add all three to `~/.zshrc`:

```bash
# Google Gemini
export GOOGLE_API_KEY=your_gemini_key_here

# Mistral
export MISTRAL_API_KEY=your_mistral_key_here

# Groq
export GROQ_API_KEY=your_groq_key_here
```

Then reload:
```bash
source ~/.zshrc
```

---

## Verify Setup

Check which APIs are available:
```bash
cd ~/Projects/claude-zillow-automation
npm run dev
```

Output will show:
```
📊 Available APIs: GEMINI, MISTRAL, GROQ
🤖 Using: GEMINI (for property 1)
🤖 Using: MISTRAL (for property 2)
🤖 Using: GROQ (for property 3)
```

---

## Bandwidth Comparison

**Before (Gemini only):**
- 6 properties = hits quota in 1 day ❌

**After (3 APIs):**
- 6 properties = 1 API per property ✅
- Can do 20 properties/day with no limits ✅
- Can do 120+ properties/month indefinitely ✅

---

## Troubleshooting

### "Error: No API keys configured!"
Missing all API keys. Add at least one:
```bash
export GOOGLE_API_KEY=key_here
source ~/.zshrc
```

### "Using: MISTRAL" but want GROQ first
The rotation cycles through APIs in order. Just run again and it'll use the next API.

### API returns 401 Unauthorized
- Check your API key is correct
- Make sure there are no trailing spaces
- Regenerate a new key from the console

---

## Minimal Setup (Just Need One More?)

If you only want to add one more API to Gemini, **choose Groq**:
- Fastest
- Most reliable
- Unlimited free tier

```bash
# Just add Groq
export GROQ_API_KEY=your_key_here
source ~/.zshrc
npm run dev
```

Now you have unlimited capacity! 🚀

---

## Next Step

Set up your API keys and run:
```bash
npm run dev
```

The tool will automatically rotate through all available APIs! 🔄
