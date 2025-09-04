let questions = [];
let remainingQuestions = [];
let score = 0;
let totalAnswered = 0;

async function loadLesson(lessonFile) {
  try {
    const res = await fetch(lessonFile);
    if (!res.ok) throw new Error(`Failed to load JSON: ${res.status}`);
    const data = await res.json();
    questions = data.questions || [];
    remainingQuestions = [...questions];

    // Score display
    let scoreDiv = document.getElementById("scoreDiv");
    if (!scoreDiv) {
      scoreDiv = document.createElement("div");
      scoreDiv.id = "scoreDiv";
      scoreDiv.style.margin = "10px 0";
      document.querySelector(".question-section").prepend(scoreDiv);
    }
    updateScore();

    getRandomQuestion();
  } catch (err) {
    console.error(err);
    const fieldset = document.querySelector("fieldset");
    if (fieldset) fieldset.innerHTML = `<legend>Error</legend><p>${err.message}</p>`;
  }
}

function updateScore() {
  const scoreDiv = document.getElementById("scoreDiv");
  scoreDiv.textContent = `Score: ${score} / ${totalAnswered}`;
}

function updateQuestionNumber() {
  const h2 = document.querySelector(".question-section h2");
  if (h2) {
    const currentQuestionNum = totalAnswered + 1;
    h2.textContent = remainingQuestions.length === 0
      ? "Quiz Finished!"
      : `Question ${currentQuestionNum} / ${questions.length}`;
  }
}

function getRandomQuestion() {
  updateQuestionNumber();

  const fieldset = document.querySelector("fieldset");
  if (!fieldset) return;

  if (remainingQuestions.length === 0) {
    fieldset.innerHTML = `
      <legend>🎉 Quiz Finished!</legend>
      <p>You answered ${score} out of ${totalAnswered} questions correctly.</p>
    `;
    return;
  }

  const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
  const q = remainingQuestions.splice(randomIndex, 1)[0];

  fieldset.innerHTML = "";
  const legend = document.createElement("legend");
  legend.textContent = q.question;
  fieldset.appendChild(legend);

  // Add image if exists
  if (q.image) {
    const img = document.createElement("img");
    img.src = q.image;
    img.alt = "Question Image";
    img.style.maxWidth = "100%";
    img.style.margin = "10px 0";
    fieldset.appendChild(img);
  }

  if (q.type === "multiple-choice" || q.type === "true-false") {
    const options = q.type === "multiple-choice" ? q.options : ["true", "false"];
    options.forEach(option => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = option;
      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + (q.type === "true-false" ? (option === "true" ? "True" : "False") : option)));
      fieldset.appendChild(label);
      fieldset.appendChild(document.createElement("br"));
    });

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Submit";
    btn.addEventListener("click", () => checkAnswerVisual(q.answer));
    fieldset.appendChild(btn);

  } else if (q.type === "short-answer") {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "userAnswer";
    input.placeholder = "Type your answer...";
    fieldset.appendChild(input);
    fieldset.appendChild(document.createElement("br"));

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Submit";
    btn.addEventListener("click", () => checkShortAnswerVisual(q.answer));
    fieldset.appendChild(btn);
  } else {
    fieldset.appendChild(document.createTextNode("Unknown question type."));
  }
}

function normalize(v) {
  return String(v).trim().toLowerCase();
}

// Disable all inputs and buttons in the current fieldset
function disableFieldset() {
  const fieldset = document.querySelector("fieldset");
  if (!fieldset) return;
  fieldset.querySelectorAll("input, button").forEach(el => el.disabled = true);
}

// Visual feedback for multiple-choice / true-false
function checkAnswerVisual(correct) {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    alert("⚠️ Please select an answer.");
    return;
  }

  totalAnswered++;

  const allLabels = document.querySelectorAll("label");
  allLabels.forEach(label => {
    const input = label.querySelector("input");
    if (normalize(input.value) === normalize(correct)) {
      label.style.color = "green";
      label.style.fontWeight = "bold";
    }
    if (input.checked && normalize(input.value) !== normalize(correct)) {
      label.style.color = "red";
      label.style.fontWeight = "bold";
    }
  });

  // Track correctness
  let isCorrect = normalize(selected.value) === normalize(correct);
  if (isCorrect) {
    score++;
  }

  // Only show explanation if wrong
  if (!isCorrect) {
    const currentQuestion = questions.find(
      q =>
        normalize(q.answer) === normalize(correct) &&
        q.question === document.querySelector("legend").textContent
    );
    if (currentQuestion && currentQuestion.explanation) {
      const explanation = document.createElement("p");
      explanation.textContent = "💡 " + currentQuestion.explanation;
      explanation.style.color = "blue";
      document.querySelector("fieldset").appendChild(explanation);
    }
  }

  updateScore();
  disableFieldset();
  setTimeout(getRandomQuestion, 2000);
}

// For short-answer
function checkShortAnswerVisual(correct) {
  const el = document.getElementById("userAnswer");
  if (!el) return;

  totalAnswered++;
  const userAnswer = el.value || "";
  const fieldset = document.querySelector("fieldset");

  const feedback = document.createElement("p");

  let isCorrect = normalize(userAnswer) === normalize(correct);

  if (isCorrect) {
    score++;
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `❌ Wrong. Correct answer: ${correct}`;
    feedback.style.color = "red";
  }

  fieldset.appendChild(feedback);

  // Only show explanation if wrong
  if (!isCorrect) {
    const currentQuestion = questions.find(
      q =>
        normalize(q.answer) === normalize(correct) &&
        q.question === document.querySelector("legend").textContent
    );
    if (currentQuestion && currentQuestion.explanation) {
      const explanation = document.createElement("p");
      explanation.textContent = "💡 " + currentQuestion.explanation;
      explanation.style.color = "blue";
      fieldset.appendChild(explanation);
    }
  }

  updateScore();
  disableFieldset();
  setTimeout(getRandomQuestion, 2000);
}

// start loading
loadLesson("../../lesson_json/test.json");