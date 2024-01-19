import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [employeeData, setEmployeeData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "Tech",
    salary: "",
    Date: "",
  });

  const [employees, setEmployees] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if the form is in edit mode
    if (employeeData.id) {
      // Update employee details in JSON server
      try {
        const response = await fetch(
          `https://json-server-deploynt.onrender.com/employees/${employeeData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(employeeData),
          }
        );

        if (response.ok) {
          // Fetch and update the list of employees after submission
          fetchEmployees();

          // Close the edit modal
          setShowEditModal(false);

          // You can also handle other actions, such as showing a success message
          console.log("Employee updated successfully!");
        } else {
          // Handle errors
          console.error("Error updating employee");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      // Add new employee details to JSON server
      try {
        const response = await fetch(
          "https://json-server-deploynt.onrender.com/employees",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(employeeData),
          }
        );

        if (response.ok) {
          // Fetch and update the list of employees after submission
          fetchEmployees();

          // Clear the form after successful submission
          setEmployeeData({
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            department: "Tech",
            salary: "",
            Date: "",
          });

          // You can also handle other actions, such as showing a success message
          console.log("Employee added successfully!");
        } else {
          // Handle errors
          console.error("Error adding employee");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleEditClick = (employee) => {
    // Open the edit modal and set the initial values
    setEmployeeData(employee);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (employeeId) => {
    // Delete employee from JSON server
    try {
      const response = await fetch(
        `https://json-server-deploynt.onrender.com/employees/${employeeId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Fetch and update the list of employees after deletion
        fetchEmployees();

        // You can also handle other actions, such as showing a success message
        console.log("Employee deleted successfully!");
      } else {
        // Handle errors
        console.error("Error deleting employee");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchEmployees = async () => {
    // Fetch the list of employees from the server
    try {
      const response = await fetch(
        "https://json-server-deploynt.onrender.com/employees"
      );
      const data = await response.json();

      // Filter employees based on search query
      const filteredEmployees = data.filter((employee) =>
        employee.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setEmployees(filteredEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    // Fetch employees when the component mounts
    fetchEmployees();
  }, [searchQuery]);

  // Calculate current employees to display based on pagination
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const filteredAndSortedEmployees = employees
    .filter(
      (employee) =>
        filterDepartment === "All" || employee.department === filterDepartment
    )
    .sort((a, b) => {
      const salaryA = parseFloat(a.salary);
      const salaryB = parseFloat(b.salary);

      return sortOrder === "asc" ? salaryA - salaryB : salaryB - salaryA;
    });
  const currentEmployees = filteredAndSortedEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Logic for rendering page numbers
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredAndSortedEmployees.length / employeesPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const handleFilterChange = (e) => {
    setFilterDepartment(e.target.value);
    setCurrentPage(1); // Reset page number when the filter changes
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div>
      <h1>Employee Management Software</h1>
      <div>
        <button onClick={() => setShowEditModal(true)}>Add Employee</button>
        <button>Log Out</button>
      </div>

      {/* Add/Edit Employee Form Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowEditModal(false)}>
              &times;
            </span>
            <form onSubmit={handleFormSubmit}>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={employeeData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={employeeData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={employeeData.email}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Department:
                <select
                  name="department"
                  value={employeeData.department}
                  onChange={handleInputChange}
                >
                  <option value="Tech">Tech</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </label>
              <label>
                Salary:
                <input
                  type="number"
                  name="salary"
                  value={employeeData.salary}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      {/* Employee Table */}
      <div>
        <label>
          Search by First Name:
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.salary}</td>
              <td>{employee.Date}</td>
              <td>
                <button onClick={() => handleEditClick(employee)}>Edit</button>
                <button onClick={() => handleDeleteClick(employee.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Filter and Sort Controls */}
      <div>
        <label>
          Filter by Department:
          <select value={filterDepartment} onChange={handleFilterChange}>
            <option value="All">All Departments</option>
            <option value="Tech">Tech</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
        </label>
        <label>
          Sort by Salary:
          <button onClick={handleSortChange}>
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </label>
      </div>

      {/* Pagination */}
      <div>
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => setCurrentPage(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
