# Plan: Integrasi Caption-Gram Web App dengan Telegram Bot

Menghubungkan web app caption-gram (Nuxt 4) dengan Telegram bot agar setiap ekstraksi caption otomatis dikirim ke chat user.

## User Flow

1. User start bot di Telegram → mendapat chat ID
2. User buka web app → input chat ID (disimpan di localStorage)
3. User submit URL → caption diekstrak → otomatis dikirim ke Telegram
4. User terima notifikasi di Telegram: caption + URL + timestamp

---

## Implementation Steps

### Phase 1: Bot Enhancement (Telegram Bot)

**Location: `caption-gram-tele-bot/`**

#### 1.1 Add /start Command Handler
- File: `index.js`
- Welcome message
- Kirim chat ID ke user dengan format yang jelas untuk di-copy
- Instruksi cara menggunakan di web app

#### 1.2 Add /help Command (Optional)
- Penjelasan cara link dengan web app
- Troubleshooting common issues

#### 1.3 Secure Token
- Move hardcoded token ke environment variable
- Create `.env` file
- Install `dotenv` package: `pnpm add dotenv`

#### 1.4 Add Start Script
- File: `package.json`
- Add: `"start": "node index.js"` untuk production

---

### Phase 2: Web App Backend (Caption-Gram API)

**Location: `caption-gram/` (parallel with Phase 1)**

#### 2.1 Create Telegram Notification API
- **New file**: `server/api/telegram/notify.post.ts`
- Accepts: `{ chatId: string, caption: string, url: string }`
- Calls Telegram Bot API `/sendMessage`
- Error handling untuk invalid chat ID
- Rate limiting consideration

#### 2.2 Install Telegram Bot Dependency
- Option A: Add `node-telegram-bot-api` ke package.json
- Option B: Gunakan native `ofetch` untuk call Bot API langsung (lebih ringan) ✅ Recommended

#### 2.3 Update Existing Caption Extraction API
- File: `server/api/ig.post.ts`
- Accept optional `chatId` parameter
- If `chatId` provided → call `/api/telegram/notify` after extraction
- Maintain backward compatibility (chatId optional)

#### 2.4 Add Environment Variable
- Create `.env` file
- Add: `TELEGRAM_BOT_TOKEN`
- Update `nuxt.config.ts` runtime config

---

### Phase 3: Web App Frontend (Caption-Gram UI)

**Location: `caption-gram/app/components/` (depends on Phase 2)**

#### 3.1 Add Chat ID Input Field
- File: `app/components/Form.vue`
- Input field untuk chat ID
- Save/load dari localStorage
- Validation: numeric, 9-10 digits
- Toggle untuk enable/disable Telegram notification

#### 3.2 Update Form Submission Logic
- Include `chatId` in POST request payload ke `/api/ig`
- Visual feedback: "Sent to Telegram ✓" setelah berhasil

#### 3.3 Add Chat ID Management UI (Enhancement)
- Button "Clear Chat ID"
- Help text: "Get your Chat ID from @caption_gram_bot"
- Link ke bot: `https://t.me/caption_gram_bot`

---

### Phase 4: Integration & Environment Setup

**Location: Both projects (depends on Phase 1-3)**

#### 4.1 Setup Environment Variables
- Bot: `.env` dengan `TELEGRAM_BOT_TOKEN`
- Web App: Vercel environment variables untuk `TELEGRAM_BOT_TOKEN`
- Ensure same token digunakan di kedua project

#### 4.2 Test Integration Locally
```bash
# Terminal 1: Run bot
cd caption-gram-tele-bot
node index.js

# Terminal 2: Run web app
cd caption-gram
pnpm dev
```
- Test complete flow end-to-end

#### 4.3 Deploy Bot (PENDING)
- **Recommended**: Railway.app atau VPS dengan PM2
- Ensure bot always online (polling mode)
- Alternative: Webhooks untuk serverless (lebih kompleks)

#### 4.4 Deploy Web App to Vercel (PENDING)
- Connect GitHub repo
- Set environment variable `TELEGRAM_BOT_TOKEN`
- Test production deployment

---

## File Structure

### Telegram Bot (`caption-gram-tele-bot/`)
```
caption-gram-tele-bot/
├── index.js              # ✏️ Add /start, /help commands, env support
├── package.json          # ✏️ Add start script, dotenv dependency
├── .env                  # 🆕 Store TELEGRAM_BOT_TOKEN
└── .gitignore           # 🆕 Add .env to gitignore
```

### Caption-Gram Web App (`caption-gram/`)
```
caption-gram/
├── server/
│   └── api/
│       ├── ig.post.ts                    # ✏️ Accept chatId param
│       └── telegram/
│           └── notify.post.ts            # 🆕 Telegram notification endpoint
├── app/
│   └── components/
│       └── Form.vue                      # ✏️ Add chat ID input
├── nuxt.config.ts                        # ✏️ Add runtime config
├── .env                                  # 🆕 Store TELEGRAM_BOT_TOKEN
└── package.json                          # ✏️ Add ofetch if needed
```

---

## Verification Checklist

### ✅ Bot Verification
- [ ] Send `/start` to bot → receive chat ID in copyable format
- [ ] Chat ID adalah angka (tidak ada "chat#" prefix)
- [ ] `/help` command shows proper instructions

