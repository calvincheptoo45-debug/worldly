const form = document.getElementById("searchForm");
const input = document.getElementById("wordInput");

const resultBox = document.getElementById("result");
const errorBox = document.getElementById("error");

const wordTitle = document.getElementById("wordTitle");
const phonetic = document.getElementById("phonetic");
const definition = document.getElementById("definition");
const example = document.getElementById("example");
const synonyms = document.getElementById("synonyms");
const audio = document.getElementById("audio");

// Handle form submission (SPA behavior: no refresh)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const word = input.value.trim();

  if (!word) {
    showError("Please enter a word.");
    return;
  }

  fetchWord(word);
});

// Fetch API data
async function fetchWord(word) {
  try {
    errorBox.textContent = "";
    resultBox.classList.add("hidden");

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();
    displayWord(data);

  } catch (error) {
    showError("Word not found. Try another word.");
  }
}

// Display data in DOM
function displayWord(data) {
  const entry = data[0];

  wordTitle.textContent = entry.word;
  phonetic.textContent = entry.phonetic || "N/A";

  const meaning = entry.meanings[0];
  definition.textContent = meaning.definitions[0].definition || "No definition found";

  example.textContent = meaning.definitions[0].example || "No example available";

  // synonyms
  const syns = meaning.definitions[0].synonyms;
  synonyms.textContent = syns && syns.length ? syns.join(", ") : "No synonyms found";

  // audio pronunciation
  const audioSrc = entry.phonetics.find(p => p.audio)?.audio;

  if (audioSrc) {
    audio.src = audioSrc;
    audio.classList.remove("hidden");
  } else {
    audio.classList.add("hidden");
  }

  resultBox.classList.remove("hidden");
}

// Error handler
function showError(message) {
  errorBox.textContent = message;
}
const saveBtn = document.getElementById("saveBtn");
const savedList = document.getElementById("savedList");

let savedWords = [];

// Load saved words when page loads
window.addEventListener("load", () => {
  const stored = localStorage.getItem("words");
  if (stored) {
    savedWords = JSON.parse(stored);
    displaySavedWords();
  }
});

// When SAVE button is clicked
saveBtn.addEventListener("click", () => {
  const word = document.getElementById("wordTitle").textContent;

  if (!word) {
    alert("No word to save!");
    return;
  }

  if (!savedWords.includes(word)) {
    savedWords.push(word);

    // Save to localStorage
    localStorage.setItem("words", JSON.stringify(savedWords));

    displaySavedWords();
  } else {
    alert("Word already saved!");
  }
});

// Display saved words
function displaySavedWords() {
  savedList.innerHTML = "";

  savedWords.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    savedList.appendChild(li);
  });
}