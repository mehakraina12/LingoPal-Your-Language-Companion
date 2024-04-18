const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "How do you say 'to travel' in Dutch?",
        answers: [
            { text: "Reizen", correct: true},
            { text: "Treinen", correct: false},
            { text: "Vakantie", correct: false}
        ]
    },
    {
        question: "How do you say 'I am looking forward to it' in Dutch?",
        answers: [
            { text: "Ik kijk er naar", correct: false},
            { text: "Ik kijk er naar uit", correct: true},
            { text: "Ik kijk er naartoe", correct: false}
        ]
    },
    {
        question: "What does 'lekker' mean in Dutch?",
        answers: [
            { text: "Delicious", correct: true},
            { text: "Lovely", correct: false},
            { text: "Lonely", correct: false}
        ]
    },
    {
        question: "How do you say 'Congratulations!' in Dutch?",
        answers: [
            { text: "Gelukkig!", correct: false},
            { text: "Succes!", correct: false},
            { text: "Gefeliciteerd!", correct: true}
        ]
    },
    {
        question: "What is the Dutch word for 'breakfast'?",
        answers: [
            { text: "Ontbijt", correct: true},
            { text: "Lunch", correct: false},
            { text: "Diner", correct: false}
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