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
  const [activeNavItem, setActiveNavItem] = useState("notification"); // State for active nav item
  const router = useRouter(); // Initialize useRouter


  const [email, setEmail] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [selectedDate, setSelectedDate] = useState(""); // Add this line
  const [collectionData, setCollectionData] = useState([]);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null); // State to track expanded card
  const [toggleState, setToggleState] = useState("Urgent"); // Default state

  const [fetchedDocuments, setFetchedDocuments] = useState([]); // State to store fetched documents

const fetchAndDisplayDocuments = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/get_collection_data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // Pass the email as a parameter
    });

    const result = await response.json();
    if (response.ok) {
      setFetchedDocuments(result.data); // Store the fetched documents in the state
      console.log("Fetched Documents:", result.data);
    } else {
      console.error("Failed to fetch documents:", result.error);
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};


  const handleToggle = (state) => {
    setToggleState(state); // Now supports "Urgent", "Upcoming", and "All"
  };
  


  const [showEmail, setShowEmail] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("email"); // Remove email from localStorage
    window.location.href = "/"; // Redirect to the login/signup page
  };
  const toggleCardExpansion = (index) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };
  const getDueDateLabel = (dueDate) => {
    if (!dueDate) return null;
    const [day, month, year] = dueDate.split('/'); // Split the date string into day, month, and year
    const due = new Date(year, month - 1, day); // Month is 0-based in JavaScript


  
    const today = new Date();
  
    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Difference in days
    console.log("Due Date: " + due)
    console.log("today: " + today)

    console.log("TimeDiff: " + daysDiff)
  
    if (daysDiff === 0) {
      return { label: "Due Today", color: "white" };
    } else if (daysDiff === 1) {
      return { label: "Due Tomorrow", color: "white" };
    } else if (daysDiff < 0) {
      return {
        label: `Overdue by ${Math.abs(daysDiff)} days`,
        color: "red",
      };
    }
  
    return null; // If it's not today, tomorrow, or overdue
  };
  
  
  







  const handleNavClick = (navItem, path) => {
    if (email) {
      setActiveNavItem(navItem); // Update the active navigation item state
      router.push(path);
    } else {
      console.error("Email is missing.");
    }
  };
  


  useEffect(() => {
    if (email) {
      fetchAndDisplayDocuments(); // Fetch data when email is set
    }
  }, [email]);
  


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
    setActiveNavItem(pathToNavItem[router.pathname] || "notification");
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
  <div style={styles.toggleContainer}>
  <button
    style={{
      ...styles.toggleButton,
      ...(toggleState === "Urgent" ? styles.activeToggle : {}),
    }}
    onClick={() => handleToggle("Urgent")}
  >
    Urgent
  </button>
  <button
    style={{
      ...styles.toggleButton,
      ...(toggleState === "Upcoming" ? styles.activeToggle : {}),
    }}
    onClick={() => handleToggle("Upcoming")}
  >
    Upcoming
  </button>
  <button
    style={{
      ...styles.toggleButton,
      ...(toggleState === "All" ? styles.activeToggle : {}),
    }}
    onClick={() => handleToggle("All")}
  >
    All
  </button>



  
  </div>
  {fetchedDocuments.length > 0 ? (
  fetchedDocuments
    .filter((doc) => {
      const dueDateInfo = getDueDateLabel(doc.due_date);
      
      if (toggleState === "Urgent") {
        // Show only cards with "Due Tomorrow"
        return dueDateInfo?.label === "Due Tomorrow";
      }
      if (toggleState === "Upcoming") {
        // Show only cards with overdue dates
        return dueDateInfo?.label && dueDateInfo.label.includes("Overdue");
      }
      return true; // Show all cards for "All" toggle
    })
    .map((doc, index) => {
      const dueDateInfo = getDueDateLabel(doc.due_date);

      return (
        <div key={index} style={styles.fetchedDocumentCard}>
          {/* Due Date Label */}
          {dueDateInfo && (
            <div style={{ color: dueDateInfo.color, fontWeight: "bold", marginBottom: "10px" }}>
              {dueDateInfo.label}
            </div>
          )}

          {/* Header Section */}
          <div style={styles.headerContainer}>
            <h3 style={styles.headerText}>
              <FontAwesomeIcon icon="file-alt" style={styles.billIcon} />
              Contract: {doc.contract_title || "N/A"}
            </h3>
          </div>

          <hr style={styles.horizontalLine} /> {/* Centered horizontal line */}

          {expandedCardIndex === index ? (
            // Expanded view with two-column layout
            <div style={styles.expandedContainer}>
              {/* Left Column */}
              <div style={styles.column}>
                {Object.entries(doc)
                  .filter((_, i) => i % 2 === 0) // Even-indexed entries
                  .map(([key, value]) => (
                    <p key={key} style={styles.expandedText}>
                      <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {value}
                    </p>
                  ))}
              </div>
              {/* Right Column */}
              <div style={styles.column}>
                {Object.entries(doc)
                  .filter((_, i) => i % 2 !== 0) // Odd-indexed entries
                  .map(([key, value]) => (
                    <p key={key} style={styles.expandedText}>
                      <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {value}
                    </p>
                  ))}
              </div>
            </div>
          ) : (
            // Collapsed view with two-column layout
            <div style={styles.collapsedContainer}>
              {/* Left Column */}
              <div style={styles.column}>
                <p style={styles.collapsedText}>
                  <strong>PROVIDER NAME:</strong> {doc.provider_name}
                </p>
                <p style={styles.collapsedText}>
                  <strong>ACTIVATION DATE:</strong> {doc.activation_date}
                </p>
                <p style={styles.collapsedText}>
                  <strong>DESTRUCTION DATE:</strong> {doc.destruction_date}
                </p>
              </div>
              {/* Right Column */}
              <div style={styles.column}>
                <p style={styles.collapsedText}>
                  <strong>RENEWAL TYPE:</strong> {doc.renewal_type}
                </p>
                <p style={styles.collapsedText}>
                  <strong>DUE DATE:</strong> {doc.due_date}
                </p>
                <p style={styles.collapsedText}>
                  <strong>LIABILITY LIMITATIONS:</strong> {doc.liability_limitations}
                </p>
              </div>
            </div>
          )}

          {/* Read More/Read Less button */}
          <button
            style={styles.readMoreButton}
            onClick={() => toggleCardExpansion(index)}
          >
            {expandedCardIndex === index ? "Read Less" : "Read More"}
          </button>
          {/* Extend Contract Button */}
          <button
            style={styles.extendButton}
            onClick={() => console.log("Extend Contract clicked for index:", index)}
          >
            Extend Contract
          </button>

          {/* Delete Contract Button */}
          <button
            style={styles.deleteButton}
            onClick={() => console.log("Delete Contract clicked for index:", index)}
          >
            Delete Contract
          </button>
        </div>
      );
    })
) : (
  <p>No documents found.</p>
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
  dueDateLabel: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center", // Center align the label
  },
  
  expandedContainer: {
    display: "flex",
    justifyContent: "space-between", // Divide into two columns
    gap: "1rem", // Space between columns
    padding: "10px 20px", // Padding for readability
  },
  collapsedContainer: {
    display: "flex",
    justifyContent: "space-between", // Divide into two columns
    gap: "1rem", // Space between columns
    padding: "10px 20px", // Padding for readability
  },
  extendButton: {
    backgroundColor: "white",
    color: "black",
    border: "2px solid black",
    borderRadius: "5px",
    padding: "0.5rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
    // marginRight: "0.5rem",
    transition: "all 0.3s ease",
    fontWeight: "bold", // Makes the text bold
    marginLeft: "0.5rem",

  },
  deleteButton: {
    backgroundColor: "#904af8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "0.5rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
    marginLeft: "0.5rem",
    transition: "all 0.3s ease",
  },
  
  column: {
    flex: 1, // Equal width for both columns
  },
  headerContainer: {
    backgroundColor: "#904af8", // Purple background
    padding: "1rem",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    textAlign: "center", // Center align the content
    display: "flex",
    justifyContent: "center",
    margin: "0", // Remove default margins
    width: "100%", // Ensure it spans the full width


    alignItems: "center",
  },
  headerText: {
    color: "#ffffff", // White text for contrast
    fontSize: "1.5rem", // Larger font size
    fontWeight: "bold", // Bold text
    margin: 0, // Remove default margin
    display: "flex",
    alignItems: "center",
    gap: "0.5rem", // Space between the icon and text
  },
  billIcon: {
    color: "#ffffff", // White color for the icon
    fontSize: "1.5rem", // Icon size matching the text
  },
  
  expandedText: {
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
    color: "white",
    lineHeight: "1.5",
  },
  collapsedText: {
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
    color: "white",
    lineHeight: "1.5",
  },
  
  
  

  
  fetchedDocumentsContainer: {
    alignItems: "center",

    marginTop: "20px",
    color: "white",
    padding: "20px",
    border: "3px solid #904af8", // Purple border matching the background aesthetics
    borderRadius: "10px", // Rounded corners for a smoother look
    backgroundColor: "#1e1e2e", // Dark background for contrast
  },
  fetchedDocumentCard: {
    justifyContent: "center", // Center children vertically
    marginBottom: "50px",
    marginLeft: "50px",

    // padding: "10px",
    borderRadius: "20px",
    border: "2px solid #904af8", // Purple border matching the background aesthetics
    backgroundColor: "black", // Dark background for contrast
    width:"70%",
        // display: "flex", // Use flexbox for content inside the card
        // flexDirection: "column", // Arrange content in a column





  },
  horizontalLine: {
    paddingLeft: "2px",
    border: "none", // Remove default border style
    height: "2px", // Set the line thickness
    backgroundColor: "#904af8", // Purple color matching the theme
    margin: "10px auto", // Center horizontally and add vertical spacing
    width: "100%", // Adjust the width to fit within the container
    marginTop:"0px",
  },
  readMoreButton: {
    background: "linear-gradient(135deg, #FFD700, #FFAA00)", // Gradient for golden texture
    color: "#1e1e2e",
    border: "none",
    borderRadius: "5px",
    padding: "0.5rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
    alignSelf: "flex-end",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)", // Add shadow for depth
    transition: "all 0.3s ease", // Smooth hover effect
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
    justifyContent:"center",
    alignItems: "center",
  
  },
  greeting: {
    color: "#f5e0dc", // Light text color for visibility
    fontSize: "2rem", // Font size
    fontWeight: "bold", // Make it stand out
    // marginBottom: "1rem", // Add spacing below the greeting
  },
  toggleContainer: {
    marginTop:"50px",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Ensure buttons fill the container
    backgroundColor: "black",
    borderRadius: "20px",
    padding: "0.5rem",
    marginBottom:"50px",
    marginLeft: "50px", // Position beside the navbar
    width: "400px", // Adjusted width to fit three buttons
    // boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    border: "2px solid #904af8", // Purple border
  },
  
  toggleButton: {
    flex: 1, // Make buttons take equal space
    padding: "0.5rem 1rem",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "transparent",
    color: "white",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
    textAlign: "center",
  },
  activeToggle: {
    backgroundColor: "#904af8", // Purple background for active state
    color: "white",
    flex: 1, // Ensure it fully occupies the allotted space
    transition: "all 0.3s ease", // Smooth transition when toggling
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
    height:"300px",
    backgroundColor: "#904af8",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px", // Rounded corners
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    padding: "1rem",
    width: "200px", // Fixed card width
    color: "#e0f0ff",
    transition: "transform 0.3s ease-in-out",
    overflow: "hidden", // Hide overflow content
    textOverflow: "ellipsis",
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
    backgroundColor: "#89b4fa",
    color: "#1e1e2e",
    border: "none",
    borderRadius: "5px",
    padding: "0.5rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
    marginLeft: "0.5rem",


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
