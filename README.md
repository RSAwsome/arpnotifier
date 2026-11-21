# ARP Notifier — Train Booking Tracker

A beautiful **Progressive Web App (PWA)** for Indian Railway ARP (Advance Reservation Period) calculations, train search, and festival calendar.

## 🌟 Features

### Tab 1 — Dashboard
- **Today's ARP Window** — instantly see which journey dates open for booking today
- **ARP Calculator** — pick any journey date → shows exact booking open date + countdown timer
- **Upcoming ARP Windows** — next 7 days preview
- **My Events** — upcoming travel events at a glance
- **ARP Rules Reference** — 60-day rule, Tatkal timings

### Tab 2 — Train Search
- **Live Train Search** between any stations (needs RapidAPI key)
- **Complete Route Timeline** with all station timings
- **Seat Availability** by class and quota
- **ARP Info** for any searched journey date
- **PNR Status Check**
- **Popular South Indian Trains** quick launch

### Tab 3 — Festival Calendar
- **Month-wise calendar** with Telugu + Indian festivals highlighted
- **Sundays** (red) and **Fridays** (yellow) highlighted
- **My Events** overlaid on calendar
- **ARP Info** for any tapped date
- **Add Custom Events** with train details → ARP auto-calculated

## 📱 PWA — Install on Android

1. Open the GitHub Pages URL in **Chrome**
2. Tap menu (⋮) → **"Install app"** or **"Add to Home screen"**
3. App launches fullscreen, works offline!

## 🔑 Setup

### RapidAPI Key (Train Search)
1. Go to [rapidapi.com](https://rapidapi.com)
2. Search **"IRCTC API"**
3. Subscribe to free tier
4. Copy `X-RapidAPI-Key`
5. Open app → ⚙️ Settings → paste key

### Firebase (Optional — sync events)
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create project → Add Web App
3. Copy config values
4. Open app → ⚙️ Settings → paste Firebase config

## 🚀 Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit — ARP Notifier PWA"
git remote add origin https://github.com/YOUR_USERNAME/arpnotifier.git
git push -u origin main
```

Then: **GitHub repo → Settings → Pages → Source: main branch**

Your app will be live at: `https://YOUR_USERNAME.github.io/arpnotifier/`

## 🛠️ Tech Stack

- **Vanilla JS** — no framework, tiny footprint
- **CSS Custom Properties** — full dark/light theme
- **Glassmorphism UI** — Apple lock-screen inspired
- **Firebase Firestore** — offline-first with sync
- **Service Worker** — full PWA + offline support
- **Inter + JetBrains Mono** — Antigravity-style fonts

## 📋 ARP Rules (as of Nov 1, 2024)

| Category | ARP |
|---|---|
| General trains | 60 days |
| Foreign tourists | 365 days |
| Tatkal (SL) | 1 day before journey, 10 AM |
| Tatkal (AC) | 1 day before journey, 11 AM |
| Premium Tatkal | 1 day before journey, 10 AM |

**Booking opens at 8:00 AM IST** on the ARP date.
