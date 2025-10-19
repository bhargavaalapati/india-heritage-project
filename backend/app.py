import os
import datetime
from datetime import timezone
import token
from flask import Flask, jsonify, request, abort
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv
from bson.objectid import ObjectId
from flask_bcrypt import Bcrypt
import jwt
from functools import wraps

# --- Load Environment ---
load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)

# --- Configuration ---
app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY", "a_default_fallback_secret_key_for_development"
)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")


# --- Helper to Convert MongoDB Data to JSON ---
def mongo_to_json(data):
    if not data:
        return data
    if isinstance(data, list):
        return [mongo_to_json(item) for item in data]
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, ObjectId):
                data[key] = str(value)
            elif isinstance(value, (list, dict)):
                data[key] = mongo_to_json(value)
    return data


# --- Database Connection ---
try:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    print(f"✅ Connected to MongoDB: {DB_NAME}")
except Exception as e:
    print(f"❌ DB Connection Error: {e}")
    # Create a dummy app to show an error if the DB connection fails
    app = Flask(__name__)

    @app.route("/")
    def error_page():
        return "Server could not connect to the database.", 503

    # --- Basic Route ---
    @app.route("/")
    def index():
        return "Hello from the IndiVerse Python/Flask Backend!"

    # --- JWT Auth Decorator ---


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token is missing or invalid!"}), 401
        token = auth_header.split(" ")[1]
        try:
            # Correct algorithm "HS256"
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = db.users.find_one({"_id": ObjectId(data["user_id"])})
            if not current_user:
                return jsonify({"error": "User not found!"}), 401
        except Exception as e:
            return jsonify({"error": "Token is invalid or expired!"}), 401
        return f(mongo_to_json(current_user), *args, **kwargs)

    return decorated

    # --- AUTHENTICATION ROUTES ---


@app.route("/api/auth/register", methods=["POST"])
def register_user():
    data = request.get_json()
    username, email, password = (
        data.get("username"),
        data.get("email"),
        data.get("password"),
    )
    if not all([username, email, password]):
        return jsonify({"error": "Missing required fields"}), 400
    if db.users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 409
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    db.users.insert_one(
        {
            "username": username,
            "email": email,
            "password_hash": hashed_password,
            "createdAt": datetime.datetime.now(timezone.utc),
        }
    )
    return jsonify({"message": "User registered successfully!"}), 201


@app.route("/api/auth/login", methods=["POST"])
def login_user():
    data = request.get_json()
    email, password = data.get("email"), data.get("password")
    user = db.users.find_one({"email": email})
    if not user or not bcrypt.check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401
    payload = {
        "user_id": str(user["_id"]),
        "username": user["username"],
        "exp": datetime.datetime.now(timezone.utc) + datetime.timedelta(days=1),
    }
    token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")
    return jsonify({"token": token})


