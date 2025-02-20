import React, { useState } from "react";
import axios from "axios";

const RegistrationPage = () => {
  const [isEmployee, setIsEmployee] = useState(true); // State to toggle between Employee and Company
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "", // Added field for Date of Birth
    skills: "",
    education: "",
    experience: "",
    location: "",
    companyName: "",
    industry: "",
    companyDescription: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/register", {
        ...formData,
        user_type: isEmployee ? "employee" : "company"
      });
      alert(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Email already registered. Please try a different one.");
      } else {
        alert('Registration failed. Please try again later.');
      }
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <div>
        {/* Toggle button */}
        <button onClick={() => setIsEmployee(!isEmployee)}>
          {isEmployee ? "Switch to Company Registration" : "Switch to Employee Registration"}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Common fields for both Employee and Company */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        {/* Employee-specific fields */}
        {isEmployee && (
          <>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills"
              required
            />
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Education"
              required
            />
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Experience"
              required
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              required
            />
          </>
        )}

        {/* Company-specific fields */}
        {!isEmployee && (
          <>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              required
            />
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Industry"
              required
            />
            <textarea
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              placeholder="Company Description"
              required
            />
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
