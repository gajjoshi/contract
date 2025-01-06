import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email():
    # Sender and recipient details
    sender_email = "gajjoshi2003@gmail.com"  # Replace with your Gmail address
    sender_password = "ztzn frjh ulnh alax"  # Replace with your App Password
    recipient_email = "mansoor12032000@gmail.com"  # Replace with the recipient's email address

    # Email content
    subject = "Test Email"
    body = "Hello, this is a test email sent using Python and Gmail App Password!"
    

    # Create the email message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject

    # Attach the body content to the email
    message.attach(MIMEText(body, "plain"))

    try:
        # Connect to Gmail's SMTP server
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Start TLS encryption
            server.login(sender_email, sender_password)  # Login using your App Password
            server.sendmail(sender_email, recipient_email, message.as_string())  # Send the email
            print("Email sent successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")

# Call the function to send the email
send_email()
