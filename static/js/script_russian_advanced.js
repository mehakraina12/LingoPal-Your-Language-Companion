const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the meaning of 'Пожалуйста' in English?",
        answers: [
            { text: "Please", correct: true },
            { text: "Thank you", correct: false },
            { text: "You're welcome", correct: false }
        ]
    },
    {
        question: "How do you say 'Мне нравится этот город' in English?",
        answers: [
            { text: "I don't like this city", correct: false },
            { text: "I like this city", correct: true },
            { text: "I like that city", correct: false }
        ]
    },
    {
        question: "What does 'Где ваш брат?' mean in English?",
        answers: [
            { text: "What's your brother's name?", correct: false },
            { text: "Where is your brother?", correct: true },
            { text: "How old is your brother?", correct: false }
        ]
    },
    {
        question: "Which sentence translates to 'Очень хорошо' in English?",
        answers: [
            { text: "Very good", correct: true },
            { text: "Very bad", correct: false },
            { text: "Very well", correct: false }
        ]
    },
    {
        question: "What is the Russian term for 'Очень хорошо'?",
        answers: [
            { text: "Very good", correct: true },
            { text: "Very bad", correct: false },
            { text: "Very well", correct: false }
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