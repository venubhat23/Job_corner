  import React, { useEffect, useState } from "react";
  import { useNavigate, Link } from "react-router-dom";
  import axios from "axios";
  import { FaHome, FaBriefcase, FaUserAlt, FaBars, FaTimes, FaSignOutAlt, FaBell, FaPlus, FaTrash } from 'react-icons/fa';
  import Profile from "./Profile";
  
  // Configure axios defaults
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
    const [sidebar, setSidebar] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const showSidebar = () => setSidebar(!sidebar);
    
    const handleLogout = () => {
      sessionStorage.removeItem('loggedin');
      sessionStorage.removeItem('user_id');
      navigate("/");
    };

    useEffect(() => {
      fetchJobs();
    }, []);

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:5000/jobs", {
          withCredentials: true
        });
        setJobs(response.data);
        setError(null);
      } 
      catch (error) {
        if (error.response && error.response.status === 404) {
          alert("You are not authorized. Redirecting to login...");
          sessionStorage.removeItem('loggedin');
          sessionStorage.removeItem('user_id');
          navigate("/login");
        } else {
          console.error("Error fetching jobs:", error);
          setError("Failed to load job listings. Please try again later.");
        }
      } finally {
        setLoading(false);
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
        await axios.post("http://127.0.0.1:5000/company/post-job", formData, {
          withCredentials: true,
        });
        setShowForm(false);
        setFormData({
          title: "",
          skills: "",
          education: "",
          working_mode: "",
          working_hours: "",
          experience: "",
          package: "",
          location: "",
        });
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

    // Loading state component
    const LoadingState = () => (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-6"></div>
          <p className="text-gray-500">Loading job listings...</p>
        </div>
      </div>
    );

    // Error state component
    const ErrorState = ({ message }) => (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-red-500 mb-2">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load jobs</h3>
        <p className="text-gray-500">{message}</p>
        <button 
          onClick={() => fetchJobs()}
          className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Try again
        </button>
      </div>
    );

    // Individual job card component
    const JobCard = ({ job }) => (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h2>
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
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <div className="flex items-center text-gray-600">
              <span className="font-medium text-gray-700 mr-2">Skills:</span>
              <span>{job.skills}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium text-gray-700 mr-2">Education:</span>
              <span>{job.education}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium text-gray-700 mr-2">Experience:</span>
              <span>{job.experience}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium text-gray-700 mr-2">Mode:</span>
              <span>{job.working_mode} • {job.working_hours}</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end border-t pt-4">
            <button 
              onClick={() => handleDelete(job.id)}
              className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium mr-2"
            >
              <FaTrash className="mr-1" />
              Delete
            </button>
            <Link 
              to={`/job/${job.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );

    // Content components for different tabs
    const DashboardContent = () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Total Jobs Posted</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{jobs.length}</p>
            <p className="text-sm text-gray-500 mt-1">Last updated today</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Active Applicants</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">24</p>
            <p className="text-sm text-gray-500 mt-1">Across all jobs</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Profile Views</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">38</p>
            <p className="text-sm text-gray-500 mt-1">In the last 7 days</p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Job Postings</h2>
            <button 
              onClick={() => setActiveTab("jobs")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View all jobs →
            </button>
          </div>
          
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : (
            <div>
              {jobs.slice(0, 3).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    );

    const JobsContent = () => (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Posted Jobs</h1>
          <button 
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FaPlus className="mr-2" />
            Post New Job
          </button>
        </div>
        
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : jobs.length > 0 ? (
          <div className="space-y-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-indigo-500 mb-4">
              <svg className="h-16 w-16 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-4">Start posting jobs to grow your team.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FaPlus className="mr-2" />
              Post Your First Job
            </button>
          </div>
        )}
      </div>
    );
    const ProfileContent = () => (
      <div className="p-6">    
        {/* Embed the Profile Component Here */}
        <Profile />
      </div>
    );
    
    
    // Job form modal
    const JobFormModal = () => (
      <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">Post New Job</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title}
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required</label>
                <input 
                  type="text" 
                  name="skills" 
                  value={formData.skills}
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education Required</label>
                <input 
                  type="text" 
                  name="education" 
                  value={formData.education}
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Mode</label>
                <input 
                  type="text" 
                  name="working_mode" 
                  value={formData.working_mode}
                  placeholder="Remote/Onsite/Hybrid"
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                <input 
                  type="text" 
                  name="working_hours" 
                  value={formData.working_hours}
                  placeholder="Full-time/Part-time"
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Required</label>
                <input 
                  type="text" 
                  name="experience" 
                  value={formData.experience}
                  placeholder="e.g., 2-3 years"
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Package</label>
                <input 
                  type="text" 
                  name="package" 
                  value={formData.package}
                  placeholder="e.g., 80,000"
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required 
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location}
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required 
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
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
                {activeTab === "jobs" && "Posted Jobs"}
                {activeTab === "profile" && "Company Profile"}
              </h1>
              
              {/* User profile button positioned at the far right edge */}
              <div className="flex items-center" style={{ marginRight: "-166px" }}>
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
                    <span className="ml-2 text-gray-700">Company Admin</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
          
          {/* Page content */}
          <main>
            {activeTab === "dashboard" && <DashboardContent />}
            {activeTab === "jobs" && <JobsContent />}
            {activeTab === "profile" && <ProfileContent />}
          </main>
        </div>
                
        {/* Job Form Modal */}
        {showForm && <JobFormModal />}
      </div>
    );
  };

  export default CompanyHomePage;