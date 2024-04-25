const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the meaning of 'ఏమి చేస్తున్నావు?' in English?",
        answers: [
            { text: "What are you doing?", correct: true },
            { text: "What do you want?", correct: false },
            { text: "How are you feeling?", correct: false }
        ]
    },
    {
        question: "How do you say 'Excuse me' in Telugu?",
        answers: [
            { text: "క్షమించండి (Kshaminchandi)", correct: true },
            { text: "అందరు చూడండి (Andaru Choodandi)", correct: false },
            { text: "మాఫీ చాహ్తా (Maafi chahta)", correct: false }
        ]
    },
    {
        question: "What does 'వద్దండి దానికి' mean in English?",
        answers: [
            { text: "I am coming home", correct: false },
            { text: "I am going to work", correct: false },
            { text: "I am going there", correct: true }
        ]
    },
    {
        question: "Which phrase means 'Can you help me?' in Telugu?",
        answers: [
            { text: "మీరు నాకు సహాయం చేయగలరా? (Meeru naaku sahayam cheyagalaraa?)", correct: true },
            { text: "మీరు నాకు సహాయం చేయండి (Meeru naaku sahayam cheyandi)", correct: false },
            { text: "మీరు నాకు సహాయం చేస్తారా? (Meeru naaku sahayam chestaaraa?)", correct: false }
        ]
    },
    {
        question: "What is the Telugu term for 'I don't understand'?",
        answers: [
            { text: "నాకు అర్థం కాదు (Naaku artham kaadu)", correct: true },
            { text: "నాకు అర్థం లేదు (Naaku artham ledu)", correct: false },
            { text: "నాకు అర్ధం కావడం లేదు (Naaku artham kaavadam ledu)", correct: false }
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