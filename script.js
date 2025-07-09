let currentEmail = "";
let currentUsername = "";
let timer = 10;

function generateEmail() {
  const random = Math.random().toString(36).substring(2, 8);
  currentUsername = random;
  currentEmail = `${random}@1secmail.com`;
  document.getElementById("email").innerText = currentEmail;
  timer = 10;
  updateTimerDisplay();
  fetchInbox();
}

function copyEmail() {
  navigator.clipboard.writeText(currentEmail);
  alert("Email copied to clipboard!");
}

function updateTimerDisplay() {
  document.getElementById("timer").innerText = timer;
}

function extendTimer() {
  if (timer < 10) {
    timer += 1;
    updateTimerDisplay();
  } else {
    alert("Cannot exceed 10 minutes.");
  }
}

function countdown() {
  if (timer > 0) {
    timer--;
    updateTimerDisplay();
  }
}

async function fetchInbox() {
  if (!currentUsername) return;

  try {
    const inboxRes = await fetch(
      `https://www.1secmail.com/api/v1/?action=getMessages&login=${currentUsername}&domain=1secmail.com`
    );
    const messages = await inboxRes.json();

    const inbox = document.getElementById("inbox");
    inbox.innerHTML = "";

    if (messages.length === 0) {
      inbox.innerHTML = "<p>No new messages.</p>";
    }

    for (const msg of messages) {
      const msgRes = await fetch(
        `https://www.1secmail.com/api/v1/?action=readMessage&login=${currentUsername}&domain=1secmail.com&id=${msg.id}`
      );
      const msgData = await msgRes.json();

      const msgDiv = document.createElement("div");
      msgDiv.className = "message";
      msgDiv.innerHTML = `
        <strong>${msg.from}</strong>
        <p><strong>Subject:</strong> ${msg.subject}</p>
        <p>${msgData.body}</p>
      `;
      inbox.appendChild(msgDiv);
    }
  } catch (error) {
    console.error("Error fetching inbox:", error);
  }
}

function addTestMessage() {
  const inbox = document.getElementById("inbox");
  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerHTML = `<strong>test@demo.com</strong><p>This is a test message.</p>`;
  inbox.appendChild(msg);
}

generateEmail();
setInterval(countdown, 60000);
setInterval(fetchInbox, 30000);