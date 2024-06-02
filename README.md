# Chat App

This project is a full-stack chat application built with modern web technologies. The project is organized into three main folders:

1. **front-end**: The React-based user interface of the application.
2. **back-end-lambdas**: Serverless functions for handling backend logic, deployed on AWS Lambda.
3. **socket-server**: A WebSocket server for real-time communication.

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)

## Project Structure

```plaintext
├── front-end/
├── back-end-lambdas/
├── socket-server/
├── docker-compose.yml
└── README.md
```

### front-end
This folder contains the React-based front-end of the chat application.

### back-end-lambdas
This folder contains the serverless functions that handle backend logic. These functions are deployed on AWS Lambda.

### socket-server
This folder contains the WebSocket server that handles real-time communication between clients.

## Getting Started
Prerequisites 
- Node.js (>= 14.x)
- npm (>= 6.x)
- Docker (>= 20.x)
- AWS CLI (for deploying serverless functions)

### Installation
1. Clone the repository:

    ```
    git clone https://github.com/ylakeah/gigradar-super-chat.git
    ```

2. Install dependencies for each part of the project:

- root folder
    ````
    npm install (at root folder)
    ````
- front-end
    ````
    cd front-end
    npm install
    ````
- back-end-lambdas
    ````
    cd back-end-lambdas
    npm install
    ````
- socket-server
    ````
    cd socket-server
    npm install
    ````

### Environment Variables

Make sure to create a .env file in the root directory of each part of the project (if needed), and provide the required environment variables.

Example for front-end/.env:

```
REACT_APP_BYTESCALE_KEY=your_bytescale_public_key
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SOCKET_URL=http://localhost:3005
```

Example for back-end-lambdas/.env:

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Example for socket-server/.env:

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## Running the Application

run the commands in the root directory of each part of the project 

for front-end

```
npm run dev
```

for back-end-lambdas

```
serverless offline (use prefix 'sudo' if necessary)
```

for socket-server

```
npm run dev
```
