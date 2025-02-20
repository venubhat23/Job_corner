import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeHomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  
  const handleLogout = () => {
    navigate("/logout");
    sessionStorage.removeItem('loggedin');
sessionStorage.removeItem('user_id');
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);
  const handleApply = async (jobId) => {
    const userId = sessionStorage.getItem("user_id"); // Ensure you get the actual logged-in user ID
  
    try {
      const response = await fetch("http://localhost:5000/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, job_id: jobId }),
        credentials: "include", // Ensure session handling
      });
  
      const data = await response.json();
  
      if (response.status === 403) {
        alert("Unauthorized. Redirecting to login...");
        navigate("/login"); // Redirect to Login.js
      } else if (response.status === 409) {
        alert(data.error);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };
  
  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.experience.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>

                <svg
                  className="block size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>

                <svg
                  className="hidden size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <button onClick={handleLogout}>Logout</button>

      {/* Search bar */}
      <div className="my-4">
        <input
          type="text"
          placeholder="Search by title, company, experience, or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded"
        />
      </div>

      <div>
        <h2>Available Jobs</h2>
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Company Name</th>
              <th>Skills</th>
              <th>Education</th>
              <th>Working Mode</th>
              <th>Working Hours</th>
              <th>Experience</th>
              <th>Package</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{job.title}</td>
                <td>{job.company_name}</td>
                <td>{job.skills}</td>
                <td>{job.education}</td>
                <td>{job.working_mode}</td>
                <td>{job.working_hours}</td>
                <td>{job.experience}</td>
                <td>{job.package}</td>
                <td>{job.location}</td>
                <td>
                  <button onClick={() => handleApply(job.id)}>Apply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EmployeeHomePage;
