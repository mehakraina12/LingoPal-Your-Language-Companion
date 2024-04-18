const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which word means 'to eat' in Gujarati?",
        answers: [
            { text: "પીણું", correct: false },
            { text: "ખાવું", correct: true },
            { text: "ઉતારવું", correct: false }
        ]
    },
    {
        question: "What does the Gujarati word 'પ્રમાણવાચી' mean in English?",
        answers: [
            { text: "Evidence", correct: true },
            { text: "Statement", correct: false },
            { text: "Document", correct: false }
        ]
    },
    {
        question: "How do you say 'beautiful' in Gujarati?",
        answers: [
            { text: "સુંદર", correct: true },
            { text: "ખુશબુ", correct: false },
            { text: "સરસ", correct: false }
        ]
    },
    {
        question: "Which Gujarati word means 'sun'?",
        answers: [
            { text: "તારા", correct: false },
            { text: "ચંદ્ર", correct: false },
            { text: "સૂરજ", correct: true }
        ]
    },
    {
        question: "What is the meaning of 'ગાડ્યું' in English?",
        answers: [
            { text: "To fly", correct: false },
            { text: "To run", correct: true },
            { text: "To swim", correct: false }
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