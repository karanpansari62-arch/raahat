// --- Global State ---
let currentTheme = localStorage.getItem('theme') || 'light';
let userLanguage = 'en-US';
let chatHistory = [];
let streak = 5;
let coins = 150;

const i18n = {
  'en-US': {
    title: 'RAAHAT',
    subtitle: 'AI Mental Health Support for Students',
    btnChat: 'Talk to AI',
    btnBook: 'Book Counselor',
    featChatTitle: 'Zoon Bot 2.0',
    featChatDesc: 'Empathetic AI support available 24/7 in regional languages',
    featBookTitle: 'Counseling Booking',
    featBookDesc: 'Secure and private sessions with professional psychologists',
    featLangTitle: 'Multi-Language Support',
    featLangDesc: 'Support for Hindi, English, Kashmiri, and Dogri',
    featResTitle: 'Resource Hub',
    featResDesc: 'Low-bandwidth videos, audio guides, and articles for mental well-being',
    featPeerTitle: 'Peer Community',
    featPeerDesc: 'Anonymous forum for students to help each other',
    featLowNetTitle: 'Low Internet Mode',
    featLowNetDesc: 'Text-first UI designed for rural and low-bandwidth regions'
  },
  'hi-IN': {
    title: 'RAAHAT',
    subtitle: 'छात्रों के लिए एआई मानसिक स्वास्थ्य सहायता',
    btnChat: 'AI से बात करें',
    btnBook: 'काउंसलर बुक करें',
    featChatTitle: 'ज़ून बॉट 2.0',
    featChatDesc: 'क्षेत्रीय भाषाओं में 24/7 सहानुभूतिपूर्ण AI सहायता उपलब्ध',
    featBookTitle: 'परामर्श बुकिंग',
    featBookDesc: 'पेशेवर मनोवैज्ञानिकों के साथ सुरक्षित सत्र',
    featLangTitle: 'बहु-भाषा समर्थन',
    featLangDesc: 'हिंदी, अंग्रेजी, कश्मीरी और डोगरी के लिए समर्थन',
    featResTitle: 'संसाधन हब',
    featResDesc: 'मानसिक भलाई के लिए कम-बैंडविड्थ वीडियो और लेख',
    featPeerTitle: 'सहकर्मी समुदाय',
    featPeerDesc: 'छात्रों को एक-दूसरे की मदद करने के लिए अनाम मंच',
    featLowNetTitle: 'कम इंटरनेट मोड',
    featLowNetDesc: 'ग्रामीण क्षेत्रों के लिए टेक्स्ट-फर्स्ट यूआई'
  },
  'ks-IN': {
    title: 'RAAHAT',
    subtitle: 'AI ذہنی صحت کی مدد',
    btnChat: 'AI سٟتؠ کتھ کریو',
    btnBook: 'کونسلر بک کریو',
    featChatTitle: 'زون بوٹ 2.0',
    featChatDesc: 'علاقائی زبانن مَنٛز 24/7 ہمدرد AI مدد',
    featBookTitle: 'کونسلنگ بکنگ',
    featBookDesc: 'ماہرین نفسیات سٟتؠ محفوظ سیشن',
    featLangTitle: 'متعدد زبانہٕ',
    featLangDesc: 'ہندی، انگریزی، کشمیری تہٕ ڈوگری',
    featResTitle: 'وسیلہٕ',
    featResDesc: 'ذہنی صحت خاطرٕ کم بینڈوتھ ویڈیو تہٕ مضمون',
    featPeerTitle: 'کمیونٹی',
    featPeerDesc: 'طالب علمن خاطرٕ گمنام فورم',
    featLowNetTitle: 'کم انٹرنیٹ موڈ',
    featLowNetDesc: 'دیہی علاقن خاطرٕ ٹیکسٹ-فرسٹ UI'
  },
  'doi-IN': {
    title: 'RAAHAT',
    subtitle: 'AI मानसिक स्वास्थ्य समर्थन',
    btnChat: 'AI कन्नै गल्ल करो',
    btnBook: 'काउंसलर बुक करो',
    featChatTitle: 'ज़ून बॉट 2.0',
    featChatDesc: 'स्थानीय भाशाएं च 24/7 हमदर्द AI मदद',
    featBookTitle: 'काउंसलिंग बुकिंग',
    featBookDesc: 'माहरें कन्नै सुरक्षित सेशन',
    featLangTitle: 'बहु-भाशा समर्थन',
    featLangDesc: 'हिंदी, अंग्रेजी, कश्मीरी ते डोगरी',
    featResTitle: 'रिसर्च हब',
    featResDesc: 'मानसिक भलाई लेई कम-बैंडविड्थ वीडियो ते लेख',
    featPeerTitle: 'कमेटी',
    featPeerDesc: 'विद्यार्थियें लेई गुमनाम फोरम',
    featLowNetTitle: 'घट इंटरनेट मोड',
    featLowNetDesc: 'ग्रामीण इलाकें लेई टेक्स्ट-फर्स्ट UI'
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('themeToggle').checked = true;
  }
  
  // Language listener
  const langSel = document.getElementById('languageSelect');
  const langSelNav = document.getElementById('languageSelectNav');
  if (langSel) langSel.addEventListener('change', updateLanguage);
  if (langSelNav) langSelNav.addEventListener('change', updateLanguage);

  // Initialize Chat History
  initChatHistory();

  // Initialize Dashboard Chart
  initMoodChart();
  
  // Update Profile Data
  updateStatsDisplay();
});

