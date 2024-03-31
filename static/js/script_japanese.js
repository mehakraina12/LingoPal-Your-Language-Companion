const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'ありがとう ございます' (arigatou gozaimasu) mean in English?",
        answers: [
            { text: "Thank you very much", correct: true},
            { text: "Goodbye", correct: false},
            { text: "Excuse me", correct: false},
        ]
    },
    {
        question: "Which phrase means 'What time is it?' in Japanese?",
        answers: [
            { text: "今何時ですか？ (ima nanji desu ka?)", correct: true},
            { text: "どこですか？ (doko desu ka?)", correct: false},
            { text: "どうぞ (douzo)", correct: false},
        ]
    },
    {
        question: "What is the Japanese word for 'friend'?",
        answers: [
            { text: "子供 (kodomo)", correct: false},
            { text: "友達 (tomodachi)", correct: true},
            { text: "先生 (sensei)", correct: false},
        ]
    },
    {
        question: "Which of the following means 'I love you' in Japanese?",
        answers: [
            { text: "いただきます (itadakimasu)", correct: false},
            { text: "愛してる (aishiteru)", correct: true},
            { text: "ありがとう (arigatou)", correct: false},
        ]
    },
    {
        question: "What does 'お願いします' (onegai shimasu) mean in English?",
        answers: [
            { text: "Please", correct: true},
            { text: "Thank you", correct: false},
            { text: "I'm sorry", correct: false},
        ]
    },
    {
        question: "What is the correct translation for 'excuse me' in Japanese, when trying to get someone's attention?",
        answers: [
            { text: "ごめんなさい (gomen nasai)", correct: false},
            { text: "お願いします (onegai shimasu)", correct: false},
            { text: "すみません (sumimasen)", correct: true},
        ]
    },
    {
        question: "How do you say 'goodbye' in Japanese?",
        answers: [
            { text: "おはようございます (ohayou gozaimasu)", correct: false},
            { text: "こんにちは (konnichiwa)", correct: false},
            { text: "さようなら (sayounara)", correct: true},
        ]
    },
    {
        question: "What does 'いただきます' (itadakimasu) mean in English?",
        answers: [
            { text: "Please", correct: false},
            { text: "Let's eat", correct: true},
            { text: "Welcome", correct: false},
        ]
    },
    {
        question: "What is the Japanese word for 'car'?",
        answers: [
            { text: "車 (kuruma)", correct: true},
            { text: "電車 (densha)", correct: false},
            { text: "自転車 (jitensha)", correct: false},
        ]
    },
    {
        question: "Which phrase means 'How are you?' in Japanese?",
        answers: [
            { text: "お元気ですか？ (ogenki desu ka?)", correct: true},
            { text: "どうもありがとう (doumo arigatou)", correct: false},
            { text: "ごめんなさい (gomen nasai)", correct: false},
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
            'lang': 'Japanese',
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