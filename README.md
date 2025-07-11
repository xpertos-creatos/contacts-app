# Contacts App

A simple web application for managing contacts, built with React and powered by Supabase for the backend.

---

## Tech Stack

- **Frontend:** [React](https://reactjs.org/)
- **Backend & Database:** [Supabase](https://supabase.io/)
- **Package Manager:** [npm](https://www.npmjs.com/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- You need [Node.js](https://nodejs.org/en/) (which includes npm) installed on your system.
- You need a Supabase account and a project set up to get the database credentials.

### Installation & Setup

1.  **Clone the repository (if applicable):**
    ```sh
    git clone <your-repository-url>
    cd contacts-app
    ```

2.  **Install project dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables:**
    This project uses a `.env` file to handle sensitive credentials like Supabase API keys. This file is ignored by Git and should not be shared publicly.

    -   First, create a copy of the example file `.env.example` and name it `.env`:
        ```sh
        cp .env.example .env
        ```
    -   Next, open the new `.env` file and add your personal Supabase project URL and Anon Key. You can find these in your Supabase project dashboard under `Settings > API`.

        ```env
        REACT_APP_SUPABASE_URL=your_supabase_url
        REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
        ```

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will automatically reload when you make changes.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance. Your app is ready to be deployed!

### `npm test`

Launches the test runner in the interactive watch mode.