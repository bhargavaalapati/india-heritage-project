# IndiVerse: An Interactive Journey Through India's Heritage

IndiVerse is a full-stack web application designed to be an engaging, all-in-one portal for exploring the rich cultural and historical heritage of India. It provides users with an interactive map, a dynamic community feed, and an AI-powered chatbot to make learning about India's history a modern and seamless experience.

## ✨ Features

- **Secure User Authentication**: Full registration and login system using JWT (JSON Web Tokens) for secure, stateless sessions. Passwords are fully encrypted using Bcrypt.
- **Interactive Community Feed**: An Instagram-like feed where authenticated users can create posts, like, comment, reply to comments, and delete their own content.
- **Protected Routes**: Core features like the community page are protected, ensuring only logged-in users can access and interact with them.
- **AI Heritage Chatbot**: A rule-based chatbot ("Asa") that can answer questions about Indian states, capitals, food, festivals, and heritage sites. Includes moderation for sensitive topics.
- **Content Exploration**: Users can browse heritage sites, read blog posts, and explore content fetched dynamically from the backend.
- **Modern, Responsive UI**: A clean and fully responsive user interface built with Tailwind CSS that works seamlessly on desktop and mobile devices.

---

## 🛠️ Technology Stack

The project is built with a modern, full-stack architecture, separating the client and server for scalability and maintainability.

| Category     | Technology               | Description                                                                                                |
| :----------- | :----------------------- | :--------------------------------------------------------------------------------------------------------- |
| **Frontend** | **React.js** (with Vite) | A powerful JavaScript library for building fast and dynamic single-page applications.                      |
|              | **React Router**         | Handles all client-side routing, including public and protected routes.                                    |
|              | **Tailwind CSS**         | A utility-first CSS framework for rapid, custom UI development.                                            |
|              | **Framer Motion**        | Used for smooth page transitions and animations.                                                           |
| **Backend**  | **Flask** (Python)       | A lightweight and flexible web framework used to build the REST API.                                       |
|              | **Flask-Bcrypt**         | For securely hashing user passwords.                                                                       |
|              | **PyJWT**                | For generating and verifying JSON Web Tokens for authentication.                                           |
| **Database** | **MongoDB** (via Atlas)  | A NoSQL document database, providing flexibility for storing diverse data like users, posts, and comments. |

---

## 🚀 Getting Started

Follow these instructions to get the project running locally for development and testing.

### **Prerequisites**

- Node.js (v18 or newer)
- Python (v3.9 or newer) & `pip`
- A MongoDB Atlas account and connection string.

### **Backend Setup**

1.  Navigate to the `/backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:

    ```bash
    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate

    # For Windows
    python -m venv venv
    venv\Scripts\activate
    ```

3.  Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the `/backend` root and add your configuration:
    ```env
    MONGO_URI="your_mongodb_atlas_connection_string"
    DB_NAME="IndiVerseDB"
    SECRET_KEY="a_strong_random_secret_key_for_jwt"
    ```

### **Frontend Setup**

1.  In a new terminal, navigate to the `/frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the required Node.js packages:
    ```bash
    npm install
    ```

### **Running the Application**

You will need two separate terminals running simultaneously.

- **Terminal 1: Start the Backend**

  ```bash
  cd backend
  source venv/bin/activate # Or venv\Scripts\activate on Windows
  python app.py
  ```

  The backend API will be running on `http://localhost:5000`.

- **Terminal 2: Start the Frontend**

  ```bash
  cd frontend
  npm run dev
  ```

  The frontend application will be running on `http://localhost:5173`.

---

## 🔐 API Endpoints

The backend provides the following REST API endpoints. Routes marked with `Yes` require a valid JWT to be sent in the `Authorization: Bearer <token>` header.

| Endpoint                                | Method   | Auth Required? | Description                               |
| :-------------------------------------- | :------- | :------------- | :---------------------------------------- |
| `/api/auth/register`                    | `POST`   | No             | Creates a new user account.               |
| `/api/auth/login`                       | `POST`   | No             | Logs in a user and returns a JWT.         |
| `/api/auth/me`                          | `GET`    | Yes            | Gets the currently logged-in user's data. |
| `/api/posts`                            | `GET`    | No             | Gets all community posts.                 |
| `/api/posts`                            | `POST`   | Yes            | Creates a new community post.             |
| `/api/posts/<id>`                       | `DELETE` | Yes            | Deletes a post owned by the user.         |
| `/api/posts/<id>/like`                  | `PATCH`  | Yes            | Toggles a like on a post.                 |
| `/api/posts/<id>/comments`              | `POST`   | Yes            | Adds a comment to a post.                 |
| `/api/posts/<id>/comments/<id>`         | `DELETE` | Yes            | Deletes a comment owned by the user.      |
| `/api/posts/<id>/comments/<id>/replies` | `POST`   | Yes            | Adds a reply to a comment.                |
| `/api/heritage`                         | `GET`    | No             | Gets all heritage sites.                  |
| `/api/blogs`                            | `GET`    | No             | Gets all blog posts.                      |
| `/api/messages/recent`                  | `GET`    | No             | Gets recent contact messages for the UI.  |

---

## 🔮 Future Improvements

- **File Uploads**: Implement file storage (e.g., using AWS S3 or Cloudinary) to allow users to upload images directly from their devices instead of using URLs.
- **Password Reset**: Add a "Forgot Password" feature that sends a secure reset link to the user's email.
- **Enhanced Chatbot**: Integrate a proper NLP (Natural Language Processing) service to improve the chatbot's conversational abilities.
- **User Profiles**: Create dedicated user profile pages where users can see all their posts and activity.
