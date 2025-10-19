# IndiVerse: An Interactive 3D/AR Heritage Exploration Platform

IndiVerse is a feature-rich, full-stack web application designed to be a modern, immersive portal for exploring the rich cultural and historical heritage of India. Moving beyond static pages, IndiVerse integrates interactive maps, a dynamic community feed, and AR features to bring India's history to life for students, tourists, and history enthusiasts.

## ✨ Features

- **Secure User Authentication**: Complete user registration and login system using **JWT** for secure sessions and **Bcrypt** for password encryption.
- **Dynamic Community Feed**: An Instagram-like social hub where authenticated users can create posts (via URL or file upload), like, comment, reply, and delete their own content.
- **Interactive Geo-Map**: An engaging, interactive map of India built with **React Simple Maps** and **Leaflet**, allowing users to explore states and discover content visually.
- **AR Integration**: On-site heritage exploration is enhanced through **QR Codes** that can be scanned to launch AR models or 3D views of monuments on a mobile device.
- **AI-Powered Chatbot**: An integrated, rule-based AI assistant that answers user questions about Indian states, capitals, food, festivals, and heritage sites.
- **Rich Animations & Transitions**: A fluid and professional user experience powered by **Framer Motion** and the **GreenSock Animation Platform (GSAP)**.
- **Smooth Content Sliders**: Touch-friendly carousels and sliders built with **Swiper.js** for showcasing images and content.
- **Protected Routes**: Core features are protected, ensuring that only logged-in users can access sensitive routes and perform actions like posting or commenting.

---

## 🛠️ Technology Stack

The project utilizes a modern, decoupled architecture with a powerful set of libraries to create a feature-rich experience.

| Category           | Technology                          | Description                                                                                                                                             |
| :----------------- | :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**       | **React.js** (with Vite)            | A powerful JavaScript library for building a fast, component-based single-page application.                                                             |
|                    | **React Router**                    | Handles all client-side navigation, including public and protected routes.                                                                              |
| **Styling**        | **Tailwind CSS**                    | A utility-first CSS framework for rapid, custom, and fully responsive UI development.                                                                   |
| **Animation**      | **Framer Motion** & **GSAP**        | A combination of declarative (Framer Motion) and high-performance imperative (GSAP) animation libraries to create a fluid and engaging user experience. |
| **Mapping**        | **React Simple Maps** & **Leaflet** | Used together to create beautiful, interactive, and performant SVG maps of India for geographical exploration.                                          |
| **UI Components**  | **Swiper.js** & **React Icons**     | For creating modern, touch-enabled content sliders and for a comprehensive library of high-quality icons.                                               |
| **AR/Utility**     | **qrcode.react**                    | Generates QR codes on the fly to link real-world locations to digital AR content.                                                                       |
| **Backend**        | **Flask** (Python)                  | A lightweight and flexible web framework used to build the powerful REST API.                                                                           |
| **Authentication** | **Flask-Bcrypt** & **PyJWT**        | For industry-standard password hashing and secure, token-based session management.                                                                      |
| **Database**       | **MongoDB** (via Atlas)             | A flexible NoSQL document database, perfect for handling the diverse and nested data of the application.                                                |

---

## 🚀 Getting Started

Follow these instructions to get the project running locally.

### **Prerequisites**

- Node.js (v18 or newer)
- Python (v3.9 or newer) & `pip`
- A MongoDB Atlas account and connection string.

### **Backend Setup**

1.  Navigate to the `/backend` directory.
2.  Create and activate a virtual environment.
3.  Install dependencies: `pip install -r requirements.txt`
4.  Create a `.env` file and add your configuration:
    ```env
    MONGO_URI="your_mongodb_atlas_connection_string"
    DB_NAME="YourDBName"
    SECRET_KEY="a_strong_random_secret_key"
    ```

### **Frontend Setup**

1.  Navigate to the `/frontend` directory.
2.  Install dependencies: `npm install`

### **Running the Application**

You will need two separate terminals.

- **Terminal 1 (Backend):**

  ```bash
  cd backend
  # Activate virtual environment (e.g., source venv/bin/activate)
  python app.py
  ```

  **Note: Differs for Windows (OS) and Linux Based OS thank you.**

- **Terminal 2 (Frontend):**
  ```bash
  cd frontend
  npm run dev
  ```
  Navigate to `http://localhost:5173`.

---

## 🔐 API Endpoints

The backend REST API provides several endpoints to support the application's features. Routes requiring authentication must include a valid JWT in the `Authorization` header.

| Endpoint                   | Method        | Auth Required? | Description                             |
| :------------------------- | :------------ | :------------- | :-------------------------------------- |
| `/api/auth/register`       | `POST`        | No             | Creates a new user.                     |
| `/api/auth/login`          | `POST`        | No             | Authenticates a user and returns a JWT. |
| `/api/auth/me`             | `GET`         | Yes            | Retrieves the current user's data.      |
| `/api/posts`               | `GET`, `POST` | `POST`: Yes    | Fetches or creates community posts.     |
| `/api/posts/<id>`          | `DELETE`      | Yes            | Deletes a post owned by the user.       |
| `/api/posts/<id>/like`     | `PATCH`       | Yes            | Likes/unlikes a post.                   |
| `/api/posts/<id>/comments` | `POST`        | Yes            | Adds a comment to a post.               |
| `/api/heritage`            | `GET`         | No             | Fetches all heritage sites.             |

---

## 🔮 Future Improvements

- **Direct File Uploads**: Implement a cloud storage solution (like AWS S3 or Cloudinary) to allow users to upload images directly instead of just using URLs.
- **Expand AR Library**: Integrate more 3D models and AR experiences for a wider range of heritage sites.
- **Real-time Chat**: Upgrade the chatbot or community feed with WebSockets for real-time communication.
- **User Profile Pages**: Create dedicated profile pages for users to view their posts and activity.
