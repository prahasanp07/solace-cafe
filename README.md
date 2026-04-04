# Solace Café — Website

A fully animated, production-ready café website for **Solace Café, Bangalore**.

---

## 📁 Project Structure

```
solace-cafe/
├── index.html          ← Main HTML (all sections)
├── css/
│   └── style.css       ← All styles, variables, animations, responsive
├── js/
│   └── main.js         ← Loader, cursor, parallax, tabs, reveal, count-up
├── assets/             ← Drop your local images/videos here
└── README.md
```

---

## 🚀 How to Run Locally

Just open `index.html` in any modern browser — no build step needed.

```bash
# Option 1: Simple double-click
open index.html

# Option 2: Live Server (VS Code extension recommended)
# Right-click index.html → "Open with Live Server"

# Option 3: Python local server
python3 -m http.server 3000
# Then visit http://localhost:3000
```

---

## 🎨 Key Customisation Points

### CSS Variables (`css/style.css` — top of file)
Change the entire colour palette in one place:
```css
:root {
  --terracotta:  #c2714f;   /* Primary accent */
  --espresso:    #2c1a0e;   /* Dark backgrounds */
  --cream:       #f5efe6;   /* Light backgrounds */
  --gold:        #b8924a;   /* Price / highlight */
  /* ... */
}
```

### Hero Image
In `css/style.css`, find `.hero-bg` and replace the `background` URL:
```css
.hero-bg {
  background: url('assets/your-hero-image.jpg') center/cover no-repeat;
}
```

### Marquee Text
In `index.html`, edit the `.marquee-item` spans to change the rolling text.

### Menu Items
Each item lives in `index.html` inside `#panel-coffee`, `#panel-food`, etc.
To add a new item, copy any `.menu-item` block and update the content.

### Loader Duration
In `js/main.js`, change the `1800` ms value:
```js
setTimeout(() => { ... }, 1800); // milliseconds
```

---

## 📦 Deploy

### Netlify (recommended — free)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the entire `solace-cafe/` folder
3. Done — live in seconds ✅

### Vercel
```bash
npm i -g vercel
cd solace-cafe
vercel
```

### GitHub Pages
Push the folder to a GitHub repo, then enable Pages under Settings → Pages.

---

## 🖼 Replacing Placeholder Images

All images currently use **Unsplash CDN URLs**. To use real Solace Café photos:
1. Add your images to the `assets/` folder
2. In `index.html`, replace `https://images.unsplash.com/...` with `assets/your-image.jpg`

---

## 📱 Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| > 900px | Full desktop layout |
| ≤ 900px | Hamburger nav, single-column sections, hidden accent images |
| ≤ 600px | Smaller hero text, tighter spacing |

---

Built with pure HTML, CSS, and vanilla JS — no frameworks, no dependencies.
