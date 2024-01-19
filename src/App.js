// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import img1 from "./images/img1.jpg";
import Dashboard from "./components/Dashboard";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <Box
      bgImage={img1}
      bgSize="cover"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
