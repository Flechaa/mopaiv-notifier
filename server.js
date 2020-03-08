const { MessageEmbed, WebhookClient } = require("discord.js");
const express = require("express");
require("dotenv").config();
const app = express();
let notifier = require("./notify.js");
notifier = new notifier();
const mongoose = require("mongoose");
const notifierweb = new WebhookClient(
  process.env.webhook_id,
  process.env.webhook_token
);

mongoose.connect(process.env.db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get("/", function(request, response) {
  response.sendStatus(200);
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

notifier.on("newItem", item => {
  send(
    item,
    Number(item.Exclusive) ? "**New Exclusive Item**" : "**New Item**"
  );
});

notifier.on("itemNameUpdate", item => {
  send(item, "**Item Name Updated**");
});

notifier.on("itemImageUpdate", item => {
  send(item, "**Item Thumbnail Updated**");
});

notifier.on("itemPriceUpdated", item => {
  send(item, "**Item Price Updated**");
});

notifier.on("itemUpdated", item => {
  send(item, "**Item Updated**");
});

function send(item, msg) {
  notifierweb.send(`${msg} @everyone`, notifierembed(item));
}

function notifierembed(item) {
  const embed = new MessageEmbed()
    .setColor(Number(item.Exclusive) ? "BLUE" : "GREEN")
    .setTitle(item.Name)
    .setURL(`https://mopaiv.com/market/item/${item.id}`)
    .setThumbnail(`https://cdn.mopaiv.com/market/${item.Image}.png`)
    .setDescription(
      `**Price:** ${Number(
        item.Cost
      ).toLocaleString()} <:mopaiv:685610406105972757>`
    )
    .setTimestamp()
    .setFooter("Mopaiv Notifier");
  return embed;
}

notifier.start();
