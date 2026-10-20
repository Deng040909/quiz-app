/* ========================= DATA ========================= */
const questions = [
  // ---- 1-10: Multiple Choice (easy to moderate) ----
  { id:1, type:"mc", topic:"HTML", text:"Which tag is used to create a paragraph in HTML?",
    choices:["<p>","<para>","<text>","<pg>"], answer:0 },
  { id:2, type:"mc", topic:"HTML", text:"Which tag is used to create a hyperlink (a clickable link)?",
    choices:["<link>","<a>","<href>","<nav>"], answer:1 },
  { id:3, type:"mc", topic:"CSS", text:"Which CSS property changes the text color of an element?",
    choices:["color","text-color","font-color","background-color"], answer:0 },
  { id:4, type:"mc", topic:"CSS", text:"Which CSS property changes the background color of an element?",
    choices:["color","background-color","bgcolor","fill"], answer:1 },
  { id:5, type:"mc", topic:"CSS", text:"Which CSS property controls the size of text?",
    choices:["font-size","text-size","font-style","text-style"], answer:0 },
  { id:6, type:"mc", topic:"CSS", text:"Which CSS property makes text bold?",
    choices:["font-weight","text-bold","font-bold","bold-text"], answer:0 },
  { id:7, type:"mc", topic:"CSS", text:"Which unit is most commonly used to set exact sizes in pixels?",
    choices:["px","pt","in","cm"], answer:0 },
  { id:8, type:"mc", topic:"JS", text:"Which symbol starts a single-line comment in JavaScript?",
    choices:["//","##","<!-- -->","**"], answer:0 },
  { id:9, type:"mc", topic:"JS", text:"Which keyword is commonly used in modern JavaScript to declare a variable?",
    choices:["var","let","int","dim"], answer:1 },
  { id:10, type:"mc", topic:"JS", text:"Which keyword is used to write a decision (an if-statement) in JavaScript?",
    choices:["if","when","check","then"], answer:0 },

  // ---- 11-20: Fill in the blank (easy to moderate) ----
  { id:11, type:"blank", topic:"HTML", text:"The tag that holds all the visible content of a webpage (text, images, etc.) is __________.",
    answer:["body","<body>"] },
  { id:12, type:"blank", topic:"HTML", text:"The tag used to insert an image into a webpage is __________.",
    answer:["img","<img>"] },
  { id:13, type:"blank", topic:"HTML", text:"The tag used for the biggest, most important heading on a page is __________.",
    answer:["h1","<h1>"] },
  { id:14, type:"blank", topic:"CSS", text:"The CSS property used to add space INSIDE an element, between its content and its border, is __________.",
    answer:["padding"] },
  { id:15, type:"blank", topic:"CSS", text:"The CSS property used to add space OUTSIDE an element's border is __________.",
    answer:["margin"] },
  { id:16, type:"blank", topic:"CSS", text:"The file extension used for external CSS files is .__________.",
    answer:["css"] },
  { id:17, type:"blank", topic:"CSS", text:"The CSS property used to align text (left, center, or right) is __________.",
    answer:["text-align"] },
  { id:18, type:"blank", topic:"CSS", text:"The CSS property used to change the font (typeface) of text is __________.",
    answer:["font-family"] },
  { id:19, type:"blank", topic:"JS", text:"The file extension used for JavaScript files is .__________.",
    answer:["js"] },
  { id:20, type:"blank", topic:"JS", text:"The JavaScript keyword used to show a popup message to the user is __________.",
    answer:["alert"] },
];

/* ========================= STATE ========================= */
let timerMode = false;
let current = 0;
let userAnswers = new Array(questions.length).fill(null); // index for mc, string for blank
let timerInterval = null;
let timeLeft = 30;

/* ========================= SCREEN HELPERS ========================= */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ========================= THEME TOGGLE ========================= */
function toggleTheme(){
  document.body.classList.toggle('light');
  const icon = document.getElementById('theme-icon');
  icon.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
}

/* ========================= WELCOME ========================= */
function selectMode(withTimer){
  timerMode = withTimer;
  document.getElementById('mode-notimer').classList.toggle('selected', !withTimer);
  document.getElementById('mode-timer').classList.toggle('selected', withTimer);
}

function startQuiz(){
  current = 0;
  userAnswers = new Array(questions.length).fill(null);
  showScreen('screen-quiz');
  renderQuestion();
}

/* ========================= QUIZ RENDER ========================= */
function renderQuestion(){
  clearInterval(timerInterval);
  const q = questions[current];
  document.getElementById('q-counter').textContent = `Question ${current+1} / ${questions.length}`;
  document.getElementById('progress-fill').style.width = `${((current)/questions.length)*100 + (100/questions.length)}%`;
  document.getElementById('q-type').textContent = q.type === 'mc' ? 'Multiple Choice' : 'Fill in the Blank';
  document.getElementById('q-text').textContent = q.text;

  const choicesEl = document.getElementById('q-choices');
  const blankEl = document.getElementById('q-blank');
  choicesEl.innerHTML = '';

  if(q.type === 'mc'){
    blankEl.style.display = 'none';
    choicesEl.style.display = 'flex';
    const letters = ['A','B','C','D'];
    q.choices.forEach((choiceText, idx) => {
      const div = document.createElement('div');
      div.className = 'choice' + (userAnswers[current] === idx ? ' selected' : '');

      const letterSpan = document.createElement('span');
      letterSpan.className = 'letter';
      letterSpan.textContent = letters[idx];

      const textSpan = document.createElement('span');
      textSpan.textContent = choiceText;

      div.appendChild(letterSpan);
      div.appendChild(textSpan);
      div.onclick = () => selectChoice(idx);
      choicesEl.appendChild(div);
    });
  } else {
    choicesEl.style.display = 'none';
    blankEl.style.display = 'block';
    blankEl.value = userAnswers[current] || '';
    setTimeout(() => blankEl.focus(), 50);
    blankEl.oninput = () => { userAnswers[current] = blankEl.value; };
  }

  document.getElementById('btn-prev').disabled = current === 0;
  document.getElementById('btn-next').textContent = current === questions.length - 1 ? 'Finish ✔' : 'Next →';

  if(timerMode){
    timeLeft = 30;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if(timeLeft <= 0){
        clearInterval(timerInterval);
        goNext();
      }
    }, 1000);
  } else {
    document.getElementById('timer-display').innerHTML = '';
  }
}

