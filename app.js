(function () {
  "use strict";

  var listEl = document.getElementById("update-list");
  var filtersEl = document.getElementById("filters");
  var emptyEl = document.getElementById("empty-state");
  var lastCheckedEl = document.getElementById("last-checked");
  var sourceListEl = document.getElementById("source-list");

  var state = {
    items: [],
    sources: [],
    activeFilter: "all"
  };

  fetch("data/updates.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("データの取得に失敗しました (" + res.status + ")");
      return res.json();
    })
    .then(function (data) {
      state.items = (data.items || []).slice().sort(function (a, b) {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      });
      state.sources = data.sources || [];
      renderLastChecked(data.last_checked);
      renderSourceList(state.sources);
      renderFilters(state.sources);
      renderList();
    })
    .catch(function (err) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      emptyEl.textContent = "データを読み込めませんでした: " + err.message;
    });

  function renderLastChecked(isoString) {
    if (!isoString) {
      lastCheckedEl.textContent = "最終確認日時: 不明";
      return;
    }
    var d = new Date(isoString);
    var formatted = isNaN(d.getTime())
      ? isoString
      : d.toLocaleString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
    lastCheckedEl.textContent = "最終確認日時: " + formatted;
  }

  function renderSourceList(sources) {
    sourceListEl.innerHTML = sources
      .map(function (s) {
        return (
          '<li><a href="' +
          escapeAttr(s.url) +
          '" target="_blank" rel="noopener">' +
          escapeHtml(s.label) +
          "</a> — " +
          escapeHtml(s.description || "") +
          "</li>"
        );
      })
      .join("");
  }

  function renderFilters(sources) {
    var buttons = [{ key: "all", label: "すべて" }].concat(
      sources.map(function (s) {
        return { key: s.key, label: s.label };
      })
    );

    filtersEl.innerHTML = buttons
      .map(function (b) {
        var pressed = b.key === state.activeFilter ? "true" : "false";
        return (
          '<button type="button" class="filter-chip" data-key="' +
          escapeAttr(b.key) +
          '" aria-pressed="' +
          pressed +
          '">' +
          escapeHtml(b.label) +
          "</button>"
        );
      })
      .join("");

    filtersEl.querySelectorAll(".filter-chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.activeFilter = btn.getAttribute("data-key");
        filtersEl.querySelectorAll(".filter-chip").forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        renderList();
      });
    });
  }

  function renderList() {
    var items = state.items.filter(function (item) {
      return state.activeFilter === "all" || item.source === state.activeFilter;
    });

    if (items.length === 0) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    listEl.innerHTML = items.map(renderCard).join("");
  }

  function renderCard(item) {
    var sourceMeta = state.sources.find(function (s) {
      return s.key === item.source;
    });
    var sourceLabel = sourceMeta ? sourceMeta.label : item.source;
    var dateLabel = formatDate(item.date);
    var tags = (item.tags || [])
      .map(function (t) {
        return '<span class="tag">' + escapeHtml(t) + "</span>";
      })
      .join("");

    return (
      '<li class="update-card">' +
      '<div class="card-top">' +
      '<span class="source-badge ' +
      escapeAttr(item.source) +
      '">' +
      escapeHtml(sourceLabel) +
      "</span>" +
      '<span class="update-date">' +
      dateLabel +
      "</span>" +
      "</div>" +
      "<h3>" +
      escapeHtml(item.title_ja) +
      "</h3>" +
      (tags ? '<div class="tag-row">' + tags + "</div>" : "") +
      "<p>" +
      escapeHtml(item.summary_ja) +
      "</p>" +
      '<div class="usage-box">' +
      '<span class="label">活用例</span>' +
      "<p>" +
      escapeHtml(item.usage_example_ja) +
      "</p>" +
      "</div>" +
      '<a class="source-link" href="' +
      escapeAttr(item.source_url) +
      '" target="_blank" rel="noopener">公式ソースを見る →</a>' +
      "</li>"
    );
  }

  function formatDate(isoDate) {
    var d = new Date(isoDate + "T00:00:00+09:00");
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }
})();
