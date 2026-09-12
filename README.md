Curate - Change++ Fall 2026 Coding Challenge

Name: Angela Wang
Vanderbilt Email: angela.w.wang@vanderbilt.edu

PROJECT OVERVIEW

Curate is a full-stack image saving and sharing application. Users can search for images through the Pixabay API, create collections, save and edit images, remove images or entire collections, and share collections through unique read-only URLs.

TECHNOLOGIES

Frontend:

- React
- TypeScript
- Vite
- Lucide React

Backend:

- Node.js
- Express
- Mongoose

Database:

- MongoDB Atlas

External API:

- Pixabay API

SETUP AND INSTALLATION

Prerequisites:

- Node.js and npm
- A MongoDB Atlas database
- A Pixabay API key

1. Clone the repository and enter the project directory:

   git clone <REPOSITORY_URL>
   cd Fall2026-CodingChallenge

2. Install frontend dependencies:

   cd client
   npm install

3. Create a file named .env inside the client directory and add:

   VITE_PIXABAY_API_KEY=your_pixabay_api_key

4. Return to the project root and install backend dependencies:

   cd ../server
   npm install

5. Create a file named .env inside the server directory and add:

   MONGODB_URI=your_mongodb_connection_string
   PIXABAY_API_KEY=your_pixabay_api_key

6. Start the backend server from the server directory:

   npm run dev

   The backend runs at:
   http://localhost:3000

7. In a separate terminal, start the frontend:

   cd client
   npm run dev

   The frontend runs at:
   http://localhost:5173

FEATURES

- Search for images using the Pixabay API
- Create and view collections
- Save images to collections
- Edit saved image titles
- Delete saved images
- Delete collections
- Persist collections and saved content with MongoDB
- Generate unique shareable collection URLs
- View shared collections in a read-only interface
- Responsive layout for desktop and mobile
- Lazy-loaded images and user feedback for loading and successful actions

REFLECTION

Throughout the challenge, I gained experience tackling the process of putting together a full-stack application from start to finish. I learned how to connect a React frontend to my own Express API and use MongoDB to keep collections and saved images persistent instead of losing them whenever the server restarted. One of the most interesting issues I ran into was discovering that Pixabay image URLs expire, which led me to use the saved image IDs to retrieve fresh URLs from the API.
