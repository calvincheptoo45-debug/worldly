const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const saveBtn = document.getElementById("saveBtn");
const savedList = document.getElementById("savedList");

const wordTitle = document.getElementById("wordTitle");
const meaningBox = document.getElementById("meaningBox");

let savedWords = [];

/* LOAD SAVED WORDS */
window.addEventListener("load", () => {
  const stored = localStorage.getItem("words");
  if (stored) {
    savedWords = JSON.parse(stored);
    displaySavedWords();
  }
});

/* ==============================
   FREE DICTIONARY API CALL
============================== */
async function searchWord(word) {
  if (!word) return;

  wordTitle.textContent = "Searching...";
  meaningBox.textContent = "";

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    const data = await response.json();

    // API returns "title" when word not found
    if (data.title === "No Definitions Found") {
      wordTitle.textContent = word;
      meaningBox.textContent = "No meaning found.";
      return;
    }

    const meaning =
      data[0]?.meanings?.[0]?.definitions?.[0]?.definition;

    wordTitle.textContent = word;
    meaningBox.textContent = meaning || "No definition available.";

  } catch (error) {
    console.log(error);
    wordTitle.textContent = word;
    meaningBox.textContent = "Error fetching meaning.";
  }
}

/* SEARCH BUTTON */
searchBtn.addEventListener("click", () => {
  const word = searchInput.value.trim().toLowerCase();
  searchWord(word);
});

/* ENTER KEY SEARCH */
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

/* SAVE WORD */
saveBtn.addEventListener("click", () => {
  const word = wordTitle.textContent.trim();

  if (!word || word === "Searching...") {
    alert("Search a word first!");
    return;
  }

  if (!savedWords.includes(word)) {
    savedWords.push(word);
    localStorage.setItem("words", JSON.stringify(savedWords));
    displaySavedWords();
  } else {
    alert("Word already saved!");
  }
});

/* DISPLAY SAVED WORDS */
function displaySavedWords() {
  savedList.innerHTML = "";

  savedWords.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;

    li.addEventListener("click", () => {
      searchWord(word);
    });

    savedList.appendChild(li);
  });
}