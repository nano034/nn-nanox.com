/* =========================================================
   NN | RAW GENERATOR
   Cloudflare Worker API 接続版
   main.js とは独立したサービス専用JS
   ========================================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  // =========================================================
  // Cloudflare Worker
  // =========================================================

  const API_URL =
    "https://nn-raw-api.nanoxdayo.workers.dev/create";

  // =========================================================
  // DOM
  // =========================================================

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
  let creating = false;

  // =========================================================
  // 初期化
  // =========================================================

  document.querySelectorAll(".reveal").forEach((el) => {
    requestAnimationFrame(() => {
      el.classList.add("is-visible");
    });
  });

  document.querySelectorAll(".bottom-nav .nav-item").forEach((item) => {
    item.classList.toggle(
      "is-active",
      item.dataset.page === "raw.html"
    );
  });

  // =========================================================
  // Toast
  // =========================================================

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("is-show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("is-show");
    }, 2200);
  }

  // =========================================================
  // 文字数
  // =========================================================

  function updateCount() {
    if (!count || !input) return;

    count.textContent =
      `${input.value.length.toLocaleString()} 文字`;
  }

  // =========================================================
  // 簡易Lua圧縮
  // =========================================================

  function simpleMinifyLua(text) {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .join("\n");
  }

  // =========================================================
  // ファイル名処理
  // =========================================================

  function sanitizeFilename(name) {
    return String(name || "")
      .trim()
      .replace(/\.lua$/i, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
  }

  // =========================================================
  // Raw生成
  // =========================================================

  async function create() {
    if (creating) return;

    let code = input.value;

    // -----------------------------------------
    // 空チェック
    // -----------------------------------------

    if (!code.trim()) {
      showToast("コードを入力してください！");
      input.focus();
      return;
    }

    // -----------------------------------------
    // 簡易圧縮
    // -----------------------------------------

    if (minifyCode.checked) {
      code = simpleMinifyLua(code);
    }

    // -----------------------------------------
    // ファイル名
    // -----------------------------------------

    const name = customNameToggle.checked
      ? (sanitizeFilename(filename.value) || "script")
      : "script";

    // -----------------------------------------
    // UIを生成中にする
    // -----------------------------------------

    creating = true;

    const originalText = createRaw.textContent;

    createRaw.disabled = true;
    createRaw.textContent = "生成中…";

    showToast("Rawリンクを生成しています…");

    try {
      // -----------------------------------------
      // Cloudflare Workerへ送信
      // -----------------------------------------

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          code: code,
          filename: name
        })
      });

      // -----------------------------------------
      // レスポンス解析
      // -----------------------------------------

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "サーバーから正しいレスポンスが返りませんでした。"
        );
      }

      // -----------------------------------------
      // APIエラー
      // -----------------------------------------

      if (!response.ok) {
        throw new Error(
          data?.error ||
          `サーバーエラー (${response.status})`
        );
      }

      // -----------------------------------------
      // URL確認
      // -----------------------------------------

      if (!data.url) {
        throw new Error(
          "Raw URLを取得できませんでした。"
        );
      }

      // -----------------------------------------
      // 結果表示
      // -----------------------------------------

      rawUrl.textContent = data.url;
      openRaw.href = data.url;

      resultSection.classList.remove("is-hidden");
      resultSection.classList.add("is-visible");

      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      showToast("Rawリンクを生成しました！");

    } catch (error) {

      console.error(
        "NN RAW GENERATOR ERROR:",
        error
      );

      showToast(
        error?.message ||
        "生成に失敗しました。"
      );

    } finally {

      creating = false;

      createRaw.disabled = false;
      createRaw.textContent = originalText;
    }
  }

  // =========================================================
  // 入力
  // =========================================================

  input.addEventListener(
    "input",
    updateCount
  );

  // =========================================================
  // Enterで生成
  // Shift + Enterは改行
  // =========================================================

  input.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        create();
      }

    }
  );

  // =========================================================
  // カスタムファイル名
  // =========================================================

  customNameToggle.addEventListener(
    "change",
    () => {

      filenameBox.classList.toggle(
        "is-hidden",
        !customNameToggle.checked
      );

      if (customNameToggle.checked) {
        filename.focus();
      }

    }
  );

  // =========================================================
  // 生成ボタン
  // =========================================================

  createRaw.addEventListener(
    "click",
    create
  );

  // =========================================================
  // URLコピー
  // =========================================================

  copyUrl.addEventListener(
    "click",
    async () => {

      const value = rawUrl.textContent.trim();

      if (!value) {
        showToast("コピーするURLがありません。");
        return;
      }

      try {

        await navigator.clipboard.writeText(value);

        copyUrl.textContent =
          "✓ コピーしました";

        copyUrl.classList.add(
          "is-copied"
        );

        showToast(
          "URLをコピーしました！"
        );

        setTimeout(() => {

          copyUrl.textContent =
            "📋 コピー";

          copyUrl.classList.remove(
            "is-copied"
          );

        }, 1800);

      } catch (error) {

        console.error(error);

        showToast(
          "URLをコピーできませんでした"
        );

      }

    }
  );

  // =========================================================
  // 初期文字数
  // =========================================================

  updateCount();

})();
