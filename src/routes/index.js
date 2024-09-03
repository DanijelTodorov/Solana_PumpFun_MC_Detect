const {
  setLimitMarketCap,
  userMap,
  defaultLimitMarketCap,
} = require("@/services/socket");

const userModel = require("@/models/user.model");

const router = async (bot) => {
  if (userMap.size == 0) {
    const users = await userModel.find();
    for (let i = 0; i < users.length; i++) {
      userMap.set(users[i].id, users[i].limitMarketCap);
      console.log(users[i].id);
    }
  }
  bot.onText(/^\/start$/, async (msg) => {
    if (msg.chat.id == null || msg.chat.id == undefined) return;
    bot.sendMessage(msg.chat.id, "Bot started");

    if (userMap.get(msg.chat.id) == undefined) {
      userMap.set(msg.chat.id, defaultLimitMarketCap);
      console.log(`${msg.chat.id} is added to user list`);

      const exist = await userModel.findOne({ id: msg.chat.id });
      if (!exist) {
        console.log("User registered.....");
        const user = new userModel({
          id: msg.chat.id,
          firstName: msg.from.first_name,
          lastName: msg.from.last_name,
          userName: msg.from.username,
          limitMarketCap: defaultLimitMarketCap,
        });
        await user.save();
      } else {
        console.log("User already existed.....");
      }
    } else {
      console.log(`${msg.chat.id} is already existed in user list`);
    }
  });

  bot.onText(/^\/stop$/, async (msg) => {
    if (msg.chat.id == null || msg.chat.id == undefined) return;

    if (userMap.get(msg.chat.id)) {
      userMap.delete(msg.chat.id);
      console.log(`${msg.chat.id} is removed from user list`);
    } else {
      console.log(`${msg.chat.id} is not existed in user list`);
    }

  });

  bot.onText(/^\/setmc$/, async (msg) => {
    if (msg.chat.id == null || msg.chat.id == undefined) return;

    bot.sendMessage(msg.chat.id, "Set Market Cap").then(() => {
      bot.once("message", async (response) => {
        const newMarketCap = response.text;

        console.log("Set MarketCap");
        if (!isNaN(newMarketCap)) {
          console.log("MC:", newMarketCap);
          setLimitMarketCap(msg.chat.id, newMarketCap);
          let user = await userModel.findOne({ id: msg.chat.id });
          if (user) {
            console.log("user");
            user.limitMarketCap = newMarketCap;
            await user.save();
          }
          bot.sendMessage(msg.chat.id, `Mc changed successfully`);
        } else {
          bot.sendMessage(msg.chat.id, `Invalid Market Cap`);
        }
      });
    });
  });
  bot.on("callback_query", (query) => {
    const data = query.data.split(" ");
    switch (data[0]) {
      case "close":
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        bot.deleteMessage(chatId, messageId);
        break;
    }
    bot.answerCallbackQuery(query.id);
  });

  bot.on("polling_error", (e) => {
    console.error(e);
  });
};

module.exports = {
  router,
};
