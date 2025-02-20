import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const JobDetailsPage = () => {
  const { jobId } = useParams();  // Get jobId from the URL params
  const [appliedEmployees, setAppliedEmployees] = useState([]);

  useEffect(() => {
    fetchAppliedEmployees();
  }, []);

  const fetchAppliedEmployees = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/job-applicants/${jobId}`);
      setAppliedEmployees(response.data);
    } catch (error) {
      console.error("Error fetching applied employees:", error);
    }
  };

  return (
    <div>
      <h2>Employees Who Applied for Job {jobId}</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Skills</th>
            <th>Education</th>
            <th>Experience</th>
            <th>Location</th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {appliedEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.skills}</td>
              <td>{employee.education}</td>
              <td>{employee.experience}</td>
              <td>{employee.location}</td>
              <td>{employee.date_of_birth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobDetailsPage;
