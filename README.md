# TaskBox - Kanban Board Application

A modern task management system with customizable boards, lists, and cards.

## Features

- User authentication with JWT
- Create multiple dashboards for different projects
- Kanban boards with drag-and-drop functionality
- Create, edit, and delete lists and cards
- Share boards with other users (viewer/editor permissions)
- Responsive design for desktop and mobile

## Technologies Used

- **Frontend**: React.js, React Bootstrap, React Beautiful DND
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Authentication**: JWT

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (v4+)

### Backend Setup



 Open your browser and navigate to `http://localhost:3000`

## API Documentation

### Authentication Endpoints

| Method | Endpoint          | Description          | Request Body                              |
|--------|-------------------|----------------------|-------------------------------------------|
| POST   | /api/auth/register| Register a new user  | { name, email, password }                 |
| POST   | /api/auth/login   | Log in a user        | { email, password }                       |

### Dashboard Endpoints

| Method | Endpoint                     | Description                  | Request Body             |
|--------|-----------------------------|------------------------------|--------------------------|
| GET    | /api/dashboards             | Get all dashboards           | -                        |
| POST   | /api/dashboards             | Create a dashboard           | { title, description }   |
| DELETE | /api/dashboards/:id         | Delete a dashboard           | -                        |

### Board Endpoints

| Method | Endpoint                     | Description                  | Request Body             |
|--------|-----------------------------|------------------------------|--------------------------|
| GET    | /api/boards/:boardId        | Get a specific board         | -                        |
| POST   | /api/boards                 | Create a board               | { dashboardId }          |
| DELETE | /api/boards/:boardId        | Delete a board               | -                        |

### Board Sharing Endpoints

| Method | Endpoint                          | Description                  | Request Body             |
|--------|----------------------------------|------------------------------|--------------------------|
| POST   | /api/boards/:boardId/share       | Share a board                | { email, role }          |
| GET    | /api/boards/:boardId/share       | Get board users              | -                        |
| DELETE | /api/boards/:boardId/share/:userId | Remove user access         | -                        |
