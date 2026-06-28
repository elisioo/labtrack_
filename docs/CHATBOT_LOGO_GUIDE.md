# Chatbot Logo Customization Guide

## How to Add Your Custom Logo

### Step 1: Prepare Your Logo

**Requirements:**
- Format: PNG, JPG, or SVG
- Recommended size: 256x256px (or larger, square ratio)
- Background: Transparent PNG works best
- File size: < 100KB recommended

### Step 2: Add Logo to Assets

1. Place your logo file in `src/assets/` folder
2. Recommended name: `bot-logo.png` (or your preferred name)

Example:
```
src/assets/
├── labtrack-logo.png     (existing)
└── bot-logo.png          (your new chatbot logo)
```

### Step 3: Configure the Chatbot

Open `src/components/Chatbot.tsx` and update the configuration at the top:

```typescript
// ══════════════════════════════════════════════
// LOGO CONFIGURATION
// ══════════════════════════════════════════════

// Import your logo
import botLogo from "@/assets/bot-logo.png";

// Change to "image" to use your logo
const LOGO_TYPE = "image"; // "emoji" or "image"

// Set your logo
const LOGO_IMAGE = botLogo;

// Optional: Change emoji fallback
const LOGO_EMOJI = "🤖";
```

### Step 4: Test

1. Save the file
2. The dev server will auto-reload
3. Open the chatbot to see your logo!

## Configuration Options

### Option 1: Emoji (Default - Current)
```typescript
const LOGO_TYPE = "emoji";
const LOGO_EMOJI = "🤖"; // Change to any emoji you like
```

**Examples:**
- 🤖 Robot
- 🎓 Academic cap (educational)
- 🧪 Test tube (laboratory)
- 💡 Light bulb (helpful)
- 🦾 Mechanical arm (AI)

### Option 2: Custom Image
```typescript
import botLogo from "@/assets/bot-logo.png";

const LOGO_TYPE = "image";
const LOGO_IMAGE = botLogo;
```

## Logo Sizes

The logo appears in two places:

1. **Header Avatar**: 36x36px circle
2. **Toggle Button**: 32x32px (icon size inside 56x56px button)

Your image will be automatically:
- Resized to fit
- Cropped to circle shape
- Centered with `object-fit: cover`

## Tips for Best Results

### For Logo Design:
- ✅ Use a square ratio (1:1)
- ✅ Center the important parts
- ✅ High contrast for visibility
- ✅ Simple design (recognizable at small size)
- ❌ Avoid text (too small to read)
- ❌ Avoid complex details

### Color Recommendations:
Match your LabTrack brand colors:
- Primary: #0d9488 (teal/cyan)
- Accent: Various shades of teal
- Background: White or transparent

### Example Logo Ideas:

**Option A: Simple Icon**
- Laboratory flask icon
- Microscope icon
- Clipboard with checkmark

**Option B: Branded Character**
- Mascot or character
- Robot with school colors
- Friendly assistant

**Option C: Letter Mark**
- "LT" for LabTrack
- "LA" for LabTrack Assistant
- University initials

## Quick Switch Between Emoji and Image

You can easily switch without removing code:

```typescript
// Use emoji:
const LOGO_TYPE = "emoji";

// Use image:
const LOGO_TYPE = "image";
```

## Troubleshooting

### Logo not showing?
1. Check file path is correct
2. Verify file exists in `src/assets/`
3. Make sure import statement matches filename
4. Check browser console for errors

### Logo looks pixelated?
- Use higher resolution image (512x512px or more)
- Use PNG or SVG format
- Ensure original image quality is good

### Logo not centered?
- Make sure image is square (1:1 ratio)
- Use transparent background
- The `object-fit: cover` should center it automatically

## Example Implementation

Here's a complete example:

```typescript
// At the top of Chatbot.tsx

// Import your logo
import botLogo from "@/assets/um-bot-logo.png";

// Configuration
const LOGO_TYPE = "image";
const LOGO_EMOJI = "🎓"; // Fallback emoji
const LOGO_IMAGE = botLogo;

// The component will automatically use your logo!
```

## Need Help?

1. Check that your logo file is in the correct location
2. Verify the import path matches your file name
3. Look at browser console for any errors
4. Try with a simple emoji first to test the setup

---

**Quick Test:**
1. Change `LOGO_EMOJI` to a different emoji (e.g., "🎓")
2. Save and check if it updates
3. If emoji works, your setup is correct for images too!
