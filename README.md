🌐 EchoSphere - Full Stack Social Media Platform

Welcome to EchoSphere, a modern, full-featured social media application where users can connect, share, and communicate in real time. This project demonstrates a complete MERN stack implementation, with features including user accounts, group feeds, direct messaging, media sharing, and more.

🚀 Features

📝 Post Creation - Users can share text and image-based posts.

💬 Real-Time Chat - Direct messaging powered by Socket.IO.

🧑‍🤝‍🧑 Follow System - Follow/unfollow users and view their posts.

👥 Group System - Create and join groups with shared feeds.

📸 Image Uploads - Integrated with Cloudinary for media hosting.

👤 User Profiles - Public profile pages with follow stats and posts.

🔐 Authentication - Secure login and registration.

⚙️ Tech Stack

Frontend

React

Tailwind CSS

Backend

Node.js

Express.js

MongoDB (via Mongoose)

Socket.IO (real-time messaging)

Additional Tools

Multer & Cloudinary for image upload

🧪 Local Setup

To run this project locally, follow these steps:

1. Clone the repository

2. Install dependencies

Install dependencies for the root, client, and server:
npm install cd client && npm install cd ../server && npm install

3. Create environment variables
Create .env files for both client and server: 

Include your MongoDB URI

Cloudinary credentials (cloud name, API key, secret)

Example for server:

MONGO_URI=your_mongo_uri CLOUDINARY_CLOUD_NAME=your_cloud_name CLOUDINARY_API_KEY=your_api_key CLOUDINARY_API_SECRET=your_api_secret

4. run the project

Start the backend:
cd server node app.js

Start the frontend:
cd ../client npm run dev

Visit: http://localhost:3000
