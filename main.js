/* =========================================================
   NN | NaNox サーバー公式サイト — main.js
   ・ボトムナビの現在地ハイライト
   ・スクロールリビール演出
   ・sc.html: プルダウン → スクリプトカード表示 → コピー機能
   ・共通: コピー系ボタン & トースト通知
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initBottomNav();
  initReveal();
  initScriptPage();
  initCopyButtons();
  initDevtoolsLock();   // ← これを追加
});


/* ---------------------------------------------------------
   ボトムナビ: 現在のページに is-active を付与
   --------------------------------------------------------- */
function initBottomNav () {
  const current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-item').forEach((item) => {
    const target = item.getAttribute('data-page');
    if (target === current) {
      item.classList.add('is-active');
      item.setAttribute('aria-current', 'page');
    }
  });
}

/* ---------------------------------------------------------
   スクロールで .reveal 要素をふわっと表示
   --------------------------------------------------------- */
function initReveal () {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------
   sc.html: カテゴリを選ぶとスクリプトカードが出てくる仕組み
   ---------------------------------------------------------
   ★ ここを編集するだけで、プルダウンの表示名・カードの名前・
     コピーされるコードのすべてが変わります。他のファイルは
     一切いじらなくてOKです。

   使い方:
   - SCRIPT_DATA のキー(1〜5)がプルダウンの並び順です。
   - label      … プルダウインに表示される名前
   - cards      … そのカテゴリを選んだときに出てくるカード
     - label    … カードの名前（見出し）
     - code     … 白い枠に表示され、コピーされるコード本体
       （コピー時は自動で "--カードの名前" が1行目に付きます）
   - カードは3枚に固定していません。増やしたり減らしたりも
     自由にできます（配列の中身を足し引きするだけ）。
   --------------------------------------------------------- */
const SCRIPT_DATA = {
  1: {
    label: 'UNIVERSAL',
    cards: [
      { label: 'Infinite Yield', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source"))()' },
      { label: 'Ghost Hub 🔑', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/tienkhanh11/spicy/refs/heads/main/GhostHub.lua"))()' },
      { label: 'Fly Gui V3', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/XNEOFF/FlyGuiV3/main/FlyGuiV3.txt"))()' },
      { label: 'VFly Noclip', code: 'loadstring(game:HttpGet("https://rawscripts.net/raw/Universal-Script-VFly-gui-and-noclip-78112"))()' },
      { label: 'Aim Bot', code: 'loadstring(game:HttpGet("https://rawscripts.net/raw/Universal-Script-Aimbot-Mobile-34677"))()' },
      { label: 'Invisible', code: 'loadstring(game:HttpGet("https://rawscripts.net/raw/Universal-Script-Invisible-script-20557"))()' },
      { label: 'PR HUB (Byぷり)', code: 'loadstring(game:HttpGet("https://pastefy.app/71ug2hy1/raw"))()' },
      { label: 'Cryptic Hub', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/OnlyCryptic/Cryptic/main/main.lua"))()' },
      { label: 'Server hop', code: 'loadstring(game:HttpGet("https://rawscripts.net/raw/Universal-Script-Server-Hop-230445"))()' },
    ],
  },
  2: {
    label: 'TIOLL',
    cards: [
      { label: 'ない', code: 'ないよー' },
    ],
  },
   3: {
    label: 'NN',
    cards: [
      { label: 'NN Hub', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/nano034/nn.github.io/refs/heads/main/script/NN%20Hub.lua"))()' },
      { label: 'Item True', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/nano034/nn.github.io/refs/heads/main/script/NN%20Hub.lua"))()' },
      { label: 'ESP', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/nano034/nn.github.io/refs/heads/main/script/ESP.lua"))()' },
     ],
   },
   4: {
    label: 'Fling Things and People',
    cards: [
      { label: 'Blitz ', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/BlizTBr/scripts/refs/heads/main/FTAP.lua"))()' },
      { label: 'GGOG', code: 'loadstring(game:HttpGet("https://rawscripts.net/raw/Fling-Things-and-People-GGOG-Script-165953"))()' },
      { label: 'alan hub', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Artss1/Flades_Hub/refs/heads/main/We%20Are%20Arts.lua"))()' },
      { label: 'klal hub', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/fratelevostru9999/src/refs/heads/main/VenomX%20Fling%20Things%20And%20People",true))()' },
      { label: 'mega hub', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/RobloxGPT/chatgpt-scripts/refs/heads/main/mega%20hub.lua"))()' },
      { label: 'chosen hub', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/khanh-lol/Ztehub/refs/heads/main/zte"))()' },
      { label: 'Iyan hub', code: 'loadstring(game:HttpGet("https://rawscripts.net/raw/Fling-Things-and-People-FTAP-iyanhu-42050"))()' },
      { label: 'gand lua', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/spacexrandom/Lua/main/FlingThingsAndPeople"))()' },
      { label: 'autoaim', code: 'Ioadstring(game:HttpGet("https://raw.githubusercontent.com/eisyu-tech/aim_bot_MoBA/refs/heads/main/hello.lua"))()' },
      { label: 'poophub', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/ilovepoop0653/PoopHUB/refs/heads/main/IlovePoop"))()' },
      { label: 'krnl reimu', code: 'loadstring(game:HttpGet("https://pastebin.com/raw/gQEWVYaY"))()' },
      { label: 'YAJU HUB', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/kingmagro2525-netizen/yajuhub/main/Qop.Xxc.lua"))()' },
          ],
  },
   5: {
    label: 'Blox Fruits',
    cards: [
      { label: 'redz', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/tlredz/Scripts/refs/heads/main/main.luau"))(Settings)' },
      { label: 'Xle', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/TlDinhKhoi/Xeter/refs/heads/main/Main.lua"))()' },
          ],
  },
   6: {
    label: 'Steal a Brainrot',
    cards: [
{ label: 'Green DT Copy', code: 'loadstring(game:HttpGet("https://x.gd/DTcopyGreenHUB"))()' },
{ label: 'Rubi HUB', code: 'loadstring(game:HttpGet("https://pastebin.com/raw/1mTMiVL8"))()' },
{ label: 'Open Rugger', code: 'loadstring(game:HttpGet("https://gist.githubusercontent.com/totohub-ex/3b5193e9ebcf99ab6460eab9f6dc7852/raw/gistfile1.txt"))()' },       
{ label: 'mvs2', code: 'loadstring(game:HttpGet("https://gist.githubusercontent.com/Zyunnsui/a81efdd72f2befeafbf2d5d4b83268d3/raw/bbeeb1c4b0076901b04c0a0fae4fce5f53e575c0/ok"))()' },
{ label: 'ZL', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/xspeedHub0/Zlhub/main/ZLPVPreview.lua"))()' },
{ label: 'NH', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/ily123950/Vulkan/refs/heads/main/Tr"))()' },
{ label: 'ラグ', code: 'loadstring(game:HttpGet("https://tcscripts.discloud.app/scripts/lagsemaura"))()' },
{ label: 'ラグv8', code: 'loadstring(game:HttpGet("https://files.zvyz.live/scripts/Cracked/TSKSkids/SVD8_Crack.luau"))()' },
{ label: 'オートジョイナー', code: 'loadstring(game:HttpGet("https://pastebin.com/raw/EZTjNyrX"))()' },
{ label: 'SK Duels v1', code: 'loadstring(game:HttpGet("https://sk-konbu.site/SKHub/v1.txt"))()' },
{ label: 'Crack NineHub', code: 'loadstring(game:HttpGet("https://sk-delt4.neocities.org/Crack_ninehub.lol"))()' },
{ label: '22s', code: 'loadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/0fbe1cfb1005a43bbfeb46cd458b7f09.lua"))()' },
{ label: 'LEMON DUELS', code: 'loadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/387a5df3b561f6821c25654316d0e352.lua"))()' },
{ label: 'SK Spawner', code: 'loadstring(game:HttpGet("https://sk-konbu.site/SKHub/free/SPAWNER-MADE-BY-SK"))()' },
{ label: 'Miranda', code: 'loadstring(game:HttpGet("https://pastefy.app/ur5hn7LW/raw",true))()' },
{ label: 'DUEL script', code: 'loadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/54f8b0d7734b505dae326f5b1f44f324.lua"))()' },
{ label: 'Chilli HUB', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/tienkhanh1/spicy/main/Chilli.lua"))()' },
{ label: 'Echo Hub', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/acesolos/Echo/refs/heads/main/hehe"))()' },
{ label: 'Fadhen Hub', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/username/fadhen-stealabrainrot/main/loader.lua", true))()' },
{ label: 'Ugly Hub', code: 'loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/53325754de16c11fbf8bf78101c1c881.lua"))()' },
{ label: 'Trax Spawner', code: 'loadstring(game:HttpGet("https://gitlab.com/traxscriptss/traxscriptss/-/raw/main/visual2.lua"))()' },
{ label: 'Moon HUB', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/KaspikScriptsRb/steal-a-brainrot/refs/heads/main/.lua"))()' },
{ label: 'Ilusión Hub Duels', code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/fdellacortw-svg/Website/refs/heads/main/config1"))()' },
          ],
  },
};
function initScriptPage () {
  const select = document.getElementById('scriptSelect');
  if (!select) return; // sc.html 以外では何もしない

  const selectedTag  = document.getElementById('selectedTag');
  const selectedNum  = document.getElementById('selectedNum');
  const cardsWrap    = document.getElementById('scriptCards');
  const emptyHint    = document.getElementById('emptyHint');

  // プルダウンの選択肢を SCRIPT_DATA から自動で作る
  Object.keys(SCRIPT_DATA).forEach((key) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = SCRIPT_DATA[key].label;
    select.appendChild(opt);
  });

  select.addEventListener('change', () => {
    const value = select.value;
    if (cardsWrap) cardsWrap.innerHTML = ''; // 前の選択肢のカードは一旦クリア

    if (!value) {
      selectedTag && selectedTag.classList.remove('is-show');
      emptyHint && emptyHint.classList.remove('is-hidden');
      return;
    }

    const category = SCRIPT_DATA[value];
    if (!category) return;

    // 選択中タグをトップに表示（=プルダウンは閉じたまま選択内容が分かる）
    if (selectedTag && selectedNum) {
      selectedNum.textContent = category.label;
      selectedTag.classList.add('is-show');
    }

    // カードを1枚ずつ作って、白い枠に code を差し込む
    category.cards.forEach((card) => {
      const copyText = `--${card.label}\n${card.code}`; // Lua用: 1行目コメント→改行→コード

      const el = document.createElement('div');
      el.className = 'script-card is-show';
      el.innerHTML = `
        <div class="script-card__head">
          <span class="script-card__label"></span>
        </div>
        <div class="code-frame">
          <code></code>
        </div>
        <button class="copy-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
          <span class="copy-btn__label">コピー</span>
        </button>
      `;
      el.querySelector('.script-card__label').textContent = card.label;
      el.querySelector('code').textContent = card.code;
      el.querySelector('.copy-btn').dataset.copy = copyText;

      cardsWrap && cardsWrap.appendChild(el);
    });

    emptyHint && emptyHint.classList.add('is-hidden');
  });
}

/* ---------------------------------------------------------
   共通: [data-copy] を持つボタンを押したらクリップボードへコピー
   --------------------------------------------------------- */
function initCopyButtons () {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;

    const card = btn.closest('.script-card');
    const codeText = card?.querySelector('code')?.textContent || '';
    const text = btn.dataset.copy || codeText;
    if (!text) return;

    try {
      await copyToClipboard(text);
      showToast(`「${codeText || text}」をコピーしました！`);
      const label = btn.querySelector('.copy-btn__label');
      btn.classList.add('is-copied');
      if (label) {
        const original = 'コピー';
        label.textContent = 'コピー済み ✓';
        setTimeout(() => {
          label.textContent = original;
          btn.classList.remove('is-copied');
        }, 1600);
      }
    } catch (err) {
      showToast('コピーに失敗しました…');
    }
  });
}

function copyToClipboard (text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // フォールバック（古いブラウザ / http環境）
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(ta);
    }
  });
}

/* ---------------------------------------------------------
   トースト通知
   --------------------------------------------------------- */
let toastTimer = null;
function showToast (message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-show');
  }, 2000);
}
/* ---------------------------------------------------------
   DevTools検知ロック（F12対策）
   --------------------------------------------------------- */
function initDevtoolsLock() {
  const originalHTML = document.body.innerHTML; // 元のページを保存

  setInterval(() => {
    const threshold = 180;
    const w = window.outerWidth - window.innerWidth;
    const h = window.outerHeight - window.innerHeight;

    const devtoolsOpen = w > threshold || h > threshold;

    if (devtoolsOpen) {
      // ロック画面
      document.body.innerHTML = `
        <div style="
          height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          flex-direction:column;
          background:#000;
          color:#fff;
          font-family: 'Zen Maru Gothic', sans-serif;
          text-align:center;
        ">
          <h1 style="font-size:32px; margin-bottom:10px;">DevTools detected</h1>
          <p style="opacity:0.8;">このページでは開発者ツールは使用できません。</p>
        </div>
      `;
    } else {
      // DevToolsを閉じたら元のページに戻す
      if (document.body.innerHTML.includes("DevTools detected")) {
        document.body.innerHTML = originalHTML;
      }
    }
  }, 500);
}
document.addEventListener('keydown', function (e) {
  // F12
  if (e.key === 'F12') {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+I (Windows/Linux) / Cmd+Option+I (Mac)
  if ((e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.metaKey && e.altKey && e.key === 'I')) {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+J (コンソール)
  if ((e.ctrlKey && e.shiftKey && e.key === 'J') ||
      (e.metaKey && e.altKey && e.key === 'J')) {
    e.preventDefault();
    return false;
  }

  // Ctrl+U (ソース表示)
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    return false;
  }

  // Ctrl+S (保存) ※おまけでよく一緒に潰される
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    return false;
  }
}, false);

document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  return false;
}, false);
document.addEventListener('keydown', function (e) {
  const key = (e.key || '').toLowerCase();
  const code = e.keyCode || e.which; // 古いブラウザ向けフォールバック

  // F12 (keyCode: 123)
  if (key === 'f12' || code === 123) {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+I / Cmd+Option+I (keyCode: 73 = 'I')
  if ((e.ctrlKey && e.shiftKey && (key === 'i' || code === 73)) ||
      (e.metaKey && e.altKey && (key === 'i' || code === 73))) {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+J / Cmd+Option+J (keyCode: 74 = 'J')
  if ((e.ctrlKey && e.shiftKey && (key === 'j' || code === 74)) ||
      (e.metaKey && e.altKey && (key === 'j' || code === 74))) {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+C (要素の検証) (keyCode: 67 = 'C')
  if ((e.ctrlKey && e.shiftKey && (key === 'c' || code === 67)) ||
      (e.metaKey && e.altKey && (key === 'c' || code === 67))) {
    e.preventDefault();
    return false;
  }

  // Ctrl+U / Cmd+Option+U (ソース表示) (keyCode: 85 = 'U')
  if ((e.ctrlKey && (key === 'u' || code === 85)) ||
      (e.metaKey && e.altKey && (key === 'u' || code === 85))) {
    e.preventDefault();
    return false;
  }

  // Ctrl+S / Cmd+S (保存) (keyCode: 83 = 'S')
  if ((e.ctrlKey || e.metaKey) && (key === 's' || code === 83)) {
    e.preventDefault();
    return false;
  }
}, false);
