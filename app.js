// cursor

document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".custom-cursor");
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});

// Start Chat
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");

let userMessage;
const apiKey = "AIzaSyCtXC-o1m1bLZ6wm3PEadQe70x6bIPGk3Q";
const initialHeight = chatInput.scrollHeight; // Store the initial height

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const apiURL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    }),
  };

  fetch(apiURL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.candidates[0].content.parts[0].text;
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = "";

  // Append the user's message to the chatbox
  chatBox.appendChild(createChatLi(userMessage, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);

  // Reset the textarea height to its initial value
  chatInput.style.height = `${initialHeight}px`;

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatBox.appendChild(incomingChatLi);
    chatBox.scrollTo(0, chatBox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = "auto"; // Reset height to calculate scrollHeight
  const newHeight = Math.max(chatInput.scrollHeight, 50); // Ensure minimum height
  chatInput.style.height = `${newHeight}px`; // Set the height based on content
});

sendChatBtn.addEventListener("click", handleChat);

// Optional: Allow sending message with Enter key
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevent adding a new line
    handleChat();
  }
});

const chatText = document.querySelector(".chatbox li p");

chatText.innerText =
  "Hello! I’m Juno 🤖—your friendly AI assistant. What can I do for you today?";

// Open and close chatbot

const chatBtn = document.querySelector(".chat-btn");
const btnArrow = document.querySelector(".chat-btn span");
const closeBtn = document.querySelector(".close-btn");
const section = document.querySelector("section");
const body = document.querySelector("body");
const heading = document.querySelector(".heading");
const subheading = document.querySelector(".subheading-left");
const insta = document.querySelector("#insta");

function disableScroll() {
  document.body.classList.add("no-scroll");
}

function enableScroll() {
  document.body.classList.remove("no-scroll");
}

const startChat = () => {
  section.classList.add("show-chatbot");
  body.classList.add("head-left");
  heading.classList.add("hide-heading");
  subheading.innerText = "Ask me anything! I’m here to help.";
  subheading.style.width = "70%";
  chatBtn.classList.add("end-chat");
  btnArrow.style.display = "none";
  chatBtn.innerHTML = "End Chat";
  insta.style.display = "none";
  disableScroll();
};

const endChat = () => {
  section.classList.remove("show-chatbot");
  body.classList.remove("head-left");
  heading.classList.remove("hide-heading");
  subheading.innerText = "Your AI for Every Conversation";
  subheading.style.width = "100%";
  chatBtn.classList.remove("end-chat");
  btnArrow.style.display = "block";
  insta.style.display = "block";
  chatBtn.innerHTML =
    "Let's Chat <span class='material-symbols-outlined'>arrow_forward</span>";
};

chatBtn.addEventListener("click", () => {
  chatBtn.classList.contains("end-chat") ? endChat() : startChat();
});

closeBtn.addEventListener("click", () => {
  endChat();
});
