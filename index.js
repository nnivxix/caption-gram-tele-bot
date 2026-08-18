require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { startCommand, helpCommand } = require("./commands.js");

// Get token from environment variable
const token = process.env.TELEGRAM_BOT_TOKEN;
const captionApiUrl = process.env.CAPTION_API_URL;

if (!token) {
  console.error(
    "Error: TELEGRAM_BOT_TOKEN is not set in environment variables.",
  );
  process.exit(1);
}

// Create bot instance using polling to receive new messages
const bot = new TelegramBot(token, { polling: true });

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg?.from?.first_name || "User";

  const message = startCommand(chatId, firstName).trim();

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  const helpMessage = helpCommand.trim();

  bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown" });
});

// add functionality to handle message contain links from instagram, youtube, facebook
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (text.startsWith("/")) {
    return; // Ignore commands
  }

  // Check if the message contains a link to Instagram, YouTube, or Facebook
  const instagramRegex = /https?:\/\/(www\.)?instagram\.com\/[^\s]+/i;
  const youtubeRegex = /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/i;
  const facebookRegex = /https?:\/\/(www\.)?facebook\.com\/[^\s]+/i;

  if (
    instagramRegex.test(text) ||
    youtubeRegex.test(text) ||
    facebookRegex.test(text)
  ) {
    const processingMessage = await bot.sendMessage(
      chatId,
      "Processing your link...",
    );
    const apiUrl = captionApiUrl + "/api/ig";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: text }),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      const data = await response.json();
      const caption = data.data.caption || "No caption available";

      bot.sendMessage(chatId, caption, { parse_mode: "Markdown" });
    } catch (error) {
      bot.sendMessage(
        chatId,
        "Sorry, there was an error processing your link.",
      );
    } finally {
      await bot.deleteMessage(chatId, processingMessage.message_id);
    }
  } else {
    bot.sendMessage(
      chatId,
      "Please send a valid Instagram, YouTube, or Facebook link to extract the caption.",
    );
  }
});
console.log("Bot is running...");
