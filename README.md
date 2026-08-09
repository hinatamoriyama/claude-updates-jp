# claude-updates-jp

Claude / Anthropicの公式アップデート(リリースノート・changelog・ニュース)を毎日チェックし、日本語で要約・活用例つきで紹介する静的サイトです。

- ビルド不要の素のHTML/CSS/JS(依存ライブラリなし)
- 表示データは `data/updates.json` の1ファイルのみ
- 日次の更新はClaude Codeのスケジュール実行(Routine)が行う。仕組みは [`AUTOMATION.md`](./AUTOMATION.md) を参照

## ローカルで見る

```bash
python3 -m http.server 8000
# または
npx serve .
```

ブラウザで `http://localhost:8000` を開く。

## ディレクトリ構成

```
index.html      画面本体
style.css       スタイル(ライト/ダーク両対応)
app.js          data/updates.json を読み込んで描画する
data/
  updates.json  表示データ本体(このファイルを更新すれば画面に反映される)
AUTOMATION.md   日次自動更新の仕組み・ルール
```

## 関連

- ビジネス側の記録(企画書・タスク・リサーチ): `hinatamoriyama/ai-company` リポジトリの `projects/アプリ開発/20260809_Claude更新まとめサイト/`
