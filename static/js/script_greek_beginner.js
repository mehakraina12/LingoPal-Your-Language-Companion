const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the Greek word for 'hello'?",
        answers: [
            { text: "Γεια σου", correct: false},
            { text: "Καλημέρα", correct: true},
            { text: "Αντίο", correct: false},
        ]
    },
    {
        question: "How do you say 'thank you' in Greek?",
        answers: [
            { text: "Συγγνώμη", correct: false},
            { text: "Ευχαριστώ", correct: true},
            { text: "Παρακαλώ", correct: false},
        ]
    },
    {
        question: "What is the Greek word for 'yes'?",
        answers: [
            { text: "Ναι", correct: true},
            { text: "Όχι", correct: false},
            { text: "Ίσως", correct: false}
        ]
    },
    {
        question: "Which of the following sentences means 'I am hungry' in Greek?",
        answers: [
            { text: "Είμαι κουρασμένος.", correct: false},
            { text: "Πεινάω.", correct: true},
            { text: "Είμαι ευτυχισμένος.", correct: false}
        ]
    },
    {
        question: "What does 'Με λένε Μαρία' mean in English?",
        answers: [
            { text: "My name is Maria.", correct: true},
            { text: "I am tired.", correct: false},
            { text: "I am happy.", correct: false},
        ]
    }
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