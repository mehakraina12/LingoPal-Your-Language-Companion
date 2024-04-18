const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'Ψυχή' mean in English?",
        answers: [
            { text: "Mind", correct: false },
            { text: "Body", correct: false },
            { text: "Soul", correct: true }
        ]
    },
    {
        question: "How do you say 'to break the ice' in Greek?",
        answers: [
            { text: "Να σπάσεις τον αέρα", correct: false },
            { text: "Να σπάσεις τα πάγια", correct: false },
            { text: "Να σπάσεις τον πάγο", correct: true }
        ]
    },
    {
        question: "Which Greek phrase means 'to make a long story short'?",
        answers: [
            { text: "Να κάνεις την ιστορία μικρή", correct: false },
            { text: "Να κάνεις τον λόγο σύντομο", correct: false },
            { text: "Να κάνεις μια μακριά ιστορία σύντομη", correct: true }
        ]
    },
    {
        question: "What is the Greek word for 'nostalgia'?",
        answers: [
            { text: "Νοσταλγία", correct: true },
            { text: "Ανάμνηση", correct: false },
            { text: "Συναισθηματική αναταραχή", correct: false }
        ]
    },
    {
        question: "How would you say 'to lose one's mind' in Greek?",
        answers: [
            { text: "Να χάσεις το μυαλό σου", correct: true },
            { text: "Να χάσεις την καρδιά σου", correct: false },
            { text: "Να χάσεις το σώμα σου", correct: false }
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