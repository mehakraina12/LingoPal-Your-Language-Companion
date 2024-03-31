const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following is the correct translation for 'Good morning' in French?",
        answers: [
            { text: "Bonjour", correct: true},
            { text: "Bonsoir", correct: false},
            { text: "Bon appétit", correct: false},
        ]
    },
    {
        question: "How do you say 'Thank you' in French?",
        answers: [
            { text: "Merci", correct: true},
            { text: "S'il vous plaît", correct: false},
            { text: "Excusez-moi", correct: false},
        ]
    },
    {
        question: "Which verb is used to express 'to go' in French?",
        answers: [
            { text: "Venir", correct: false},
            { text: "Aller", correct: true},
            { text: "Faire", correct: false},
        ]
    },
    {
        question: "What is the French word for 'cat'?",
        answers: [
            { text: "Chien", correct: false},
            { text: "Chat", correct: true},
            { text: "Poisson", correct: false},
        ]
    },
    {
        question: "How do you say 'I love you' in French?",
        answers: [
            { text: "Je t'aime", correct: true},
            { text: "Bonjour", correct: false},
            { text: "Je suis désolé", correct: false},
        ]
    },
    {
        question: "Which of the following is a correct translation for 'apple' in French?",
        answers: [
            { text: "Poire", correct: false},
            { text: "Fraise", correct: false},
            { text: "Pomme", correct: true},
        ]
    },
    {
        question: "What does 'merci beaucoup' mean in English?",
        answers: [
            { text: "Excuse me", correct: false},
            { text: "Goodbye", correct: false},
            { text: "Thank you very much", correct: true},
        ]
    },
    {
        question: "Which of the following is the correct conjugation of the verb 'parler' (to speak) in the present tense for 'nous' (we)?",
        answers: [
            { text: "Tu parles", correct: false},
            { text: "Nous parlons", correct: true},
            { text: "Il/Elle parle", correct: false},
        ]
    },
    {
        question: "What is the French word for 'book'?",
        answers: [
            { text: "Livre", correct: true},
            { text: "Maison", correct: false},
            { text: "Voiture", correct: false},
        ]
    },
    {
        question: "Which of the following expressions means 'How are you?' in French?",
        answers: [
            { text: "Comment ça va ?", correct: true},
            { text: "Quel âge as-tu ?", correct: false},
            { text: "Quel est ton prénom ?", correct: false},
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

    $.ajax({
        url: '/result_update',
        type: 'POST',
        data: {
            'lang': 'French',
            'score': score,
        },
        dataType: 'json',
        headers: {
            'X-CSRFToken': csrftoken  // Include CSRF token in headers
        }
    })
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