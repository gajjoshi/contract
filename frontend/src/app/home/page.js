"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";


// lib/fontawesome.js
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faCog,
  faBell,
  faFileAlt,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// Add the icons to the library
library.add(faHome, faCog, faBell, faFileAlt, faPlus, faUser);

function HomePage() {
  const [activeNavItem, setActiveNavItem] = useState("home"); // State for active nav item
  const router = useRouter(); // Initialize useRouter


  const [email, setEmail] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [selectedDate, setSelectedDate] = useState(""); // Add this line
  const [collectionData, setCollectionData] = useState([]);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null); // State to track expanded 
  const [modalData, setModalData] = useState(null); // State for modal data
const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility


const openModal = (data) => {
  setModalData(data); // Set data for modal
  setIsModalOpen(true); // Open modal
};

const closeModal = () => {
  setIsModalOpen(false); // Close modal
};



  const [showEmail, setShowEmail] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("email"); // Remove email from localStorage
    window.location.href = "/"; // Redirect to the login/signup page
  };
  const toggleCardExpansion = (index) => {
    if (expandedCardIndex === index) {
      setExpandedCardIndex(null); // Collapse if already expanded
    } else {
      setExpandedCardIndex(index); // Expand and show modal
      openModal(collectionData[index]);
    }
  };
  





  const [formData, setFormData] = useState({
    // contract_type:"",
    contract_title:"",
    // due_date_for_todays_month_as_per_calendar:"",
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
    reminder:"",
  });


  const handleNavClick = (navItem, path) => {
    if (email) {
      setActiveNavItem(navItem); // Update the active navigation item state
      router.push(path);
    } else {
      console.error("Email is missing.");
    }
  };
  


  


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
        body: JSON.stringify({ email: email }), 
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
      console.log(data);
      if (response.ok) {
        console.log("andres")
        const jsonMatch = data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          if (jsonMatch) {
  try {
    const jsonData = JSON.parse(jsonMatch[0]);
    setFormData({ ...formData, ...jsonData });
    // console.log("form data: " + formData);

  } catch (err) {
    console.error("JSON Parsing Error:", err);
    setUploadMessage("Failed to parse extracted data.");
  }
} else {
  console.error("No JSON Match Found.");
  setUploadMessage("Extracted text does not contain valid JSON.");
}

          setFormData({

            contract_title: jsonData.contract_title_along_with_provider_name || "",
            // due_date_for_todays_month_as_per_calendar:jsonData.due_date_for_todays_month_as_per_calendar || "",
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
          console.log(formData)
        }
        console.log("form data: " + formData);

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

  useEffect(() => {
    const pathToNavItem = {
      "/home": "home",
      "/notification": "notification",
      "/documents": "documents",
      "/add": "add",
      "/profile": "profile",
      "/settings": "settings",
    };
    setActiveNavItem(pathToNavItem[router.pathname] || "home");
  }, [router.pathname]);
  
  
  

  return (
    
    
    <div style={styles.container}>
      {/* <button style={styles.logoutButton} onClick={() => handleLogout()}>
  Logout
</button> */}
<nav style={styles.navBar}>
  {/* Logo */}
  <div style={styles.logoContainer}>
    <Image src="/logo3.png" alt="Logo" width={80} height={80} />
  </div>
  <div
  style={{
    ...styles.navItem,
    ...(activeNavItem === "home" ? styles.navItemActive : {}),
  }}
  onClick={() => handleNavClick("home", "/home")}
>
  <FontAwesomeIcon icon="home" style={styles.icon} />
</div>

<div
  style={{
    ...styles.navItem,
    ...(activeNavItem === "notification" ? styles.navItemActive : {}),
  }}
  onClick={() => handleNavClick("notification", "/notification")}
>
  <FontAwesomeIcon icon="bell" style={styles.icon} />
</div>

<div
  style={{
    ...styles.navItem,
    ...(activeNavItem === "documents" ? styles.navItemActive : {}),
  }}
  onClick={() => handleNavClick("documents", "/documents")}
>
  <FontAwesomeIcon icon="file-alt" style={styles.icon} />
</div>

<div
  style={{
    ...styles.navItem,
    ...(activeNavItem === "add" ? styles.navItemActive : {}),
  }}
  onClick={() => handleNavClick("add", "/add")}
>
  <FontAwesomeIcon icon="plus" style={styles.icon} />
</div>

<div
  style={{
    ...styles.navItem,
    ...(activeNavItem === "profile" ? styles.navItemActive : {}),
  }}
  onClick={() => handleNavClick("profile", "/profile")}
>
  <FontAwesomeIcon icon="user" style={styles.icon} />
</div>

<div
  style={{
    ...styles.navItem,
    ...(activeNavItem === "settings" ? styles.navItemActive : {}),
  }}
  onClick={() => handleNavClick("settings", "/settings")}
>
  <FontAwesomeIcon icon="cog" style={styles.icon} />
</div>

</nav>
<div style={styles.outerContainer}>
<h1 style={styles.greeting}>
    Hi {email || "User"},
    <br />
    <h2 style={styles.welcome}>Welcome to BillSync</h2>
    
  </h1>








{/* <div style={styles.profileContainer}>
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
</div> */}
<h1 style={styles.title}></h1>
<p style={styles.email}>Contracts</p>

{collectionData.length > 0 && (
  <div style={styles.cardContainer}>
    {collectionData.map((item, index) => (
      <div key={index} style={styles.card}>
        {Object.entries(item)
          .slice(0, 3) // Show only the first 3 fields on the card
          .map(([key, value]) => (
            <p key={key} style={styles.cardText}>
              <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {value}
            </p>
          ))}

        {/* Read More Button */}
        <button
          style={styles.readMoreButton}
          onClick={() => toggleCardExpansion(index)}
        >
          Read More
        </button>
      </div>
    ))}

    {/* Modal */}
    {expandedCardIndex !== null && (
      <div
        style={styles.modalOverlay}
        onClick={(e) => {
          // Close the modal if the overlay is clicked (not the modal itself)
          if (e.target === e.currentTarget) toggleCardExpansion(null);
        }}
      >
        <div style={styles.modal}>
          <button style={styles.closeButton} onClick={() => toggleCardExpansion(null)}>
            &times;
          </button>
          <div style={styles.modalContent}>
            {Object.entries(collectionData[expandedCardIndex]).map(([key, value]) => (
              <p key={key} style={styles.modalText}>
                <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {value}
              </p>
            ))}
          </div>
        </div>
      </div>
    )}
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





      
      {showForm && formData && (
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
    <label style={styles.label}>
  Reminder (in days):
  <input
    type="number"
    value={formData.reminder || ""}
    onChange={(e) => handleChange({ target: { name: "reminder", value: e.target.value } })}
    style={styles.input}
    min="0" // Ensure only non-negative values
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
  icon: {
    fontSize: "2rem",
    color: "black", // Icon color
    transition: "color 0.3s ease", // Smooth color transition
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(8px)", // Blur effect for background
  },
  
  modal: {
    backgroundColor: "#181825",
    color: "#cdd6f4",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
    maxWidth: "600px",
    width: "80%",
    animation: "grow 0.3s ease-in-out forwards", // Grow animation
    position: "relative",
    maxHeight: "80vh", // Limit modal height
    overflow: "hidden", // Prevent overflow beyond modal container
  },
  
  modalContent: {
    maxHeight: "calc(80vh - 3rem)", // Adjust height to fit within modal
    overflowY: "auto", // Enable vertical scrolling
    paddingRight: "0.5rem", // Add some padding for better visibility
    scrollbarWidth: "thin", // For Firefox
    scrollbarColor: "#904af8 #181825", // For Firefox (thumb color, track color)
  },
  
  modalText: {
    marginBottom: "1rem",
    fontSize: "1rem",
  },
  
  closeButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "none",
    color: "#f38ba8",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  
  "@keyframes grow": {
    "0%": {
      transform: "scale(0.8)",
      opacity: 0,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
  
  
  outerContainer: {
    height:"100vh",
    width: "calc(100% - 150px)", // Full width minus the sidebar width
    backgroundColor: "black", // Semi-transparent gray
    padding: "2rem",
    margin: "0", // Remove unnecessary margins
    position: "absolute",
    top: "20px",
    left: "150px", // Start right after the sidebar
    overflow: "auto", // Handle overflow if content exceeds viewport height
    borderTopLeftRadius: "50px", // Add rounding only on the top-left corner
    // overflowY: "hidden", // Prevent vertical scrolling
    overflowY: "auto", // Enable vertical scrolling


  
  },
  greeting: {
    color: "#f5e0dc", // Light text color for visibility
    fontSize: "2rem", // Font size
    fontWeight: "bold", // Make it stand out
    // marginBottom: "1rem", // Add spacing below the greeting
  },
  welcome: {
    color: "white", // Light text color for visibility
    fontSize: "1rem", // Font size
    fontWeight: "300", // Light weight
    // fontStyle: "italic", // Italicize the text    // marginBottom: "1rem", // Add spacing below the greeting
  },
  
  
  
  
  
  
  container: {
    backgroundColor: "#904af8",
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
  navBar: {
    position: "fixed", // Keep it in place
    top: "0",
    left: "0",
    width: "100px", // Set the width of the sidebar
    height: "100%", // Full height of the page
    backgroundColor: "#904af8", // Sidebar background color
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    // boxShadow: "2px 0 5px rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
    color: "#cdd6f4",
    borderTopRightRadius: "20px", // Add rounded corner at the intersection

  },
  navItem: {
    width: "50px",
    height: "50px",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // Default transparent background
    borderRadius: "10%",
    cursor: "pointer",
    transition: "all 0.3s ease", // Smooth hover transition
  },
  navItemHover: {
    backgroundColor: "#ffffff", // White background on hover
    transform: "scale(1.2)", // Slightly increase size on hover
    boxShadow: "0 4px 10px rgba(255, 255, 255, 0.6)", // Glow effect
  },
  navItemActive: {
    backgroundColor: "white",
    color: "#1e1e2e",
    borderRadius: "10px",
  },
  content: {
    marginLeft: "250px", // Leave space for the sidebar
    padding: "1rem",
    flex: "1",
  },
  logoContainer: {
    marginBottom: "2rem", // Space below the logo
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
    // justifyContent: "center", // Center cards horizontally
    alignItems:"start",

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
    flex: "0 0 300px", // Fixed card width, prevents shrinking or growing
    display: "flex", // Use flexbox
    flexDirection: "column", // Stack content vertically

    height:"300px",
    backgroundColor: "#904af8",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px", // Rounded corners
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    padding: "1rem",
    width: "200px", // Fixed card width
    color: "#e0f0ff",
    transition: "transform 0.3s ease-in-out",
    // overflow: "hidden", // Hide overflow content
    textOverflow: "ellipsis",
    overflow: "hidden", // Hide overflowing content

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
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
    color: "white",
    lineHeight: "1.4",
  },
  readMoreButton: {
    background: "linear-gradient(135deg, #FFD700, #FFAA00)", // Yellow-to-Golden gradient
    // background: "black", // Yellow-to-Golden gradient

    color: "#1e1e2e",
    border: "none",
    borderRadius: "5px",
    padding: "0.5rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontSize: "0.9rem",
    marginTop: "auto", // Push it to the bottom
    alignSelf: "flex-end", // Align to the right (optional)
    marginBottom: "10px", // Add space between button and container bottom


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
