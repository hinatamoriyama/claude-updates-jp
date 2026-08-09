# 日次自動更新の仕組み

このリポジトリは、Claude Codeのスケジュール実行(Routine)によって**毎日自動で**内容が更新されます。
このファイルは、日次実行されるセッション(=あなた)が読んで、そのまま作業できるようにするための実行手順書です。

## 実行手順

1. **リポジトリを取得する**
   - `hinatamoriyama/claude-updates-jp` をこのセッションに追加(未追加の場合はadd_repoツールを使う)し、最新の `main` ブランチをclone/pullする。

2. **公式情報源を確認する**
   `data/updates.json` の `sources` 配列に登録されている各URLをWebFetchで取得し、前回チェック以降(`data/updates.json` の `last_checked` より新しい)に追加・更新された項目がないか確認する。

   現在監視している情報源:
   - Claude Platform release notes: https://platform.claude.com/docs/en/release-notes/overview (Claude API・SDK・Console)
   - Claude Code changelog: https://code.claude.com/docs/en/changelog (Claude Code本体)
   - Claude Apps release notes: https://support.claude.com/en/articles/12138966-release-notes (claude.ai・Cowork等。**このドメインはネットワーク制限で直接WebFetchできない環境がある**。その場合はWebSearchでのスニペット取得や `https://code.claude.com/docs/en/changelog` 内の関連言及で代替し、確認できなかった場合は無理に埋めない)
   - Anthropic News: https://www.anthropic.com/news (モデル発表・会社発表)

   余裕があれば `WebSearch` で "Anthropic Claude update <今月>" のような検索も行い、上記の一次情報で見落としがないか補強する(ただし一次情報を優先し、二次情報だけで項目を作らない)。

3. **新しいアップデートだけを追加する**
   - 既存の `items[].id` と重複する内容は追加しない(同じ日付・同じ発表の重複記載を避ける)。
   - 新しい項目ごとに、次のフォーマットで `items` 配列の**先頭**に追加する(配列は日付降順を維持):

     ```json
     {
       "id": "YYYY-MM-DD-短い英字スラッグ",
       "date": "YYYY-MM-DD",
       "source": "platform | claude-code | claude-apps | anthropic-news",
       "source_url": "一次情報のURL",
       "title_ja": "日本語のタイトル(体言止め、30字程度)",
       "summary_ja": "何が変わったかの日本語要約。一次情報に基づく事実のみを書き、推測は書かない。2〜4文程度。",
       "usage_example_ja": "このアップデートを実際にどう使えるかの具体例。可能なら『一人AI会社』(hinatamoriyama/ai-company)のような個人開発・週5〜10時間運用の文脈でどう活きるかを書く。無理に関連付けず、一般的な活用例でもよい。",
       "tags": ["短いタグ", "最大3つ程度"]
     }
     ```

   - 些末な文言修正・typo修正・内部API限定の変更など、一般ユーザーにとって重要度が低いものは無理に載せなくてもよい(取捨選択してよい)。1回の実行で載せる新規項目は目安5〜10件程度まで。
   - `last_checked` を実行時刻(JST, ISO8601、例: `2026-08-10T09:00:00+09:00`)に更新する。

4. **コミット・pushする**
   - `data/updates.json` の変更のみをコミットする(コード側=`index.html`/`style.css`/`app.js`は日次実行では基本的に触らない)。
   - コミットメッセージ例: `chore: 日次アップデート反映 (2026-08-10)`
   - 変更がない日(新規アップデートが本当に無かった日)は、`last_checked` のみ更新してコミットしてよい。
   - `main` ブランチへ直接pushする(このリポジトリはコンテンツデータの自動更新が前提のため、日次実行についてはPRを経由しない。誤りがあれば `git revert` で即座に戻せる)。

5. **公開する**
   - Netlifyでこのリポジトリと連携済みの場合はpushだけで自動デプロイされる。連携が無い/不明な場合は、Netlify MCPツール(`netlify-project-services-updater` の `deploy-site` 等)で対象サイト(team: `hinatamoriyama`, project名は `hinatamoriyama/ai-company` の `knowledge/公開アプリ一覧.md` を参照)に対して手動デプロイを行う。

6. **失敗した場合**
   - 情報源の取得に失敗した(ネットワーク制限等)場合は、無理にダミーの内容を作らず、その日は何もせず終了してよい(次の日次実行に委ねる)。
   - pushに失敗した場合は、ローカルの変更・コミットを残さない(宙に浮いたコミットを作らない)。

## データ品質のルール(手動更新でも同じ)

- 出典URLを必ず残す。
- 事実(公式情報に書かれていること)と推測(このサイトの解釈・活用例の提案)を混同しない。`summary_ja` は事実、`usage_example_ja` は提案、という役割分担を守る。
- 日本語で書く。
