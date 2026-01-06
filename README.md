🍳 Recipe Finder Application
============================

A full-stack web application that allows users to search for recipes based on ingredients, categories, or culinary areas, view detailed cooking instructions, and save their favorite meals to a personal profile.

🚀 Features
-----------

*   **User Authentication:** Secure Registration and Login using **JWT** (JSON Web Tokens).
    
*   **Smart Search:** Filter recipes by **Ingredient** (e.g., "Egg"), **Category** (e.g., "Seafood"), or **Area** (e.g., "Italian").
    
*   **Recipe Details:** View full ingredients lists and cooking instructions in a popup modal.
    
*   **Favorites System:** Save recipes to a personalized list and remove them when done.
    
*   **Responsive UI:** Clean, grid-based layout that works on different screen sizes.
    

🛠️ Tech Stack
--------------

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
    
*   **Backend:** Node.js, Express.js
    
*   **Database:** MongoDB (using Mongoose)
    
*   **External API:** [TheMealDB](https://www.themealdb.com/api.php) (for recipe data)
    
*   **Authentication:** bcryptjs (hashing), jsonwebtoken (auth tokens)
    

📂 Project Structure
--------------------

   recipe-finder/  
   ├── client/              # Frontend Code  
   │   ├── index.html       # Main UI  
   │   ├── styles.css       # Styling  
   │   └── script.js        # Logic (API calls, DOM manipulation)  
   ├── server/              # Backend Code  
   │   ├── models/          # Database Schemas (User.js)  
   │   ├── routes/          # API Endpoints (auth.js, recipes.js)  
   │   ├── middleware/      # Auth verification (auth.js)  
   │   ├── server.js        # Entry point  
   │   └── .env             # Environment variables (Ignored by Git)  
   └── README.md            # Project Documentation   

⚙️ Installation & Setup
-----------------------

Follow these steps to run the project locally.

### 1\. Backend Setup (Server)

1.  Bash 
      cd server
    
2.  Bash
      npm install
    
3.  Create a .env file in the server/ folder and add your credentials:
    PORT=5000
    MONGO\_URI=your\_mongodb\_connection\_string
    JWT\_SECRET=your\_secret\_key\_here_
    
4.  Bash
      npm run dev
      _You should see: Server running on port 5000 & MongoDB Connected_
    

### 2\. Frontend Setup (Client)

1.  Open the client/ folder.
    
2.  Open index.html in your browser.
    
    *   **Recommended:** Use "Live Server" extension in VS Code for the best experience.
        

🔌 API Endpoints
----------------

### **Authentication**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |

### **Recipes**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/recipes/search?type=x&term=y` | Search by ingredient, category, or area |
| GET | `/api/recipes/:id` | Get full details for a specific recipe |
| GET | `/api/recipes/favorites` | Get logged-in user's saved recipes |
| POST | `/api/recipes/favorites` | Add a recipe to favorites |
| DELETE | `/api/recipes/favorites/:id` | Remove a recipe from favorites |

