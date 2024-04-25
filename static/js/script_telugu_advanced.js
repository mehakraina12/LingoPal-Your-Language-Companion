const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "How do you say 'I am hungry' in Telugu?",
        answers: [
            { text: "నేను ఆకలిపోయినాను (Nenu aakalipoynaanu)", correct: true },
            { text: "నేను తినడం సమయం (Nenu thinadam samayam)", correct: false },
            { text: "నేను పక్కన ఉన్నాను (Nenu pakkana unnanu)", correct: false }
        ]
    },
    {
        question: "What does 'ఎక్కడ వుంటావు?' mean in English?",
        answers: [
            { text: "Where did you come from?", correct: false },
            { text: "Where are you going?", correct: false },
            { text: "Where are you?", correct: true }
        ]
    },
    {
        question: "Which phrase translates to 'I'm tired' in Telugu?",
        answers: [
            { text: "నేను ఆలస్యం చేస్తున్నాను (Nenu aalasyam chestunnaanu)", correct: true },
            { text: "నేను వాళ్ళు మొట్టమొదటి (Nenu vaallu mottamodati)", correct: false },
            { text: "నేను కొన్నిసార్లు సైనికుడు (Nenu konnisarlu sainikudu)", correct: false }
        ]
    },
    {
        question: "What is the Telugu term for 'Where is the bathroom?'",
        answers: [
            { text: "బాత్‌రూమ్ ఎక్కడ ఉంది? (Bathroom ekkada undi?)", correct: true },
            { text: "నాకు అర్ధం కాదు (Naaku artham kaadu)", correct: false },
            { text: "పార్లర్ ఎక్కడ ఉంది? (Parlor ekkada undi?)", correct: false }
        ]
    },
    {
        question: "How do you say 'How much does it cost?' in Telugu?",
        answers: [
            { text: "అది ఎంత ధరలు? (Adi emtha daralu?)", correct: true },
            { text: "అది ఏమిటి? (Adi emiti?)", correct: false },
            { text: "అది ఎంత నుండి? (Adi emtha nundi?)", correct: false }
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