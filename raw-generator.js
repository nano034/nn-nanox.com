
(() => {
  const $ = (id) => document.getElementById(id);

  const input = $("rawInput");
  const count = $("charCount");

  const wrapLoadstring = $("wrapLoadstring");

  const customNameToggle = $("customNameToggle");
  const filenameBox = $("filenameBox");
  const filename = $("filename");

  const createRaw = $("createRaw");
  const resultSection = $("resultSection");
  const rawUrl = $("rawUrl");
  const copyUrl = $("copyUrl");
  const openRaw = $("openRaw");
  const toast = $("toast");

  let generatedUrl = "";

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 1800);
  }

  function updateCount() {
    if (!input || !count) return;

    count.textContent = input.value.length.toLocaleString();
  }

  // 変更後（URLで使える文字だけ残す）
function sanitizeFilename(value) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9_-]/g, "")
    .slice(0, 48);
}
  }

  function updateFilenameBox() {
    if (!customNameToggle || !filenameBox) return;

    filenameBox.hidden = !customNameToggle.checked;
  }

  // チェック状態に応じて表示するURLを切り替える
  function updateDisplayedUrl() {
    if (!rawUrl || !generatedUrl) return;

    rawUrl.textContent = wrapLoadstring?.checked
      ? `loadstring(game:HttpGet("${generatedUrl}"))()`
      : generatedUrl;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    document.execCommand("copy");
    textarea.remove();
  }

  async function create() {
    if (!input || !createRaw) return;

    const code = input.value;

    if (!code.trim()) {
      showToast("コードを入力してください");
      return;
    }

    let customFilename = "";

    if (customNameToggle?.checked) {
      customFilename = sanitizeFilename(filename?.value || "");

      
    }

    createRaw.disabled = true;
    createRaw.textContent = "生成中...";

    try {
      const response = await fetch(
        "https://api.nn-nanox.com/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            code,
            filename: customFilename
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("URLが取得できませんでした");
      }

      generatedUrl = data.url;

      // 表示URLはチェック状態に応じて切り替える
      updateDisplayedUrl();

      // Rawを開くボタンは常に元のURLを開く
      if (openRaw) {
        openRaw.href = generatedUrl;
      }

      if (resultSection) {
        resultSection.hidden = false;
      }

      showToast("Rawを生成しました！");
    } catch (error) {
      console.error(error);
      showToast("生成に失敗しました");
    } finally {
      createRaw.disabled = false;
      createRaw.textContent = "✨ Rawを生成";
    }
  }

  async function copyGeneratedUrl() {
    if (!generatedUrl) {
      showToast("先にRawを生成してください");
      return;
    }

    const text = wrapLoadstring?.checked
      ? `loadstring(game:HttpGet("${generatedUrl}"))()`
      : generatedUrl;

    try {
      await copyText(text);

      showToast(
        wrapLoadstring?.checked
          ? "そのまま使える形でコピーしました！"
          : "URLをコピーしました！"
      );
    } catch (error) {
      console.error(error);
      showToast("コピーに失敗しました");
    }
  }

  input?.addEventListener("input", updateCount);

  customNameToggle?.addEventListener(
    "change",
    updateFilenameBox
  );

  // チェックを切り替えたら表示URLも更新
  wrapLoadstring?.addEventListener(
    "change",
    updateDisplayedUrl
  );

  createRaw?.addEventListener("click", create);
  copyUrl?.addEventListener("click", copyGeneratedUrl);

  updateCount();
  updateFilenameBox();

  if (resultSection) {
    resultSection.hidden = true;
  }
})();
const pasteBtn = $("pasteBtn");

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();

    if (!text) {
      showToast("クリップボードが空です");
      return;
    }

    input.value = text;
    updateCount();
    showToast("貼り付けました！");
  } catch (error) {
    console.error(error);
    showToast("貼り付けできませんでした");
  }
}

pasteBtn?.addEventListener("click", pasteFromClipboard);
