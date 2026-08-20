# 🐼💕 Secret Birthday Surprise Website for Sadalika

A complete, romantic, interactive, mobile-first birthday surprise web application designed specifically for GitHub Pages.

---

## 🌟 Features Overview

- **Mobile-First Design**: Tailored specifically for scanning via a QR code on smartphones (iPhone & Android).
- **Interactive Unlock Flow**:
  1. **Secret Welcome Screen** ("Hey Beautiful... 💕")
  2. **Multi-Step Question System** (Verifies answers case-insensitively with space trimming)
  3. **Birthday Unlock Celebration** (Confetti, floating balloons, glowing background, and custom popup card)
  4. **Romantic Love Letter** (Cream paper letter card with handwritten styling)
  5. **Interactive Panda Gateway** (Cute animated Bubu panda holding a "CLICK ME 💕" board)
  6. **Memory Gallery & Lightbox Viewer** (Responsive photo/video grid with full-screen viewer)
- **Seamless Continuous Audio**: Plays background music throughout all steps without restarting on screen transitions or modal opens.

---

## 🛠️ How to Customize Your Content

All customization is done inside the top section of `script.js`. Open `script.js` in any text editor:

### 1. Change Personalized Names & Answers
```javascript
const CONFIG = {
    girlfriendName: "Sadalika", // Her name
    pandaName: "Bubu",         // Her panda's name
    hisNameLetter: "A",        // Your name's first letter
    ...
```

### 2. Edit Your Love Letter
In `script.js`, find `loveLetter:` inside `CONFIG`. Replace the text between the backticks `` ` ``:
```javascript
loveLetter: `Write your custom romantic letter here... 💕`,
```

### 3. Add / Replace Photos
1. Copy your photos into the folder: `assets/photos/`
2. Name them `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `photo4.jpg`, etc.
3. Update the `memories` array in `script.js`:
```javascript
memories: [
    {
        type: "image",
        src: "assets/photos/photo1.jpg",
        caption: "Our happy memory ❤️"
    },
    {
        type: "image",
        src: "assets/photos/photo2.jpg",
        caption: "A beautiful smile 💕"
    }
]
```

### 4. Add / Replace Videos
1. Copy your `.mp4` video files into: `assets/videos/`
2. Name it `video1.mp4`
3. Add a video entry to `memories` in `script.js`:
```javascript
{
    type: "video",
    src: "assets/videos/video1.mp4",
    caption: "A precious video moment 🐼✨"
}
```

### 5. Add / Replace Background Song
Background music is loaded from `assets/musics/looplove.mp3`. You can replace this audio file anytime.

---

## 🚀 How to Host on GitHub Pages (Free)

Since this repository (`pinky_birthday`) is already set up on your GitHub account, follow these easy steps:

### Step 1: Push the Project to GitHub
Run the following commands in your terminal:
```bash
git add .
git commit -m "Add birthday surprise website"
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to your GitHub repository: [https://github.com/ashenudara29/pinky_birthday](https://github.com/ashenudara29/pinky_birthday)
2. Click **Settings** (top navigation tab).
3. On the left sidebar, click **Pages**.
4. Under **Build and deployment** -> **Branch**:
   - Change `None` to `main`.
   - Leave the folder as `/ (root)`.
   - Click **Save**.
5. Wait 1-2 minutes. Refresh the page to see your live URL:
   `https://ashenudara29.github.io/pinky_birthday/`

---

## 📱 Step 3: Create the QR Code

1. Copy your live website URL: `https://ashenudara29.github.io/pinky_birthday/`
2. Visit a free QR Code generator site (such as [https://www.qr-code-generator.com/](https://www.qr-code-generator.com/) or [https://me-qr.com/](https://me-qr.com/)).
3. Paste the URL and download the QR code image.
4. Print or send the QR code to your girlfriend! When she scans it on her phone, the surprise will unfold! 🐼💕
