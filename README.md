# EpicDaily 🏏

EpicDaily is a cricket-themed habit tracker designed to turn long-term habit building into an engaging, gamified experience. Whether you're "practicing in the nets" (daily habits) or "facing a rival squad" (team mechanics), EpicDaily uses the spirit of cricket to keep you consistent.

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