function updateLanguage(e) {
  userLanguage = e.target.value;
  
  const navSelect = document.getElementById('languageSelectNav');
  const profSelect = document.getElementById('languageSelect');
  if (navSelect && navSelect.value !== userLanguage) navSelect.value = userLanguage;
  if (profSelect && profSelect.value !== userLanguage) profSelect.value = userLanguage;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[userLanguage] && i18n[userLanguage][key]) {
      el.innerText = i18n[userLanguage][key];
    }
  });
}

// --- Navigation Logic ---
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
  });
  
  // Remove active cl***REMOVED*** from all nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
  });

  // Show target section
  document.getElementById(sectionId).classList.add('active');
  
  // Add active cl***REMOVED*** to corresponding nav link
  const navId = sectionId.replace('Section', '');
  const targetNav = document.getElementById(`nav-${navId}`);
  if (targetNav) targetNav.classList.add('active');

  // Close mobile menu if open
  document.querySelector('.nav-links').classList.remove('show');

  // Special handling when showing specific sections
  if (sectionId === 'chatSection') {
    scrollToBottom();
    document.getElementById('userInput').focus();
  }
}

function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('show');
}

// --- Chatbot Logic ---

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

function handleEnter(event) {
  if (event.key === 'Enter') {
    if (!isAITyping) sendMessage();
  }
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
  const isHindi = document.getElementById('languageSelectNav').value === 'hi-IN';
  const confirmMsg = isHindi ? "क्या आप वाकई चैट हटाना चाहते हैं?" : "Are you sure you want to clear the chat history?";
  if (confirm(confirmMsg)) {
    const greeting = isHindi ? "नमस्ते! मैं Zoon Bot 2.0 हूँ। आज आप कैसा महसूस कर रहे हैं? 💙" : "Hi! I'm Zoon Bot 2.0. How are you feeling today? 💙";
    chatBox.innerHTML = `
      <div class="message bot-message">
        ${greeting}
      </div>
    `;
    currentSessionId = Date.now().toString();
    saveSessionChat('bot', greeting);
  }
}

function appendMessage(text, sender) {
  if (text !== "Typing..." && text !== "सोच रहा है..." && text !== "[Generation Stopped]") {
    saveSessionChat(sender, text);
  }
  createMessageDOM(text, sender);
  scrollToBottom();
}

function createMessageDOM(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
  
  if (sender === 'bot' && text !== "[Generation Stopped]") {
    const textSpan = document.createElement('span');
    textSpan.innerText = text;
    
    // Create Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.className = "copy-btn";
    copyBtn.title = "Copy to clipboard";
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(text);
      copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      copyBtn.style.color = "var(--primary-color)";
      copyBtn.style.opacity = "1";
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.style.color = "";
        copyBtn.style.opacity = "";
      }, 2000);
    };
    
    msgDiv.appendChild(textSpan);
    msgDiv.appendChild(copyBtn);
  } else {
    msgDiv.innerText = text;
  }

  chatBox.appendChild(msgDiv);
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Append User message
  appendMessage(text, 'user');
  userInput.value = '';

  // Simulate AI Thinking delay
  setTimeout(() => {
    generateAIResponse(text.toLowerCase());
  }, 1000);
}

