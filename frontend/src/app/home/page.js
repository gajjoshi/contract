"use client";
import React, { useEffect, useState } from "react";

function HomePage() {
  const [email, setEmail] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [selectedDate, setSelectedDate] = useState(""); // Add this line
  const [collectionData, setCollectionData] = useState([]);
  const [showEmail, setShowEmail] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("email"); // Remove email from localStorage
    window.location.href = "/"; // Redirect to the login/signup page
  };
  





  const [formData, setFormData] = useState({
    client_name: "",
    client_address: "",
    client_email: "",
    client_phone: "",
    provider_name: "",
    provider_address: "",
    provider_email: "",
    provider_phone: "",
    unique_contract_id: "",
    activation_date: "",
    initial_term: "",
    renewal_type: "",
    termination_notice: "",
    status: "",
    payment_id: "",
    amount: "",
    due_date: "",
    late_payment_fee: "",
    sla_id: "",
    service_quality_metrics: "",
    privacy_provisions: "",
    liability_limitations: "",
  });

  


  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setUploadMessage(`File selected: ${uploadedFile.name}`);
  };
  const fetchCollectionData = async () => {
    try {
      console.log("srilankan")

      console.log(email)
      const response = await fetch("http://127.0.0.1:8000/get_collection_data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }), // Logged-in email
      });
  
      const result = await response.json();
      if (response.ok) {
        setCollectionData(result.data);
        console.log("Fetched Data:", result.data);
      } else {
        console.error("Failed to fetch collection data:", result.error);
      }
    } catch (error) {
      console.error("Error fetching collection data:", error);
    }
  };
  
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/submit_data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Logged-in email (collection name)
          data: formData, // Form data
          selected_date: selectedDate, // Calendar input
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("Data submitted successfully!");
        console.log("Submitted Data:", result);
      } else {
        alert("Failed to submit data.");
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Something went wrong while submitting the data.");
    }
  };
  


  const handleFileUpload = async () => {
    if (!file) {
      setUploadMessage("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/extract_text/", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        const jsonMatch = data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          setFormData({
            client_name: jsonData.client_name || "",
  client_address: jsonData.client_address || "",
  client_email: jsonData.client_email || "",
  client_phone: jsonData.client_phone || "",
  provider_name: jsonData.provider_name || "",
  provider_address: jsonData.provider_address || "",
  provider_email: jsonData.provider_email || "",
  provider_phone: jsonData.provider_phone || "",
  unique_contract_id: jsonData.unique_contract_id || "",
  activation_date: jsonData.activation_date || "",
  initial_term: jsonData.initial_term || "",
  renewal_type: jsonData.renewal_type || "",
  termination_notice: jsonData.termination_notice || "",
  status: jsonData.status || "",
  payment_id: jsonData.payment_id || "",
  amount: jsonData.amount || "",
  due_date: jsonData.due_date || "",
  late_payment_fee: jsonData.late_payment_fee || "",
  sla_id: jsonData.sla_id || "",
  service_quality_metrics: jsonData.service_quality_metrics || "",
  privacy_provisions: jsonData.privacy_provisions || "",
  liability_limitations: jsonData.liability_limitations || "",
          });
          setShowForm(true); // Show the extracted data form
        }
        setUploadMessage("Text extracted successfully!");
      } else {
        setUploadMessage(data.error || "Failed to extract text.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      setUploadMessage("Error uploading file.");
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail.trim());
      console.log("Fetched Email:", storedEmail.trim());
    } else {
      console.error("No email found in localStorage.");
    }
  }, []);
  
  // New useEffect to fetch data when email is updated
  useEffect(() => {
    if (email) {
      fetchCollectionData(); // Call fetchCollectionData only after email is updated
    }
  }, [email]);
  
  

  return (
    
    <div style={styles.container}>
      <button style={styles.logoutButton} onClick={() => handleLogout()}>
  Logout
</button>

      <div style={styles.profileContainer}>
  <div
    style={styles.profileIcon}
    onMouseEnter={() => setShowEmail(true)}
    onMouseLeave={() => setShowEmail(false)}
    onClick={() => setShowEmail(!showEmail)} 
  >
    <span style={styles.profileLetter}>{email.charAt(0).toUpperCase()}</span>
  </div>
  {showEmail && (
    <div style={styles.emailTooltip}>
      Logged in as: <strong>{email}</strong>
    </div>
  )}
</div>

      <h1 style={styles.title}></h1>
      <p style={styles.email}>Contracts</p>
      {collectionData.length > 0 && (
  <div style={styles.cardContainer}>
    <h3 style={styles.sectionTitle}></h3>
    {collectionData.map((item, index) => (
      <div key={index} style={styles.card}>
        {Object.entries(item).map(([key, value]) => (
          <p key={key} style={styles.cardText}>
            <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {value}
          </p>
        ))}
      </div>
    ))}
  </div>
)}


      <div style={styles.uploadSection}>
        <h3 style={styles.sectionTitle}>Upload a File (PDF, JPG, PNG, DOCX)</h3>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf, .jpg, .jpeg, .png, .docx"
          style={styles.fileInput}
        />
        <button style={styles.uploadButton} onClick={handleFileUpload}>
          Upload and Extract Text
        </button>
        {uploadMessage && <p style={styles.uploadMessage}>{uploadMessage}</p>}
      </div>

      {showForm && (
  <div style={styles.formContainer}>
    <h3 style={styles.sectionTitle}>Extracted Data</h3>
    {Object.keys(formData).map((key) => (
      <label key={key} style={styles.label}>
        {key.replace(/_/g, " ").toUpperCase()}:
        <input
          type="text"
          name={key}
          value={formData[key]}
          onChange={handleChange}
          style={styles.input}
        />
      </label>

      
      
    )
    )}
        {/* Stylish Calendar Input */}
        <label style={styles.label}>
      Destruction Date:
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={styles.calendarInput}
      />
    </label>
     {/* Submit Button */}
    <button style={styles.submitButton} onClick={handleSubmit}>
      Submit Form
    </button>
  </div>
    
  // </div>
)}


    </div>
  );
}

