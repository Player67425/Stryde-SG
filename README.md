# Stryde SG — Full Working Prototype

**Empowering teens to not only be healthy but to flourish—one Stryde at a time.**

A comprehensive React Native + Expo + TypeScript app for Singaporean teens (ages 12-19) to manage their health holistically.

## How to Run

```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start
```

Then:
- **Physical device**: Scan QR code with Expo Go app (iOS/Android)
- **iOS Simulator**: Press 'i' (Mac only)
- **Android Emulator**: Press 'a'
- **Web**: Press 'w' (limited functionality)

## Features

### 5 Core Tabs
1. **Learn** - 8 beginner modules with quizzes + Advanced research library
2. **Track** - Daily logging, 7-day trends, weekly insights, Scan Meal Assist
3. **Connect** - Quests, teams, badges, Singapore fitness events
4. **Reflect** - Journal modes, mood tracking, progress patterns
5. **AI Coach** - 5 modes with offline knowledge base

### Onboarding & Tutorial
- First-launch onboarding quiz (required + optional fields with helper labels)
- Interactive 6-step tutorial

### Singapore-Focused
- Local food examples (hawker, canteen, bubble tea)
- My Healthy Plate integration
- Singapore fitness events

### Safety & Ethics
- No parent mode, leaderboards, or body comparison
- No shame/punishment language
- Supportive tone throughout
- AI safety guardrails

### Offline-First
- All data stored locally with AsyncStorage
- No external API keys required

## Tech Stack

- Expo SDK 54 + React Native 0.81
- TypeScript
- Expo Router (file-based routing)
- AsyncStorage for persistence

## Project Structure

```
/app/(tabs)  - 5 main tab screens
/data        - Content data
/types       - TypeScript interfaces
/utils       - Storage utilities
```

## Demo Guide

1. **First Launch**: Complete 3-step onboarding
2. **Tutorial**: Walk through 6 features or skip
3. **Explore**: Try each of the 5 tabs

## Data Storage

All data stored locally using AsyncStorage keys.

## License

Prototype for demonstration purposes.
