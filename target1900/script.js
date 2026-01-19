let wordsData = {};
let words = [];
let order = [];
let index = 0;
let delaySec = 3;
let timer = null;
let progressTimer = null;

// DOM
const setup = document.getElementById("setup");
const study = document.getElementById("study");
const wordIndex = document.getElementById("wordIndex");
const word = document.getElementById("word");
const mean = document.getElementById("mean");
const progressBar = document.getElementById("progressBar");

const startIndexInput = document.getElementById("startIndex");
const endIndexInput = document.getElementById("endIndex");
const delayInput = document.getElementById("delay");

document.getElementById("startBtn").onclick = start;
document.getElementById("prevBtn").onclick = prev;
document.getElementById("nextBtn").onclick = next;

// JSON読み込み
async function loadWords() {
    const res = await fetch("words.json");
    wordsData = await res.json();

    const len = Object.keys(wordsData).length;
    startIndexInput.max = len;
    endIndexInput.max = len;
    endIndexInput.value = len;
}

// 開始
async function start() {
    await loadWords();

    const start = Number(startIndexInput.value) - 1;
    const end = Number(endIndexInput.value) - 1;
    delaySec = Number(delayInput.value);

    if (start > end) {
        alert("開始番号は終了番号以下にしてください");
        return;
    }

    words = Object.entries(wordsData).map(([word, mean], i) => ({
        no: i + 1,
        word,
        mean
    })).slice(start, end + 1);

    order = shuffle([...words]);
    index = 0;

    setup.style.display = "none";
    study.style.display = "block";

    showWord();
}

// 表示
function showWord() {
    clearTimers();

    const item = order[index];
    wordIndex.textContent = `${item.no}`;
    word.textContent = item.word;
    mean.textContent = item.mean;
    mean.style.visibility = "hidden";

    startProgress();
}

// プログレスバー
function startProgress() {
    let remaining = delaySec * 1000;
    const total = remaining;

    progressBar.style.width = "100%";

    progressTimer = setInterval(() => {
        remaining -= 50;
        progressBar.style.width = (remaining / total * 100) + "%";
    }, 50);

    timer = setTimeout(() => {
        mean.style.visibility = "visible";
        clearInterval(progressTimer);
        progressBar.style.width = "0%";
    }, delaySec * 1000);
}

// ナビ
function next() {
    index = (index + 1) % order.length;
    showWord();
}

function prev() {
    index = (index - 1 + order.length) % order.length;
    showWord();
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function clearTimers() {
    clearTimeout(timer);
    clearInterval(progressTimer);
}
