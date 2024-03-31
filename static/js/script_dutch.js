const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "How would you say 'hello' in Dutch?",
        answers: [
            { text: "Hallo", correct: true},
            { text: "Goedemorgen", correct: false},
            { text: "Tot ziens", correct: false},
        ]
    },
    {
        question: "What does the word 'huis' mean in Dutch?",
        answers: [
            { text: "House", correct: true},
            { text: "Car", correct: false},
            { text: "Tree", correct: false},
        ]
    },
    {
        question: "Which of the following means 'thank you' in Dutch?",
        answers: [
            { text: "Ja", correct: false},
            { text: "Bedankt", correct: true},
            { text: "Alstublieft", correct: false},
        ]
    },
    {
        question: "How would you ask 'How are you?' in Dutch?",
        answers: [
            { text: "Waar kom je vandaan?", correct: false},
            { text: "Hoe gaat het met je?", correct: true},
            { text: "Wat is je naam?", correct: false},
        ]
    },
    {
        question: "What is the correct translation of 'I am hungry' in Dutch?",
        answers: [
            { text: "Ik heb honger", correct: true},
            { text: "Ik heb dorst", correct: false},
            { text: "Ik ben moe", correct: false},
        ]
    },
    {
        question: "Which of the following is the Dutch word for 'cat'?",
        answers: [
            { text: "Vis", correct: false},
            { text: "Vogel", correct: false},
            { text: "Kat", correct: true},
        ]
    },
    {
        question: "How do you say 'please' in Dutch?",
        answers: [
            { text: "Soms", correct: false},
            { text: "Nooit", correct: false},
            { text: "Alsjeblieft", correct: true},
        ]
    },
    {
        question: "What does 'fiets' mean in Dutch?",
        answers: [
            { text: "Boat", correct: false},
            { text: "Bicycle", correct: true},
            { text: "Train", correct: false},
        ]
    },
    {
        question: "Which of these is the correct translation for 'goodbye' in Dutch?",
        answers: [
            { text: "Tot ziens", correct: true},
            { text: "Nee", correct: false},
            { text: "Ja", correct: false},
        ]
    },
    {
        question: "How do you say 'water' in Dutch?",
        answers: [
            { text: "Water", correct: true},
            { text: "Vuur", correct: false},
            { text: "Lucht", correct: false},
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
            'lang': 'Dutch',
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