let isAITyping = false;
let currentAbortController = null;

function toggleChatbotState() {
  if (isAITyping) {
    if (currentAbortController) {
      currentAbortController.abort();
    }
  } else {
    sendMessage();
  }
}

async function generateAIResponse(userText) {
  if (isAITyping) return;
  
  isAITyping = true;
  currentAbortController = new AbortController();
  
  // Swap UI to Stop button
  const sendBtn = document.getElementById('sendBtn');
  const sendIcon = document.getElementById('sendIcon');
  if (sendBtn && sendIcon) {
    sendBtn.classList.remove('primary');
    sendBtn.classList.add('danger');
    sendIcon.classList.remove('fa-paper-plane');
    sendIcon.classList.add('fa-stop');
  }

  const isHindi = document.getElementById('languageSelect').value === 'hi-IN';
  
  // Show "Typing..." indicator
  const typingId = "msg-" + Date.now();
  const msgDiv = document.createElement('div');
  msgDiv.id = typingId;
  msgDiv.classList.add('message', 'bot-message');
  msgDiv.innerText = isHindi ? "सोच रहा है..." : "Typing...";
  chatBox.appendChild(msgDiv);
  scrollToBottom();

  try {
    // Send to our local Python Flask backend
    const response = await fetch('http://127.0.0.1:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText, language: isHindi ? 'hi-IN' : 'en-US' }),
      signal: currentAbortController.signal
    });

    const data = await response.json();
    
    // Remove "Typing..." indicator
    const typingNode = document.getElementById(typingId);
    if(typingNode) typingNode.remove();

    if (response.ok) {
      appendMessage(data.reply, 'bot');
      speakText(data.reply); // Trigger TTS with AI response
    } else {
      throw new Error(data.error || "Unknown Error");
    }
  } catch (err) {
    console.error("Local Backend Error:", err);
    // Remove typing indicator if error occurs
    const typingNode = document.getElementById(typingId);
    if(typingNode) typingNode.remove();
    
    if (err.name === 'AbortError') {
      appendMessage("[Generation Stopped]", 'bot');
    } else {
      const fallbackMsg = isHindi 
        ? "क्षमा करें, मैं सर्वर से कनेक्ट नहीं हो पा रहा हूँ। क्या आपने Python बैकएंड चलाया?" 
        : "Sorry, I can't reach my brain. Did you start the Python backend in your terminal?";
      appendMessage(fallbackMsg, 'bot');
    }
  } finally {
    isAITyping = false;
    currentAbortController = null;
    
    // Swap UI back to Send button
    const sendBtn = document.getElementById('sendBtn');
    const sendIcon = document.getElementById('sendIcon');
    if (sendBtn && sendIcon) {
      sendBtn.classList.remove('danger');
      sendBtn.classList.add('primary');
      sendIcon.classList.remove('fa-stop');
      sendIcon.classList.add('fa-paper-plane');
    }
  }
}

// --- Speech Synthesis (Text-to-Speech) ---
function speakText(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedLang = document.getElementById('languageSelect').value || 'en-US';
    utterance.lang = selectedLang;
    utterance.rate = 0.95; // Slightly faster for natural cadence
    utterance.pitch = 1.25; // Higher pitch for a sweeter female tone
    
    // Grab all available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Prioritize specific attractive female voices based on OS
    let selectedVoice = voices.find(v => 
      v.lang.startsWith(selectedLang.split('-')[0]) && (
        v.name.includes("Female") || 
        v.name.includes("Zira") || // Windows
        v.name.includes("Samantha") || // macOS
        v.name.includes("Victoria") || // macOS
        v.name.includes("Google UK English Female")
      )
    );
    
    if (!selectedVoice) selectedVoice = voices.find(v => v.lang.startsWith(selectedLang.split('-')[0]));
    if (selectedVoice) utterance.voice = selectedVoice;

    // Cancel any ongoing speech before starting a new one
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech Synthesis not supported in this browser.");
  }
}

