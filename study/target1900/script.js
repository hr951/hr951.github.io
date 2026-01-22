let wordsData = null; // データを保持
let words = [];       // 範囲絞り込み後のリスト
let order = [];       // シャッフル後のリスト
let index = 0;
let delaySec = 2;
let timer = null;
let progressTimer = null;

const setup = document.getElementById("setup");
const study = document.getElementById("study");
const wordIndex = document.getElementById("wordIndex");
const word = document.getElementById("word");
const mean = document.getElementById("mean");
const progressBar = document.getElementById("progressBar");
const startIndexInput = document.getElementById("startIndex");
const endIndexInput = document.getElementById("endIndex");
const delayInput = document.getElementById("delay");

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

    const startNo = parseInt(startIndexInput.value);
    const endNo = parseInt(endIndexInput.value);
    delaySec = parseFloat(delayInput.value);

    // --- バリデーション ---
    if (isNaN(startNo) || isNaN(endNo) || isNaN(delaySec)) {
        alert("数値を入力してください");
        return;
    }
    if (startNo < 1 || endNo < 1) {
        alert("1以上の番号を指定してください");
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
document.getElementById("backBtn").onclick = () => {
    clearTimers();
    study.style.display = "none";
    setup.style.display = "block";
};
