Here’s a description for the `README.md` file of the `AdminitY` project:

---

# AdminitY

**AdminitY** is a secure and modular admin panel built using **Node.js**, **Express**, **Handlebars**, and **NeDB** for database management. It is designed to handle user authentication, CRUD operations, and dynamic content rendering, providing a robust solution for admin interfaces.

### Features

- **User Management**: Easily create, update, and delete user records with different access levels (approved, lead).
- **Dynamic Content Rendering**: Handlebars templating engine for server-side rendering of views.
- **Session Management**: Secure session handling with user authentication via **Telegram**.
- **Ajax-Based CRUD Operations**: Handles operations asynchronously through RESTful endpoints.
- **NeDB Integration**: Lightweight, file-based database solution for managing user data.
- **Customizable UI**: Easily adaptable UI components with Handlebars, supporting conditional rendering and dynamic data display.

### Project Structure

```bash
.
├── assets/                  # Static assets (CSS, JS, Images)
├── data/
│   └── users.db             # NeDB database for storing user information
├── views/
│   └── pages/               # Handlebars templates for rendering pages
├── index.js                 # Main server entry point
└── config.js                # Configuration file (e.g., session secret, bot usernames)
```

### Core Functionalities

1. **User Authentication via Telegram**
   - The app uses a Telegram bot for login and verifies the username against an allowed list.
   - It allows only authorized users to access the dashboard and settings.

2. **User Management**
   - Add new users as either `approved` or `lead` types.
   - Display a list of users, sorted based on the user type and other parameters like `timestamp` and `username`.
   - Users can be edited or removed dynamically using the provided endpoints.

3. **CRUD Operations with NeDB**
   - **Insert**, **update**, and **delete** operations are supported for user data.
   - NeDB is used to store user records in a local `users.db` file.
   - The app sorts and filters user data for different views like approved users and lead users.

4. **Session and Authentication Middleware**
   - The application leverages Express sessions to store user data securely during their login session.
   - Middleware ensures only authenticated users can access certain routes, like the dashboard or settings.

5. **Dynamic Content Rendering**
   - Handlebars templates are used to render user-friendly and customizable web pages.
   - Includes helper functions to format dates and conditionally display content based on data values.

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/AdminitY.git
   cd AdminitY
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `config.js`:
   - Set your session secret, allowed Telegram usernames, and bot username.

4. Start the server:
   ```bash
   npm start
   ```

   The app will run on port `3008` by default.

5. To use **ngrok** for local testing:
   ```bash
   ngrok http 3008
   ```

   The generated ngrok URL will be saved to `ngrok-url.txt` for external access.

### API Endpoints

- **GET /login**: Renders the login page for Telegram authentication.
- **POST /auth/telegram**: Authenticates users based on their Telegram credentials.
- **GET /dashboard**: Displays the admin dashboard for authorized users.
- **GET /users**: Lists approved users.
- **POST /users**: Adds a new user to the database.
- **POST /users/:id/delete**: Deletes an existing user.

### Future Enhancements

- Add support for more user roles and access levels.
- Implement two-factor authentication for higher security.
- Expand database support to include MongoDB or PostgreSQL for larger-scale applications.

---

