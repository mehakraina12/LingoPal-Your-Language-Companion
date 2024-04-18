const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "In the sentence 'He painted the house blue', what part of speech is 'blue'?",
        answers: [
            { text: "Adjective", correct: true},
            { text: "Noun", correct: false},
            { text: "Adverb", correct: false},
        ]
    },
    {
        question: "What is the correct past participle of the verb 'drink'?",
        answers: [
            { text: "Drinked", correct: false},
            { text: "Drank", correct: false},
            { text: "Drunk", correct: true},
        ]
    },
    {
        question: "Which sentence uses 'whom' correctly?",
        answers: [
            { text: "Who did you give the book to?", correct: false},
            { text: "Whom is going to the party?", correct: false},
            { text: "To whom it may concern: ...", correct: true},
        ]
    },
    {
        question: "What is the correct superlative form of 'far'?",
        answers: [
            { text: "More far", correct: false},
            { text: "Farrer", correct: false},
            { text: "Farthest", correct: true}
        ]
    },
    {
        question: "What is the correct plural form of 'octopus'?",
        answers: [
            { text: "Octopuses", correct: true},
            { text: "Octopi", correct: false},
            { text: "Octopodes", correct: false}
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