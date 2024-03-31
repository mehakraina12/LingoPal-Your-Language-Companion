const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which phrase means 'I'm sorry, I don't understand' in Punjabi?",
        answers: [
            { text: "ਮਾਫ ਕਰੋ, ਮੈਂ ਸਮਝਾਂ ਨਹੀਂ ਰਿਹਾ (maaf karo, main samjhan nahi riha)", correct: true},
            { text: "ਮੁਆਫ ਕਰੋ, ਮੈਂ ਗਲ ਨਹੀਂ ਸਮਝ ਰਿਹਾ (muaf karo, main gal nahi samajh riha)", correct: false},
            { text: "ਮੁਆਫ ਕਰੋ, ਮੈਂ ਸਮਝਦਾ ਨਹੀਂ (muaf karo, main samjhaan nahi)", correct: false},
        ]
    },
    {
        question: "How do you say 'to travel' in Punjabi?",
        answers: [
            { text: "ਸਫ਼ਰ ਕਰਨਾ (safar karna)", correct: true},
            { text: "ਰਹਿਣਾ (rahina)", correct: false},
            { text: "ਚੱਲਣਾ (challna)", correct: false},
        ]
    },
    {
        question: "What does 'ਅੱਜ ਕਲ' mean in English?",
        answers: [
            { text: "Tomorrow", correct: false},
            { text: "Nowadays", correct: true},
            { text: "Always", correct: false},
        ]
    },
    {
        question: "Which phrase means 'How are you?' in Punjabi?",
        answers: [
            { text: "ਕਿਵੇਂ ਚਾਲਦੇ ਹੋ? (kiven chalde ho?)", correct: false},
            { text: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ? (tusi kiven ho?)", correct: true},
            { text: "ਕੀ ਕਰ ਰਹੇ ਹੋ? (ki kar rahe ho?)", correct: false},
        ]
    },
    {
        question: "What is the Punjabi word for 'car'?",
        answers: [
            { text: "ਗੱਡੀ (gaddi)", correct: true},
            { text: "ਅਕਸਰ (aksar)", correct: false},
            { text: "ਵਾਗਣ (vagan)", correct: false},
        ]
    },
    {
        question: "How do you say 'goodbye' in Punjabi?",
        answers: [
            { text: "ਅੱਜ ਦੇ ਨਾਲ (ajj de naal)", correct: false},
            { text: "ਹੇਠ ਜਾਓ (haith jao)", correct: false},
            { text: "ਫਿਰ ਮਿਲਾਂਗੇ (phir milange)", correct: true},
        ]
    },
    {
        question: "What does 'ਕੀ ਹਾਲ ਹੈ?' (ki haal hai?) mean in English?",
        answers: [
            { text: "Where are you?", correct: false},
            { text: "Who are you?", correct: false},
            { text: "How are you?", correct: true},
        ]
    },
    {
        question: "What is the Punjabi word for 'Hello'?",
        answers: [
            { text: "ਨਮਸਤੇ (Namaste)", correct: false},
            { text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ (Sat Sri Akaal)", correct: true},
            { text: "ਹੈਲੋ (Hello)", correct: false},
        ]
    },
    {
        question: "What does 'ਮੇਰਾ ਨਾਂ ਜਸਵੀਂਦਰ ਹੈ' mean in English?",
        answers: [
            { text: "My name is Jasvinder.", correct: true},
            { text: "What is your name?", correct: false},
            { text: "Where are you from?", correct: false},
        ]
    },
    {
        question: "What is the meaning of 'ਮੈਨੂੰ ਮਾਫ ਕਰੋ' in English?",
        answers: [
            { text: "Please forgive me.", correct: true},
            { text: "Thank you.", correct: false},
            { text: "Excuse me.", correct: false},
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
            'lang': 'Punjabi',
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