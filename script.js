const total = 10;
let quiz = [];
let index = 0;
let score = 0;
let time = 0;
let timerId; // Use this consistently

function startQuiz() {
  const diff = document.getElementById("difficulty").value;
  // Create a copy and shuffle
  quiz = shuffle([...QUESTION_BANK[diff]]).slice(0, total);

  index = 0;
  score = 0;

// 1. Reset the progress bar to 0 immediately
  document.getElementById("progress-fill").style.width = "0%";

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");

// 3. Use a tiny timeout (10ms) to trigger the animation
  setTimeout(() => {
    showQuestion();
  }, 10);
}

function startTimer() {
  time = 0;
  document.getElementById("timer").innerText = `Time: 0s`;
  
  // Clear any existing interval before starting a new one
  clearInterval(timerId); 
  
  timerId = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = `Time: ${time}s`;
  }, 1000);
}

// function showQuestion() {
//   const q = quiz[index];
//   document.getElementById("question").innerText = q.q;

//   const optionsDiv = document.getElementById("options");
//   optionsDiv.innerHTML = "";

//   q.o.forEach(opt => {
//     const btn = document.createElement("button");
//     btn.innerText = opt;
//     btn.onclick = () => checkAnswer(opt);
//     optionsDiv.appendChild(btn);
//   });
  
//   startTimer(); // Start timer as soon as question is shown
// }

function showQuestion() {
  const q = quiz[index];
  
  // 1. Update the Text (e.g., Question 1 / 10)
  const progressText = document.getElementById("progress");
  if (progressText) {
    progressText.innerText = `Question ${index + 1} / ${total}`;
  }

  // 2. Update the Bar Fill
  const fill = document.getElementById("progress-fill");
  if (fill) {
    const progressPercent = ((index + 1) / total) * 100;
    fill.style.width = progressPercent + "%";
    console.log("Current Progress:", progressPercent + "%"); // Debugging line
  }

  // 3. Update Question and Options
  document.getElementById("question").innerText = q.q;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.o.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsDiv.appendChild(btn);
  });
  
  startTimer();
}

// --- ADDED THIS FUNCTION ---
function checkAnswer(selectedOption) {
  const correctAnswer = quiz[index].a;

  if (selectedOption === correctAnswer) {
    score++;
  }

  // Move to next question immediately
  nextQuestion();
}

function nextQuestion() {
  clearInterval(timerId); // Stop the current timer
  index++;
  
  if (index < quiz.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timerId);
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  const savedBest = Number(localStorage.getItem("best") || 0);
  const best = Math.max(score, savedBest);
  localStorage.setItem("best", best);

  document.getElementById("finalScore").innerText = `Score: ${score} / ${total}`;
  document.getElementById("bestScore").innerText = `Best Score: ${best}`;

  let iq = score <= 3 ? "Below Average" : score <= 7 ? "Average" : "High";
  document.getElementById("iqLevel").innerText = `IQ Level: ${iq}`;

  document.getElementById("setup").classList.remove("hidden");
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}