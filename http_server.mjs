import express from "express";
const app = express();
import admin from "./admin.js";
import { JSONFilePreset } from "lowdb/node";

const defaultData = { posts: [] };
const db = await JSONFilePreset("db.json", defaultData);

app.get("/data", function (req, res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.send(db.data.posts);
});

// ----------------------------------------------------
// add post - test using:
//      curl http://localhost:3001/posts/ping/1/false
// ----------------------------------------------------
app.get("/item/:id", function (req, res) {
  res.set("Access-Control-Allow-Origin", "*");
  const idToken = req.headers.authorization;
  console.log("header: ", idToken);

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedToken) {
      console.log("decodedToken:", decodedToken);
      const post1 = db.data.posts.find((post) => post.id === req.params.id);
      res.send(post1);
    })
    .catch(function (error) {
      console.log("error:", error);
      res.set("Access-Control-Allow-Origin", "*");
      res.send("Authentication fail");
    });
});

app.get("/posts/:title/:id/:published", function (req, res) {
  var post = {
    id: req.params.id,
    title: req.params.title,
    published: req.params.published,
  };
  console.log(post);
  db.data.posts.push(post);
  db.write();

  res.set("Access-Control-Allow-Origin", "*");
  res.send(db.data.posts[post.id]);
});

// ----------------------------------------------------
// delete All entries - test using:
//      curl http://localhost:3001/deleteAll
// ----------------------------------------------------
app.get("/deleteAll", function (req, res) {
  db.data.posts = [];
  db.write();

  res.set("Access-Control-Allow-Origin", "*");
  res.status(204).send();
});

// start server
// -----------------------
app.listen(3001, function () {
  console.log("Running on port 3001!");
});
