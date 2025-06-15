import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } catch (error) {
        console.error("Login error:", error);
        setLoginError(error.message || "Failed to login. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-wrapper" style={{ width: "800px", maxWidth: "90%" }}>
        <Row className="g-0">
          {/* Left side - decorative */}
          <Col md={5} className="d-none d-md-block">
            <div className="login-banner h-100 d-flex justify-content-center align-items-center" 
                 style={{ 
                   background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                   borderRadius: "10px 0 0 10px"
                 }}>
              <div className="text-center text-white p-4">
                <h2 className="fw-bold mb-3">Task Box</h2>
                <p className="mb-0">Organize your tasks efficiently</p>
                <div className="mt-4">
                  <i className="bi bi-kanban" style={{ fontSize: "48px" }}></i>
                </div>
              </div>
            </div>
          </Col>
          
          {/* Right side - form */}
          <Col md={7}>
            <Card className="border-0 h-100">
              <Card.Body className="d-flex flex-column justify-content-center p-4">
                <div className="text-center mb-4">
                  <h3 className="fw-bold">Welcome Back</h3>
                  <p className="text-muted small">Sign in to continue to Task-Box</p>
                </div>

                {loginError && (
                  <Alert variant="danger" className="py-2 mb-3">
                    {loginError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      className="py-2"
                    />
                    <Form.Control.Feedback type="invalid" className="small">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Label className="small fw-bold mb-0">Password</Form.Label>
                      <Link to="/forgot-password" className="text-decoration-none small">
                        Forgot password?
                      </Link>
                    </div>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      className="mt-1 py-2"
                    />
                    <Form.Control.Feedback type="invalid" className="small">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 d-flex justify-content-between align-items-center">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Remember me"
                      className="small"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mb-3"
                    disabled={loading}
                    style={{ background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" }}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0 small text-muted">
                      Don't have an account?{" "}
                      <Link to="/register" className="text-decoration-none fw-bold">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;