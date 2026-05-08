
/*
  * commands.js
  * Define command handlers for Telegram bot
  * @param {number} chatId - Telegram chat ID
  * @param {string} firstName - User's first name
  * @returns {string} Response message for /start command
*/
export const startCommand = (chatId, firstName) => {
  return`
👋 Halo ${firstName}!

Selamat datang di Caption-Gram Bot!

📋 Your Chat ID: \`${chatId}\`

📝 Cara menggunakan:
1. Copy Chat ID di atas (tap untuk copy)
2. Buka https://caption-gram.vercel.app
3. Paste Chat ID di kolom Telegram
4. Submit URL → Caption otomatis dikirim ke sini!

Gunakan /help untuk bantuan lebih lanjut.
  `
};

export const helpCommand = `
📖 *Caption-Gram Bot - Panduan*

*Langkah-langkah:*
1. Copy Chat ID Anda dari pesan /start
2. Buka web app Caption-Gram
3. Paste Chat ID di kolom Telegram
4. Submit URL Instagram/YouTube/Facebook
5. Caption akan otomatis dikirim ke chat ini

*Perintah yang tersedia:*
/start - Mulai bot dan dapatkan Chat ID
/help - Tampilkan panduan ini

*Troubleshooting:*
• Pastikan Chat ID sudah benar
• Cek koneksi internet
• URL harus dari Instagram, YouTube, atau Facebook

*Link Web App:*
https://caption-gram.vercel.app
  `;