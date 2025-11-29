# LeHalo Logo & Favicon Setup

## Upload Your Logo Files

To use your LeHalo logo (the glowing yellow-gold "LeHalo" text with halo graphic), you need to upload two image files:

### 1. Logo File: `lehalo-logo.png`
- **Location:** `C:\lehalo\assets\lehalo-logo.png`
- **Recommended Size:** 600x200px or similar aspect ratio (width should be about 3x the height)
- **Format:** PNG with transparency
- **Usage:** Displayed on the homepage hero section and navigation bar
- **Description:** The full "LeHalo" logo with halo graphic above the 'L'

### 2. Favicon/Icon File: `lehalo-icon.png`
- **Location:** `C:\lehalo\assets\lehalo-icon.png`
- **Recommended Sizes:** 
  - 32x32px (standard favicon)
  - 64x64px (high-DPI displays)
  - 180x180px (Apple touch icon)
- **Format:** PNG with transparency
- **Usage:** Browser tab favicon, bookmarks, app icons
- **Description:** A square version of the logo, ideally just the halo or a simplified "LH" monogram

## How to Upload

1. **Save your logo image** as `lehalo-logo.png`
2. **Save your favicon image** as `lehalo-icon.png`
3. **Copy both files** to the `C:\lehalo\assets\` folder
4. **Replace** the existing placeholder files if they exist
5. **Refresh your browser** to see the new logo

## Image Specifications

### Logo (lehalo-logo.png)
- **Background:** Transparent or matches your site background
- **Text Color:** Glowing yellow-gold (#F4D23D or similar)
- **Halo Graphic:** Yellow-gold, positioned above the 'L'
- **Style:** Clean, modern, with glow effect

### Favicon (lehalo-icon.png)
- **Background:** Transparent
- **Content:** Simplified version - halo graphic or "LH" monogram
- **Color:** Yellow-gold to match logo
- **Style:** Recognizable at small sizes (32x32px)

## Current Status

✅ All HTML files are configured to use:
- `/assets/lehalo-logo.png` for the main logo
- `/assets/lehalo-icon.png` for the favicon

The files are referenced in:
- `ui/index.html` (homepage)
- `ui/browser.html` (browser interface)
- `ui/error.html` (error page)
- `ui/proxy.html` (legacy proxy page)

## Fallback

If the logo files are missing, the site will:
- Display "LeHalo" as text in the navigation and hero sections
- Use a default icon for the favicon

Once you upload the actual logo files, they will automatically be used throughout the site!

