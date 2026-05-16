# EpicDaily 🏏

EpicDaily is a cricket-themed habit tracker designed to turn long-term habit building into an engaging, gamified experience. Whether you're "practicing in the nets" (daily habits) or "facing a rival squad" (team mechanics), EpicDaily uses the spirit of cricket to keep you consistent.

## 🚀 Live Links

- **[Development Preview](https://ais-dev-n56ztnds6mstfkpe5sbdsn-55985620159.asia-southeast1.run.app)** (Active during development)
- **[Public Share Link](https://ais-pre-n56ztnds6mstfkpe5sbdsn-55985620159.asia-southeast1.run.app)** (Requires deployment)
- **[Open in AI Studio](https://ai.studio/build/e264d571-41bf-4020-aef9-da696c66eab3)**

## 📸 Screen Gallery

### 1. Welcome & Onboarding
*The entry point where you join the squad.*
![Onboarding Screen](https://images.unsplash.com/photo-1540747913346-19e3ad6436b9?w=800&q=80)

### 2. The Nets (Dashboard)
*Track your daily drills and see your form.*
![Dashboard Screen](https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80)

### 3. Coach Academy (AI Insights)
*Personalized technical analysis and motivational quotes.*
![Coach Academy](https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80)

### 4. Career Path (Achievements)
*Visualize your rise from Debut to Legend.*
![Career Path](https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80)

### 5. The Stadium (Match Play)
*Compete with your team and see the leaderboard.*
![The Stadium](https://images.unsplash.com/photo-1508344928928-71657da71809?w=800&q=80)

### 6. Club Shop
*Redeem your runs for exclusive rewards.*
![Club Shop](https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80)

## 🌟 Key Features

- **Daily Drills**: Gamified habit tracking where completions are scored as "Runs".
- **The Nets**: A personalized dashboard showing your current form, streaks, and active milestones.
- **Coach Academy**: AI-powered insights that analyze your habit patterns, providing suggestions, benefits, and risks for your routine.
- **Daily Motivation**: AI-generated motivational cricket quotes paired with cinematic backgrounds, ready for download.
- **Career Path**: Visualized achievement tracker with milestones at 7, 21, 90, and 365 days.
- **The Stadium (Teams)**: Share your "Locker ID" with teammates to link runs and participate in squad-based matches.
- **Match Replay**: A calendar-based history view allowing you to revisit past performances and photo proofs.
- **Club Shop**: Redeem your earned "Runs" for exclusive rewards and gear.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Animations**: Framer Motion (motion/react)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Node.js, Express
- **AI Engine**: Google Gemini API (@google/genai)
- **State Management**: Local Storage (Persistence)
- **Date Handling**: date-fns

## 🚀 Installation and Setup

To run EpicDaily locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### Steps

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd epicdaily
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The app will be running at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

## 📂 Project Structure

- `server.ts`: Express backend handling AI requests and static file serving.
- `src/App.tsx`: Main application logic and routing.
- `src/index.css`: Global styles and Tailwind configuration.
- `src/lib/storage.ts`: Local storage utilities for data persistence.
- `metadata.json`: Application metadata and permissions.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
