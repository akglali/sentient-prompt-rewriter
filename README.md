# Sentient Prompt Rewriter (Browser Extension)

A simple Chrome/Edge extension that takes any text you select and rewrites it into a **cleaner, AI-ready prompt** using the [Sentient Dobby model](https://sentientfoundation.ai/).

---

## 🚀 Features
- Right-click → “Rewrite with Dobby”
- Popup window with input/output boxes
- Configurable API endpoint (defaults to our demo proxy at `https://api.sentient-rewrite.xyz/rewrite`)
- Copy button for quick use in other apps
- Works in Chrome and Edge (Manifest V3)

---

## 🔧 Installation

### 1. Clone this repo
```bash
git clone https://github.com/YOURUSERNAME/sentient-prompt-rewriter.git
cd sentient-prompt-rewriter/extension
```

### 2. Load in Chrome/Edge

#### 1. Open chrome://extensions/ (or edge://extensions/)
#### 2. Enable Developer mode
#### 3. Click Load unpacked
#### 4. Select the extension/ folder

 - The extension icon will appear in your toolbar.

## 🖱 Usage

#### 1. Select any text on a webpage
#### 2. Right-click → Rewrite with Dobby
#### 3. Or open the popup, paste text, and click Rewrite
#### 4. Output appears in the popup — copy with one click

## ⚙️ Configuration

- Open the popup → scroll to Endpoint field
- Default: https://api.sentient-rewrite.xyz/rewrite
- You can replace this with your own proxy server URL if you deploy one

🔒 The extension does not store any API keys locally. All requests are routed through a backend proxy.

## 📦 Optional: Run your own proxy

- A lightweight Node.js proxy is included in server/. This keeps your Fireworks API key safe (never expose it in extension code).

### To deploy your own server:
- Copy server.mjs
- Add .env with your FIREWORKS_API_KEY and MODEL_ID (check example.env)
- Run via Node or Docker, or put behind Nginx with TLS
