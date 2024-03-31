const questions = [
    {
        question: "What is the German word for 'hello'?",
        answers: [
            { text: "Hallo", correct: true},
            { text: "Guten Morgen", correct: false},
            { text: "Tschüss", correct: false},
        ]
    },
    {
        question: "How do you say 'thank you' in German?",
        answers: [
            { text: "Danke", correct: true},
            { text: "Entschuldigung", correct: false},
            { text: "Bitte", correct: false},
        ]
    },
    {
        question: "Which verb is used to express 'to have' in German?",
        answers: [
            { text: "Können", correct: false},
            { text: "Haben", correct: true},
            { text: "Sein", correct: false},
        ]
    },
    {
        question: "What is the German word for 'dog'?",
        answers: [
            { text: "Pferd", correct: false},
            { text: "Hund", correct: true},
            { text: "Katze", correct: false},
        ]
    },
    {
        question: "How do you say 'goodbye' in German?",
        answers: [
            { text: "Auf Wiedersehen", correct: true},
            { text: "Guten Tag", correct: false},
            { text: "Bitte", correct: false},
        ]
    },
    {
        question: "Which of the following is a correct translation for 'apple' in German?",
        answers: [
            { text: "Erdbeere", correct: false},
            { text: "Birne", correct: false},
            { text: "Apfel", correct: true},
        ]
    },
    {
        question: "What does 'bitte schön' mean in English?",
        answers: [
            { text: "Goodbye", correct: false},
            { text: "Excuse me", correct: false},
            { text: "You're welcome", correct: true},
        ]
    },
    {
        question: "Which of the following is the correct conjugation of the verb 'gehen' (to go) in the present tense for 'wir' (we)?        ",
        answers: [
            { text: "Du gehst", correct: false},
            { text: "Wir gehen", correct: true},
            { text: "Er/Sie geht", correct: false},
        ]
    },
    {
        question: "What is the German word for 'house'?",
        answers: [
            { text: "Haus", correct: true},
            { text: "Baum", correct: false},
            { text: "Wohnung", correct: false},
        ]
    },
    {
        question: "Which of the following expressions means 'How are you?' in German?",
        answers: [
            { text: "Wie geht es dir?", correct: true},
            { text: "Wo wohnst du?", correct: false},
            { text: "Wie alt bist du?", correct: false},
        ]
    },

];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentquestionindex = 0;
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

function showScore() {
    resetState();
    let message = "";
    if (score >= 8) {
        message = "Accepted";
    } else {
        message = "Rejected";
    }
    questionElement.innerHTML = `Thank you for attempting the quiz. You may exit the quiz now.<br>You scored ${score} out of ${questions.length}!<br>${message}`;
    nextButton.innerHTML = "Exit";
    nextButton.style.display = "block";
}


function handleNextButton(){
    currentquestionindex++;
    if(currentquestionindex<questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentquestionindex < questions.length) {
        handleNextButton();
    } else {
        // Instead of starting the quiz again, go back to the previous page
        history.back();
    }
});

startQuiz();