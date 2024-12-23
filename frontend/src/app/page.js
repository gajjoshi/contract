
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";


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
        localStorage.setItem("email", formData.email); e
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
              <p style={styles.loginText}>
  Already a user?{" "}
  <span onClick={() => router.push("/login")} style={styles.loginLink}>
    Log in
  </span>
</p>
        <button type="submit" style={styles.button}>
          Submit
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
    color: "#007BFF",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
    color: "black",
  },
  form: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: "0.8rem",
    margin: "1rem 0",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  message: {
    fontSize: "1rem",
    marginTop: "1rem",
    color: "#007BFF",
  },
};

export default SignupPage;
