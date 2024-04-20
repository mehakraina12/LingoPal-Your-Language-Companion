const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'मन की बात' mean in English?",
        answers: [
            { text: "Heart's Desire", correct: false },
            { text: "Talk of the Mind", correct: true },
            { text: "Emotional Connection", correct: false }
        ]
    },
    {
        question: "What is the meaning of 'संवाद' in English?",
        answers: [
            { text: "Dialogue", correct: true },
            { text: "Discussion", correct: false },
            { text: "Conversation", correct: false }
        ]
    },
    {
        question: "Which of the following translates to 'निर्भरता' in English?",
        answers: [
            { text: "Independence", correct: false },
            { text: "Dependence", correct: true },
            { text: "Interdependence", correct: false }
        ]
    },
    {
        question: "What is the Hindi term for 'राष्ट्रवाद'?",
        answers: [
            { text: "Nationalism", correct: true },
            { text: "Patriotism", correct: false },
            { text: "Republicanism", correct: false }
        ]
    },
    {
        question: "How do you say 'मनुष्यता' in English?",
        answers: [
            { text: "Humanitarianism", correct: true },
            { text: "Humanity", correct: false },
            { text: "Humanism", correct: false }
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