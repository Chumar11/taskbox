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
import "../Css/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setSuccess(false);

    if (validateForm()) {
      setLoading(true);
      try {
        // Call the actual registration API
        const response = await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        // Registration successful
        setSuccess(true);

        // Store tokens and user data
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to login after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.error("Registration error:", error);
        setRegisterError(
          error.message || "Registration failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-page d-flex justify-content-center align-items-center min-vh-100">
      <div className="register-wrapper" style={{ width: "1000px", maxWidth: "95%" }}>
        <Row className="g-0">
          {/* Left side - decorative */}
          <Col md={6} className="d-none d-md-block">
            <div className="register-banner h-100 d-flex flex-column justify-content-center align-items-center" 
                 style={{ 
                   background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                   borderRadius: "10px 0 0 10px",
                   padding: "40px"
                 }}>
              <div className="text-center text-white">
                <div className="mb-5">
                  <i className="bi bi-kanban-fill" style={{ fontSize: "64px" }}></i>
                </div>
                <h1 className="fw-bold mb-4">Task Box</h1>
                <p className="mb-4 lead">Organize your work and life with our efficient task management platform.</p>
                <div className="benefits mt-5">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <span>Create unlimited dashboards</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <span>Collaborate with your team</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <span>Track your progress in real time</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          
          {/* Right side - form */}
          <Col md={6}>
            <Card className="border-0 h-100">
              <Card.Body className="d-flex flex-column p-4 p-lg-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Create your account</h2>
                  <p className="text-muted small">Join thousands of users organizing their tasks</p>
                </div>

                {registerError && (
                  <Alert variant="danger" className="py-2 mb-3">
                    {registerError}
                  </Alert>
                )}

                {success && (
                  <Alert variant="success" className="py-2 mb-3">
                    Registration successful! Redirecting to login...
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      className="py-2"
                    />
                    <Form.Control.Feedback type="invalid" className="small">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

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

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                          className="py-2"
                        />
                        <Form.Control.Feedback type="invalid" className="small">
                          {errors.password}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted small">
                          Min. 8 characters
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.confirmPassword}
                          className="py-2"
                        />
                        <Form.Control.Feedback type="invalid" className="small">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="termsAgreed"
                      label={
                        <span className="small">
                          I agree to the{" "}
                          <Link to="/terms" className="text-decoration-none">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link to="/privacy" className="text-decoration-none">
                            Privacy Policy
                          </Link>
                        </span>
                      }
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mb-3"
                    disabled={loading}
                    style={{ background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" }}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0 small">
                      Already have an account?{" "}
                      <Link to="/login" className="text-decoration-none fw-bold">
                        Sign In
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

export default Register;