# Deployment Guide

## Quick Start

This is a static website that can be deployed to any static hosting service.

## Local Development

1. Clone the repository
2. Open `index.html` in a web browser, or
3. Start a local server:
   ```bash
   python3 -m http.server 8080
   ```
4. Visit `http://localhost:8080`

## Deployment Options

### Netlify

1. Connect your GitHub repository to Netlify
2. Build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
3. Deploy!

### GitHub Pages

1. Go to repository Settings
2. Navigate to Pages section
3. Select branch: `main` or your preferred branch
4. Select folder: `/ (root)`
5. Save

### Vercel

1. Import your GitHub repository
2. Framework Preset: Other
3. Build Command: (leave empty)
4. Output Directory: (leave empty)
5. Deploy!

### AWS S3 + CloudFront

1. Create an S3 bucket
2. Enable static website hosting
3. Upload files: `index.html`, `styles.css`, `script.js`
4. Configure CloudFront for HTTPS
5. Update DNS

## Files Structure

```
athivatech.com/
├── index.html      # Main HTML file
├── styles.css      # All CSS styling
├── script.js       # JavaScript for interactivity
├── README.md       # Project documentation
└── DEPLOYMENT.md   # This file
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Lightweight: ~36KB total (HTML + CSS + JS)
- No external dependencies except Google Fonts
- Fast loading times
- Optimized for SEO

## Customization

### Update Content
Edit the HTML in `index.html` to modify:
- Case studies
- Services
- Company information
- Contact details

### Change Colors
Update CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #ec4899;
}
```

### Add Animations
Modify or extend JavaScript in `script.js`

## Support

For issues or questions, please open an issue in the repository.
