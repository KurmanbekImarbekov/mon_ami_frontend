# Mon Ami — Premium French Restaurant & Coffee House Landing Page

![Mon Ami](https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80)

A luxury landing page for **Mon Ami**, a French restaurant & coffee house in Bishkek. Designed with an Apple × Dior × Louis Vuitton aesthetic — minimal, elegant, and premium.

## Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, Grid, Flexbox, Glassmorphism
- **Vanilla JavaScript** — No frameworks, clean architecture
- **GSAP** — Scroll animations, parallax, stagger reveals
- **Lenis** — Smooth scrolling
- **AOS** — Scroll reveal animations (fallback)

## Features

### Sections
- ✦ Fullscreen cinematic hero with video background
- ✦ About section with elegant typography
- ✦ Masonry gallery with hover effects
- ✦ Signature menu showcase cards
- ✦ "Why Mon Ami" feature grid
- ✦ Featured coffee section with parallax
- ✦ Testimonials with glassmorphism cards
- ✦ Instagram feed gallery
- ✦ Contact with map placeholder
- ✦ Minimalist footer

### Premium Effects
- ✦ Custom animated cursor (gold ring + dot)
- ✦ Preloader / loading screen
- ✦ Grain overlay for film-like texture
- ✦ Button glow animations
- ✦ Card hover lift effects
- ✦ Image zoom on hover
- ✦ Scroll-triggered reveals (GSAP + AOS)
- ✦ Mouse parallax on hero
- ✦ Floating decorative elements
- ✦ Smooth image loading with blur transition
- ✦ Button ripple effect

### UX
- ✦ EN/RU language switcher (full translation)
- ✦ Reservation modal with form
- ✦ Mobile hamburger menu with animations
- ✦ Smooth scroll navigation
- ✦ Gallery lightbox (keyboard navigable)
- ✦ Fully responsive (360px → 4K)
- ✦ Reduced motion support
- ✦ Print styles

## Color Palette

| Color | Hex |
|-------|-----|
| Background | `#0B0B0B` |
| Cream | `#F5F1EA` |
| Gold | `#C9A86A` |
| White | `#FFFFFF` |

## Typography

- **Playfair Display** — Headings (serif, elegant)
- **Poppins** — Body text (clean, modern)

## Project Structure

```
monami/
├── index.html
├── css/
│   ├── style.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── slider.js
│   └── animations.js
├── assets/
│   ├── images/      (add your images here)
│   ├── videos/      (add hero video here)
│   └── icons/
└── README.md
```

## Getting Started

1. **Clone or download** the project
2. Add your background video to `assets/videos/paris.mp4` (or edit the source in `index.html`)
3. Replace images with actual Mon Ami photos
4. Open `index.html` in a browser (or use Live Server)

### Recommended Hero Video
Download a free Paris cinematic video from:
- [Pexels](https://www.pexels.com/search/videos/paris%20night/)
- [Pixabay](https://pixabay.com/videos/search/paris/)

Place it at `assets/videos/paris.mp4`

## Customization

### Replace Images
All images use Unsplash placeholder URLs. Replace with actual Mon Ami photos by editing `src` attributes in `index.html`.

### Update Contact Info
Edit phone number, address, and Instagram handle in the contact section of `index.html`.

### Language Translations
All text is centralized in `js/main.js` under the `translations` object. Add or modify languages there.

## Performance

- Lazy loading images
- Async script loading
- Optimized animations with GSAP
- Preconnect to Google Fonts
- Responsive image sizes

## Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari / Chrome

## License

For demonstration purposes. Replace all images and content before commercial use.

---

*Designed with ✦ for Mon Ami — Bishkek*