import { useNavigate, Link, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHome, FaBriefcase, FaFileAlt, FaUserAlt, FaBars, FaTimes, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { RecentJobsSection, AvailableJobsSection } from './EnhancedJobListings';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

const EmployeeHomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebar, setSidebar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [appliedLoading, setAppliedLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedError, setAppliedError] = useState(null);
  const navigate = useNavigate();
  
  const showSidebar = () => setSidebar(!sidebar);
  
  const handleLogout = () => {
    sessionStorage.removeItem('loggedin');
    sessionStorage.removeItem('user_id');
    navigate("/login");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:5000/jobs", {
          withCredentials: true
        });
        setJobs(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to load job listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  
  // Fetch applied jobs whenever activeTab is "applications"
  useEffect(() => {
    if (activeTab === "applications") {
      const fetchAppliedJobs = async () => {
        setAppliedLoading(true);
        try {
          const response = await axios.get("http://127.0.0.1:5000/applied-jobs", {
            withCredentials: true
          });
          
          setAppliedJobs(response.data.applied_jobs);
          setAppliedError(null);
        } catch (error) {
          console.error("Error fetching applied jobs:", error);
          if (error.response && error.response.status === 401) {
            alert("Please login to view your applications");
            navigate("/login");
          } else {
            setAppliedError("Failed to load your applications. Please try again later.");
          }
        } finally {
          setAppliedLoading(false);
        }
      };

      fetchAppliedJobs();
    }
  }, [activeTab, navigate]);
 
  const handleApply = async (jobId) => {
    const userId = sessionStorage.getItem("user_id"); 

    if (!userId) {
        alert("User not logged in. Redirecting to login...");
        navigate("/login");
        return;
    }

    try {
        const response = await axios.post("http://127.0.0.1:5000/apply", {
          user_id: userId,
          job_id: jobId
        }, { 
          withCredentials: true 
        });
        
        alert(response.data.message || "Application submitted!");
    } catch (error) {
        console.error("Error applying for job:", error);
        if (error.response) {
            if (error.response.status === 403) {
                alert("Unauthorized. Redirecting to login...");
                navigate("/login");
            } else if (error.response.status === 409) {
                alert(error.response.data.error || "You've already applied for this job");
            } else {
                alert(error.response.data.error || "Something went wrong");
            }
        } else {
            alert("Something went wrong. Please try again.");
        }
    }
  };
  
  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) => {
    return (
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.experience?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Content components for different tabs
  const DashboardContent = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Active Applications</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">5</p>
          <p className="text-sm text-gray-500 mt-1">Last updated today</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Jobs Matched</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{jobs.length}</p>
          <p className="text-sm text-gray-500 mt-1">Based on your profile</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Profile Views</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">12</p>
          <p className="text-sm text-gray-500 mt-1">In the last 7 days</p>
        </div>
      </div>
      
      {/* Use the enhanced Recent Jobs component */}
      <RecentJobsSection 
        jobs={filteredJobs}
        loading={loading}
        error={error}
        handleApply={handleApply}
      />
      <div className="mt-4 text-right">
        <button 
          onClick={() => setActiveTab("jobs")}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View all jobs →
        </button>
      </div>
    </div>
  );

  const JobsContent = () => (
    <div className="p-6">
      {/* Use the enhanced Available Jobs component */}
      <AvailableJobsSection 
        jobs={filteredJobs}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleApply={handleApply}
      />
    </div>
  );
  
  // New component for My Applications
  const ApplicationsContent = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      
      {appliedLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : appliedError ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          <p>{appliedError}</p>
        </div>
      ) : appliedJobs && appliedJobs.length > 0 ? (
        <div className="space-y-6">
          {appliedJobs.map((job) => (
            <div key={job.job_id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h2>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaBriefcase className="mr-2 text-indigo-600" />
                      <span>{job.company_name}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg className="h-5 w-5 text-indigo-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-indigo-600">₹{job.package}</div>
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Applied
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center border-t pt-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Application Status:</span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Under Review
                    </span>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-indigo-500 mb-4">
            <svg className="h-16 w-16 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-500 mb-4">You haven't applied for any jobs yet.</p>
          <button 
            onClick={() => setActiveTab("jobs")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Browse Jobs
          </button>
        </div>
      )}
    </div>
  );

  // Navigation data array with icons
  const navigationItems = [
    {
      title: "Dashboard",
      tab: "dashboard",
      icon: <FaHome className="w-5 h-5" />
    },
    {
      title: "Jobs",
      tab: "jobs",
      icon: <FaBriefcase className="w-5 h-5" />
    },
    {
      title: "My Applications",
      tab: "applications",
      icon: <FaFileAlt className="w-5 h-5" />
    },
    {
      title: "Profile",
      tab: "profile",
      icon: <FaUserAlt className="w-5 h-5" />
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Hamburger menu for mobile */}
      <div className="md:hidden fixed z-50 top-4 left-4">
        <button 
          onClick={showSidebar} 
          className="text-white bg-indigo-600 p-2 rounded-md"
        >
          <FaBars />
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`bg-indigo-900 text-white fixed h-screen z-40 transition-all duration-300 ease-in-out ${sidebar ? 'w-64' : 'w-0 md:w-20'} overflow-hidden`}>
        {/* Logo area */}
        <div className="p-4 flex items-center border-b border-indigo-800 justify-between">
          <div className="flex items-center">
            <img 
              className="h-8 w-auto mr-2" 
              src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=white" 
              alt="JobGuru" 
            />
            <span className={`text-xl font-semibold transition-opacity duration-200 ${sidebar ? 'opacity-100' : 'opacity-0 md:hidden'}`}>JobGuru</span>
          </div>
          <button onClick={showSidebar} className="text-white md:hidden">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation links */}
        <nav className="mt-5 px-2">
          {navigationItems.map((item, index) => (
            <a 
              key={index}
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.tab);
              }}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md mb-2 transition-all duration-200 ease-in-out ${
                activeTab === item.tab 
                  ? "bg-indigo-700 text-white shadow-lg" 
                  : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
              }`}
            >
              <div className="flex items-center">
                {item.icon}
                <span className={`ml-4 transition-opacity duration-200 ${sidebar ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
                  {item.title}
                </span>
              </div>
            </a>
          ))}
        </nav>
        
        {/* Logout button at bottom */}
        <div className="absolute bottom-0 w-full border-t border-indigo-800 py-4">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-sm font-medium text-indigo-200 hover:bg-indigo-800 hover:text-white w-full transition-all duration-150"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className={`ml-4 transition-opacity duration-200 ${sidebar ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebar ? 'ml-64' : 'ml-0 md:ml-20'}`}>
        {/* Top navigation */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <h1 className="text-lg font-semibold">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "jobs" && "Jobs"}
              {activeTab === "applications" && "My Applications"}
              {activeTab === "profile" && "Profile"}
            </h1>
            
            {/* User profile button positioned at the far right edge */}
            <div className="flex items-center " style={{ marginRight: "-166px" }}>
              <div className="relative mr-4">
                <button className="flex items-center text-gray-500 hover:text-gray-700 relative">
                  <span className="sr-only">Notifications</span>
                  <FaBell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </div>
              
              <div className="relative">
                <button className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <span className="ml-2 text-gray-700">John Doe</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main>
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "jobs" && <JobsContent />}
          {activeTab === "applications" && <ApplicationsContent />}
          {activeTab === "profile" && (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Profile</h1>
              <p className="text-gray-500">Manage your profile information here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeeHomePage;