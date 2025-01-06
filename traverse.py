from pymongo import MongoClient
from groq import Groq

# Groq API Key
GROQ_API_KEY = "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"

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)

def traverse_and_generate_emails():
    # Connect to the local MongoDB server
    client_mongo = MongoClient("mongodb://localhost:27017/")  # Adjust the connection string if needed
    db = client_mongo["user_database"]  # Replace with your database name

    # Iterate through all collections in the database
    for collection_name in db.list_collection_names():
        collection = db[collection_name]
        print(f"Processing Collection: {collection_name}")
        
        # Query to exclude specific fields
        cursor = collection.find({}, {"password": 0, "sent": 0})  # Exclude password and sent fields
        
        for document in cursor:
            # Convert the document into a string representation
            document_content = str(document)

            # Prompt for Groq to draft the email using the entire document content
            prompt = (
                f"Using the following document, draft an  email to the client statting that the due is in reminder days (you will find reminder in the data provided). Extract all the informATION, "
                f"and contract information if present, and create a professional email summarizing the details:\n\n"
                f"{document_content}"
            )

            # Generate email using Groq API
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.3-70b-versatile",
                stream=False,
            )
            
            # Extract and print the generated email
            drafted_email = chat_completion.choices[0].message.content
            print(f"Drafted Email for Document:")
            print(drafted_email)
            print("-" * 50)

# Call the function
traverse_and_generate_emails()
