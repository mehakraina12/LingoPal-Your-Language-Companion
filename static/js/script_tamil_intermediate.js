const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'எங்கே போகிறீர்கள்?' mean in English?",
        answers: [
            { text: "Where are you going?", correct: true },
            { text: "Where do you live?", correct: false },
            { text: "What are you doing?", correct: false }
        ]
    },
    {
        question: "Which phrase translates to 'What's your name?' in Tamil?",
        answers: [
            { text: "உங்கள் பெயர் என்ன? (Ungal peyar enna?)", correct: true },
            { text: "உங்கள் எண் என்ன? (Ungal en enna?)", correct: false },
            { text: "உங்கள் வீட்டு எங்கு? (Ungal veettu engu?)", correct: false }
        ]
    },
    {
        question: "What is the meaning of 'எப்படி செய்கிறீர்கள்?' in English?",
        answers: [
            { text: "What are you doing?", correct: true },
            { text: "What do you want?", correct: false },
            { text: "How are you feeling?", correct: false }
        ]
    },
    {
        question: "How do you say 'Excuse me' in Tamil?",
        answers: [
            { text: "மன்னிக்கவும் (Mannikkavum)", correct: false },
            { text: "மனம் வருகிறது (Manam varugiradhu)", correct: false },
            { text: "மன்னிக்கப்படுகிறேன் (Mannikkappadugiren)", correct: true }
        ]
    },
    {
        question: "What does 'பயணி சென்று வருகிறேன்' mean in English?",
        answers: [
            { text: "I am coming home", correct: false },
            { text: "I am going on a trip", correct: true },
            { text: "I am going to work", correct: false }
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