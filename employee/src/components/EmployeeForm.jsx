import React, { useState } from "react";
import axios from "axios";

const EmployeeForm = ({ onSubmit, initialValues, editingEmployee }) => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        // Editing an existing employee
        const response = await axios.put(
          `http://localhost:3000/employees/${editingEmployee.id}`,
          formData
        );

        // Invoke the onSubmit function provided by the parent
        onSubmit(response.data);

        // Clear the form
        setFormData({});
      } else {
        // Adding a new employee
        const response = await axios.post(
          "http://localhost:3000/employees",
          formData
        );

        onSubmit(response.data);

        setFormData({});
      }
    } catch (error) {
      console.error("Error adding/editing employee:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Last Name:
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Department:
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="Tech">Tech</option>
          <option value="Marketing">Marketing</option>
          <option value="Operations">Operations</option>
        </select>
      </label>
      <br />
      <label>
        Salary:
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default EmployeeForm;