// Ensure voices are eagerly loaded to prevent selection bugs
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// --- Speech Recognition (Voice Input) ---
const micBtn = document.getElementById('micBtn');

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    alert("Speech Recognition API is not supported in your browser. Try Chrome or Edge.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = document.getElementById('languageSelect').value;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = function() {
    micBtn.classList.add('recording');
    userInput.placeholder = "Listening...";
  };

  recognition.onresult = function(event) {
    const speechResult = event.results[0][0].transcript;
    userInput.value = speechResult;
    sendMessage(); // Auto-send when voice input finishes
  };

  recognition.onspeechend = function() {
    recognition.stop();
  };

  recognition.onerror = function(event) {
    console.error("Speech recognition error", event.error);
    micBtn.classList.remove('recording');
    userInput.placeholder = "Type a message...";
  };

  recognition.onend = function() {
    micBtn.classList.remove('recording');
    userInput.placeholder = "Type a message...";
  };

  recognition.start();
}

// --- Dashboard Chart (Chart.js) ---
window.moodChartInstance = null;
const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weeklyData = [6, 7, 5, 8, 7, 9, 8];
const monthlyLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
const monthlyData = [5.5, 7.2, 8.0, 7.5];

function initMoodChart() {
  const ctx = document.getElementById('moodChart');
  if (!ctx) return;

  window.moodChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeklyLabels,
      datasets: [{
        label: 'Mood Level (1-10)',
        data: weeklyData,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#0ea5e9',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 10
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function updateChart(timeframe) {
  if (!window.moodChartInstance) return;
  
  const wBtn = document.getElementById('btnWeekly');
  const mBtn = document.getElementById('btnMonthly');
  
  if (timeframe === 'weekly') {
    if (wBtn) wBtn.classList.add('active');
    if (mBtn) mBtn.classList.remove('active');
    window.moodChartInstance.data.labels = weeklyLabels;
    window.moodChartInstance.data.datasets[0].data = weeklyData;
  } else {
    if (mBtn) mBtn.classList.add('active');
    if (wBtn) wBtn.classList.remove('active');
    window.moodChartInstance.data.labels = monthlyLabels;
    window.moodChartInstance.data.datasets[0].data = monthlyData;
  }
  
  window.moodChartInstance.update();
}

// --- Profile & Settings ---
function updateStatsDisplay() {
  document.getElementById('streakCount').innerText = `${streak} Days`;
  document.getElementById('coinCount').innerText = coins;
  document.getElementById('profileStreak').innerText = `${streak} Days`;
  document.getElementById('profileCoins').innerText = `${coins} Coins`;
}

function toggleDarkMode() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    currentTheme = 'dark';
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    currentTheme = 'light';
  }
}

// --- Booking Logic Redesign ---
let bookingState = {
  counselor: null,
  date: null,
  time: null,
  sessionType: null
};

document.addEventListener('DOMContentLoaded', () => {
  renderDateSelector();
  renderAppointments();
});

function renderDateSelector() {
  const container = document.getElementById('dateSelector');
  if (!container) return;
  container.innerHTML = '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = days[d.getDay()];
    const dateNum = d.getDate();
    const fullDateStr = d.toISOString().split('T')[0];
    
    const btn = document.createElement('button');
    btn.className = 'date-btn';
    btn.innerHTML = `<div class="date-day">${dayName}</div><div class="date-num">${dateNum}</div>`;
    btn.onclick = () => selectDate(btn, fullDateStr);
    container.appendChild(btn);
  }
}

function selectCounselor(name) {
  bookingState.counselor = name;
  document.querySelectorAll('.counselor-card').forEach(c => c.classList.remove('selected'));
  if(name.includes('Aisha')) {
    const el = document.getElementById('counselor-Aisha');
    if(el) el.classList.add('selected');
  }
  else if(name.includes('Rahul')) {
    const el = document.getElementById('counselor-Rahul');
    if(el) el.classList.add('selected');
  }
  validateBooking();
}

function selectDate(btnElement, dateStr) {
  bookingState.date = dateStr;
  document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected'));
  btnElement.classList.add('selected');
  validateBooking();
}

function selectTime(btnElement, timeStr) {
  if (btnElement.classList.contains('unavailable')) return;
  bookingState.time = timeStr;
  document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
  btnElement.classList.add('selected');
  validateBooking();
}

