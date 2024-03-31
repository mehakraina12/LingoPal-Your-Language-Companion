const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following is the correct way to say 'hello' in Mandarin Chinese?",
        answers: [
            { text: "你好 (Nǐ hǎo)", correct: true},
            { text: "再见 (Zàijiàn)", correct: false},
            { text: "谢谢 (Xièxiè)", correct: false},
        ]
    },
    {
        question: "What does the character '中' (zhōng) mean in Mandarin?",
        answers: [
            { text: "Middle", correct: true},
            { text: "Sun", correct: false},
            { text: "Mountain", correct: false},
        ]
    },
    {
        question: "Which tone is used for the word 'mā' to mean 'mother' in Mandarin Chinese?",
        answers: [
            { text: "Second tone (rising)", correct: false},
            { text: "First tone (high and level)", correct: true},
            { text: "Third tone (falling-rising)", correct: false},
        ]
    },
    {
        question: "How do you say 'thank you' in Mandarin Chinese?",
        answers: [
            { text: "对不起 (Duìbuqǐ)", correct: false},
            { text: "谢谢 (Xièxiè)", correct: true},
            { text: "不客气 (Bù kèqì)", correct: false},
        ]
    },
    {
        question: "In Mandarin Chinese, how would you ask someone's name?",
        answers: [
            { text: "你叫什么名字？(Nǐ jiào shénme míngzi?)", correct: true},
            { text: "你是哪国人？(Nǐ shì nǎ guó rén?)", correct: false},
            { text: "你好吗？(Nǐ hǎo ma?) ", correct: false},
        ]
    },
    {
        question: "What does '不好意思' (bù hǎo yìsi) mean in Mandarin Chinese?",
        answers: [
            { text: "Thank you", correct: false},
            { text: "Sorry", correct: true},
            { text: "Goodbye", correct: false},
        ]
    },
    {
        question: "Which of the following means 'apple' in Mandarin Chinese?",
        answers: [
            { text: "鱼 (Yú)", correct: false},
            { text: " 西瓜 (Xīguā)", correct: false},
            { text: "苹果 (Píngguǒ)", correct: true},
        ]
    },
    {
        question: "How do you say 'I love you' in Mandarin Chinese?",
        answers: [
            { text: "我想你 (Wǒ xiǎng nǐ)", correct: false},
            { text: "我爱你 (Wǒ ài nǐ)", correct: true},
            { text: " 我怀念你 (Wǒ huáiniàn nǐ)", correct: false},
        ]
    },
    {
        question: "Which measure word is used for counting flat objects in Mandarin Chinese?",
        answers: [
            { text: "张 (zhāng)", correct: true},
            { text: "个 (gè)", correct: false},
            { text: "条 (tiáo)", correct: false},
        ]
    },
    {
        question: "What does the phrase '早上好' (zǎoshang hǎo) mean in Mandarin Chinese?",
        answers: [
            { text: "Good morning", correct: true},
            { text: "Good evening", correct: false},
            { text: "Good night", correct: false},
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
            'lang': 'Chinese',
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