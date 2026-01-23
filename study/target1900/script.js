let wordsData = null; // データを保持
let words = [];       // 範囲絞り込み後のリスト
let order = [];       // シャッフル後のリスト
let index = 0;
let delaySec = 2;
let timer = null;
let progressTimer = null;
let correctWords = [];
let wrongWords = [];
let currentTab = 'correct'; // 'correct' or 'wrong'

const setup = document.getElementById("setup");
const study = document.getElementById("study");
const wordIndex = document.getElementById("wordIndex");
const word = document.getElementById("word");
const mean = document.getElementById("mean");
const progressBar = document.getElementById("progressBar");
const startIndexInput = document.getElementById("startIndex");
const endIndexInput = document.getElementById("endIndex");
const delayInput = document.getElementById("delay");
const reviewModeInput = document.getElementById("reviewMode");

// 起動時にデータを1回だけロード
async function init() {
    try {
        const res = await fetch("https://raw.githubusercontent.com/hr951/hr951.github.io/refs/heads/main/study/target1900/words_en_ja.json");
        wordsData = await res.json();
        const maxLen = Object.keys(wordsData).length;
        startIndexInput.max = maxLen;
        endIndexInput.max = maxLen;
        endIndexInput.value = maxLen;
    } catch (e) {
        alert("データの読み込みに失敗しました");
    }
}
init();

async function start() {
    if (!wordsData) return;

    const isReviewMode = reviewModeInput.checked;

    // --- 復習モードの判定 ---
    if (isReviewMode) {
        if (wrongWords.length === 0) {
            alert("誤答リストが空です");
            return;
        }
        // 誤答リスト
        words = [...wrongWords];
    } else {

        const startNo = parseInt(startIndexInput.value);
        const endNo = parseInt(endIndexInput.value);
        delaySec = parseFloat(delayInput.value);
        correctWords = [];
        wrongWords = [];
        updateStats();
        renderTable();

        // --- バリデーション ---
        if (isNaN(startNo) || isNaN(endNo) || isNaN(delaySec)) {
            alert("数値を入力してください");
            return;
        }
        if (startNo < 1 || endNo < 1) {
            alert("1以上の番号を指定してください");
            return;
        }
        if (endNo > 1900) {
            alert("1900以下の番号を指定してください");
            return;
        }
        if (startNo > endNo) {
            alert("開始番号は終了番号以下にしてください（ex: 1 〜 100）");
            return;
        }
        // ----------------------

        // 全単語を配列化
        const allWords = Object.entries(wordsData).map(([w, m], i) => ({
            no: i + 1,
            word: w,
            mean: m
        }));

        // 指定範囲のみ抽出
        words = allWords.filter(w => w.no >= startNo && w.no <= endNo);
    }

    if (words.length === 0) {
        alert("指定された範囲に単語が見つかりませんでした");
        return;
    }

    order = shuffle([...words]);
    index = 0;

    setup.style.display = "none";
    study.style.display = "block";

    showWord();
}

function showWord() {
    clearTimers();

    const item = order[index];
    wordIndex.textContent = `No. ${item.no}`;
    word.textContent = item.word;
    mean.textContent = item.mean;
    mean.style.visibility = "hidden"; // 隠す

    startProgress();
}

function startProgress() {
    let remaining = delaySec * 1000;
    const total = remaining;
    const step = 50;

    progressBar.style.width = "100%";

    progressTimer = setInterval(() => {
        remaining -= step;
        const percent = Math.max(0, (remaining / total) * 100);
        progressBar.style.width = percent + "%";

        if (remaining <= 0) {
            clearInterval(progressTimer);
            mean.style.visibility = "visible"; // 意味を表示
        }
    }, step);
}

function markWord(isCorrect) {
    const item = order[index];

    // 重複登録防止（一度答えたらリストを更新）
    const updateList = (list) => {
        if (!list.find(w => w.no === item.no)) list.push(item);
    };

    if (isCorrect) {
        updateList(correctWords);
        // 誤答リストにいたら消す
        wrongWords = wrongWords.filter(w => w.no !== item.no);
    } else {
        updateList(wrongWords);
        // 正答リストにいたら消す
        correctWords = correctWords.filter(w => w.no !== item.no);
    }

    updateStats();
    renderTable();

    next();
}

function updateStats() {
    const correctNum = correctWords.length;
    const totalAttempted = correctWords.length + wrongWords.length;
    const accuracy = totalAttempted === 0 ? 0 : Math.round((correctNum / totalAttempted) * 100);

    document.getElementById("correctNum").textContent = correctNum;
    document.getElementById("totalNum").textContent = totalAttempted;
    document.getElementById("accuracy").textContent = accuracy;
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === (tab === 'correct' ? '正答' : '誤答'));
    });
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";
    const list = (currentTab === 'correct') ? correctWords : wrongWords;

    // 新しい順に表示
    [...list].reverse().forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${item.no}</td><td>${item.word}</td><td>${item.mean}</td>`;
        tbody.appendChild(tr);
    });
}

function next() {
    index++;
    if (index >= order.length) {
        alert("範囲内の単語をすべて学習しました。再シャッフルします。");
        order = shuffle([...words]);
        index = 0;
    }
    showWord();
}

function prev() {
    index--;
    if (index < 0) index = order.length - 1;
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

// イベント
document.getElementById("startBtn").onclick = start;
document.getElementById("prevBtn").onclick = prev;
document.getElementById("nextBtn").onclick = next;
document.getElementById("correctBtn").onclick = () => markWord(true);
document.getElementById("wrongBtn").onclick = () => markWord(false);
document.getElementById("backBtn").onclick = () => {
    clearTimers();
    study.style.display = "none";
    setup.style.display = "block";
};
