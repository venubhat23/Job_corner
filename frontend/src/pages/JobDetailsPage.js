import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaBriefcase, FaMapMarkerAlt, FaGraduationCap, FaClock, FaMoneyBillWave, FaUserClock, FaCalendarAlt, FaBuilding } from 'react-icons/fa';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyStatus, setApplyStatus] = useState(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:5000/job/${jobId}`, {
          withCredentials: true
        });
        setJob(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  const handleApply = async () => {
    try {
      await axios.post(`http://127.0.0.1:5000/apply/${jobId}`, {}, {
        withCredentials: true
      });
      setApplyStatus('success');
    } catch (error) {
      console.error("Error applying for job:", error);
      setApplyStatus('error');
    }
  };

  // Loading state component
  const LoadingState = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8 text-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="flex space-x-4 w-full mb-6">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="h-40 bg-gray-200 rounded w-full mb-6"></div>
        <div className="h-10 bg-gray-200 rounded w-48"></div>
        <p className="text-gray-500 mt-4">Loading job details...</p>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = ({ message }) => (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8 text-center">
      <div className="text-red-500 mb-4 text-5xl">⚠️</div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">Unable to load job details</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Go Back
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Application status toast
  const StatusToast = ({ status }) => {
    if (!status) return null;
    
    return (
      <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg ${
        status === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white font-medium animate-fade-in-out`}>
        {status === 'success' ? 
          'Application submitted successfully!' : 
          'Failed to apply. Please try again.'}
      </div>
    );
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!job) return <ErrorState message="Job not found" />;

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <FaArrowLeft className="mr-2" />
          Back to Jobs
        </button>
      </div>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with company branding */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 py-6 px-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
              <div className="flex items-center text-indigo-100">
                <FaBuilding className="mr-2" />
                <span className="font-medium">ABC Company Inc.</span>
              </div>
            </div>
            <div className="bg-white py-2 px-4 rounded-md shadow-md">
              <div className="text-xl font-bold text-indigo-700">₹{job.package}</div>
              <div className="text-xs text-gray-500">Annual</div>
            </div>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            <div className="flex flex-col items-center p-3 rounded-lg bg-indigo-50">
              <div className="bg-indigo-100 p-2 rounded-full mb-2">
                <FaMapMarkerAlt className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="font-medium text-gray-900">{job.location}</div>
              <div className="text-xs text-gray-500">Location</div>
            </div>
            
            <div className="flex flex-col items-center p-3 rounded-lg bg-indigo-50">
              <div className="bg-indigo-100 p-2 rounded-full mb-2">
                <FaUserClock className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="font-medium text-gray-900">{job.experience}</div>
              <div className="text-xs text-gray-500">Experience</div>
            </div>
            
            <div className="flex flex-col items-center p-3 rounded-lg bg-indigo-50">
              <div className="bg-indigo-100 p-2 rounded-full mb-2">
                <FaBriefcase className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="font-medium text-gray-900">{job.working_mode}</div>
              <div className="text-xs text-gray-500">Work Mode</div>
            </div>
            
            <div className="flex flex-col items-center p-3 rounded-lg bg-indigo-50">
              <div className="bg-indigo-100 p-2 rounded-full mb-2">
                <FaClock className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="font-medium text-gray-900">{job.working_hours}</div>
              <div className="text-xs text-gray-500">Schedule</div>
            </div>
          </div>
        </div>
        
        {/* Detailed information */}
        <div className="p-6 space-y-6">
          {/* Job Overview */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Overview</h2>
            <p className="text-gray-700">
              We are looking for a talented {job.title} to join our dynamic team. This position offers competitive compensation and opportunities for career growth in a collaborative environment.
            </p>
          </div>
          
          {/* Requirements */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-indigo-100 p-2 rounded-full mr-4">
                  <FaGraduationCap className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Education</h3>
                  <p className="text-gray-700">{job.education}</p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-indigo-100 p-2 rounded-full mr-4">
                  <FaCalendarAlt className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Start Date</h3>
                  <p className="text-gray-700">Immediate</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Skills */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.split(',').map((skill, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm font-medium">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
          
          {/* Job Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose text-gray-700 max-w-none">
              <p>As a {job.title}, you will be responsible for:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Collaborating with cross-functional teams to deliver high-quality solutions</li>
                <li>Participating in the full development lifecycle from planning to deployment</li>
                <li>Maintaining and improving existing systems</li>
                <li>Staying current with industry trends and technologies</li>
                <li>Contributing to a positive team environment</li>
              </ul>
            </div>
          </div>
          
          {/* Benefits */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                  <h3 className="font-medium text-gray-900">Health Insurance</h3>
                </div>
                <p className="text-gray-700 text-sm">Comprehensive medical, dental, and vision coverage</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                  <h3 className="font-medium text-gray-900">Professional Development</h3>
                </div>
                <p className="text-gray-700 text-sm">Training budgets and learning opportunities</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                  <h3 className="font-medium text-gray-900">Flexible Work</h3>
                </div>
                <p className="text-gray-700 text-sm">{job.working_mode} work options available</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                  <h3 className="font-medium text-gray-900">Competitive Pay</h3>
                </div>
                <p className="text-gray-700 text-sm">Annual salary of ₹{job.package} plus bonuses</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Apply button */}
        <div className="bg-gray-50 px-6 py-5 sm:flex sm:flex-row-reverse border-t border-gray-200">
          <button 
            onClick={handleApply}
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Now
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="mt-3 sm:mt-0 sm:mr-3 w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Jobs
          </button>
          
          <div className="hidden sm:block flex-1">
            <div className="flex items-center">
              <button className="mr-4 text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related jobs section */}
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Similar Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Senior {job.title}</h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <FaMapMarkerAlt className="h-4 w-4 text-indigo-600 mr-1" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full text-xs font-medium">
                    {job.skills.split(',')[0]}
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full text-xs font-medium">
                    {job.working_mode}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-indigo-600">₹{parseInt(job.package) + (item * 10000)}</span>
                  <Link to={`/job/${job.id + item}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Application status toast */}
      <StatusToast status={applyStatus} />
    </div>
  );
};

export default JobDetailsPage;