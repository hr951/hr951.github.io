// --- 共通設定 ---
let saveTimeout;

function updateStatus(isSaving) {
    const statusEl = document.getElementById('saveStatus');
    if (!statusEl) return;
    if (isSaving) {
        statusEl.innerText = '保存中...';
        statusEl.className = 'status-saving';
    } else {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            statusEl.innerText = '保存済み';
            statusEl.className = 'status-saved';
        }, 800);
    }
}

// --- 勉強メモ機能 ---
const COLORS = ['white', 'darkcyan', 'gold', 'pink', 'mediumblue', 'firebrick', 'darkmagenta', 'limegreen'];
let selectedColor = COLORS[0];
let tabs = [];
let activeTabId = null;

function initMemo() {
    const paletteEl = document.getElementById('palette');
    if (!paletteEl) return;

    COLORS.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch' + (color === selectedColor ? ' selected' : '');
        swatch.style.backgroundColor = color;
        swatch.onclick = () => {
            selectedColor = color;
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            swatch.classList.add('selected');
        };
        paletteEl.appendChild(swatch);
    });

    const savedData = localStorage.getItem('studyMemos_v2');
    if (savedData) {
        tabs = JSON.parse(savedData);
        if (tabs.length > 0) activeTabId = tabs[0].id;
    }
    renderMemo();
}

function addTab() {
    const titleInput = document.getElementById('newTabTitle');
    if (!titleInput.value) return;
    const newTab = { id: Date.now().toString(), title: titleInput.value, color: selectedColor, content: '' };
    tabs.push(newTab);
    activeTabId = newTab.id;
    titleInput.value = '';
    saveMemo();
}

function saveCurrentMemo() {
    updateStatus(true);
    const content = document.getElementById('memoEditor').value;
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
        tab.content = content;
        localStorage.setItem('studyMemos_v2', JSON.stringify(tabs));
    }
    updateStatus(false);
}

function renderMemo() {
    const tabList = document.getElementById('tabList');
    const editor = document.getElementById('memoEditor');
    if (!tabList) return;
    tabList.innerHTML = '';
    tabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `tab ${tab.id === activeTabId ? 'active' : ''}`;
        tabEl.style.borderTop = `5px solid ${tab.color}`;
        tabEl.innerHTML = `<span onclick="switchTab('${tab.id}')">${tab.title}</span><span class="delete-tab" onclick="deleteTab('${tab.id}', event)">✕</span>`;
        tabList.appendChild(tabEl);
    });
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab) { editor.value = activeTab.content; editor.disabled = false; }
    else { editor.value = ''; editor.disabled = true; }
}

function switchTab(id) { activeTabId = id; renderMemo(); }
function deleteTab(id, e) {
    e.stopPropagation();
    if (!confirm('削除しますか？')) return;
    tabs = tabs.filter(t => t.id !== id);
    if (activeTabId === id) activeTabId = tabs.length > 0 ? tabs[0].id : null;
    saveMemo();
}
function saveMemo() { localStorage.setItem('studyMemos_v2', JSON.stringify(tabs)); renderMemo(); }

// --- カレンダー機能 ---
function initCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    const rangeDisplay = document.getElementById('weekRange');
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());

    const endDate = new Date(sunday);
    endDate.setDate(sunday.getDate() + 6);
    rangeDisplay.innerText = `${sunday.getFullYear()}年 ${sunday.getMonth() + 1}/${sunday.getDate()} 〜 ${endDate.getMonth() + 1}/${endDate.getDate()}`;

    grid.innerHTML = '';
    const daysJP = ["日", "月", "火", "水", "木", "金", "土"];
    const classes = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    for (let i = 0; i < 7; i++) {
        const curr = new Date(sunday);
        curr.setDate(sunday.getDate() + i);
        const isToday = curr.toDateString() === today.toDateString();
        const dateKey = `cal_${curr.getFullYear()}${curr.getMonth() + 1}${curr.getDate()}`;
        const savedText = localStorage.getItem(dateKey) || "";

        const card = document.createElement('div');
        card.className = `day-card ${classes[i]} ${isToday ? 'today' : ''}`;
        card.innerHTML = `
            <div class="day-header"><span class="day-name">${daysJP[i]}曜日</span><span class="day-date">${curr.getMonth() + 1}/${curr.getDate()}</span></div>
            <div class="day-content"><textarea placeholder="予定を記入" oninput="saveCalData('${dateKey}', this.value)">${savedText}</textarea></div>`;
        grid.appendChild(card);
    }
}

function saveCalData(key, value) {
    updateStatus(true);
    localStorage.setItem(key, value);
    updateStatus(false);
}

// --- ページ読み込み時の初期化 ---
window.onload = () => {
    initMemo();
    initCalendar();
};