const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which phrase means 'to hit the nail on the head' in Greek?",
        answers: [
            { text: "Να πετύχεις τον πάτο του καρφιού", correct: false },
            { text: "Να χτυπήσεις το κεφάλι του καρφιού", correct: false },
            { text: "Να χτυπήσεις το καρφί στο κεφάλι", correct: true }
        ]
    },
    {
        question: "What does 'Τσιμπάω' mean in English?",
        answers: [
            { text: "To taste", correct: false },
            { text: "To bite", correct: true },
            { text: "To chew", correct: false }
        ]
    },
    {
        question: "How do you say 'to make ends meet' in Greek?",
        answers: [
            { text: "Να κάνεις το τέλος να συναντήσει την αρχή", correct: false },
            { text: "Να καλύψεις τις ανάγκες", correct: true },
            { text: "Να καλύψεις το κενό", correct: false }
        ]
    },
    {
        question: "Which Greek phrase means 'to bury the hatchet'?",
        answers: [
            { text: "Να θάψεις την προσοχή", correct: false },
            { text: "Να θάψεις την ασημάντη", correct: false },
            { text: "Να θάψεις τον πόλεμο", correct: true }
        ]
    },
    {
        question: "What is the Greek term for 'double entendre'?",
        answers: [
            { text: "Διπλή σημασία", correct: true },
            { text: "Διπλή ερμηνεία", correct: false },
            { text: "Διπλή αντίληψη", correct: false }
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