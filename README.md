# Setting up a Next.js, Node.js, MongoDB App with Apache Reverse Proxy

Guide on how to setup a bare bones React app with
- Next.js
- Node.js
- MongoDB
- Apache


## Prerequisites

The following needs to be installed:

- Next.js
- Node.js (version 18 or higher) 
- MongoDB 
- Apache2

- PM2 (For reverse proxy, essentially just keeps the website persistent)
https://pm2.keymetrics.io/
```bash
    sudo npm install -g pm2
```

## Step 1: Set up the Next.js App

1. Create a new Next.js app by running the following command in your terminal:

    ```bash
    npx create-next-app my-app
    ```

2. Change into the app directory:

    ```bash
    cd my-app
    ```

3. Start the development server: (This step is when you are testing the web app itself)

    ```bash
    npm run dev
    ```

4. Build the app for deployment:

    ```bash
    npm run build
    ```

## Step 2: Set up the PM2

1. Start the PM2/Node daemon:

    ```bash
    pm2 start npm --name 'example-name' -- run start
    ```

1A. Verify status:

    ```bash
    pm2 status
    ```

## Step 3: Set up Apache Reverse Proxy


1. Create a new Apache virtual host configuration file:

    ```bash
    sudo nano /etc/apache2/sites-available/my-app.conf
    ```

2. Add the following configuration to the file:

    ```apache
    <VirtualHost *:80>
      ServerName IPADDRESS/DOMAINNAME
      ServerAdmin example@email.com

      ErrorLog ${APACHE_LOG_DIR}/error.log
      CustomLog ${APACHE_LOG_DIR}/access.log combined
      ProxyPass / http://localhost:3000/
      ProxyPassReverse / http://localhost:3000/
      ProxyRequests Off
    </VirtualHost>


    ```
    **Still working on HTTPS implementation don't worry about following code block.**

    ```
    <VirtualHost *:443>
        ServerName IPADDRESS/DOMAINNAME
        
        ProxyPreserveHost on
        ProxyPass / http://localhost:3000/
        ProxyPassReverse / http://localhost:3000/
        LogLevel warn
        LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\" **%T/%D**" combined
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
        SSLEngine on
        SSLCertificateFile /etc/ssl/____
        SSLCertificateKeyFile  /etc/ssl/____
    </VirtualHost>
    ```
    - ServerName: IP Address or Domain of Apache server

3. Enable the virtual host:

    ```bash
    sudo a2ensite my-app.conf
    ```

4. Restart Apache:

    ```bash
    sudo systemctl restart apache2
    ```

5. Enable Proxy Access:

    ```bash
    sudo a2enmod proxy && sudo a2enmod proxy_http

    sudo systemctl restart apache2

    OR

    sudo service apache2 stop
    sudo service apache2 start
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
3. Find connection URI () & DB_ NAME and store in a ".env" file
```.env

MONGODB_URI = URI CONNECTION STRING
DB_NAME = Database Name

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
5. To Be Continued... (The rest is just a mock representation of how MongoDB connects with Next.js using Mongoose, and it can be found online if you desire)

## Known Issues
1. HTTPS integration


## Sources
https://httpd.apache.org/docs/2.4/vhosts/examples.html
https://blog.beyonddevops.engineer/setting-up-reverse-proxy-for-next-js-application-in-ubuntu-2204
https://dev.to/tikam02/how-to-deploy-node-server-on-apache2-23d7
https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-22-04
https://dev.to/digitalpollution/your-nextjs-app-your-environment-a-guide-to-deployment-10l
