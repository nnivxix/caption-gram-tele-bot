function escapeMarkdown(text){
  // Escape special characters for Telegram Markdown
  return text.replace(/[_*()~`>#+=|{}]/g, "\\$&");
}

module.exports = { escapeMarkdown };