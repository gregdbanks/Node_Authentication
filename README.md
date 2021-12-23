# Node_MVP :smiley:
MVP Guide for authentication using json web tokens

## What to Know?
You should know the basics of javascript and node, so this guide assumes both.

## What NPM packages will we be using?

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

## 1. Setup an account at mongoDB Atlas. 
[For more info...](https://docs.atlas.mongodb.com/)

1. After signing up, click on `+ New Project`
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
Now, you have the mongoURI you are ready to connect my-authentication app to the database. Please follow the below steps.

---

## 2. Initiate project
1. Create a new folder call it `my-authentication`
2. Pull up terminal/git bash, cd into `my-authentication`, and execute this statement below
```
npm init
```
3. Npm init will ask basic info, fill out accordingly
4. Install all packages mentioned previously
```
npm install express express-validator body-parser bcryptjs jsonwebtoken mongoose --save
```
5. Now create a file 'index.js' at the root of your project adding this code:
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

Congratulation you have successfully setup and initialized a node app :rocket: 

## 3. Make first model
1. Create folder called `model`
2. Inside model create file called `User.js` (must capitalize)
3. Add this code to `User.js`, here we are using mongoose for our schema and this will allow us to save a user to our database.

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

## 4. Make Config for DB info
1. Create a new folder call it `config` and add a file naming it `db.js`
2. Add this code to `db.js`

```js
const mongoose = require("mongoose");

// Replace this with your MONGOURI. ** Do not push this to a public repo, use environment variables to hide sensitive info, such as connection strings
const MONGOURI = "mongodb://testuser:testpassword@ds257698.mlab.com:57698/node-auth";

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

3. Update your `index.js` to connect api to DB.

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

Congratulation you have successfully made your first model and configured your database connection :rocket: 

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
