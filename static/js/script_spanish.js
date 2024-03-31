const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the Spanish word for 'Hello'?",
        answers: [
            { text: "Hola", correct: true},
            { text: "Adiós", correct: false},
            { text: "Gracias", correct: false},
        ]
    },
    {
        question: "What does '¿Cómo te llamas?' mean in English?",
        answers: [
            { text: "What's your name?", correct: true},
            { text: "Where are you from?", correct: false},
            { text: "Goodbye", correct: false},
        ]
    },
    {
        question: "What does '¿Cuánto cuesta esto?' mean in English?",
        answers: [
            { text: "Where is the bathroom?", correct: false},
            { text: "How much does this cost?", correct: true},
            { text: "How are you?", correct: false},
        ]
    },
    {
        question: "What is the Spanish word for 'Book'?",
        answers: [
            { text: "Azúcar", correct: false},
            { text: "Libro", correct: true},
            { text: "Té", correct: false},
        ]
    },
    {
        question: "Which phrase means 'I don't understand' in Spanish?",
        answers: [
            { text: "No entiendo", correct: true},
            { text: "¿Dónde está el baño?", correct: false},
            { text: "Hablo español", correct: false},
        ]
    },
    {
        question: "What is the Spanish word for 'Love'?",
        answers: [
            { text: "Felicidad", correct: false},
            { text: "Tristeza", correct: false},
            { text: "Amor", correct: true},
        ]
    },
    {
        question: "Which of the following means 'Good morning' in Spanish?",
        answers: [
            { text: "Buenas noches", correct: false},
            { text: "Buenas mañanas", correct: false},
            { text: "Buenas días", correct: true},
        ]
    },
    {
        question: "Which phrase means 'I don't know' in Spanish?",
        answers: [
            { text: "No hablo español", correct: false},
            { text: "No sé", correct: true},
            { text: "No me gusta", correct: false},
        ]
    },
    {
        question: "What is the Spanish word for 'Family'?",
        answers: [
            { text: "Familia", correct: true},
            { text: "Comida", correct: false},
            { text: "Casa", correct: false},
        ]
    },
    {
        question: "Which of the following means 'Excuse me' in Spanish when trying to get someone's attention?",
        answers: [
            { text: "Disculpe", correct: true},
            { text: "Ayuda", correct: false},
            { text: "Perdón", correct: false},
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
        message = "<br><span style='color: green; font-size: small;'>We are pleased to inform you that you have been selected to teach. Your proficiency in this language meet our standards, and we believe you will be an excellent addition to our team of instructors.</span>";
    } else {
        message = "<br><span style='color: red; font-size: small;'>We regret to inform you that we are unable to offer you to teach at this time, as our instructors must meet specific proficiency standards which you do not currently fulfill.</span>";
    }
    message += "<br><br>You may close the tab now";
    questionElement.innerHTML = `Thank you for attempting the quiz.<br>You scored ${score} out of ${questions.length}!<br>${message}`;

    $.ajax({
        url: '/result_update',
        type: 'POST',
        data: {
            'lang': 'Spanish',
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