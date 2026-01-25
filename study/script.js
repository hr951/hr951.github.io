const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');

// メニューを開く処理
function openMenu() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    menuBtn.classList.add('hidden'); // ボタンを隠す
}

// メニューを閉じる処理
function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    menuBtn.classList.remove('hidden'); // ボタンを再表示
}