function updateTimerDisplay(){
  document.getElementById('timer-display').innerHTML = `<span class="timer-badge">⏱ ${timeLeft}s</span>`;
}

function selectChoice(idx){
  userAnswers[current] = idx;
  renderQuestion();
}

function goNext(){
  if(current < questions.length - 1){
    current++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function goPrev(){
  if(current > 0){
    current--;
    renderQuestion();
  }
}

/* ========================= KEYBOARD NAV ========================= */
document.addEventListener('keydown', (e) => {
  const quizActive = document.getElementById('screen-quiz').classList.contains('active');
  const resultsActive = document.getElementById('screen-results').classList.contains('active');

  if(quizActive){
    if(e.key === 'ArrowRight'){ e.preventDefault(); goNext(); }
    else if(e.key === 'ArrowLeft'){ e.preventDefault(); goPrev(); }
    else if(e.key === 'Enter' && questions[current].type === 'blank'){ e.preventDefault(); goNext(); }
  }

  if(resultsActive){
    const k = e.key.toLowerCase();
    if(k === 'a') showAnswerKey();
    else if(k === 'r') retryQuiz();
    else if(k === 'd') finishDone();
  }

  const ansKeyActive = document.getElementById('screen-answerkey').classList.contains('active');
  if(ansKeyActive){
    const k = e.key.toLowerCase();
    if(k === 'b') backToResults();
    else if(k === 'r') retryQuiz();
    else if(k === 'd') finishDone();
  }
});

/* ========================= GRADING ========================= */
function isCorrect(q, idx){
  if(q.type === 'mc'){
    return userAnswers[idx] === q.answer;
  } else {
    const given = (userAnswers[idx] || '').trim().toLowerCase();
    return q.answer.includes(given);
  }
}

function finishQuiz(){
  clearInterval(timerInterval);
  let total = 0;
  questions.forEach((q, idx) => {
    if(isCorrect(q, idx)) total++;
  });
  const pct = Math.round((total/questions.length)*100);

  document.getElementById('score-circle').style.setProperty('--pct', pct);
  document.getElementById('score-big').textContent = `${total}/${questions.length}`;

  let remark = '';
  if(pct === 100) remark = "Perfect score! You're a certified web wizard. 🧙";
  else if(pct >= 80) remark = "Excellent! You really know your HTML, CSS & JS.";
  else if(pct >= 60) remark = "Good job! A bit more practice and you'll master it.";
  else if(pct >= 40) remark = "Not bad — review the topics you missed.";
  else remark = "Keep studying! Check the answer key to learn more.";
  document.getElementById('remark').textContent = remark;

  showScreen('screen-results');
}

/* ========================= ANSWER KEY ========================= */
function showAnswerKey(){
  const list = document.getElementById('ak-list');
  list.innerHTML = '';
  const letters = ['A','B','C','D'];

  questions.forEach((q, idx) => {
    const correct = isCorrect(q, idx);
    const div = document.createElement('div');
    div.className = 'ak-item ' + (correct ? 'correct' : 'incorrect');

    let yourAnsText, correctAnsText;
    if(q.type === 'mc'){
      yourAnsText = userAnswers[idx] !== null ? `${letters[userAnswers[idx]]}. ${q.choices[userAnswers[idx]]}` : '(no answer)';
      correctAnsText = `${letters[q.answer]}. ${q.choices[q.answer]}`;
    } else {
      yourAnsText = userAnswers[idx] ? userAnswers[idx] : '(no answer)';
      correctAnsText = q.answer[0];
    }

    const qDiv = document.createElement('div');
    qDiv.className = 'ak-q';
    qDiv.textContent = `${correct ? '✅' : '❌'} Q${q.id} [${q.topic}]: ${q.text}`;

    const yourDiv = document.createElement('div');
    yourDiv.className = 'ak-row your';
    yourDiv.textContent = `Your answer: ${yourAnsText}`;

    const correctDiv = document.createElement('div');
    correctDiv.className = 'ak-row correctans';
    correctDiv.textContent = `Correct answer: ${correctAnsText}`;

    div.appendChild(qDiv);
    div.appendChild(yourDiv);
    div.appendChild(correctDiv);
    list.appendChild(div);
  });

  showScreen('screen-answerkey');
}

/* ========================= BACK / RETRY / DONE ========================= */
function backToResults(){
  showScreen('screen-results');
}

function retryQuiz(){
  showScreen('screen-welcome');
}

function finishDone(){
  showScreen('screen-done');
  setTimeout(() => {
    window.close();
  }, 400);
}