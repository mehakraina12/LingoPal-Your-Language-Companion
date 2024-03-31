const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the meaning of the Gujarati word 'પ્રેમ' (prem)?",
        answers: [
            { text: "Love", correct: true},
            { text: "Sadness", correct: false},
            { text: "Joy", correct: false},
        ]
    },
    {
        question: "How many vowels are there in the Gujarati alphabet?",
        answers: [
            { text: "7", correct: true},
            { text: "10", correct: false},
            { text: "12", correct: false},
        ]
    },
    {
        question: "What is the plural form of the Gujarati word 'પાણી' (pani)?",
        answers: [
            { text: "પાણા (pana)", correct: false},
            { text: "પાણિયાં (paniyam)", correct: true},
            { text: "પાણીઓનું (panionu)", correct: false},
        ]
    },
    {
        question: "Which of the following is a correct sentence in Gujarati?",
        answers: [
            { text: "મને ખુબ જ્યાંક નથી. (Mane khub jyank nathi.)", correct: false},
            { text: " મને ખુબ ખુશી થવી જાય છે. (Mane khub khushi thavi jay che.)", correct: true},
            { text: "મને ખુબ ભૂખ લાગી છે. (Mane khub bhukh lagi che.)", correct: false},
        ]
    },
    {
        question: "What does the Gujarati phrase 'મજા માં રહેજો' (maja ma rahejo) mean?",
        answers: [
            { text: "Stay in fun", correct: true},
            { text: "Keep smiling", correct: false},
            { text: "Stay in peace", correct: false},
        ]
    },
    {
        question: "Which of the following words means 'teacher' in Gujarati?",
        answers: [
            { text: "પરિશ્રમકર્તા (parishramkartha)", correct: false},
            { text: "શિક્ષાક્ષેત્ર (shikshakshetra)", correct: false},
            { text: "શિક્ષક (shikshak)", correct: true},
        ]
    },
    {
        question: "What is the correct translation of 'આશા' in English?",
        answers: [
            { text: "Fear", correct: false},
            { text: "Sadness", correct: false},
            { text: "Hope", correct: true},
        ]
    },
    {
        question: "Which of the following is a correct greeting in Gujarati?",
        answers: [
            { text: "મજામાં (majama)", correct: false},
            { text: "કેમ છો? (kem cho?)", correct: true},
            { text: "આભાર (aabhar)", correct: false},
        ]
    },
    {
        question: "Which of the following is a correct translation of 'ખેળ' in English?",
        answers: [
            { text: "Play", correct: true},
            { text: "Study", correct: false},
            { text: "Work", correct: false},
        ]
    },
    {
        question: "What is the correct translation of 'બધા' (badha) in English?",
        answers: [
            { text: "All", correct: true},
            { text: "None", correct: false},
            { text: "Some", correct: false},
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
            'lang': 'Gujarati',
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