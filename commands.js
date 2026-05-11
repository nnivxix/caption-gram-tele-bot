
/*
  * commands.js
  * Define command handlers for Telegram bot
  * @param {number} chatId - Telegram chat ID
  * @param {string} firstName - User's first name
  * @returns {string} Response message for /start command
*/
const startCommand = (chatId, firstName) => {
  return`
👋 Hello ${firstName}!

Welcome to Caption-Gram Bot!

📋 Your Chat ID: \`${chatId}\`

📝 How to use:
1. Copy the Chat ID above (tap to copy)
2. Open https://caption-gram.vercel.app/settings/telegram-bot
3. Paste the Chat ID into the Telegram field
4. Submit a URL → Captions will be sent here automatically!

Use /help for more information.
  `
};

const helpCommand = `
📖 *Caption-Gram Bot - Guide*

*Steps:*
1. Copy your Chat ID from the /start message
2. Open the Caption-Gram web app
3. Paste the Chat ID into the Telegram field
4. Submit an Instagram/YouTube/Facebook URL
5. Captions will be automatically sent to this chat

*Available commands:*
/start - Start the bot and get your Chat ID
/help - Show this guide

*Troubleshooting:*
• Make sure the Chat ID is correct
• Check your internet connection
• The URL must be from Instagram, YouTube, or Facebook

*Link Web App:*
https://caption-gram.vercel.app
  `;
  
module.exports = { startCommand, helpCommand };