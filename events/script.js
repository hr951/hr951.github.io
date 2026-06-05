// 再生中のクローン音声を管理するための配列
let activeClones = [];
// ボタンごとの音量設定を保持
let volumeSettings = {};

let activeSoundCounts = {
    "Prologue": 0,
    "Belle-A": 0,
    "Belle-B": 0,
    "BeOurGuest": 0,
    "SomethingThere": 0,
    "Gaston": 0,
    "HowDoesAMomentLastForever": 0,
    "TheMobSong": 0,
    "CurtainCall": 0,

    "Comical": 0,
    "Combat": 0,
    "Transformation": 0,
    "Upbeat": 0,
    "BeautyAndTheBeast": 0,

    "Comical_1": 0,
    "Comical_2": 0,
    "Comical_3": 0,
    "Comical_4": 0,
    "Comical_5": 0,

    "Horse": 0,
    "BeastGrowl": 0,
    "Blizzard": 0,
    "WolfGrowl": 0,
    "BreakDoor": 0,
    "Burning": 0,
    "AppearKnife": 0,
    "StabWithKnife": 0,
    "Collapse": 0,
};

function playMultiSound(id) {
    const master = document.getElementById(id);
    if (master) {
        activeSoundCounts[id]++;
        // 🔊 UIを更新（スピーカーマーク表示）
        updatePlayingUI(id, true);

        const clone = master.cloneNode();
        // どのマスターから作られたか識別子を付与
        clone.dataset.originId = id;
        // 現在のスライダー音量を適用
        clone.volume = volumeSettings[id] || 1;

        activeClones.push(clone);
        clone.play();

        clone.onended = () => {
            activeClones = activeClones.filter(c => c !== clone);
            clone.remove();

            handleSoundStop(id);
        };
    }
}

function handleSoundStop(id) {
    activeSoundCounts[id]--;
    // 1つでも鳴っていれば表示を維持、すべて止まった時だけ消す
    if (activeSoundCounts[id] <= 0) {
        activeSoundCounts[id] = 0; // 負にならないように
        updatePlayingUI(id, false);
    }
}

// 個別停止：特定の音源IDに紐づく音だけを止める
function stopSpecificSound(id) {
    activeClones.forEach(clone => {
        if (clone.dataset.originId === id) {
            clone.pause();
            clone.remove();
        }
    });
    activeClones = activeClones.filter(clone => clone.dataset.originId !== id);

    activeSoundCounts[id] = 0;
    updatePlayingUI(id, false);
}

// 特定のクローンを配列とメモリから安全に削除するヘルパー関数
function removeClone(audioInstance) {
    audioInstance.remove();
    activeClones = activeClones.filter(item => item !== audioInstance);
}

// 🛑 すべての音を停止する関数
function stopAllSounds() {
    // 現在再生中のすべてのクローンをループ処理
    activeClones.forEach(clone => {
        clone.pause();   // 再生を停止
        clone.remove();  // DOMから削除
    });

    // 配列を空にする
    activeClones = [];

    for (const id in activeSoundCounts) {
        activeSoundCounts[id] = 0;
        updatePlayingUI(id, false);
    }
}

// 音量更新：既存の音と、これから鳴る音の両方に反映
function updateVolume(id, val) {
    volumeSettings[id] = val;
    // 現在鳴っている同じIDの音すべてをリアルタイムで音量変更
    activeClones.forEach(clone => {
        if (clone.dataset.originId === id) {
            clone.volume = val;
        }
    });
}

function updatePlayingUI(id, isPlaying) {
    // 同じoriginIdを持つすべての.sound-itemを探す（再利用対応）
    if (id.startsWith("Belle-")) {
        id = "Belle-A";
    } else if (id.startsWith("Belle_B-")) {
        id = "Belle-B";
    } else if (id.startsWith("Gaston-")) {
        id = "Gaston";
    } else if (id.startsWith("BeOurGuest-")) {
        id = "BeOurGuest";
    } else if (id.startsWith("SomethingThere-")) {
        id = "SomethingThere";
    } else if (id.startsWith("TheMobSong-")) {
        id = "TheMobSong";
    }
    const soundItems = document.querySelectorAll(`.button-pair[data-control-id="${id}"]`);
    soundItems.forEach(item => {
        if (isPlaying) {
            item.classList.add('is-playing');
        } else {
            item.classList.remove('is-playing');
        }
    });
}