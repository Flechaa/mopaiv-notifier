const EventEmitter = require("events");
const notify = require("./models/notifier");
const fetch = require("node-fetch");

module.exports = class Notifier extends EventEmitter {
  constructor(...args) {
    super(...args);
  }

  start() {
    setInterval(async () => await this.checkNewItems(), 1000 * process.env.delay);
  }

  async getItems() {
    try {
      const body = await fetch(`https://mopaiv.com/api/market/recent`).then(
        res => res.json()
      );
      return body;
    } catch (err) {
      console.error(err);
    }
  }

  async checkNewItems() {
    const items = await this.getItems();
    if (!items.length) return;
    items.map(async item => {
      const noti = await notify.findOne({ id: Number(item.id) });
      if (!noti) {
        const newItem = new notify({
          id: Number(item.id),
          name: item.Name,
          thumbnail: item.Image,
          price: item.Cost,
          exclusive: Number(item.Exclusive) ? true : false
        });
        newItem.save();
        console.log("New Item");
        return this.emit("newItem", item);
      }
      if (noti.name != item.Name) {
        noti.name = item.Name;
        console.log("Item Name Updated");
        this.emit("itemNameUpdate", item);
      }
      if (noti.thumbnail != item.Image) {
        noti.thumbnail = item.Image;
        console.log("Item Thumbnail Updated");
        this.emit("itemImageUpdate", item);
      }
      if (noti.price != item.Cost) {
        noti.price = item.Cost;
        console.log("Item Price Updated");
        this.emit("itemPriceUpdated", item);
      }
      if (noti.exclusive != Number(item.Exclusive) ? true : false) {
        noti.exclusive = Number(item.Exclusive) ? true : false;
        console.log("Item Updated");
        this.emit("itemUpdated", item);
      }
      noti.save();
    });
  }
};
