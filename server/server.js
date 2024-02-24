const webPush = require("web-push");

const publicKey = process.env.VAPID_PUBLIC_KEY || "BLhZoz6PPt1v9YyrUDM0jNnbA8hGQewVF9F70i09Oqfk1jtVxGjSs0UD1f7tyKiw9qGwFKJO4V1wOXnaKRj3-ig";
const privateKey = process.env.VAPID_PRIVATE_KEY || "wj5NUsrAFyFNKmZQ2BEh7k0Knvwu_KxroZwy7tYTEzM";
const baseUrl = process.env.BASE_URL || "https://localhost:8100";

if (!publicKey || !privateKey) {
  console.log(
    "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
    "environment variables. You can use the following ones:"
  );
  console.log(webPush.generateVAPIDKeys());
  return;
}

webPush.setVapidDetails(baseUrl, publicKey, privateKey);

const fileExists = require('fs').existsSync;
const express = require('express');
const app = express();

app.use(express.json())

app.get('/vapid', (req, res) => {
  res.json({publicKey})
});

app.post('/notification', async (req, res) => {
  const data = await req.json();

  for (let subscription of data.subscriptions) {
    webPush.sendNotification(subscription, data.payload, {
      TTL: 0
    });
  }

  res.sendStatus(200);
});

app.get('**', (req, res) => {
  let file = req.url;
  if (!fileExists("./www/" + file)) file = "index.html";
  res.sendFile(file, { root: "www" });
})

app.listen(3000, () => {
  console.log("Mahlzeit server started on port 3000.");
})
