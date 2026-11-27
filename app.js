console.log("Habitly is alive");

const defaultHabits = [
  { id: 1, name: "Drink water", emoji: "💧", completedDates: [] },
  { id: 2, name: "Read a book", emoji: "📚", completedDates: [] },
  { id: 3, name: "Morning run", emoji: "🏃", completedDates: [] },
  { id: 4, name: "Meditate", emoji: "🧘", completedDates: [] },
  { id: 5, name: "Write journal", emoji: "✍️", completedDates: [] }
];

const STORAGE_KEY = "habitly-habits";

function loadHabits() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Could not load habits", error);
  }
  return defaultHabits;
}

function saveHabits() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error("Could not save habits", error);
  }
}

let habits = loadHabits();

function getToday() {
  return new Date().toLocaleDateString("en-CA");
}

function createHabitCard(habit) {
  const doneToday = habit.completedDates.includes(getToday());
  return `
    <li class="habit-card">
      <div class="habit-top">
        <span class="habit-emoji">${habit.emoji}</span>
        <div class="habit-info">
          <h2 class="habit-name">${habit.name}</h2>
          <p class="habit-streak">🔥 0 day streak</p>
        </div>
        <button type="button" class="delete-btn" data-id="${habit.id}" aria-label="Delete habit">🗑️</button>
      </div>
      <button type="button" class="complete-btn ${doneToday ? "done" : ""}" data-id="${habit.id}">${doneToday ? "Done ✓" : "Complete"}</button>
    </li>
  `;
}

const habitList = document.getElementById("habitList");

function updateSummary() {
  const today = getToday();
  const doneCount = habits.filter(function (habit) {
    return habit.completedDates.includes(today);
  }).length;

  document.getElementById("doneToday").textContent = doneCount + "/" + habits.length;
}

function renderHabits() {
  if (habits.length === 0) {
    habitList.innerHTML = `<li class="empty-state">No habits yet. Add your first one above 🌱</li>`;
  } else {
    habitList.innerHTML = habits.map(createHabitCard).join("");
  }
  updateSummary();
  saveHabits();
}

renderHabits();

habitList.addEventListener("click", function (event) {
  const deleteBtn = event.target.closest(".delete-btn");
  if (!deleteBtn) return;

  const id = Number(deleteBtn.dataset.id);

  if (confirm("Delete this habit?")) {
    habits = habits.filter(function (habit) {
      return habit.id !== id;
    });
    renderHabits();
  }
});

habitList.addEventListener("click", function (event) {
  const completeBtn = event.target.closest(".complete-btn");
  if (!completeBtn) return;

  const id = Number(completeBtn.dataset.id);
  const habit = habits.find(function (h) {
    return h.id === id;
  });
  const today = getToday();

  if (habit.completedDates.includes(today)) {
    habit.completedDates = habit.completedDates.filter(function (d) {
      return d !== today;
    });
  } else {
    habit.completedDates.push(today);
  }

  renderHabits();
});

let selectedEmoji = "💧";

const addForm = document.getElementById("addForm");
const habitInput = document.getElementById("habitInput");
const emojiPicker = document.getElementById("emojiPicker");
const formMessage = document.getElementById("formMessage");

emojiPicker.addEventListener("click", function (event) {
  const option = event.target.closest(".emoji-option");
  if (!option) return;

  document.querySelectorAll(".emoji-option").forEach(function (btn) {
    btn.classList.remove("selected");
  });
  option.classList.add("selected");
  selectedEmoji = option.dataset.emoji;
});

addForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = habitInput.value.trim();

  if (name === "") {
    formMessage.textContent = "Please type a habit name first 🙂";
    return;
  }

  const isDuplicate = habits.some(function (habit) {
    return habit.name.toLowerCase() === name.toLowerCase();
  });

  if (isDuplicate) {
    formMessage.textContent = "You already have that habit!";
    return;
  }

  habits.push({
    id: Date.now(),
    name: name,
    emoji: selectedEmoji,
    completedDates: []
  });

  habitInput.value = "";
  formMessage.textContent = "";
  renderHabits();
});

const fallbackQuotes = [
  { quote: "Small steps every day lead to big change.", author: "Unknown" },
  { quote: "We are what we repeatedly do.", author: "Will Durant" },
  { quote: "It always seems impossible until it is done.", author: "Nelson Mandela" }
];

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");

function showQuote(quote, author) {
  quoteText.textContent = "\u201C" + quote + "\u201D";
  quoteAuthor.textContent = "\u2014 " + author;
}

async function loadQuote() {
  quoteText.textContent = "Loading...";
  quoteAuthor.textContent = "";

  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    if (!response.ok) {
      throw new Error("Bad response");
    }
    const data = await response.json();
    showQuote(data.quote, data.author);
  } catch (error) {
    const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    showQuote(random.quote, random.author);
  }
}

loadQuote();