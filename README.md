# Node_MVP :smiley:
MVP for authentication using json web tokens

> For this mvp we will be using MongoDB Atlas Cloud Database to store our users. [For more info...](https://docs.atlas.mongodb.com/)

<details>
<summary>Instructions for MongoDB Atlas </summary>

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


</details>

<details>
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

---
