const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following sentences uses the subjunctive mood correctly?",
        answers: [
            { text: "If I was you, I would do it differently.", correct: false},
            { text: "If I were you, I would do it differently.", correct: true},
            { text: "If I would be you, I would do it differently.", correct: false}
        ]
    },
    {
        question: "What is the correct form of the comparative adjective for 'good'?",
        answers: [
            { text: "Gooder", correct: false},
            { text: "More good", correct: false},
            { text: "Better", correct: true},
        ]
    },
    {
        question: "Which sentence uses the passive voice correctly?",
        answers: [
            { text: "The cat chased the mouse.", correct: false},
            { text: "The mouse was chased by the cat.", correct: true},
            { text: "The mouse was chasing the cat.", correct: false},
        ]
    },
    {
        question: "What is the correct plural form of 'child'?",
        answers: [
            { text: "Childs", correct: false},
            { text: "Childrens", correct: false},
            { text: "Children", correct: true}
        ]
    },
    {
        question: "Which of the following words is an adverb?",
        answers: [
            { text: "Quickly", correct: true},
            { text: "House", correct: false},
            { text: "Red", correct: false}
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