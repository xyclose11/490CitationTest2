# Setting up a Next.js, Node.js, MongoDB App

Guide on how to setup a bare bones React app with
- Next.js
- Node.js
- MongoDB


## Prerequisites

The following needs to be installed:

- Next.js
- Node.js (Version 20 or higher) 
- npm (Version 10 or higher)
- MongoDB 

### Common Issues with Dependency Install/Version

1. Node version will be stuck at 12 or below and unable to update.

Solution: Use the npm package "n" to manage the Node versions for you.

    ```bash
    node --version
    npm install -g n
    n lts 
    n prune
    node --version
    ```


## Step 1: Set up the Next.js App

0. Initialize Node.js package.json

    init: Creates package.json file
    -y: Auto says "yes" to the prompts
    
    ```bash
    npm init -y
    ```

    This package.json will be 1 directory above the Next.js app

1. Create a new Next.js app by running the following command in your terminal:

    ```bash
    npx create-next-app my-app
    ```

2. Change into the app directory:

    ```bash
    cd my-app
    ```
    The structure should look similar to:
    /your-project
    ├── .next/
    ├── node_modules/
    ├── pages/
    │   ├── index.js
    │   └── about.js
    ├── package.json
    └── server.js

3. Start the development server: (This step is when you are testing the web app itself)

    ```bash
    npm run dev
    ```

## Step 3: Create Custom Node.js server

1. Create a new 'server.js' file in your project directory (This will be the Next.js root)

2. Use the following starter code in the file to test functionality. (This can be changed)

    ```javascript
    const http = require('http');
    const next = require('next');

    const dev = process.env.NODE_ENV !== 'production';
    const app = next({ dev });
    const handle = app.getRequestHandler();

    app.prepare().then(() => {
    http.createServer((req, res) => {
        handle(req, res);
    }).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
    });

    ```
3. Alt the 'start' script in the **Next.js** -> package.json to:

    ```json
    "scripts": {
    "start": "node server.js",
    
    }

    ```

4. To start the application run the following:

    ```bash
    npm start
    ```


## Step 4: Test the Setup

1. Open your web browser and navigate to whatever value is in Servername.
2. You should see your Next.js app running through Apache reverse proxy.


## Step 5: MongoDB Integration
DON'T FOLLOW MONGODB WEBSITE INSTALL -> Majority of their servernames are incorrect and caused massive headaches
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

```
sudo apt-get install gnupg curl


curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -


echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update

sudo apt-get install -y mongodb-org

```


## Running MongoDB

**Start/Stop/Restart MongoDB**
```
sudo systemctl start mongod
sudo systemctl stop mongod
sudo systemctl restart mongod

```
**Verify Status**
```

sudo systemctl status mongod

```
**Enable (Will auto start if rebooted)**
```

sudo systemctl enable mongod

```
**Using MongoDB**
- Can use MongoSH
- SETUP SECURITY MEASURES -> https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-security-checklist
- To receive remote users it must be setup to receive (The following link) -> https://www.mongodb.com/docs/manual/reference/connection-string/#find-your-self-hosted-deployment-s-connection-string


## MongoDB Integration
Node Driver Mongo Docs:
https://www.mongodb.com/docs/drivers/node/current/

**Sidenote:** When we start development we will need to create users/admins for the database, and implement a level of security using the following link
**SECURE MONGODB SERVER -> https://www.mongodb.com/docs/manual/administration/security-checklist/**

1. To integrate install the node MongoDB driver
```

npm install mongodb

```
2. Install Mongoose (ODM)

**Following Steps Are Technically Optional**
**The Following Steps Are Just Showing The Example That I Used To Connect To The MongoDB Server And Do CRUD Operations.**
3. Create a file called ".local.env" **DO NOT INCLUDE .local.env IN ANY VERSION CONTROL SOFTWARE**
```.local.env

DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password

```
4. In the 'src/' directory create the following
- pages/api folders
- util folder
- models folder
```
src
|app
|models
|pages
  |api
|utils
```
5. In the 'utils' directory create a new js file (Name it something like dbConnect.js), and put the following initial code to connect to the MongoDB server (localhost).

```javascript
import mongoose from 'mongoose';

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbUser = encodeURIComponent(process.env.DB_USER);
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);

const dbUrl = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1`;


const connection = {};

async function connectDb() {
  if (connection.isConnected) {
    // Use existing database connection
    return;
  }
  // Use new database connection
  const db = await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  connection.isConnected = db.connections[0].readyState;
}

export default connectDb;
```

- EncodeURIComponent ensures that the credentials are safe to be included in the URL



## Sources
https://httpd.apache.org/docs/2.4/vhosts/examples.html
https://blog.beyonddevops.engineer/setting-up-reverse-proxy-for-next-js-application-in-ubuntu-2204
https://dev.to/tikam02/how-to-deploy-node-server-on-apache2-23d7
https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-22-04
https://dev.to/digitalpollution/your-nextjs-app-your-environment-a-guide-to-deployment-10l