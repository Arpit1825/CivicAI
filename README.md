
# 🚀 CivicAI – AI Powered Civic Issue Reporting Platform

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Google Gemini](https://img.shields.io/badge/Google-Gemini%20Vision-blue?logo=google)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Storage-blue)
![Google Cloud](https://img.shields.io/badge/Google-Cloud-blue?logo=googlecloud)

> **CivicAI** is an AI-powered hyperlocal civic issue reporting platform built using the MERN Stack and Google Gemini Vision. Citizens can report public infrastructure issues, while AI automatically classifies images, estimates severity, generates summaries, and helps authorities prioritize issue resolution.

---

# 🌐 Live Demo

**Frontend:** `Add after deployment`

**Backend:** `Add after deployment`

**Demo Video:** `Drive link`

---

# 📌 Problem Statement

Traditional civic complaint systems often suffer from manual categorization, duplicate reports, delayed responses, and limited citizen engagement. Authorities struggle to prioritize issues efficiently while citizens lack transparency into complaint progress.

CivicAI addresses these challenges through AI-powered image understanding, geolocation, duplicate detection, community participation, and administrative dashboards.

---

# 💡 Our Solution

Using **Google Gemini Vision API**, CivicAI automatically analyzes uploaded images to determine:

- Issue Category
- Severity Level
- AI Generated Summary

The platform further enhances civic reporting with:

- Duplicate Issue Detection
- Interactive Maps
- Nearby Issues
- Community Validation
- Admin Dashboard
- Real-time Status Tracking

---

# ✨ Key Features

## 👤 Citizen

- Secure JWT Authentication
- Raise Civic Issues
- AI Image Analysis
- Automatic Category Detection
- Severity Prediction
- AI Summary Generation
- Cloudinary Image Upload
- Browser Geolocation
- Reverse Geocoding
- Interactive Maps
- Nearby Issues
- My Raised Issues
- My Supported Issues
- Community Support
- Duplicate Detection

## 🛡️ Admin

- Role Based Access
- Admin Secret Registration
- Dashboard Analytics
- Manage Issues
- Update Resolution Status

---

# 🤖 Google Technologies Used

## Google Gemini Vision API

- Automatic Image Understanding
- Issue Categorization
- Severity Prediction
- AI Generated Summary

## Google Cloud

- Frontend Hosting
- Backend Deployment

## Google AI Studio

- Gemini API Management

---

# 🛠 Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Leaflet

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer

### Cloud

- Google Cloud
- MongoDB Atlas
- Cloudinary

### AI

- Google Gemini Vision API

---

# 🏗️ System Architecture

```text
Citizen
    │
React Frontend
    │
Express REST API
 ┌────┼──────────────┐
 │    │              │
Mongo Cloudinary Gemini
 │
Admin Dashboard
```

---

# 📸 Screenshots

Replace these placeholders after deployment.

```md
![Landing](assets/landing.png)

![Raise Issue](assets/raise-issue.png)

![AI Analysis](assets/ai-analysis.png)

![Interactive Map](assets/map.png)

![Citizen Dashboard](assets/dashboard.png)

![Admin Dashboard](assets/admin-dashboard.png)
```

---

# ⚙️ Installation

```bash
git clone https://github.com/Arpit1825/CivicAI.git

cd CivicAI

cd client
npm install

cd ../server
npm install
```

Run frontend

```bash
cd client
npm run dev
```

Run backend

```bash
cd server
npm start
```

---

# 🔐 Environment Variables

### Server

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
ADMIN_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GEMINI_API_KEY=
```

### Client

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 🚀 Deployment

| Component | Platform |
|-----------|----------|
| Frontend | Google Cloud |
| Backend | Google Cloud Run |
| Database | MongoDB Atlas |
| AI | Google Gemini Vision API |
| Image Storage | Cloudinary |
| Maps | Leaflet + OpenStreetMap |

Update with deployed URLs after hosting.

---

# 🔮 Future Scope

- Mobile Application
- Push Notifications
- Government Portal Integration
- AI Priority Prediction
- Heatmap Analytics
- Multilingual Support
- Email Notifications
- Smart Analytics Dashboard

---

# 👨‍💻 Team

**Project:** CivicAI

Developed for the **Google AI Hackathon** using MERN Stack, Google Gemini Vision, Google Cloud, MongoDB Atlas, Cloudinary, and Leaflet.

---

# 🙏 Acknowledgements

- Google AI Studio
- Google Gemini Vision API
- Google Cloud
- MongoDB Atlas
- Cloudinary
- React
- Express.js
- Tailwind CSS
- Leaflet
- OpenStreetMap

---

⭐ If you like this project, consider giving it a star on GitHub.
