from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['user_database']  # Replace 'user_database' with your database name
import os
import requests
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import pytesseract
from PIL import Image
from PyPDF2 import PdfReader
from docx import Document

UPLOAD_DIR = "uploads/"
GROQ_API_KEY = "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"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
@csrf_exempt
def get_collection_data(request):
    if request.method == "POST":
        try:
            # Parse email from request body
            data = json.loads(request.body)   
            print(data)

            email = data.get("email")
            print(email)

            if not email:
                return JsonResponse({"error": "Email is required."}, status=400)

            # Retrieve all documents in the collection named after the email
            collection = db[email]
            documents = list(collection.find({"password": {"$exists": False}}, {"_id": 0}))

            return JsonResponse({"data": documents}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def submit_data(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            # print(email)
            form_data = data.get("data")
            selected_date = data.get("selected_date")

            if not email:
                return JsonResponse({"error": "Email is required."}, status=400)

            # Set collection dynamically based on email
            collection = db[email]

            # Insert the form data into MongoDB
            form_data["destruction_date"] = selected_date
            form_data["submit_date"] = datetime.utcnow()
            collection.insert_one(form_data)

            return JsonResponse({"message": "Data submitted successfully."}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def extract_text(request):
    if request.method == "POST":
        try:
            # Ensure the upload directory exists
            if not os.path.exists(UPLOAD_DIR):
                os.makedirs(UPLOAD_DIR)

            uploaded_file = request.FILES.get("file")
            if not uploaded_file:
                return JsonResponse({"error": "No file uploaded"}, status=400)

            # Save the file temporarily
            file_path = os.path.join(UPLOAD_DIR, uploaded_file.name)
            with open(file_path, "wb+") as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            # Extract text from the uploaded file
            extracted_text = ""
            if uploaded_file.name.endswith(".pdf"):
                with open(file_path, "rb") as f:
                    reader = PdfReader(f)
                    for page in reader.pages:
                        extracted_text += page.extract_text() or ""
            elif uploaded_file.name.endswith((".jpg", ".jpeg", ".png")):
                image = Image.open(file_path)
                extracted_text = pytesseract.image_to_string(image)
            elif uploaded_file.name.endswith(".docx"):
                doc = Document(file_path)
                extracted_text = "\n".join([para.text for para in doc.paragraphs])
            else:
                return JsonResponse({"error": "Unsupported file type"}, status=400)

            # Delete the temporary file
            os.remove(file_path)
            print(extracted_text)
            print("waha tamatar")

            # Use Groq API to extract structured parameters
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            }
            payload = {
    "model": "llama3-70b-8192",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant that extracts structured information from text . "
                                      "Always return the result in JSON format."},
        {"role": "user", "content": f"""
            Extract the following details from the text:
            - End Date
            - Renewal Date
            - Name
            - Email ID
            - Phone Number
            - Additional Important Information
client_name  client_address, client_email , client_phone ,provider_name , provider_address , provider_email , provider_phone , unique_contract_id (if available) , activation_date , initial_term , renewal_type , termination_notice , status , payment_id , amount , due_date , late_payment_fee , sla_id , service_quality_metrics , privacy_provisions , liability_limitations
            Always return the result in this JSON format , and leave the field entry if there is no association:
            {{
                "client_name": "<value>",
  "client_address": "<value>",
  "client_email": "<value>",
  "client_phone": "<value>",
  "provider_name": "<value>",
  "provider_address": "<value>",
  "provider_email": "<value>",
  "provider_phone": "<value>",
  "unique_contract_id": "<value>",
  "activation_date": "<value>",
  "initial_term": "<value>",
  "renewal_type": "<value>",
  "termination_notice": "<value>",
  "status": "<value>",
  "payment_id": "<value>",
  "amount": "<value>",
  "due_date": "<value>",
  "late_payment_fee": "<value>",
  "sla_id": "<value>",
  "service_quality_metrics": "<value>",
  "privacy_provisions": "<value>",
  "liability_limitations": "<value>"
            }}
            
            Text: {extracted_text}
        """}
    ],
    "max_tokens": 300
}


            response = requests.post(GROQ_API_URL, headers=headers, json=payload)
            if response.status_code == 200:
                groq_response = response.json()
                print("Groq API Response:", groq_response)  # Print entire API response for debugging
                try:
                    print("chomp")
                    print(groq_response["choices"][0]['message']['content'])

                    
                    structured_data = groq_response["choices"][0]["message"]["content"]

                    print(structured_data)
                   
         
                    return JsonResponse(structured_data
                      , status=200,safe=False)
                except (IndexError, KeyError) as e:
                    return JsonResponse({"error": f"Unexpected API response structure: {e}"}, status=500)
            else:
                return JsonResponse({"error": f"Failed to process text with Groq API: {response.text}"}, status=response.status_code)


        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)
























@csrf_exempt
def check_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            collection = db[email]     
            # Check if the collection (email) already exists
            if email in db.list_collection_names():
                if collection.find_one({"password":password}):
                    return JsonResponse({"message": "User created successfully."}, status=201)
                else:
                    return JsonResponse({"error": "Invalid password."}, status=401)
            



                
            else:
                return JsonResponse({"error": "User doesnt exists"}, status=402)
            
        except:
            return JsonResponse({"error": "Only POST method is allowed."}, status=405)

    

































@csrf_exempt
def create_user(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from the request
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            collection = db[email]     
            # Check if the collection (email) already exists
            if email in db.list_collection_names():
                return JsonResponse({"error": "User already exists."}, status=400)

            
            # Validate required fields
            if not email or not password:
                return JsonResponse({"error": "All fields (username, email, password) are required."}, status=400)
            
            # Create the user document
            user_document = {
                "email": email,
                "password": password,  # In a real-world scenario, hash the password before storing
                "created_at": datetime.utcnow()  # Store the current UTC time
            }
            
            # Insert the document into the MongoDB collection
            collection.insert_one(user_document)
            
            return JsonResponse({"message": "User created successfully."}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)

@csrf_exempt
def get_user(request):
    if request.method == "GET":
        try:
            # Get the email from query parameters
            email = request.GET.get("email", None)

            if not email:
                return JsonResponse({"error": "Email parameter is required"}, status=400)

            # Set collection name dynamically to the email
            collection = db[email]  # Collection name is the email

            # Fetch the document from the collection where 'email' exists
            user = collection.find_one({"email": {"$exists": True}}, {"_id": 0})  # Exclude _id field
            
            if user:
                return JsonResponse(user, status=200)
            else:
                return JsonResponse({"message": f"No document found in collection '{email}'"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)