const {
  setLimitMarketCap,
  userMap,
  defaultLimitMarketCap,
} = require("@/services/socket");

const userModel = require("@/models/user.model");

const admin = [6721289426, 6968764559, 631967827, 2103646535];

let userlistindex = 0;

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
      bot.sendMessage(msg.chat.id, "Only admins can use this function");
      return;
    }
  });

  bot.onText(/^\/manageuser$/, async (msg) => {
    if (msg.chat.id == null || msg.chat.id == undefined) return;

    if (admin.includes(msg.chat.id)) {
      userlistindex = 0;
      const { title, buttons } = await getManageUi(msg.chat.id, userlistindex);
      bot.sendMessage(msg.chat.id, title, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: buttons,
        },
      });
    } else {
      bot.sendMessage(msg.chat.id, "Only admins can use this function");
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
    if (userMap.get(msg.chat.id) && admin.includes(msg.chat.id)) {
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
    } else {
      bot.sendMessage(msg.chat.id, "Only admins can use this function");
      return;
    }
  });

  bot.onText(/^\/getmc$/, async (msg) => {
    if (msg.chat.id == null || msg.chat.id == undefined) return;
    if (userMap.get(msg.chat.id) && admin.includes(msg.chat.id)) {
      let user = await userModel.findOne({ id: msg.chat.id });
      if (user) {
        const market_cap = user.limitMarketCap;
        bot.sendMessage(msg.chat.id, `Limit Market Cap = ${market_cap}`);
      }
    } else {
      bot.sendMessage(msg.chat.id, "Only admins can use this function.");
    }
  });

  // bot.on("callback_query", (query) => {
  //   const data = query.data.split(" ");
  //   switch (data[0]) {
  //     case "close":
  //       const chatId = query.message.chat.id;
  //       const messageId = query.message.message_id;
  //       bot.deleteMessage(chatId, messageId);
  //       break;
  //   }
  //   bot.answerCallbackQuery(query.id);
  // });

  bot.on("callback_query", async (query) => {
    try {
      const chatId = query.message.chat.id;
      const messageId = query.message.message_id;
      const data = query.data;
      if (admin.includes(chatId)) {
        if (data == "allow_user") {
          await bot.sendMessage(chatId, "Please input user Id to allow").then();
          bot.once("message", async (newMessage) => {
            id = newMessage.text;
            console.log("id = ", id);
            let user;
            try {
              user = await userModel.findById(id);
            } catch (error) {
              console.log("user find error");
              bot.sendMessage(chatId, "Invalid user Id");
              return;
            }
            if (user) {
              user.allowed = true;
              await user.save();
              userMap.set(user.id, user.limitMarketCap);
              bot.sendMessage(chatId, "user allowed");
              const { title, buttons } = await getManageUi(
                chatId,
                userlistindex
              );
              switchMenu(bot, chatId, messageId, title, buttons);
              // bot.deleteMessage(chatId, messageId);
              // bot.sendMessage(chatId, title, {
              //   parse_mode: "HTML",
              //   reply_markup: {
              //     inline_keyboard: buttons,
              //   },
              // });
            }
          });
        } else if (data == "stop_user") {
          await bot.sendMessage(chatId, "Please input user Id to stop");
          bot.once("message", async (newMessage) => {
            id = newMessage.text;
            console.log("id = ", id);
            let user;
            try {
              user = await userModel.findById(id);
            } catch (error) {
              console.log("user find error");
              bot.sendMessage(chatId, "Invalid user Id");
              return;
            }
            if (user) {
              user.allowed = false;
              await user.save();
              userMap.delete(user.id);
              bot.sendMessage(chatId, "user stopped");
              const { title, buttons } = await getManageUi(
                chatId,
                userlistindex
              );
              switchMenu(bot, chatId, messageId, title, buttons);
              // bot.deleteMessage(chatId, messageId);
              // bot.sendMessage(chatId, title, {
              //   parse_mode: "HTML",
              //   reply_markup: {
              //     inline_keyboard: buttons,
              //   },
              // });
            }
          });
        } else if (data == "remove_user") {
          await bot.sendMessage(chatId, "Please input user Id to remove");
          bot.once("message", async (newMessage) => {
            id = newMessage.text;
            console.log("id = ", id);
            let allowed;
            try {
              allowed = await userModel.findByIdAndDelete(id);
            } catch (error) {
              console.log('error');
              bot.sendMessage(chatId, 'Invalid user Id');
            }
            
            if (allowed) {
              userMap.delete(allowed.id);
              bot.sendMessage(chatId, "user removed");
              const { title, buttons } = await getManageUi(
                chatId,
                userlistindex
              );
              switchMenu(bot, chatId, messageId, title, buttons);
              // bot.deleteMessage(chatId, messageId);
              // bot.sendMessage(chatId, title, {
              //   parse_mode: "HTML",
              //   reply_markup: {
              //     inline_keyboard: buttons,
              //   },
              // });
            }
          });
        } else if (data == "prev_users") {
          userlistindex--;
          const users = await userModel.find({});
          if (userlistindex < 0) userlistindex = Math.floor(users.length / 10);
          const { title, buttons } = await getManageUi(chatId, userlistindex);
          switchMenu(bot, chatId, messageId, title, buttons);
        } else if (data == "next_users") {
          userlistindex++;
          const users = await userModel.find({});
          if (userlistindex > Math.floor(users.length / 10)) userlistindex = 0;
          const { title, buttons } = await getManageUi(chatId, userlistindex);
          switchMenu(bot, chatId, messageId, title, buttons);
        }
      } else {
        bot.sendMessage(chatId, "This function can only be used by admin");
      }
    } catch (error) {
      console.log("callback_query = ", error);
    }
  });

  bot.on("polling_error", (e) => {
    console.error(e);
  });
};

async function switchMenu(bot, chatId, messageId, title, json_buttons) {
  const keyboard = {
    inline_keyboard: json_buttons,
    resize_keyboard: true,
    one_time_keyboard: true,
    force_reply: true,
  };

  try {
    await bot.editMessageText(title, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: keyboard,
      disable_web_page_preview: true,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.log(error);
  }
}

const getManageUi = async (chatId, index) => {
  let users = await userModel.find({});
  let title = `Manage Users (total users: ${users.length})\n\n`;
  for (let i = index * 10; i < Math.min((index + 1) * 10, users.length); i++) {
    title += `${i + 1}. UserName: ${users[i].userName} ${users[i].allowed ? " 🟩" : " 🟥"}\nId: <code>${users[i]._id}</code>( Tap to copy )\n\n`;
  }

  const buttons = [
    [
      { text: "⏪", callback_data: "prev_users" },
      { text: "⏩", callback_data: "next_users" },
    ],
    [
      { text: "🟩 Allow", callback_data: "allow_user" },
      { text: "🟥 Not approved", callback_data: "stop_user" },
      { text: "❌ Remove", callback_data: "remove_user" },
    ],
  ];

  return { title, buttons };
};

module.exports = {
  router,
};
