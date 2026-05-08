require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { startCommand, helpCommand } = require('./commands.js');

// Get token from environment variable
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Error: TELEGRAM_BOT_TOKEN tidak ditemukan di file .env');
  process.exit(1);
}

// Buat instance bot menggunakan polling untuk menerima pesan baru
const bot = new TelegramBot(token, {polling: true});

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg?.from?.first_name || 'User';
  
  const message = startCommand(chatId, firstName).trim();
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = helpCommand.trim();
  
  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

console.log('Bot sedang berjalan...');
console.log('Tekan Ctrl+C untuk menghentikan bot.');
