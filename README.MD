# Securing the Handshake

`Securing the Handshake` is a full-stack phone book application built with a React frontend and an Express backend. The project demonstrates session-based authentication, CSRF protection, and basic contact management features such as creating, viewing, and deleting contacts.

## Project Overview

The application is split into two parts:

- `frontend/`: React + Vite client
- `backend/`: Express API server

Users can:

- sign up
- log in
- stay authenticated with sessions
- fetch a CSRF token before protected requests
- view contacts
- add contacts
- delete contacts

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Fetch API

### Backend

- Node.js
- Express
- express-session
- csurf
- cookie-parser
- cors
- bcryptjs
- dotenv

## Folder Structure

```text
Securing-the-Handshake/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       └── components/
│           ├── Auth.jsx
│           ├── AddContact.jsx
│           └── Contact.jsx
└── README.MD
```

## Features

- Session-based authentication
- CSRF-protected API requests
- Login and signup form
- Contact list view
- Add contact form
- Delete contact action
- CORS support for local frontend development

## How Authentication Works

The backend uses `express-session` to store the logged-in user in the session.

The backend also uses `csurf` with cookies. Before sending protected requests such as:

- signup
- login
- logout
- add contact
- delete contact

the frontend first fetches a CSRF token from:

```text
GET /api/csrf-token
```

That token is then included in the request header:

```text
x-csrf-token
```

## Environment Variables

### Backend

Create `backend/.env` if it does not already exist:

```env
PORT=5001
SESSION_SECRET=abcdefghijklmnopqrstuvwxyz
FRONTEND_URL=http://localhost:3000
FRONTEND_URLS=http://localhost:3000,http://localhost:5173
```

Notes:

- `PORT` is the backend server port.
- `SESSION_SECRET` is used to sign the session.
- `FRONTEND_URL` is the primary allowed frontend origin.
- `FRONTEND_URLS` allows multiple frontend origins during local development.

### Frontend

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_BACKEND_URL=http://localhost:5001
```

Notes:

- `VITE_API_BASE_URL` is used by `frontend/src/api.js`
- `VITE_BACKEND_URL` is available for frontend references to the backend host

## Installation

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

## Running the Application

### Start the backend

```bash
cd backend
npm start
```

Expected output:

```bash
Backend server running on http://localhost:5001
```

### Start the frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

Vite will usually run on:

```text
http://localhost:5173
```

## Default Demo User

The backend seeds one demo account in memory:

```text
Username: Ritheavong
Password: password123
```

Important:

- This data is stored only in memory.
- Restarting the backend resets users and contacts back to the seeded values.

## API Endpoints

### CSRF

- `GET /api/csrf-token`

Returns:

```json
{
  "csrfToken": "token-value"
}
```

### Authentication

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

#### Signup body

```json
{
  "username": "newuser",
  "password": "mypassword"
}
```

#### Login body

```json
{
  "username": "Ritheavong",
  "password": "password123"
}
```

### Contacts

- `GET /api/contacts`
- `POST /api/contacts`
- `PUT /api/contacts/:id`
- `DELETE /api/contacts/:id`

#### Create contact body

```json
{
  "username": "John Doe",
  "phonenumber": "123-456-7890"
}
```

#### Update contact body

```json
{
  "username": "Updated Name",
  "phonenumber": "111-222-3333"
}
```

## Frontend Components

### `App.jsx`

Controls:

- authentication state
- page navigation
- logout flow
- refresh after adding a contact

### `Auth.jsx`

Handles:

- login
- signup
- CSRF token loading for auth requests

### `AddContact.jsx`

Handles:

- contact form input
- CSRF token loading
- sending new contact data to the backend

### `Contact.jsx`

Handles:

- loading all contacts
- storing the CSRF token for contact actions
- deleting contacts from the UI and backend

### `api.js`

Contains the frontend API helpers for:

- CSRF token fetch
- signup
- login
- logout
- session check
- get contacts
- add contact
- delete contact

## How to Test the Application

### Manual browser test

1. Start the backend.
2. Start the frontend.
3. Open the frontend in the browser.
4. Log in with the demo account.
5. Open the `Contacts` page and verify seeded contacts appear.
6. Open `Add Contact` and create a new contact.
7. Return to `Contacts` and verify the new contact appears.
8. Delete a contact and verify it disappears from the list.
9. Log out and confirm protected data is no longer accessible.

### Quick API smoke test

You can test with Postman or Insomnia using cookies and CSRF headers.

Recommended flow:

1. `GET /api/csrf-token`
2. `POST /api/auth/login`
3. `GET /api/contacts`
4. `POST /api/contacts`
5. `DELETE /api/contacts/:id`

## Known Limitations

- Data is stored in memory only.
- Restarting the backend resets all changes.
- There is no database integration yet.
- There is no automated backend test suite yet.
- The `PUT /api/contacts/:id` route exists in the backend, but there is not yet an edit form in the frontend.

## Future Improvements

- Add persistent database storage
- Add edit contact UI
- Add automated API tests with Supertest or Jest
- Improve form validation
- Add better error and loading states
- Deploy frontend and backend

## Authors

Created as a class project for practicing secure full-stack development with sessions and CSRF protection.
