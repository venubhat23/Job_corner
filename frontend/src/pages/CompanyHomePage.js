import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

const CompanyHomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    skills: "",
    education: "",
    working_mode: "",
    working_hours: "",
    experience: "",
    package: "",
    location: "",
  });
  const navigate=useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
        
      const response = await axios.get("http://127.0.0.1:5000/jobs", {
        withCredentials: true  // This next
      });
      
      setJobs(response.data);  
    } 
    catch (error) {
      if (error.response && error.response.status === 404) {
        alert("You are not authorized. Redirecting to login...");
        sessionStorage.removeItem('loggedin');
        sessionStorage.removeItem('user_id');
        navigate("/login");

      } else {
        console.error("Error fetching jobs:", error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/company/post-job", formData,{
        withCredentials: true,
      });
      setShowForm(false);
      fetchJobs(); // Refresh job list
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/company/delete-job/${jobId}`);
        fetchJobs(); // Refresh job list after deletion
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  return (
    <div>
      <h2>Company Job Dashboard</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Post New Job"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Job Title" onChange={handleChange} required />
          <input type="text" name="skills" placeholder="Skills Required" onChange={handleChange} required />
          <input type="text" name="education" placeholder="Education Required" onChange={handleChange} required />
          <input type="text" name="working_mode" placeholder="Working Mode (Remote/Onsite)" onChange={handleChange} required />
          <input type="text" name="working_hours" placeholder="Working Hours" onChange={handleChange} required />
          <input type="text" name="experience" placeholder="Experience Required" onChange={handleChange} required />
          <input type="text" name="package" placeholder="Salary Package" onChange={handleChange} required />
          <input type="text" name="location" placeholder="Job Location" onChange={handleChange} required />
          <button type="submit">Post Job</button>
        </form>
      )}

      <h3>Posted Jobs</h3>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Skills</th>
            <th>Education</th>
            <th>Working Mode</th>
            <th>Working Hours</th>
            <th>Experience</th>
            <th>Package</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td><Link to={`/job/${job.id}`}>{job.title}</Link></td>
              <td>{job.skills}</td>
              <td>{job.education}</td>
              <td>{job.working_mode}</td>
              <td>{job.working_hours}</td>
              <td>{job.experience}</td>
              <td>{job.package}</td>
              <td>{job.location}</td>
              <td>
                <button onClick={() => handleDelete(job.id)} style={{ color: "red", cursor: "pointer" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyHomePage;
