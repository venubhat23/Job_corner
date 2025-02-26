import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("Login Successful:", response.data);
      sessionStorage.setItem('loggedin', 'true');
      sessionStorage.setItem('user_id', response.data.user.user_id);
      let login_as = response.data.user.user_type
      let login_is_emp = (login_as === 'employee')
      if (login_is_emp)
        navigate('/employee')
      else navigate('/company')

    } catch (error) {
      console.error("Error response:", error.response || error.message);
      setErrorMessage(error.response?.data?.error || "Server error. Try again!");
    }
  };

    return (
    
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold absolute top-5 left-5">Welcome to JobCorner</h1>
      <div className="bg-white p-6 shadow-lg rounded-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Login</h2>

        {errorMessage && <p className="text-red-500 text-sm mb-3">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4 text-left">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-sm mt-4 text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
