require('dotenv').config();
require('module-alias/register');

const bot = require('@/configs/bot');
const { router } = require('@/routes');

const { connectDB } = require('@/configs/database.js');
const { initSocket } = require('@/services/socket.js');

(async () => {
    await connectDB()
    router(bot);
    await initSocket(bot)
})();
