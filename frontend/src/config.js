// Configuration for API Base URL
// In development, this uses the proxy defined in vite.config.js ('/api')
// In production, you must set VITE_API_URL in your environment variables to point to your deployed backend (e.g., https://my-app.onrender.com/api)

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default API_URL;
