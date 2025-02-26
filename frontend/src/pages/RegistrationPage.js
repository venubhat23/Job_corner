import React, { useState } from "react";
import axios from "axios";

const RegistrationPage = () => {
  const [isEmployee, setIsEmployee] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    skills: "",
    education: "",
    experience: "",
    location: "",
    companyName: "",
    industry: "",
    companyDescription: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/register", {
        ...formData,
        user_type: isEmployee ? "employee" : "company",
      });
      alert(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Email already registered. Please try a different one.");
      } else {
        alert("Registration failed. Please try again later.");
      }
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Register</h2>
        <button
          onClick={() => setIsEmployee(!isEmployee)}
          className="w-full mb-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition"
        >
          {isEmployee ? "Switch to Company Registration" : "Switch to Employee Registration"}
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="input-field" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="input-field" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="input-field" />
          {isEmployee ? (
            <>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="input-field" />
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills" required className="input-field" />
              <input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="Education" required className="input-field" />
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience" required className="input-field" />
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required className="input-field" />
            </>
          ) : (
            <>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required className="input-field" />
              <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry" required className="input-field" />
              <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} placeholder="Company Description" required className="input-field" />
            </>
          )}

          <button type="submit" className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;

// Tailwind CSS Input Field Style
const inputFieldStyle = "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
document.querySelectorAll(".input-field").forEach(el => el.className = inputFieldStyle);
