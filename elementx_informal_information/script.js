// JSONデータを取得 lobby
fetch('https://raw.githubusercontent.com/hr951/hr951.github.io/refs/heads/main/elementx_informal_information/lobby_data.json')
    .then(response => response.json())
    .then(jsonData => {
        console.log(jsonData); // JSONの確認

        // `r7` と `gw25` のコンテナを取得
        const r7lobby = document.getElementById("r7-lobby");
        const gw25lobby = document.getElementById("gw25-lobby");

        // `r7` のデータがある場合
        if (jsonData["r7"] && r7lobby) {
            appendCategory(jsonData["r7"]["lobby"], `ロビー（${Object.keys(jsonData.r7.lobby).length}個）`, r7lobby, "r7");
            appendCategory(jsonData["r7"]["afk"], `AFKロビー（${Object.keys(jsonData.r7.afk).length}個）`, r7lobby, "r7");
        } else {
            console.error("Error: 'r7' データが見つかりません！");
        }

        // `gw25` のデータがある場合
        if (jsonData["gw25"] && gw25lobby) {
            appendCategory(jsonData["gw25"]["lobby"], `ロビー（${Object.keys(jsonData.gw25.lobby).length}個）`, gw25lobby, "gw25");
            appendCategory(jsonData["gw25"]["old"], `旧ロビー（${Object.keys(jsonData.gw25.old).length}個）`, gw25lobby, "gw25");
            appendCategory(jsonData["gw25"]["afk"], `AFKロビー（${Object.keys(jsonData.gw25.afk).length}個）`, gw25lobby, "gw25");
        } else {
            console.error("Error: 'gw25' データが見つかりません！");
        }
    })
    .catch(error => console.error('JSONの読み込みエラー:', error));

// JSONデータを取得 Games
fetch('https://raw.githubusercontent.com/hr951/hr951.github.io/refs/heads/main/elementx_informal_information/games_data.json')
    .then(response => response.json())
    .then(jsonData => {
        console.log(jsonData); // JSONの確認

        // `r7` と `gw25` のコンテナを取得
        const r7games = document.getElementById("r7-games");
        const gw25games = document.getElementById("gw25-games");

        // `r7` のデータがある場合
        if (jsonData["r7"] && r7games) {
            appendCategory_games(jsonData["r7"]["Annihilation"], `Annihilation（${Object.keys(jsonData.r7.Annihilation).length}個）`, r7games, "r7");
            appendCategory_games(jsonData["r7"]["BlockingDead"], `BlockingDead（${Object.keys(jsonData.r7.BlockingDead).length}個）`, r7games, "r7");
            appendCategory_games(jsonData["r7"]["BlockParty"], `BlockParty（${Object.keys(jsonData.r7.BlockParty).length}個）`, r7games, "r7");
            appendCategory_games(jsonData["r7"]["Gravity"], `Gravity（${Object.keys(jsonData.r7.Gravity).length}個）`, r7games, "r7");
            appendCategory_games(jsonData["r7"]["MurderMystery"], `MurderMystery（${Object.keys(jsonData.r7.MurderMystery).length}個）`, r7games, "r7");
            appendCategory_games(jsonData["r7"]["PropHunt"], `PropHunt（${Object.keys(jsonData.r7.PropHunt).length}個）`, r7games, "r7");
            appendCategory_games(jsonData["r7"]["Sumo"], `Sumo（${Object.keys(jsonData.r7.Sumo).length}個）`, r7games, "r7");
            appendCategory_games(jsonData["r7"]["SuperJump"], `SuperJump（${Object.keys(jsonData.r7.SuperJump).length}個）`, r7games, "r7");
            appendCategory_games(jsonData["r7"]["SurvivalGames"], `SurvivalGames（${Object.keys(jsonData.r7.SurvivalGames).length}個）`, r7games, "r7");
            appendCategory_games(jsonData["r7"]["TheBridge"], `TheBridge（${Object.keys(jsonData.r7.TheBridge).length}個）`, r7games, "r7");
            appendCategory_games(jsonData["r7"]["TNTTag"], `TNTtag（${Object.keys(jsonData.r7.TNTTag).length}個）`, r7games, "r7");
        } else {
            console.error("Error: 'r7' データが見つかりません！");
        }

        // `gw25` のデータがある場合
        if (jsonData["gw25"] && gw25games) {
            appendCategory_games(jsonData["gw25"]["Annihilation"], `Annihilation（${Object.keys(jsonData.gw25.Annihilation).length}個）`, gw25games, "gw25");
            appendCategory_games(jsonData["gw25"]["BlockingDead"], `BlockingDead（${Object.keys(jsonData.gw25.BlockingDead).length}個）`, gw25games, "gw25");
            appendCategory_games(jsonData["gw25"]["BlockParty"], `BlockParty（${Object.keys(jsonData.gw25.BlockParty).length}個）`, gw25games, "gw25");
            appendCategory_games(jsonData["gw25"]["Gravity"], `Gravity（${Object.keys(jsonData.gw25.Gravity).length}個）`, gw25games, "gw25");
            appendCategory_games(jsonData["gw25"]["MurderMystery"], `MurderMystery（${Object.keys(jsonData.gw25.MurderMystery).length}個）`, gw25games, "gw25");
            appendCategory_games(jsonData["gw25"]["PropHunt"], `PropHunt（${Object.keys(jsonData.gw25.PropHunt).length}個）`, gw25games, "gw25");
            appendCategory_games(jsonData["gw25"]["SuperJump"], `SuperJump（${Object.keys(jsonData.gw25.SuperJump).length}個）`, gw25games, "gw25");
            appendCategory_games(jsonData["gw25"]["SurvivalGames"], `SurvivalGames（${Object.keys(jsonData.gw25.SurvivalGames).length}個）`, gw25games, "gw25");
            appendCategory_games(jsonData["gw25"]["TheBridge"], `TheBridge（${Object.keys(jsonData.gw25.TheBridge).length}個）`, gw25games, "gw25");
            appendCategory_games(jsonData["gw25"]["TNTRun"], `TNTRun（${Object.keys(jsonData.gw25.TNTRun).length}個）`, gw25games, "gw25");
            appendCategory_games(jsonData["gw25"]["TNTTag"], `TNTTag（${Object.keys(jsonData.gw25.TNTTag).length}個）`, gw25games, "gw25");
        } else {
            console.error("Error: 'gw25' データが見つかりません！");
        }
    })
    .catch(error => console.error('JSONの読み込みエラー:', error));

