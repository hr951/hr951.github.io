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

// LoadJSON
async function loadWords() {
    const res = await fetch("https://raw.githubusercontent.com/hr951/hr951.github.io/refs/heads/main/target1900/words_en_ja.json");
    wordsData = await res.json();

    const len = Object.keys(wordsData).length;
    startIndexInput.max = len;
    endIndexInput.max = len;
    endIndexInput.value = len;
}

// Start
async function start() {
    await loadWords();

    const startNo = Number(startIndexInput.value);
    const endNo = Number(endIndexInput.value);
    delaySec = Number(delayInput.value);

    if (startNo > endNo) {
        alert("開始番号は終了番号以下にしてください");
        return;
    }

    // 全単語に番号付け
    const allWords = Object.entries(wordsData).map(([word, mean], i) => ({
        no: i + 1,
        word,
        mean
    }));

    // 指定範囲のみ抽出
    words = allWords.filter(
        w => w.no >= startNo && w.no <= endNo
    );

    // 範囲内のみシャッフル
    order = shuffle([...words]);
    index = 0;

    setup.style.display = "none";
    study.style.display = "block";

    showWord();
}

// Show
function showWord() {
    clearTimers();

    const item = order[index];
    wordIndex.textContent = `${item.no}`;
    word.textContent = item.word;
    mean.textContent = item.mean;
    mean.style.visibility = "hidden";

    startProgress();
}

// ProgressBar
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

// Button
function next() {
    index++;
    if (index >= order.length) {
        order = shuffle([...order]); // 1周後に再シャッフル
        index = 0;
    }
    showWord();
}

function prev() {
    index--;
    if (index < 0) index = order.length - 1;
    showWord();
}


// Shuffle
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