function selectSessionType(type) {
  bookingState.sessionType = type;
  document.querySelectorAll('.session-type-btn').forEach(b => b.classList.remove('selected'));
  if (type === 'Online') {
    const el = document.getElementById('session-Online');
    if(el) el.classList.add('selected');
  }
  if (type === 'Offline') {
    const el = document.getElementById('session-Offline');
    if(el) el.classList.add('selected');
  }
  validateBooking();
}

function validateBooking() {
  const btn = document.getElementById('confirmBookingBtn');
  if (!btn) return;
  if (bookingState.counselor && bookingState.date && bookingState.time && bookingState.sessionType) {
    btn.disabled = false;
    btn.classList.remove('disabled');
  } else {
    btn.disabled = true;
    btn.classList.add('disabled');
  }
}

function confirmBooking() {
  const statusMsg = document.getElementById('bookingStatus');
  if (statusMsg) {
    statusMsg.innerText = `Appointment confirmed with ${bookingState.counselor} via ${bookingState.sessionType} on ${bookingState.date} at ${bookingState.time}. 🎉`;
    statusMsg.className = 'status-msg success';
  }
  
  // Save to localStorage
  let appointments = JSON.parse(localStorage.getItem('raahat_appointments')) || [];
  appointments.push({
    id: Date.now().toString(),
    ...bookingState
  });
  localStorage.setItem('raahat_appointments', JSON.stringify(appointments));
  
  // Reset UI
  setTimeout(() => {
    if (statusMsg) statusMsg.className = 'status-msg hidden';
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    bookingState = { counselor: null, date: null, time: null, sessionType: null };
    validateBooking();
    renderAppointments();
  }, 4000);
  
  renderAppointments();
}

function renderAppointments() {
  const list = document.getElementById('appointmentsList');
  if (!list) return;
  
  const appointments = JSON.parse(localStorage.getItem('raahat_appointments')) || [];
  if (appointments.length === 0) {
    list.innerHTML = '<p class="empty-state">No upcoming appointments.</p>';
    return;
  }
  
  list.innerHTML = '';
  appointments.forEach(a => {
    const d = new Date(a.date);
    const dateFormatted = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const div = document.createElement('div');
    div.className = 'appointment-item';
    div.innerHTML = `
      <h4>${a.counselor}</h4>
      <p><i class="fas fa-calendar-alt"></i> ${dateFormatted} at ${a.time}</p>
      <p><i class="fas ${a.sessionType === 'Online' ? 'fa-video' : 'fa-user-friends'}"></i> ${a.sessionType} Session</p>
    `;
    list.appendChild(div);
  });
}

// --- Auth System UI Mock ---
function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  const tabs = document.querySelectorAll('.auth-tab');
  tabs[0].classList.toggle('active', isLogin);
  tabs[1].classList.toggle('active', !isLogin);

  document.getElementById('ageFieldContainer').style.display = isLogin ? 'none' : 'block';
  document.getElementById('authAge').required = !isLogin;
  document.getElementById('authSubmitBtn').innerText = isLogin ? 'Login' : 'Sign Up';
}

function handleAuth(event) {
  event.preventDefault();
  const email = document.getElementById('authEmail').value;
  
  // UI Changes on Login
  document.getElementById('nav-auth-container').style.display = 'none';
  document.getElementById('nav-profile-container').style.display = 'block';
  
  // Update Profile Name if signing up
  const isSignup = document.querySelector('.auth-tab.active').innerText === 'Sign Up';
  if (isSignup) {
    const namePart = email.split('@')[0];
    document.getElementById('profileName').innerText = namePart;
  }
  
  alert('Auth successful for: ' + email + '. Welcome to RAAHAT!');
  
  // Go straight to dashboard and reset form
  document.getElementById('authForm').reset();
  showSection('dashboardSection');
}

function editProfile() {
  const newName = prompt("Enter new name:", document.getElementById('profileName').innerText);
  if (newName) {
    document.getElementById('profileName').innerText = newName;
  }
}

// --- Chat History Logic (localStorage) ---
let currentSessionId = Date.now().toString();

function initChatHistory() {
  renderChatHistoryList();
}

