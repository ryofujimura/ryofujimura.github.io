# Resume Website

A clean, modern resume website built with HTML and Tailwind CSS featuring smooth scroll animations.

## Features

- **10 Text Blocks**: Professional resume sections with placeholder content
- **Tailwind CSS**: Modern styling with responsive design
- **Scroll Animations**: Smooth fade-in animations triggered on scroll
- **Interactive Elements**: Click animations and hover effects
- **Mobile Responsive**: Optimized for all device sizes

## Animation Details

The website uses custom CSS animations for the resume lines:

```css
.resume-line {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
    will-change: opacity, transform;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    display: block;
}

.resume-line.animated {
    opacity: 1;
    transform: translateY(0);
}
```

## Usage

1. Open `index.html` in a web browser
2. Scroll to see the animations trigger
3. Click on any section for additional interaction

## Structure

- `index.html` - Main website file
- `README.md` - Project documentation

## Technologies

- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- CSS3 Animations 