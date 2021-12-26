# Node_MVP :smiley:
MVP Guide for authentication using json web tokens

# What is JWT and why is it useful?

JWT is useful for Authorization and Information exchange. Can be sent via URL/ Post request/HTTP Header which makes it fast for transmission and usable. It contains the details of user (not session id in cookies like traditional request), so no need to query database to get user details.


# What to Know?
You should know the basics of javascript and node, so this guide assumes both.

# For this mvp we will be using MongoDB Atlas Cloud Database to store our users. 
[For more info...](https://docs.atlas.mongodb.com/)

<details>
<summary>Instructions for MongoDB Atlas </summary>

1. Visit [Official Docs](https://docs.atlas.mongodb.com/) , After signing up, click on `+ New Project`
2. Name your project
3. Click `Create Project`
4. Click `Build a Database`
5. Select FREE tier and click `Create`
6. Choose a cloud provider, I chose AWS, but any will do
7. Choose a region, any
8. Scroll to the bottom and click `Create Cluster` (could take several minutes)
9. Create a User, entering in a username and password and then clicking `Create User`
10. Select where you would like to connect from, select local, and then click `Add My Current Ip Address`
11. Click `Finish and Close` at the bottom of page
12. In Database Deployments Click the `Connect` button next to your cluster name
13. Click `Connect your application`, here is where you can get your connection string. :smile: 


</details>

---

# What NPM packages will we be using?

> [express](http://expressjs.com/)

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications

> [express-validator](https://express-validator.github.io/docs/)

To Validate the body data on the server in the express framework, we will be using this library. It's a server-side data validation library. So, even if a malicious user bypasses the client-side verification, the server-side data validation will catch it and throw an error.

> [bcryptjs](https://www.npmjs.com/package/bcrypt)

This library will be used to hash the password and then store it to database.This way even app administrators can't access the account of a user.

> [JWT](https://jwt.io/)

JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA. You can specify how much time that token will last as well.

> [mongoose](https://mongoosejs.com/docs/)

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.

> [body-parser](https://www.npmjs.com/package/body-parser)

A Node middleware for parsing request.body data (JSON).

> [dotenv](https://www.npmjs.com/package/dotenv)

Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.

# Now lets get started and initiate our project
1. Create a new folder call it 'my-authentication'
2. Pull up terminal/git bash and execute this statement below
```
npm init
```
3. npm init will ask basic info, fill out accordingly
4. install all packages mentioned previously
```
npm install express express-validator body-parser bcryptjs jsonwebtoken mongoose dotenv --save
```
5. Now create a file 'index.js' at the route adding this code:
```js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});


app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
```
6. Last step is to test, execute below, should see 'server will start at PORT 4000' in terminal
```
node index.js
```

### :rocket:  Congratulation you have successfully setup and initialized a node app

# Configure User Model
1. Create `.env` file at the root of your app, here is where you will store your connection string you recieved earlier doing the mongoDB Atlas section. Inside the `.env` file add this as well as your connection string:
```
DB_URI=yourSecretConnectionStringGoesHere
```
2. Create a `config` folder and inside create a `db.js`, add code below
```js
const mongoose = require("mongoose");
require('dotenv').config()

// Replace this with your MONGOURI.
const MONGOURI = process.env.DB_URI;

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
```
3. Test by running`node index.js` in your terminal, expect server to connect
4. Creat a `model` folder and inside create a `User.js` (Capitalized), add code below
```js
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);
```
5. Update `index.js` adding code below
```js 
const express = require("express");
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});


app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
```

# Make Route for user signup

<!-- <details>
<summary>File Structure</summary>

```
config /
    db.js
middleware /
    auth.js
model /
    User.js
routes /
    user.js
-index.js-
```

`config / db.js`: A command-line utility that lets you interact with this Django project in various ways. 

`middleware / auth.js`: A command-line utility that lets you interact with this Django project in various ways. 

`model / User.js`: A command-line utility that lets you interact with this Django project in various ways. 

`routes / user.js`: This is where we import express and bodparser. 

`index.js`: This is where we import express and bodparser. 

</details>

--- -->