function saveSessionChat(sender, text) {
  let sessions = JSON.parse(localStorage.getItem('raahat_chat_sessions')) || {};
  if (!sessions[currentSessionId]) {
    sessions[currentSessionId] = {
      id: currentSessionId,
      timestamp: Date.now(),
      messages: []
    };
  }
  
  sessions[currentSessionId].messages.push({ sender, text });
  sessions[currentSessionId].lastUpdated = Date.now();
  
  localStorage.setItem('raahat_chat_sessions', JSON.stringify(sessions));
  renderChatHistoryList();
}

function renderChatHistoryList() {
  const list = document.getElementById('chatHistoryList');
  if (!list) return;

  const sessions = JSON.parse(localStorage.getItem('raahat_chat_sessions')) || {};
  const sessionArray = Object.values(sessions).sort((a, b) => b.lastUpdated - a.lastUpdated);

  if (sessionArray.length === 0) {
    list.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 1rem;">No history found.</p>';
    return;
  }

  list.innerHTML = '';
  sessionArray.forEach(session => {
    // Find first user message for title, or fallback
    const firstUserMsg = session.messages.find(m => m.sender === 'user');
    const previewText = firstUserMsg ? firstUserMsg.text : "New Conversation";
    const dateStr = new Date(session.lastUpdated).toLocaleString();

    const item = document.createElement('div');
    item.className = 'history-item' + (session.id === currentSessionId ? ' active-session' : '');
    item.onclick = () => loadSession(session.id);
    
    item.innerHTML = `
      <div class="history-info">
        <div class="history-preview">${previewText}</div>
        <div class="history-time">${dateStr}</div>
      </div>
      <button class="delete-chat-btn" title="Delete" onclick="event.stopPropagation(); deleteSession('${session.id}')">
        <i class="fas fa-trash"></i>
      </button>
    `;
    list.appendChild(item);
  });
}

function loadSession(sessionId) {
  const sessions = JSON.parse(localStorage.getItem('raahat_chat_sessions')) || {};
  const session = sessions[sessionId];
  if (!session) return;

  currentSessionId = sessionId;
  chatBox.innerHTML = ''; // clear DOM
  
  session.messages.forEach(msg => {
    createMessageDOM(msg.text, msg.sender);
  });
  scrollToBottom();
  renderChatHistoryList();
  
  if (window.innerWidth <= 768) toggleChatSidebar(); // Close on mobile after selection
}

function deleteSession(sessionId) {
  if (!confirm("Delete this conversation?")) return;
  const sessions = JSON.parse(localStorage.getItem('raahat_chat_sessions')) || {};
  delete sessions[sessionId];
  localStorage.setItem('raahat_chat_sessions', JSON.stringify(sessions));
  
  if (currentSessionId === sessionId) {
    clearChat(); // Unload current if deleted
  } else {
    renderChatHistoryList();
  }
}

function clearAllChatHistory() {
  if (!confirm("Are you sure you want to clear ALL chat history?")) return;
  localStorage.removeItem('raahat_chat_sessions');
  clearChat();
}

function toggleChatSidebar() {
  const sidebar = document.getElementById('chatSidebar');
  if (sidebar) sidebar.classList.toggle('hidden');
}

function startNewChat() {
  currentSessionId = Date.now().toString();
  chatBox.innerHTML = '';
  const langNav = document.getElementById('languageSelectNav');
  const isHindi = langNav && langNav.value === 'hi-IN';
  const greeting = isHindi ? "नमस्ते! मैं Raahat AI हूँ। आज आप कैसा महसूस कर रहे हैं? 💙" : "Hi! I'm Raahat AI. How are you feeling today? 💙";
  createMessageDOM(greeting, 'bot');
  saveSessionChat('bot', greeting);
  
  // Close sidebar on mobile if open
  const sidebar = document.getElementById('chatSidebar');
  if (window.innerWidth <= 768 && sidebar && !sidebar.classList.contains('hidden')) {
    toggleChatSidebar();
  }
}

// --- Resource Hub Logic ---
function filterResources(category, btnElement) {
  if (btnElement) {
    document.querySelectorAll('.resource-pill').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
  }

  const cards = document.querySelectorAll('.resource-card');
  cards.forEach(card => {
    if (category === 'All' || card.getAttribute('data-category') === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}
