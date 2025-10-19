# backend/seed.py
import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# --- Configuration ---
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")


# --- Helper function to load JSON data ---
def load_json_data(file_path):
    script_dir = os.path.dirname(__file__)
    # Path goes up from /backend, then down into the data folder
    # IMPORTANT: Assumes your frontend folder is at the same level as backend
    abs_file_path = os.path.join(script_dir, "..", "frontend", "src", "data", file_path)
    try:
        with open(abs_file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: Could not find the file at {abs_file_path}")
        return None


def seed_database():
    if not MONGO_URI:
        print("❌ MONGO_URI not found in .env file. Exiting.")
        return

    client = None
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        print(f"✅ MongoDB Connected for seeding database '{DB_NAME}'...")

        # Prepare data for seeding
        data_to_seed = {
            "heritagesites": load_json_data("heritageData.json"),
            "blogs": load_json_data("blogs.json"),
            "states": list(load_json_data("statesData.json").values()),
            "tours": load_json_data("toursData.json"),
            "quizzes": [
                {"monumentId": key, "questions": value}
                for key, value in load_json_data("quizData.json").items()
            ],
            "posts": load_json_data("db.json").get("photos", []),
            "messages": load_json_data("contactData.json").get("messages", []),
        }

        for collection_name, data in data_to_seed.items():
            if data is not None:
                collection = db[collection_name]
                collection.delete_many({})
                if len(data) > 0:
                    collection.insert_many(data)
                print(
                    f"✅ Seeded {len(data)} documents into '{collection_name}' collection."
                )

        print("\n🌱 Seeding complete!")

    except Exception as e:
        print(f"❌ An error occurred during seeding: {e}")
    finally:
        if client:
            client.close()
            print("MongoDB connection closed.")


if __name__ == "__main__":
    seed_database()
