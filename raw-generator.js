/* =========================================================
   NN | RAW GENERATOR
   main.js とは独立したサービス専用JS
   ========================================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const input = $("rawInput");
  const count = $("charCount");
  const hidePreview = $("hidePreview");
  const minifyCode = $("minifyCode");
  const customNameToggle = $("customNameToggle");
  const filenameBox = $("filenameBox");
  const filename = $("filename");
  const createRaw = $("createRaw");
  const resultSection = $("resultSection");
  const rawUrl = $("rawUrl");
  const copyUrl = $("copyUrl");
  const openRaw = $("openRaw");
  const toast = $("toast");

  let toastTimer = null;

  // 既存 style.css の .reveal は main.js が表示状態へ切り替える前提。
  // このサービスでは main.js に依存させないため、専用JS側で表示する。
  document.querySelectorAll(".reveal").forEach((el) => {
    requestAnimationFrame(() => el.classList.add("is-visible"));
  });

  // 既存サイトと同じく現在ページのナビをアクティブにする。
  document.querySelectorAll(".bottom-nav .nav-item").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.page === "raw.html");
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 2200);
  }

  function updateCount() {
    count.textContent = `${input.value.length.toLocaleString()} 文字`;
  }

  function simpleMinifyLua(text) {
    // 安全な完全Luaパーサーではないため、明示的に「簡易圧縮」。
    // 文字列内の空白を壊さないような本格的圧縮ではない。
    return text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "")
      .join("\n");
  }

  function makeId(length = 10) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, n => chars[n % chars.length]).join("");
  }

  function sanitizeFilename(name) {
    return name
      .trim()
      .replace(/\.lua$/i, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
  }

  function buildDemoRawUrl(id, name) {
    /*
      現在はフロントエンドのみのデモURL。
      実運用ではここをバックエンド/APIから返されたURLに置き換える。

      例:
      const response = await fetch("/api/create", {...});
      const data = await response.json();
      return data.url;
    */
    const origin = window.location.origin;
    return `${origin}/raw/${encodeURIComponent(name)}-${id}.lua`;
  }

  function create() {
    let code = input.value;

    if (!code.trim()) {
      showToast("コードを入力してください！");
      input.focus();
      return;
    }

    if (minifyCode.checked) {
      code = simpleMinifyLua(code);
    }

    const id = makeId();
    const name = customNameToggle.checked
      ? (sanitizeFilename(filename.value) || "script")
      : "script";

    const url = buildDemoRawUrl(id, name);

    /*
      注意:
      静的サイトだけでは、このURLに新しいLuaファイルを
      サーバーへ保存することはできない。
      ここではUI確認用URLを生成している。
      本番ではAPI接続部分を追加する。
    */

    rawUrl.textContent = url;
    openRaw.href = url;

    resultSection.classList.remove("is-hidden");
    resultSection.classList.add("is-visible");
    resultSection.scrollIntoView({ behavior: "smooth", block: "center" });

    showToast("Rawリンクを生成しました！");
  }

  input.addEventListener("input", updateCount);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      create();
    }
  });

  customNameToggle.addEventListener("change", () => {
    filenameBox.classList.toggle("is-hidden", !customNameToggle.checked);
    if (customNameToggle.checked) filename.focus();
  });

  createRaw.addEventListener("click", create);

  copyUrl.addEventListener("click", async () => {
    const value = rawUrl.textContent;
    try {
      await navigator.clipboard.writeText(value);
      copyUrl.textContent = "✓ コピーしました";
      copyUrl.classList.add("is-copied");
      showToast("URLをコピーしました！");
      setTimeout(() => {
        copyUrl.textContent = "📋 コピー";
        copyUrl.classList.remove("is-copied");
      }, 1800);
    } catch {
      showToast("コピーできませんでした");
    }
  });

  updateCount();
})();