@app.route("/api/auth/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    return jsonify(current_user)


# --- HERITAGE ROUTES ---
@app.route("/api/heritage", methods=["GET"])
def get_heritage_sites():
    return jsonify(mongo_to_json(list(db.heritagesites.find())))


@app.route("/api/heritage/<string:id>", methods=["GET"])
def get_heritage_site(id):
    site = db.heritagesites.find_one({"id": id})
    return (
        jsonify(mongo_to_json(site)) if site else (jsonify({"error": "Not Found"}), 404)
    )


# --- BLOG ROUTES ---
@app.route("/api/blogs", methods=["GET"])
def get_blogs():
    blogs = list(db.blogs.find().sort("date", -1))
    return jsonify(mongo_to_json(blogs))


@app.route("/api/blogs/<string:id>", methods=["GET"])
def get_blog(id):
    try:
        blog = db.blogs.find_one({"_id": ObjectId(id)})
        return (
            jsonify(mongo_to_json(blog))
            if blog
            else (jsonify({"error": "Not Found"}), 404)
        )
    except Exception:
        abort(404)


# --- STATES / TOURS / QUIZZES ---
@app.route("/api/states/<string:id>", methods=["GET"])
def get_state(id):
    state = db.states.find_one({"id": id})
    return (
        jsonify(mongo_to_json(state))
        if state
        else (jsonify({"error": "Not Found"}), 404)
    )


@app.route("/api/tours", methods=["GET"])
def get_tours():
    tours = list(db.tours.find())
    return jsonify(mongo_to_json(tours))


@app.route("/api/tours/<string:id>", methods=["GET"])
def get_tour(id):
    tour = db.tours.find_one({"id": id})
    if not tour:
        abort(404)
    monuments = list(
        db.heritagesites.find({"id": {"$in": tour.get("monumentIds", [])}})
    )
    ordered = sorted(monuments, key=lambda m: tour["monumentIds"].index(m["id"]))
    tour["monuments"] = ordered
    return jsonify(mongo_to_json(tour))


@app.route("/api/quizzes/<string:monumentId>", methods=["GET"])
def get_quiz(monumentId):
    quiz = db.quizzes.find_one({"monumentId": monumentId})
    return (
        jsonify(mongo_to_json(quiz)) if quiz else (jsonify({"error": "Not Found"}), 404)
    )


# --- CONTACT MESSAGES ---
@app.route("/api/messages", methods=["POST"])
def add_message():
    data = request.get_json()
    if not all(k in data for k in ("name", "email", "message")):
        abort(400, "Missing required fields")
    data["timestamp"] = datetime.datetime.now(timezone.utc)
    db.messages.insert_one(data)
    return jsonify({"message": "Message received successfully!"}), 201


@app.route("/api/messages/recent", methods=["GET"])
def get_recent_messages():
    msgs = list(
        db.messages.find({}, {"name": 1, "timestamp": 1, "_id": 0})
        .sort("timestamp", -1)
        .limit(5)
    )
    return jsonify(msgs)


# --- COMMUNITY POSTS ROUTES ---


# Helper to get a single post with full author/comment details
def get_full_post(post_id):
    pipeline = [
        {"$match": {"_id": ObjectId(post_id)}},
        {
            "$lookup": {
                "from": "users",
                "localField": "authorId",
                "foreignField": "_id",
                "as": "authorInfo",
            }
        },
        {"$unwind": "$authorInfo"},
        {
            "$project": {
                "url": 1,
                "description": 1,
                "likes": 1,
                "likedBy": 1,
                "comments": 1,
                "createdAt": 1,
                "authorId": 1,
                "author": {
                    "_id": "$authorInfo._id",
                    "username": "$authorInfo.username",
                },
            }
        },
    ]
    result = list(db.communityposts.aggregate(pipeline))
    return result[0] if result else None


# GET all posts (now includes author info)
@app.route("/api/posts", methods=["GET"])
def get_all_posts():
    pipeline = [
        {"$sort": {"createdAt": -1}},
        {
            "$lookup": {
                "from": "users",
                "localField": "authorId",
                "foreignField": "_id",
                "as": "authorInfo",
            }
        },
        {
            "$unwind": {"path": "$authorInfo", "preserveNullAndEmptyArrays": True}
        },  # Keep posts even if author is deleted
        {
            "$project": {
                "url": 1,
                "description": 1,
                "likes": 1,
                "likedBy": 1,
                "comments": 1,
                "createdAt": 1,
                "authorId": 1,
                "author": {
                    "_id": "$authorInfo._id",
                    "username": "$authorInfo.username",
                },
            }
        },
    ]
    posts = list(db.communityposts.aggregate(pipeline))
    return jsonify(mongo_to_json(posts))


# CREATE a new post (now protected and linked to author)
@app.route("/api/posts", methods=["POST"])
@token_required
def create_post(current_user):
    data = request.get_json()
    if not data or not data.get("url"):
        abort(400, "Missing URL field")
    new_post = {
        "url": data["url"],
        "description": data.get("description", ""),
        "authorId": ObjectId(current_user["_id"]),
        "likes": 0,
        "likedBy": [],
        "comments": [],
        "createdAt": datetime.datetime.now(timezone.utc),
    }
    result = db.communityposts.insert_one(new_post)
    created_post = get_full_post(result.inserted_id)
    return jsonify(mongo_to_json(created_post)), 201


# DELETE a post (new and protected)
@app.route("/api/posts/<string:post_id>", methods=["DELETE"])
@token_required
def delete_post(current_user, post_id):
    post = db.communityposts.find_one({"_id": ObjectId(post_id)})
    if not post:
        abort(404)
    if str(post.get("authorId")) != current_user["_id"]:
        return jsonify({"error": "Not authorized to delete this post"}), 403
    db.communityposts.delete_one({"_id": ObjectId(post_id)})
    return jsonify({"message": "Post deleted successfully"}), 200


# LIKE/UNLIKE a post (protected)
@app.route("/api/posts/<string:post_id>/like", methods=["PATCH"])
@token_required
def toggle_like(current_user, post_id):
    user_id_str = current_user["_id"]
    post = db.communityposts.find_one({"_id": ObjectId(post_id)})
    if not post:
        abort(404)
    if user_id_str in post.get("likedBy", []):
        update = {"$pull": {"likedBy": user_id_str}, "$inc": {"likes": -1}}
    else:
        update = {"$addToSet": {"likedBy": user_id_str}, "$inc": {"likes": 1}}
    db.communityposts.update_one({"_id": ObjectId(post_id)}, update)
    return jsonify({"message": "Success"}), 200


# ADD a comment (protected)
@app.route("/api/posts/<string:post_id>/comments", methods=["POST"])
@token_required
def add_comment(current_user, post_id):
    data = request.get_json()
    if not data or not data.get("text"):
        abort(400, "Comment text required")
    new_comment = {
        "_id": ObjectId(),
        "text": data["text"],
        "author": {"_id": current_user["_id"], "username": current_user["username"]},
        "createdAt": datetime.datetime.now(timezone.utc),
        "replies": [],
    }
    db.communityposts.update_one(
        {"_id": ObjectId(post_id)}, {"$push": {"comments": new_comment}}
    )
    updated_post = get_full_post(post_id)
    return jsonify(mongo_to_json(updated_post))


# DELETE a comment (new and protected)
@app.route(
    "/api/posts/<string:post_id>/comments/<string:comment_id>", methods=["DELETE"]
)
@token_required
def delete_comment(current_user, post_id, comment_id):
    post = db.communityposts.find_one({"_id": ObjectId(post_id)})
    if not post:
        abort(404)
    comment = next(
        (c for c in post.get("comments", []) if str(c["_id"]) == comment_id), None
    )
    if not comment:
        abort(404)

    is_post_author = str(post.get("authorId")) == current_user["_id"]
    is_comment_author = comment.get("author", {}).get("_id") == current_user["_id"]
    if not is_post_author and not is_comment_author:
        return jsonify({"error": "Not authorized"}), 403

    db.communityposts.update_one(
        {"_id": ObjectId(post_id)},
        {"$pull": {"comments": {"_id": ObjectId(comment_id)}}},
    )
    updated_post = get_full_post(post_id)
    return jsonify(mongo_to_json(updated_post))


# ADD a reply (now protected)
@app.route(
    "/api/posts/<string:post_id>/comments/<string:comment_id>/replies", methods=["POST"]
)
@token_required
def add_reply(current_user, post_id, comment_id):
    data = request.get_json()
    if not data or not data.get("text"):
        abort(400, "Reply text required")
    reply = {
        "_id": ObjectId(),
        "text": data["text"],
        "author": {"_id": current_user["_id"], "username": current_user["username"]},
        "createdAt": datetime.datetime.now(timezone.utc),
    }
    db.communityposts.update_one(
        {"comments._id": ObjectId(comment_id)}, {"$push": {"comments.$.replies": reply}}
    )
    updated_post = get_full_post(post_id)
    return jsonify(mongo_to_json(updated_post))


@app.route("/")
def error_page():
    return "Server connection issue. Check backend logs.", 503


# --- Main Entry ---
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, port=port)
