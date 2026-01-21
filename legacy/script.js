// 폰트 크기 조절 기능 (더 유연하게)
const chatContainerDiv = document.getElementById("chatContainer");
let currentFontSize = 16; // px, 기본값
function updateChatFontSize() {
  chatContainerDiv.style.fontSize = currentFontSize + "px";
}
updateChatFontSize();

document.getElementById("decreaseFont").onclick = function () {
  currentFontSize = Math.max(8, currentFontSize - 1); // 8px 이하로는 제한
  updateChatFontSize();
};
document.getElementById("increaseFont").onclick = function () {
  currentFontSize = Math.min(64, currentFontSize + 1); // 64px 이상은 제한
  updateChatFontSize();
};
// OpenAI API 키를 여기에 입력하세요
const OPENAI_API_KEY =
  "YOUR_KEY";

const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

// 메시지 추가 함수
function addMessage(content, isUser) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${
    isUser ? "user-message" : "assistant-message"
  }`;

  const contentP = document.createElement("p");
  contentP.className = "message-content";
  if (isUser) {
    contentP.textContent = content;
  } else {
    // 마크다운 렌더링 (marked.js 필요)
    if (window.marked) {
      contentP.innerHTML = window.marked.parse(content);
    } else {
      contentP.textContent = content;
    }
  }

  messageDiv.appendChild(contentP);
  chatContainer.appendChild(messageDiv);

  // 스크롤을 최하단으로 이동
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// OpenAI API 호출 함수
async function callOpenAI(userMessage) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error("API 요청에 실패했습니다.");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.";
  }
}

// 메시지 전송 처리
async function handleSend() {
  const message = userInput.value.trim();
  if (!message) return;

  // 사용자 메시지 표시
  addMessage(message, true);
  userInput.value = "";

  // "..." 표시로 응답 대기 상태 표시
  addMessage("응답을 생성하는 중...", false);

  // API 호출 및 응답 처리
  const response = await callOpenAI(message);

  // 대기 메시지 제거
  chatContainer.removeChild(chatContainer.lastChild);

  // 실제 응답 표시
  addMessage(response, false);
}

// 이벤트 리스너 등록
sendButton.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

// marked.js 동적 로드 (CDN)
if (!window.marked) {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
  script.onload = () => {
    console.log("marked.js loaded");
  };
  document.head.appendChild(script);
}
