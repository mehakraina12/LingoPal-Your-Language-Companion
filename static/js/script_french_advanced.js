const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which phrase means 'to put one's foot in it' in French?",
        answers: [
            { text: "Mettre de l'argent sur la table", correct: false },
            { text: "Mettre le pied dans la porte", correct: false },
            { text: "Mettre les pieds dans le plat", correct: true }
        ]
    },
    {
        question: "What does 'C'est la vie' mean in English?",
        answers: [
            { text: "That's the way it is", correct: true },
            { text: "It's life", correct: false },
            { text: "That's life", correct: false }
        ]
    },
    {
        question: "How do you say 'to have a crush on someone' in French?",
        answers: [
            { text: "Avoir un béguin pour quelqu'un", correct: true },
            { text: "Avoir un coup de foudre pour quelqu'un", correct: false },
            { text: "Être épris de quelqu'un", correct: false }
        ]
    },
    {
        question: "Which phrase means 'to play hard to get'?",
        answers: [
            { text: "Jouer avec le feu", correct: false },
            { text: "Faire l'indifférent", correct: true },
            { text: "Jouer franc jeu", correct: false }
        ]
    },
    {
        question: "What is the French word for 'to daydream'?",
        answers: [
            { text: "Rêvasser", correct: true },
            { text: "Rêver éveillé", correct: false },
            { text: "Rêver de jour", correct: false }
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