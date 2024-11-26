# Url Shortner Assignment

Welcome to the **Url Shortner** assignment from **House of Marktech**.

This is a simple URL shortener API that allows users to shorten URLs and view statistics on their shortened URLs.

## Prerequisites

Before setting up the app, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (Recommended version: v14 or above)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [git](https://git-scm.com/) (Version control)

## Getting Started

Follow these steps to get the project up and running locally.

### 1. Clone the Repository

Start by cloning the repository to your local machine. Open a terminal and run:

```bash
git clone https://github.com/nidhish-srivastava/Url-shortner-assignment.git
```

### 2. Navigate to the Project Directory
Go into the project directory:
```bash
cd Url-shortner-assignment
```

### 3. Install Dependencies
Install all required dependencies using npm:
```bash
npm install
```

### 4. Set Up Environment Variables
Create a .env file in the root of the project directory. You can copy the contents from the .env.example (if available) or create your own environment variables. Here's an example of what you might need:
```bash
MONGO_DB_URI = ""
PORT = 
```

### 5. Start the Application
Once everything is set up, start the Express.js application locally:
```bash
npm run dev
```
By Default it is running on port 3000

### 6. Running unit test cases
```bash
npm run test
```


### 6. Access the API Documentation(Swagger Ui)
Once the app is running, you can access the API documentation at:
http://localhost:3000/api-docs
Command to generate docs
```bash
npm run generateDoc
```


### Deployment(Vercel):
[url-shortner-assignment.vercel.app](https://url-shortner-assignment.vercel.app/)

---


## Tech Stack

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **Docker** : Containerising the whole application

### Database

- **MongoDB**: A NoSQL database for storing application data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.

### Packages

- **express**: Fast, unopinionated, minimalist web framework for Node.js.
- **cors**: Enable Cross-Origin Resource Sharing (CORS) with various options.
- **nodemon**: A tool that helps develop Node.js-based applications by automatically restarting the node application when file changes are detected.
- **dotenv**: Loads environment variables from a `.env` file into `process.env`.
- **swagger-ui-express**: Serve auto-generated swagger-ui generated API docs from express.
- **swagger-autogen**: Automatic swagger documentation generator.
- **shortd** : Short random id generator 
- **express-rate-limiter** : Rate limiter for the server
- **jest** : Unit test cases

  

## API Endpoints

### 1. Shorten a URL
- **Endpoint**: `POST /shorten`
- **Description**: This endpoint accepts a URL and generates a shortened version of it.

#### Request

**Body** (JSON):
```json
{
  "url": "https://www.example.com"
}
```

#### Response

**Success (HTTP 200):**
```json
{
  "shortUrl": "http://localhost:4000/abc123"
}
```
**Error - Invalid URL (HTTP 400):**
```json
{
  "error": "Invalid URL"
}
```

**Error - Server Error (HTTP 500):**
```json
{
  "error": "Server error"
}
```

### 2. Redirect to Original URL
- **Endpoint**: `GET /:shortId`
- **Description**: This endpoint redirects the user to the original URL based on the provided short ID.

#### Request

**URL Parameter**:
```makefile
shortId: abc123
```

#### Response

**Success** (HTTP 302):
- Redirects to the original URL (e.g., `https://www.example.com`).

**Error - URL Not Found** (HTTP 404):
```json
{
  "error": "URL not found"
}
```

**Error - Server Error (HTTP 500):**
```json
{
  "error": "Server error"
}
```

### 3. Get Stats for Shortened URL
- **Endpoint**: `GET /stats/:shortId`
- **Description**: This endpoint returns statistics for the shortened URL, including the number of clicks and the last accessed timestamp.

#### Request

**URL Parameter**:
```makefile
shortId: abc123
```

#### Response

**Success (HTTP 200):**
```json
{
  "clicks": 5,
  "lastAccessed": "2024-11-25T10:20:30Z"
}
```

**Error - URL Not Found (HTTP 404):**
```json
{
  "error": "URL not found"
}
```

**Error - Server Error (HTTP 500):**
```json
{
  "error": "Server error"
}
```