### ✅ Web App Verification
- [ ] Input chat ID → tersimpan setelah refresh
- [ ] Submit URL without chat ID → works normally (backward compatible)
- [ ] Submit URL with chat ID → caption extracted AND sent to Telegram

### ✅ Integration Verification
- [ ] Receive Telegram message dengan format: Caption + URL + Timestamp
- [ ] Invalid chat ID → proper error handling di web app
- [ ] Bot offline → web app still works, shows error toast

### ✅ Production Verification
- [ ] Deploy bot to Railway/VPS → test polling works
- [ ] Deploy web app to Vercel → environment variable loaded
- [ ] End-to-end flow di production environment

---

## Technical Decisions

### Chat ID Storage
- **Frontend**: localStorage (user-specific, per-browser)
- **No backend database** → stateless, simple architecture
- User re-enters chat ID if clears browser data

### Authentication
- **No Telegram OAuth** (simplified approach)
- User manually copies chat ID dari bot
- **Trust model**: anyone with chat ID can send messages to themselves

### Message Format
```
🎯 Caption Extracted!

Caption: <extracted_description>

🔗 URL: <original_url>
⏰ Time: <timestamp>
```

### Deployment Strategy
- **Bot**: Railway.app (free tier, always-on polling)
- **Web App**: Vercel (free tier, serverless functions)
- **Same token** across environments: `TELEGRAM_BOT_TOKEN`

### API Implementation
- Use `ofetch` (already in Nuxt) instead of `node-telegram-bot-api`
- Telegram Bot API endpoint: `https://api.telegram.org/bot{token}/sendMessage`
- Lighter weight, no extra dependencies

---

## Scope

### ✅ Included
- Basic integration flow
- Chat ID management via localStorage
- Backward compatibility (web app works without Telegram)
- Error handling & user feedback
- Environment variable security

### ❌ Excluded
- Telegram Login Widget (OAuth)
- Database untuk user history
- Multi-user management
- Advanced rate limiting
- Webhook mode untuk bot (stick dengan polling)
- Inline keyboard buttons di Telegram message

---

## Further Considerations

### 1. Security: Validasi Chat ID Ownership?
- **Option A**: Trust model - siapapun bisa input chat ID manapun ✅ **Recommended** (simple)
- **Option B**: Add verification flow - bot generate code yang harus diinput di web
- **Option C**: Implement Telegram Login Widget (kompleks)

### 2. Rate Limiting
- **Option A**: No limit - trust users ✅ **Recommended** (MVP)
- **Option B**: 10 requests/hour per chat ID (butuh in-memory store)
- **Option C**: Implement proper rate limiting dengan database

### 3. Bot Hosting: Polling vs Webhooks?
- **Option A**: Polling (current) - mudah, works di Railway/VPS ✅ **Recommended**
- **Option B**: Webhooks - hemat resource, cocok serverless, butuh HTTPS domain
- **Option C**: Hybrid - polling di development, webhooks di production

---

## Example Code Snippets

### Bot: /start Command Handler (index.js)
```javascript
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'User';
  
  const message = `
👋 Halo ${firstName}!

Selamat datang di Caption-Gram Bot!

📋 Your Chat ID: \`${chatId}\`

📝 Cara menggunakan:
1. Copy Chat ID di atas (tap untuk copy)
2. Buka https://caption-gram.vercel.app
3. Paste Chat ID di kolom Telegram
4. Submit URL → Caption otomatis dikirim ke sini!

Gunakan /help untuk bantuan lebih lanjut.
  `.trim();
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});
```

### Web App: Telegram Notify API (server/api/telegram/notify.post.ts)
```typescript
export default defineEventHandler(async (event) => {
  const { chatId, caption, url } = await readBody(event);
  const config = useRuntimeConfig();
  const token = config.telegramBotToken;

  const message = `
🎯 Caption Extracted!

Caption: ${caption}

🔗 URL: ${url}
⏰ Time: ${new Date().toLocaleString('id-ID')}
  `.trim();

  try {
    const response = await $fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        body: {
          chat_id: chatId,
          text: message,
        },
      }
    );
    
    return { success: true, data: response };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to send Telegram notification',
    });
  }
});
```

### Web App: Update Form.vue (localStorage)
```vue
<script setup lang="ts">
const chatId = ref('');

// Load from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('telegram_chat_id');
  if (saved) chatId.value = saved;
});

// Save to localStorage on change
watch(chatId, (newValue) => {
  if (newValue) {
    localStorage.setItem('telegram_chat_id', newValue);
  } else {
    localStorage.removeItem('telegram_chat_id');
  }
});

// Include in form submission
const handleSubmit = async () => {
  const payload = {
    url: url.value,
    ...(chatId.value && { chatId: chatId.value }), // Optional
  };
  
  // ... existing submit logic
};
</script>
```

---

## Next Steps

1. **Start with Phase 1**: Implement bot commands
2. **Parallel Phase 2**: Setup web app backend API
3. **Continue to Phase 3**: Update web app UI
4. **Test locally** (Phase 4.2) before deployment
5. **Deploy to production** (Phase 4.3-4.4)

---

## Questions?

Jika ada pertanyaan atau butuh klarifikasi selama implementasi, silakan tanyakan!

**Good luck! 🚀**
