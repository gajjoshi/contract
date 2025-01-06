import requests
import json

def extract_dates_and_terms_with_groq(input_string):
    GROQ_API_KEY = "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"
    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "system", "content": "You are an AI assistant that extracts start date, end date, and renewal terms from a given input text."},
            {"role": "user", "content": input_string}
        ]
    }

    response = requests.post(GROQ_API_URL, headers=headers, data=json.dumps(payload))
    if response.status_code == 200:
        
        print(response.json())
        completion = response.json()["choices"][0]["message"]["content"]
        print(completion)
        return completion
    else:
        return f"Error: {response.status_code}, {response.text}"

if __name__ == "__main__":
    input_string = (
        "The contract starts on 2024-06-01 and ends on 2025-06-01. "
        "Renewal terms: Automatically renewed annually unless terminated in writing."
    )

    extracted_info = extract_dates_and_terms_with_groq(input_string)
    print("Extracted Information:\n")
    print(extracted_info)
