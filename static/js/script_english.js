const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following sentences is grammatically correct?",
        answers: [
            { text: "I am studying for my exam.", correct: true},
            { text: "He plays soccer every weekends.", correct: false},
            { text: "She don't like pizza.", correct: false},
        ]
    },
    {
        question: "What is the plural form of 'child'?",
        answers: [
            { text: "Children", correct: true},
            { text: "Child's", correct: false},
            { text: "Childs", correct: false},
        ]
    },
    {
        question: "Which word is a conjunction?",
        answers: [
            { text: "Book", correct: false},
            { text: "And", correct: true},
            { text: "Run", correct: false},
        ]
    },
    {
        question: "What is the past tense of the verb 'to eat'?",
        answers: [
            { text: "Ate", correct: false},
            { text: "Eating", correct: true},
            { text: "Eaten", correct: false},
        ]
    },
    {
        question: "Which of the following is a preposition?",
        answers: [
            { text: "After", correct: true},
            { text: "Singing", correct: false},
            { text: "Quickly", correct: false},
        ]
    },
    {
        question: "What is the comparative form of the adjective 'big'?",
        answers: [
            { text: "Biggiest", correct: false},
            { text: "Biggier", correct: false},
            { text: "Bigger", correct: true},
        ]
    },
    {
        question: "Which sentence is in the passive voice?",
        answers: [
            { text: "She is baking a cake.", correct: false},
            { text: "They are playing football.", correct: false},
            { text: "The book was read by Sarah.", correct: true},
        ]
    },
    {
        question: "What does the idiom 'break a leg' mean?",
        answers: [
            { text: "To wish someone harm.", correct: false},
            { text: "To have good luck.", correct: true},
            { text: "To literally break someone's leg.", correct: false},
        ]
    },
    {
        question: "Which of the following is an adverb?",
        answers: [
            { text: "Quickly", correct: true},
            { text: "Happy", correct: false},
            { text: "Table  ", correct: false},
        ]
    },
    {
        question: "Identify the synonym of 'happy':",
        answers: [
            { text: "Joyful", correct: true},
            { text: "Sad", correct: false},
            { text: "Angry", correct: false},
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
            'lang': 'English',
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