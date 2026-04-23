import json

# 元のファイルを読み込む
with open('words_1900.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

new_data = {}
# 1から始まる連番で書き換え
for i, (word, mean) in enumerate(data.items(), 1):
    new_data[str(i)] = {
        "word": word,
        "word_mean": mean,
        "sentence": "",
        "sentence_mean": ""
    }

# 新しい形式で保存
with open('formatted_words_1900.json', 'w', encoding='utf-8') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=4)

print("変換が完了しました：formatted_words_1900.json")