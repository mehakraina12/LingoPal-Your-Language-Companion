const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does '고마워요' (gomawoyo) mean in English?",
        answers: [
            { text: "Thank you", correct: true},
            { text: "Please", correct: false},
            { text: "I'm sorry", correct: false},
        ]
    },
    {
        question: "Which phrase means 'What time is it?' in Korean?",
        answers: [
            { text: "지금 몇 시예요? (jigeum myeot siyeyo?)", correct: true},
            { text: "시간이 얼마나 지났어요? (sigani eolmana jinasseoyo?)", correct: false},
            { text: "시간이 어떻게 됐어요? (sigani eotteoke dwaesseoyo?)", correct: false},
        ]
    },
    {
        question: "What is the Korean word for 'friend'?",
        answers: [
            { text: "형제 (hyeongje)", correct: false},
            { text: "친구 (chingu)", correct: true},
            { text: "반려 (bannyeo)", correct: false},
        ]
    },
    {
        question: "Which of the following means 'I love you' in Korean?",
        answers: [
            { text: "안돼 (andwae)", correct: false},
            { text: "사랑해요 (saranghaeyo)", correct: true},
            { text: "나도 (nado)", correct: false},
        ]
    },
    {
        question: "What is the correct translation for 'excuse me' in Korean, when trying to get someone's attention?",
        answers: [
            { text: "저기요 (jeogiyo)", correct: true},
            { text: "실례합니다 (sillyehamnida)", correct: false},
            { text: "미안합니다 (mianhamnida)", correct: false},
        ]
    },
    {
        question: "How do you say 'goodbye' in Korean?",
        answers: [
            { text: "안녕 (annyeong)", correct: false},
            { text: "안녕하세요 (annyeonghaseyo)", correct: false},
            { text: "안녕히 가세요 (annyeonghi gaseyo)", correct: true},
        ]
    },
    {
        question: "What does '반갑습니다' (bangapseumnida) mean in English?",
        answers: [
            { text: "How are you", correct: false},
            { text: "Thank you", correct: false},
            { text: "Nice to meet you", correct: true},
        ]
    },
    {
        question: "Which phrase means 'How are you?' in Korean?",
        answers: [
            { text: "잘 지냈어요? (jal jinaesseoyo?)", correct: false},
            { text: "어떻게 지내세요? (eotteoke jinaeseyo?)", correct: true},
            { text: "안녕하세요? (annyeonghaseyo?)", correct: false},
        ]
    },
    {
        question: "What does '오늘은 무슨 요일이에요?' (oneureun museun yoilieyo?) mean in English?",
        answers: [
            { text: "What day is it today?", correct: true},
            { text: "How are you today?", correct: false},
            { text: "What time is it?", correct: false},
        ]
    },
    {
        question: "Which phrase means 'I'm sorry, I don't understand' in Korean?",
        answers: [
            { text: "미안합니다, 이해할 수 없습니다 (mianhamnida, ihaehal su eopseumnida)", correct: true},
            { text: "죄송합니다, 이해하지 못했습니다 (joesonghamnida, ihaehaji mothaesseumnida)", correct: false},
            { text: "미안합니다, 몰라요 (mianhamnida, mollayo)", correct: false},
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
            'lang': 'Korean',
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