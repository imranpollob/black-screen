<div align="center">
  <h1>Black Screen Online</h1>
  <p><strong>A minimal, distraction-free black screen utility with ambient clock, focus notes, and screen calibration presets.</strong></p>

  <p>
    <a href="https://imranpollob.github.io/black-screen-online/"><img src="https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-0d9488?style=flat-square" alt="Live Demo on GitHub Pages" /></a>
    <img src="https://img.shields.io/badge/License-MIT-042f2e?style=flat-square" alt="MIT License" />
    <img src="https://img.shields.io/badge/PWA-Ready-14b8a6?style=flat-square" alt="PWA Ready" />
  </p>
</div>

---

## 🌐 Live Website

- **GitHub Pages**: [https://imranpollob.github.io/black-screen-online/](https://imranpollob.github.io/black-screen-online/)

---

## ✨ Features

- 🖤 **Calibrated Dark & Ash Presets**:
  - **Row 1 (Black to Ash Gradient)**: Pure OLED Black (`#000000`), Dark Ash Charcoal (`#262626`), Medium Ash Gray (`#4b5563`), and Ash Gray (`#808080`).
  - **Row 2 (Deep Ambient Undertones)**: Dark Forest Emerald (`#042f2e`), Midnight Navy (`#0f172a`), Deep Violet (`#3b0764`), and Steel Zinc (`#27272a`).
  - **Custom Color Picker**: Choose any custom HEX or RGB color.
- 🕒 **Ambient Live Clock**: Dimmed 12-hour digital clock in the top corner that softly brightens on hover without disturbing focus.
- ✍️ **Focus Notes / Custom Text**: Click the center display or the pencil icon to type personalized focus goals, reminders, or stream notes.
- ⚡ **Zero Distractions**: Glassmorphic controls fade to low opacity when idle, keeping your screen clean and calm.
- 🌓 **Dynamic Contrast**: UI controls automatically adapt for readability whether you are on pure black, pure white, or vibrant colors.
- ⛶ **One-Touch Fullscreen**: Quickly enter or exit immersive full-screen display mode.
- 💾 **Automatic Persistence**: Remembers your preferred background color and custom text across sessions using `localStorage`.
- 📱 **Progressive Web App (PWA)**: Fullscreen web app manifest configured with icons and offline capability.
- 🔍 **SEO & Accessibility Optimized**: Complete JSON-LD structured data (`WebApplication`, `FAQPage`), Open Graph, Twitter Cards, sitemap, and robots.txt.

---

## ⌨️ Keyboard Shortcuts

| Key              | Action                                           |
| :--------------- | :----------------------------------------------- |
| <kbd>F</kbd>     | Toggle Fullscreen mode                           |
| <kbd>C</kbd>     | Toggle Color & Settings palette popover          |
| <kbd>Enter</kbd> | Save inline custom focus text                    |
| <kbd>Esc</kbd>   | Cancel editing / Close popover / Exit fullscreen |

---

## 🛠️ Common Use Cases

1. **OLED & AMOLED Power Saving**: Turn off pixels completely, cutting display power consumption and extending monitor life.
2. **Monitor Cleaning & Dust Check**: Pure black screen in a well-lit room clearly shows dust specks and fingerprint smudges.
3. **Dead Pixel & Backlight Bleed Inspection**: Cycle through pure black, white, red, green, and blue to test for stuck sub-pixels and backlight bleed.
4. **Tracing & Lightbox Mode**: Select Pure White to turn your tablet or monitor into a clean tracing lightbox.
5. **Dual-Monitor Blackout**: Keep your secondary display dark while working on your primary screen.
6. **Desk Ambient Clock**: Minimalist, clean aesthetic clock for desk setups.

---

## 🚀 How to Run Locally

Open `index.html` directly in any web browser, or launch a local web server:

```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```

Visit `http://localhost:8080` in your browser.

---

## 📦 GitHub Pages Hosting

This repository is pre-configured for GitHub Pages:

1. Go to your repository **Settings** on GitHub.
2. Under **Code and automation**, click **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (powered by `.github/workflows/deploy.yml`), or select **Deploy from a branch** (`master` / `/(root)`).
4. Your site will automatically be published to `https://<username>.github.io/<repo-name>/`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) © Imran Pollob.
