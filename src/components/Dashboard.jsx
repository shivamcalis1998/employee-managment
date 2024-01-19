import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (employeeData.id) {
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
          fetchEmployees();

          onClose();

          console.log("Employee updated successfully!");
        } else {
          console.error("Error updating employee");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
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
          fetchEmployees();

          setEmployeeData({
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            department: "Tech",
            salary: "",
            Date: "",
          });

          console.log("Employee added successfully!");
        } else {
          console.error("Error adding employee");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleEditClick = (employee) => {
    setEmployeeData(employee);
    onOpen();
  };

  const handleDeleteClick = async (employeeId) => {
    try {
      const response = await fetch(
        `https://json-server-deploynt.onrender.com/employees/${employeeId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchEmployees();

        console.log("Employee deleted successfully!");
      } else {
        console.error("Error deleting employee");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        "https://json-server-deploynt.onrender.com/employees"
      );
      const data = await response.json();

      const filteredEmployees = data.filter((employee) =>
        employee.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setEmployees(filteredEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery]);

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
    setCurrentPage(1);
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4} color="teal.500">
        Employee Management Software
      </Text>
      <Stack direction="row" spacing={4} mb={4}>
        <Button onClick={onOpen}>Add Employee</Button>
        <Button onClick={handleLogout}>Log Out</Button>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add/Edit Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleFormSubmit}>
              <FormControl mb={4}>
                <FormLabel>First Name:</FormLabel>
                <Input
                  type="text"
                  name="firstName"
                  value={employeeData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Last Name:</FormLabel>
                <Input
                  type="text"
                  name="lastName"
                  value={employeeData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Email:</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={employeeData.email}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Department:</FormLabel>
                <Select
                  name="department"
                  value={employeeData.department}
                  onChange={handleInputChange}
                >
                  <option value="Tech">Tech</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Salary:</FormLabel>
                <Input
                  type="number"
                  name="salary"
                  value={employeeData.salary}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
              <Button type="submit" colorScheme="teal">
                Submit
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box mb={4}>
        <FormControl>
          <FormLabel color="teal.500">Search by First Name:</FormLabel>
          <Input
            color="teal.200"
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </FormControl>
      </Box>
      <Table variant="simple" colorScheme="teal">
        <Thead>
          <Tr>
            <Th color="teal.200">ID</Th>
            <Th color="teal.200">First Name</Th>
            <Th color="teal.200">Last Name</Th>
            <Th color="teal.200">Email</Th>
            <Th color="teal.200">Department</Th>
            <Th color="teal.200">Salary</Th>
            <Th color="teal.200">Date</Th>
            <Th color="teal.200">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentEmployees.map((employee, index) => (
            <Tr
              key={employee.id}
              bg={index % 2 === 0 ? "teal.200" : "teal.100"}
            >
              <Td>{employee.id}</Td>
              <Td>{employee.firstName}</Td>
              <Td>{employee.lastName}</Td>
              <Td>{employee.email}</Td>
              <Td>{employee.department}</Td>
              <Td>{employee.salary}</Td>
              <Td>{employee.Date}</Td>
              <Td>
                <Button
                  onClick={() => handleEditClick(employee)}
                  colorScheme="teal"
                  mr={2}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteClick(employee.id)}
                  colorScheme="red"
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Stack direction="row" spacing={4} mb={4}>
        <FormControl color="teal.200">
          <FormLabel>Filter by Department:</FormLabel>
          <Select value={filterDepartment} onChange={handleFilterChange}>
            <option value="All" style={{ color: "black" }}>
              All Departments
            </option>
            <option value="Tech" style={{ color: "black" }}>
              Tech
            </option>
            <option value="Marketing" style={{ color: "black" }}>
              Marketing
            </option>
            <option value="Operations" style={{ color: "black" }}>
              Operations
            </option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel color="teal.200">Sort by Salary:</FormLabel>
          <Button onClick={handleSortChange} colorScheme="teal">
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={2} mb={4}>
        {pageNumbers.map((number) => (
          <Button
            key={number}
            onClick={() => setCurrentPage(number)}
            colorScheme="teal"
          >
            {number}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default Dashboard;
