// 再生中のクローン音声を管理するための配列
    let activeClones = [];

    // 連打対応の再生関数
    function playMultiSound(id) {
        const masterAudio = document.getElementById(id);
        if (masterAudio) {
            const cloneAudio = masterAudio.cloneNode();
            
            // 識別・一括停止しやすくするため、クローンに特定のクラス名を付与して配列に保存
            cloneAudio.classList.add('active-sound-clone');
            activeClones.push(cloneAudio);

            cloneAudio.play().catch(error => {
                console.error("音声の再生に失敗しました:", error);
            });

            // 再生終了時の処理
            cloneAudio.onended = function() {
                removeClone(cloneAudio);
            };
        }
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
    }