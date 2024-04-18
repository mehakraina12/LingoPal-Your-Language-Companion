const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following is the correct plural form of 'وَلَد' (walad), meaning 'boy'?",
        answers: [
            { text: "وَلادة (walādah)", correct: false},
            { text: "وُلْد (wulud)", correct: false},
            { text: "وَلاد (walād)", correct: true},
        ]
    },
    {
        question: "What is the meaning of the word 'مَكْتَب' (maktab) in Arabic?",
        answers: [
            { text: "School", correct: false},
            { text: "Office", correct: true},
            { text: "Window", correct: false},
        ]
    },
    {
        question: "Which of the following Arabic letters is pronounced as a glottal stop?",
        answers: [
            { text: "ص (ṣād)", correct: false},
            { text: "ء (hamzah)", correct: true},
            { text: "ق (qāf)", correct: false},
        ]
    },
    {
        question: "In the phrase 'في الحَدِيقَة' (fī al-ḥadīqah), what does 'في' (fī) mean?",
        answers: [
            { text: "Under", correct: false},
            { text: "On", correct: false},
            { text: "In", correct: true},
        ]
    },
    {
        question: "What is the Arabic plural form of 'طَالِب' (ṭālib), meaning 'student'?",
        answers: [
            { text: "طَلَاب (ṭalāb)", correct: false},
            { text: "طَالِبُونَ (ṭālibūna)", correct: false},
            { text: "طُلَّاب (ṭullāb)", correct: true},
        ]
    },

];

const questionElement=document.getElementById("question");
const answerButtons=document.getElementById("answer-buttons");
const nextButton=document.getElementById("next-btn");

let currentquestionindex=0;
let score = 0;

function startQuiz(){
    currentquestionindex=0;
    score=0;
    nextButton.innerHTML="Next";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentquestion=questions[currentquestionindex];
    let questionNo=currentquestionindex+1;
    questionElement.innerHTML=questionNo+". "+currentquestion.question;

    currentquestion.answers.forEach(answer => {
        const button=document.createElement("button");
        button.innerHTML=answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct=answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    })
}


function resetState(){
    nextButton.style.display="none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e){
    const selectedBtn=e.target;
    const isCorrect=selectedBtn.dataset.correct==="true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore(){
    resetState();
    questionElement.innerHTML=`You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML="Play Again";
    nextButton.style.display="block";
}

function handleNextButton(){
    currentquestionindex++;
    if(currentquestionindex<questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if(currentquestionindex<questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
})

startQuiz();