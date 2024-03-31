const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the Russian word for 'Hello'?",
        answers: [
            { text: "Здравствуйте (Zdravstvuyte)", correct: true},
            { text: "Привет (Privet)", correct: false},
            { text: "Спасибо (Spasibo)", correct: false},
        ]
    },
    {
        question: "What does 'Как тебя зовут?' mean in English?",
        answers: [
            { text: "What's your name?", correct: true},
            { text: "Where are you from?", correct: false},
            { text: "Goodbye", correct: false},
        ]
    },
    {
        question: "Which of the following means 'Thank you' in Russian?",
        answers: [
            { text: "Пожалуйста (Pozhaluysta)", correct: false},
            { text: "Спасибо (Spasibo)", correct: true},
            { text: "Нет (Net)", correct: false},
        ]
    },
    {
        question: "What is the Russian word for 'Goodbye'?",
        answers: [
            { text: "Здравствуйте (Zdravstvuyte)", correct: false},
            { text: "До свидания (Do svidaniya)", correct: true},
            { text: "Прощай (Proshchay)", correct: false},
        ]
    },
    {
        question: "Which of the following means 'Yes' in Russian?",
        answers: [
            { text: "Да (Da)", correct: true},
            { text: "Привет (Privet)", correct: false},
            { text: "Спасибо (Spasibo)", correct: false},
        ]
    },
    {
        question: "What does 'Как дела?' mean in English?",
        answers: [
            { text: "What's your name?", correct: false},
            { text: "Where are you from?", correct: false},
            { text: "How are you?", correct: true},
        ]
    },
    {
        question: "Which of the following means 'I'm sorry' in Russian?",
        answers: [
            { text: "Пожалуйста (Pozhaluysta)", correct: false},
            { text: "Привет (Privet)", correct: false},
            { text: "Извините (Izvinite)", correct: true},
        ]
    },
    {
        question: "What is the Russian word for 'Friend'?",
        answers: [
            { text: "Брат (Brat)", correct: false},
            { text: "Друг (Drug)", correct: true},
            { text: "Сестра (Sestra)", correct: false},
        ]
    },
    {
        question: "Which phrase means 'Please' in Russian?",
        answers: [
            { text: "Пожалуйста (Pozhaluysta)", correct: true},
            { text: "Извините (Izvinite)", correct: false},
            { text: "Привет (Privet)", correct: false},
        ]
    },
    {
        question: "What does 'Я говорю по-русски' mean in English?",
        answers: [
            { text: "I speak Russian.", correct: true},
            { text: "I understand Russian.", correct: false},
            { text: "I don't speak Russian.", correct: false},
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
            'lang': 'Russian',
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