// 各カテゴリを指定されたコンテナに追加する関数
function appendCategory(data, title, container, times) {
    if (!data) return; // データが存在しない場合は処理しない

    // タイトルを追加
    const categoryTitle = `<h4><b>${title}</b></h4>`;
    container.innerHTML += categoryTitle;

    Object.keys(data).forEach((key, index) => {
        const itemNum = index + 1;
        const coordinates = data[key];

        // 各アイテムのHTML生成
        const html = `
                ${coordinates}<br>
                <button onclick="toggleVisibility('${times}_${title}_${itemNum}')">画像を表示・非表示</button>
                <div id="${times}_${title}_${itemNum}" class="myClass">
                    <img src="../image/elementx_presents/${times}/${times}_${key}.jpeg" style="width:98%;margin:20px 0">
                </div><br>
        `;
        
        container.innerHTML += html;
    });
}

// 各カテゴリを指定されたコンテナに追加する関数
function appendCategory_games(data, title, container, times) {
    if (!data) return; // データが存在しない場合は処理しない

    // タイトルを追加
    const categoryTitle = `<h4><b>${title}</b></h4>`;
    container.innerHTML += categoryTitle;

    Object.keys(data).forEach((key, index) => {
        const itemNum = index + 1;
        const coordinates = data[key].cord;
        const map = data[key].map;

        // 各アイテムのHTML生成
        const html = `
                <b>${map}</b><br>
                ${coordinates}<br>
                <button onclick="toggleVisibility('${times}_${title}_${itemNum}')">画像を表示・非表示</button>
                <div id="${times}_${title}_${itemNum}" class="myClass">
                    <img src="../image/elementx_presents/${times}/${times}_${key}.jpeg" style="width:98%;margin:20px 0">
                </div><br>
        `;
        
        container.innerHTML += html;
    });
}
