
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaApple } from "react-icons/fa";



function SignupPage() {
  const router = useRouter(); // Initialize the router
  const [formData, setFormData] = useState({
    // username: "",
    email: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/create_user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.message);
        localStorage.setItem("email", formData.email); 
        router.push("/home"); 
      } else {
        setResponseMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      {console.log(error)}
      setResponseMessage("Error connecting to the server");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Sign Up</h2>
       
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
            <button type="submit" style={styles.button}>
          Submit
        </button>
              <p style={styles.loginText}>
  Already a user?{" "}
  <span onClick={() => router.push("/login")} style={styles.loginLink}>
    Log in
  </span>
</p>
<hr style={styles.horizontalLine} />
<button style={styles.socialButton}>
  Continue with Google
  <img
    src="./chrome.png"
    alt="Google"
    style={styles.socialIcon}
  />
</button>
<button style={styles.socialButton}>
  Continue with Apple
  <FaApple style={{ marginLeft: "0.5rem", color: "black" }} />
</button>



    
      </form>
      {responseMessage && <p style={styles.message}>{responseMessage}</p>}


    </div>
  );
}

const styles = {
  loginText: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#333",
  },
  loginLink: {
    color: "#9049fa",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  socialButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "0.8rem",
    margin: "0.5rem 0",
    border: "1px solid #9049fa", // Purple border
    borderRadius: "10px", // Rounded corners
    backgroundColor: "transparent", // Transparent background
    color: "black", // Purple text
    fontSize: "1rem",
    // fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
    textAlign: "center",
  },
  socialIcon: {
    marginLeft: "0.5rem",
    width: "20px", // Adjust size for icons
    height: "20px",
  },
  
  horizontalLine: {
    marginTop: "0.5rem",
    marginBottom: "1rem",
    height: "2px",
    backgroundColor: "#9049fa", // Purple color for the line
    border: "none",
  },
  
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#000", // Black background
    fontFamily: "Arial, sans-serif",
    color: "black",
  },
  form: {
    backgroundColor: "#fff", // White background
    padding: "2rem 1.5rem", // Adjusted padding for smaller form
    borderRadius: "15px", // Slightly rounded corners
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Softer shadow for a clean look
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  },
  
  title: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    margin: "0.5rem 0",
    borderRadius: "10px", // Rounded corners
    border: "1px solid #ddd", // Light gray border for clean design
    backgroundColor: "#f5f5f5", // Light gray background
    color: "#333", // Darker text color for contrast
    textAlign: "start", // Center-align text for modern look
  },
  
  button: {
    width: "100%",
    padding: "0.8rem",
    margin: "1rem 0",
    backgroundColor: "#9049fa", // Purple color for submit button
    color: "#fff", // White text for contrast
    border: "none",
    borderRadius: "10px", // Rounded corners
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    textTransform: "uppercase", // Capitalize button text
    transition: "background-color 0.3s",
  },
  
  message: {
    fontSize: "1rem",
    marginTop: "1rem",
    color: "#007BFF",
  },
};

export default SignupPage;
