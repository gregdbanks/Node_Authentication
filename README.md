# Node_MVP :smiley:
Guide for making authentication API utilizing json web tokens

# What is JWT and why is it useful?

JWT is useful for Authorization and Information exchange. Can be sent via URL/ Post request/HTTP Header which makes it fast for transmission and usable. It contains the details of user (not session id in cookies like traditional request) so , :drum: :drum: :drum: , NO need to query database to get user details.


# What to Know?
You should know the basics of javascript and node, so this guide assumes both.

We will be using MongoDB Atlas Cloud Database to store our users. [For more info...](https://docs.atlas.mongodb.com/)

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

<details>
<summary>What NPM packages will we be using?</summary>

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

</details>

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

### :rocket: - Congratulation you have successfully setup and initialized a node app

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
4. Create a `model` folder and inside create a `User.js` (Capitalized), add code below
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

# Make Route for User signup. 
If new to routing click [here](https://expressjs.com/en/starter/basic-routing.html) to learn basics

1. Create a `routes` folder and inside create a `user.js` file. Add code below
```js
const express = require("express");
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../model/User");

router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

module.exports = router;

```

2. Import in `index.js` like below
```js
const express = require("express");
const bodyParser = require("body-parser");
const user = require("./routes/user"); //new addition
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


/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
app.use("/user", user);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
```

3. Test using postman. If you don't have postman, click [here](https://learning.postman.com/docs/getting-started/installation-and-updates/) to install and setup. Expect results below.

![postman](./images/postman.png)

# Make Route for User login. 

1. Add code below to `user.js`
```js
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);
```

3. Test using postman.

# Make Route to Get User. 

1. We get tokens back from both user signup and user login, now lets add route to get a user via token. Add code below.
```js
router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});
```
If you run the server you will get an error from the auth parameter so lets make that function. 

2. Create a `middleware` folder and inside create a `auth.js` adding the code below.
```js
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};
```
This function will be used to verify the users token

3. Test using postman. After signing up a user, try getting that same user passing the token you got from signup to the request header

![token](./images/getToken.png)

# :tada: Congratulations, You have successfully created an authentication API! 


