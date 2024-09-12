require("dotenv").config();
const WebSocket = require("ws");

let defaultLimitMarketCap = 10000;
let userMap = new Map();

const tokenModel = require("@/models/token.model");
const tradingModel = require("@/models/trading.model");
const analystModel = require("@/models/analyst.model");
const { convertToShort } = require("@/utils");
const { TokenDetect } = require("../models/tokendetect");

const saveTokenData = async (data) => {
  const token = new tokenModel(data);
  await token.save();
};

const saveTradeData = async (data) => {
  const token = new tradingModel(data);
  await token.save();
};

const setLimitMarketCap = (chatId, value) => {
  userMap.set(chatId, value);
};

let mints = new Map();

const saveAnalystData = async (jsonObject, bot) => {
  if (mints.get(jsonObject.mint) == 1) {
    return;
  }
  mints.set(jsonObject.mint, 1);

  const exist = await analystModel.find(jsonObject.mint);

  if (
    exist != null &&
    exist != undefined &&
    jsonObject.twitter == null &&
    jsonObject.telegram == null &&
    jsonObject.website == null
  ) {
    if (userMap != null && userMap != undefined && userMap.size >= 1) {
      const solAmount = convertToShort(jsonObject.market_cap);
      const usdAmount = convertToShort(jsonObject.usd_market_cap);

      userMap.forEach(async (limitMarketCap, key) => {
        const detect = await TokenDetect.findOne({
          id: key,
          token: jsonObject.mint,
        });
        // override from owner
        limitMarketCap = userMap.get(631967827);
        console.log("limitMarketCap = ", limitMarketCap);
        // end
        if (
          Number(jsonObject.usd_market_cap) >= Number(limitMarketCap) &&
          Number(exist.usdMarketCap) < Number(limitMarketCap) &&
          detect == null
        ) {
          if (Number(jsonObject.usd_market_cap) < Number(limitMarketCap) * 2)
            bot.sendMessage(
              key,
              `📌 Token detected\nTOKEN URL: https://pump.fun/${jsonObject.mint}\n MC(SOL): ${Number(solAmount).toFixed(2)}\n MC(US$): ${usdAmount}\n`
            );

          const detect = new TokenDetect({
            id: key,
            token: jsonObject.mint,
          });
          await detect.save();
        }
      });
    }

    // get existed data
    const data = {
      mint: jsonObject.mint,
      hasSocial:
        jsonObject.twitter != null ||
        jsonObject.telegram != null ||
        jsonObject.website != null
          ? true
          : false,
      marketCap: jsonObject.market_cap,
      usdMarketCap: jsonObject.usd_market_cap,
      lastTimeStamp: jsonObject.timestamp,
      replys: jsonObject.reply_count,
      raydiumPool: false,
      isConfirmed: true,
    };

    await analystModel.update(jsonObject.mint, data);
  } else if (
    exist == null &&
    jsonObject.twitter == null &&
    jsonObject.telegram == null &&
    jsonObject.website == null
  ) {
    console.log("new token");

    // get existed data
    const data = {
      mint: jsonObject.mint,
      hasSocial:
        jsonObject.twitter != null ||
        jsonObject.telegram != null ||
        jsonObject.website != null
          ? true
          : false,
      marketCap: jsonObject.market_cap,
      usdMarketCap: jsonObject.usd_market_cap,
      lastTimeStamp: jsonObject.timestamp,
      replys: jsonObject.reply_count,
      raydiumPool: false,
      isConfirmed: true,
    };

    const analystRec = new analystModel.AnalystModel(data);
    await analystRec.save();

    const solAmount = convertToShort(jsonObject.market_cap);
    const usdAmount = convertToShort(jsonObject.usd_market_cap);

    userMap.forEach(async (limitMarketCap, key) => {
      //override from owner
      limitMarketCap = userMap.get(631967827);
      console.log("limitMarketCap = ", limitMarketCap);
      //end
      if (Number(jsonObject.usd_market_cap) >= Number(limitMarketCap)) {
        if (Number(jsonObject.usd_market_cap) < Number(limitMarketCap) * 2)
          bot.sendMessage(
            key,
            `📌 Token detected\nTOKEN URL: https://pump.fun/${jsonObject.mint}\n MC(SOL): ${Number(solAmount).toFixed(2)}\n MC(US$): ${usdAmount}\n`
          );
        const detect = new TokenDetect({
          id: key,
          token: jsonObject.mint,
        });
        await detect.save();
      }
    });
  } else {
    // get existed data
    const data = {
      mint: jsonObject.mint,
      hasSocial:
        jsonObject.twitter != null ||
        jsonObject.telegram != null ||
        jsonObject.website != null
          ? true
          : false,
      marketCap: jsonObject.market_cap,
      usdMarketCap: jsonObject.usd_market_cap,
      lastTimeStamp: jsonObject.timestamp,
      replys: jsonObject.reply_count,
      raydiumPool: jsonObject.raydium_pool === null ? false : true,
    };

    await analystModel.update(jsonObject.mint, data);
  }
  mints.delete(jsonObject.mint);
};

const initSocket = (bot) => {
  console.log("Socket Started");
  let socket = new WebSocket(
    "wss://frontend-api.pump.fun/socket.io/?EIO=4&transport=websocket"
  );

  socket.on("open", function open() {
    console.log("Connected to WebSocket server");
    socket.send("40");
  });

  socket.on("message", async function incoming(data) {
    const bufferString = data.toString();

    if (bufferString === "2") {
      console.log("Server is not response to this socket");
      socket.send("3");
    }

    // Get Msg Type: tradeCreated / newCoinCreated
    const startQuote = bufferString.indexOf('"');
    const endQuote = bufferString.indexOf(",");

    if (startQuote !== -1 && endQuote !== -1 && endQuote > startQuote) {
      let messageType = bufferString.substring(startQuote + 1, endQuote).trim();
      if (messageType.startsWith("tradeCreated")) {
        const startIndex = bufferString.indexOf("{");
        const endIndex = bufferString.lastIndexOf("}") + 1;

        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          const jsonObjectString = bufferString.substring(startIndex, endIndex);

          try {
            const jsonObject = JSON.parse(jsonObjectString);
            console.log("======>cabal");
            await saveAnalystData(jsonObject, bot);
            //
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        } else {
          console.error(
            "Unable to find valid JSON object in the received data."
          );
        }
      }
    } else {
      // console.error('Unable to extract message type.');
    }
  });

  socket.on("close", function close() {
    socket.send("40");
    console.log("Disconnected from WebSocket server");
    socket.send("3");
    // process.exit(1);
    initSocket(bot);
  });
};

module.exports = {
  initSocket,
  setLimitMarketCap,
  userMap,
  defaultLimitMarketCap,
};