const styles = {
  logoutButton: {
    marginTop: "1rem",
    backgroundColor: "#f38ba8",
    color: "#1e1e2e",
    padding: "0.7rem 1.5rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  
  
  container: {
    backgroundColor: "#1e1e2e",
    color: "#cdd6f4",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    width: "100%", // Use full width

  },
  profileContainer: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    
  },
  
  profileIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#89b4fa",
    color: "#1e1e2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease-in-out",
  },
  

  profileLetter: {
    color: "#1e1e2e",
    fontSize: "1.2rem",
  },
  
  emailTooltip: {
    position: "absolute",
    top: "50px",
    right: "0",
    backgroundColor: "rgba(17, 25, 40, 0.9)",
    color: "#e0f0ff",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
    zIndex: 1000,
  },
  
  title: {
    fontSize: "2.5rem",
    color: "#f5e0dc",
    marginBottom: "1rem",
  },
  email: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    color: "#89b4fa",
  },
  uploadSection: {
    backgroundColor: "#181825",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    marginBottom: "2rem",
    width: "100%",
    maxWidth: "500px",
  },
  cardContainer: {
    justifyContent: "center", // Center cards horizontally

    display: "flex",
    flexWrap: "nowrap", // Prevent cards from wrapping
    overflowX: "auto", // Enable horizontal scrolling
    gap: "1rem",
    marginBottom: "2rem",
    padding: "1rem",
    width: "100%",
    scrollBehavior: "smooth", // Smooth scrolling effect
  
    /* Hide scrollbar for Webkit (Chrome, Safari) */
    WebkitOverflowScrolling: "touch", // Smooth scrolling for iOS
    msOverflowStyle: "none", // Hide scrollbar in IE and Edge
    scrollbarWidth: "none", // Hide scrollbar in Firefox
  },
  
  // Additional CSS for Webkit browsers (Chrome, Safari)
  "::-webkit-scrollbar": {
    display: "none", // Hide scrollbar
  },
  
  
  card: {
    backgroundColor: "rgba(17, 25, 40, 0.8)", // Semi-transparent dark background
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)", // Glass effect
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)", // Smooth shadow
    padding: "1.5rem",
    minWidth: "300px", // Minimum width for cards
    maxWidth: "300px", // Fixed card width
    color: "#e0f0ff",
    transition: "transform 0.3s ease-in-out", // Smooth hover
    flex: "0 0 auto", // Prevent cards from shrinking or wrapping
  },
  
  
  sectionTitle: {
    fontSize: "1.3rem",
    marginBottom: "1rem",
    color: "#f38ba8",
  },
  fileInput: {
    marginBottom: "1rem",
    color: "#cdd6f4",
    backgroundColor: "#313244",
    border: "1px solid #6c7086",
    padding: "0.5rem",
    width: "100%",
    borderRadius: "5px",
  },
  uploadButton: {
    backgroundColor: "#89b4fa",
    color: "#1e1e2e",
    padding: "0.7rem 1.5rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "1rem",
  },
  uploadMessage: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#f38ba8",
  },
  formContainer: {
    backgroundColor: "#181825",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    maxWidth: "500px",
  },
  label: {
    fontSize: "1rem",
    color: "#f2cdcd",
  },

  cardText: {
    marginBottom: "0.8rem",
    fontSize: "1rem",
    color: "#a6c8ff",
    lineHeight: "1.5",
  },
  
  input: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    marginTop: "0.3rem",
    border: "1px solid #6c7086",
    borderRadius: "5px",
    backgroundColor: "#313244",
    color: "#cdd6f4",
  },

  
};

export default HomePage;
