const chat = document.querySelector('#chat');
const launcher = document.querySelector('#launcher');
const messages = document.querySelector('#messages');
const input = document.querySelector('#message');
let opener = launcher;

function openChat(trigger) {
  opener = trigger;
  chat.hidden = false;
  launcher.setAttribute('aria-expanded', 'true');
  document.querySelector('#close-chat').focus();
}

function closeChat() {
  chat.hidden = true;
  launcher.setAttribute('aria-expanded', 'false');
  opener.focus();
}

function appendBubble(content, role) {
  const bubble = document.createElement('p');
  bubble.className = 'bubble ' + role;
  bubble.textContent = content;
  messages.append(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

async function send(message) {
  const trimmed = message.trim();
  if (!trimmed) return;
  appendBubble(trimmed, 'visitor');
  const pending = appendBubble('Mencari jawaban…', 'bot');
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed }),
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error('Chat service unavailable');
    const data = await response.json();
    pending.textContent = data.reply;
  } catch {
    pending.textContent = 'Chat sedang tidak tersedia. Coba lagi atau lihat detail sepatu di halaman.';
  }
  messages.scrollTop = messages.scrollHeight;
}

document.querySelectorAll('[data-chat]').forEach(button => button.addEventListener('click', () => openChat(button)));
launcher.addEventListener('click', () => chat.hidden ? openChat(launcher) : closeChat());
document.querySelector('#close-chat').addEventListener('click', closeChat);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !chat.hidden) closeChat();
});
document.querySelectorAll('.prompts button').forEach(button => button.addEventListener('click', () => send(button.textContent)));
document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();
  send(input.value);
  input.value = '';
});
