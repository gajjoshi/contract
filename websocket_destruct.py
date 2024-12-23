import pymongo
from pymongo import MongoClient
from datetime import datetime, timedelta
import time
import schedule

# Connect to MongoDB
def connect_to_mongodb():
    client = MongoClient('mongodb://localhost:27017/')
    return client['user_database']

def delete_documents_with_expired_dates(db):
    today = datetime.now().date()
    deleted_docs = []

    for collection_name in db.list_collection_names():
        collection = db[collection_name]

        # Find and delete documents with a past destruction_date
        past_docs = list(collection.find({}))
        for doc in past_docs:
            destruction_date_str = doc.get("destruction_date")
            if destruction_date_str:
                try:
                    destruction_date = datetime.strptime(destruction_date_str, "%Y-%m-%d").date()
                    if destruction_date <= today:  # Check if the date is in the past or today
                        deleted_docs.append(doc)
                        collection.delete_one({"_id": doc["_id"]})
                except ValueError:
                    print(f"Invalid date format in document: {doc}")

    return deleted_docs

# Function to run periodically
def check_and_delete():
    db = connect_to_mongodb()
    deleted_docs = delete_documents_with_expired_dates(db)

    if deleted_docs:
        print(f"Deleted documents: {deleted_docs}")
    else:
        print("No documents to delete.")

# Schedule the job to run at midnight daily
schedule.every().day.at("00:00").do(check_and_delete)

# Perform an initial check on start-up
print("Performing initial check...")
check_and_delete()

print("Scheduler is running...")
while True:
    schedule.run_pending()
    time.sleep(1)
