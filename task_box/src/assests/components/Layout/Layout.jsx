import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Layout.css";
import { useBoard } from "../../../conrext/BoardContext";

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { boards = [], handleShow } = useBoard() || {};

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="layout-container">
      {/* Header */}
      <Navbar
        style={{ backgroundColor: "#232425 !important" }}
        variant="dark"
        expand="lg"
        className="px-3 py-2 sticky-top"
      >
        <div className="d-flex align-items-center">
          <Button
            variant="dark"
            className="me-2 py-1 px-2"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list fs-5"></i>
          </Button>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            Task Box
          </Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/profile">
              <img
                src="/Images/7.png"
                alt="Profile"
                className="rounded-circle"
                width="30"
                height="30"
              />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="d-flex flex-grow-1 main-container">
        {/* Sidebar */}
        <div
          className={`sidebar-wrapper ${sidebarCollapsed ? "collapsed" : ""}`}
          style={{ backgroundColor: "#1a1d21" }}
        >
          <div className="sidebar-content p-0">
            <div
              className="workspace-header p-2 border-bottom"
              style={{ borderColor: "#2c3136", padding: "0.40rem !important" }}
            >
              <div className="d-flex align-items-center ">
                <div
                  className="workspace-icon me-2"
                  style={{
                    backgroundColor: "#4bce97",
                    color: "white",
                    width: "40px",
                    height: "40px",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  T
                </div>
                <div className="workspace-info">
                  <h6
                    className="mb-0"
                    style={{ color: "white", fontSize: "0.700rem" }}
                  >
                    TaskBox Workspace
                  </h6>
                  <small style={{ color: "white", fontSize: "0.700rem" }}>
                    Free
                  </small>
                </div>
              </div>
            </div>

            <Nav className="flex-column mt-2">
              <Nav.Link
                as={Link}
                to="/"
                className="d-flex align-items-center"
                style={{ color: "#9fadbc" }}
              >
                <i className="bi bi-people me-3"></i>
                <span>Dashboard</span>
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/members"
                className="d-flex align-items-center"
                style={{ color: "#9fadbc" }}
              >
                <i className="bi bi-people me-3"></i>
                <span>Members</span>
              </Nav.Link>

              <div className="sidebar-section mt-4">
                {!sidebarCollapsed && (
                  <h6
                    className="sidebar-heading px-3 mb-1 d-flex align-items-center gap-4"
                    style={{ fontSize: "0.750rem", color: "#9fadbc" }}
                  >
                    YOUR BOARDS{" "}
                    <Button
                      variant="link"
                      className="p-0 ms-2"
                      style={{ color: "#9fadbc" }}
                      onClick={handleShow}
                      aria-label="Create new board"
                    >
                      <i
                        style={{ fontSize: "25px " }}
                        className="bi bi-plus"
                      ></i>
                    </Button>
                  </h6>
                )}

                {boards.length === 0 ? (
                  <>
                    <h3
                      className="px-4 mt-4"
                      style={{ color: "#9fadbc", fontSize: "0.700rem" }}
                    >
                      No boards available
                    </h3>
                  </>
                ) : (
                  <>
                    {boards.map((board) => (
                      <Nav.Link
                        key={board.id}
                        as={Link}
                        to={`/board/${board.id}`}
                        className="d-flex align-items-center"
                        style={{ color: "#9fadbc" }}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/board/${board.id}`;
                        }}
                      >
                        <i className="bi bi-kanban me-3"></i>
                        <span>{board.title}</span>
                      </Nav.Link>
                    ))}
                  </>
                )}
              </div>
            </Nav>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="board-content flex-grow-1"
          style={{
            background:
              "linear-gradient(to bottom, #0f1c2e 0%, #2b1b48 50%, #5a2b77 100%)",
            padding: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
