const {
  setLimitMarketCap,
  userMap,
  defaultLimitMarketCap,
} = require("@/services/socket");

const userModel = require("@/models/user.model");

const admin = [6721289426, 6968764559, 2103646535];

const router = async (bot) => {
  if (userMap.size == 0) {
    const users = await userModel.find({ allowed: true });
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
        for (let i = 0; i < admin.length; i++) {
          bot.sendMessage(
            admin[i],
            `New User registered - Name:<code>${msg.from.username}</code> Id:<code>${msg.chat.id}</code>. You can allow user using /allowuser command.`,
            { parse_mode: "HTML" }
          );
        }
        bot.sendMessage(
          msg.chat.id,
          `Please wait to be approved to use the bot.`
        );
      } else {
        console.log("User already existed.....");
      }
    } else {
      console.log(`${msg.chat.id} is already existed in user list`);
    }
  });

  bot.onText(/^\/allowuser$/, async (msg) => {
    if (msg.chat.id == null || msg.chat.id == undefined) return;

    if (admin.includes(msg.chat.id)) {
      bot
        .sendMessage(
          msg.chat.id,
          "📨 Please input user id to allow. ex: 6968764559"
        )
        .then(() => {
          bot.once("message", async (response) => {
            const id = response.text;

            if (!isNaN(id)) {
              let user = await userModel.findOne({ id });
              if (user) {
                console.log("user");
                user.allowed = true;
                await user.save();
                userMap.set(user.id, user.limitMarketCap);
                bot.sendMessage(msg.chat.id, `Allowed successfully`);
              } else {
                bot.sendMessage(msg.chat.id, "No User");
              }
            } else {
              bot.sendMessage(msg.chat.id, `Invalid limit value`);
            }
          });
        });
    } else {
      bot.sendMessage(msg.chat.id, "You have no right to allow user!");
      return;
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
    if (userMap.get(msg.chat.id)) {
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
    }
  });

  bot.onText(/^\/getmc$/, async (msg) => {
    if (msg.chat.id == null || msg.chat.id == undefined) return;
    if (userMap.get(msg.chat.id)) {
      let user = await userModel.findOne({ id: msg.chat.id });
      if (user) {
        const market_cap = user.limitMarketCap;
        bot.sendMessage(msg.chat.id, `Limit Market Cap = ${market_cap}`);
      }
    }
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
