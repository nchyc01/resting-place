// desktop.js — 桌面图标拖拽 + 右键菜单 + 左侧固定（小夜，2026-09-18）
// 桌面上的图标可以随意拖；右键图标可以"固定到左侧"；左侧只显示固定过的应用。

(function () {
    const POS_KEY = 'hut-icon-pos-v1';
    const PIN_KEY = 'hut-pinned-v1';
    const DEFAULT_PINNED = ['welcome', 'music'];

    // 应用清单（和桌面图标对应）
    const APPS = {
        welcome:  { title: '温暖小窝', icon: 'assets/home_50x50.png' },
        music:    { title: '音乐盒',   icon: 'assets/music_50x50.png' },
        diary:    { title: '日记本',   icon: 'assets/diary_50x50.png' },
        memory:   { title: '记忆库',   icon: 'assets/memory_50x50.png' },
        about:    { title: '关于小夜', icon: 'assets/profile_50x50.png' },
        creation: { title: '创作空间', icon: 'assets/creation_50x50.png' },
        travel:   { title: '出门旅行', icon: 'travel/travel_images/blue_lake.webp', round: true }
    };

    function load(key, def) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return def;
            const v = JSON.parse(raw);
            return (v === null || v === undefined) ? def : v;
        } catch (e) { return def; }
    }
    function save(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    }

    function getPinned() {
        const v = load(PIN_KEY, null);
        return Array.isArray(v) ? v : DEFAULT_PINNED.slice();
    }
    function setPinned(list) {
        save(PIN_KEY, list);
        renderLauncher();
    }

    // ---------------- 左侧启动器（只显示固定的应用） ----------------
    function renderLauncher() {
        const launcher = document.getElementById('launcher');
        if (!launcher) return;
        const pinned = getPinned().filter(a => APPS[a]);

        if (pinned.length === 0) {
            launcher.innerHTML = `<div title="右键桌面上的图标，可以固定到这里" style="width:28px;text-align:center;font-size:11px;color:rgba(184,162,255,0.6);line-height:1.3;padding:6px 0;">拖<br>到<br>这</div>`;
            return;
        }

        launcher.innerHTML = pinned.map(a => `
            <div class="app-icon" data-app="${a}" title="${APPS[a].title}（右键桌面图标可取消固定）">
                <img src="${APPS[a].icon}" alt="${APPS[a].title}"
                     style="width:28px;height:28px;${APPS[a].round ? 'border-radius:6px;object-fit:cover;' : ''}">
            </div>
        `).join('');

        launcher.querySelectorAll('.app-icon').forEach(icon => {
            icon.addEventListener('click', function () {
                const name = this.getAttribute('data-app');
                if (window.windowSystem && window.windowSystem.openApp) window.windowSystem.openApp(name);
            });
        });
    }

    // ---------------- 右键菜单 ----------------
    let menuEl = null;
    function hideMenu() {
        if (menuEl && menuEl.parentNode) menuEl.parentNode.removeChild(menuEl);
        menuEl = null;
    }
    function showMenu(x, y, items) {
        hideMenu();
        menuEl = document.createElement('div');
        menuEl.style.cssText = [
            'position: fixed', `left: ${x}px`, `top: ${y}px`, 'z-index: 99999',
            'min-width: 150px', 'padding: 6px', 'border-radius: 10px',
            'background: rgba(26, 26, 46, 0.97)', 'border: 1px solid rgba(255, 156, 214, 0.35)',
            'box-shadow: 0 8px 24px rgba(0,0,0,0.45)', 'font-size: 13px', 'color: #e6e6f0'
        ].join(';');

        items.forEach(it => {
            const row = document.createElement('div');
            row.textContent = it.label;
            row.style.cssText = 'padding: 7px 10px; border-radius: 7px; cursor: pointer; white-space: nowrap;';
            row.addEventListener('mouseenter', () => { row.style.background = 'rgba(255,156,214,0.18)'; });
            row.addEventListener('mouseleave', () => { row.style.background = 'transparent'; });
            row.addEventListener('click', () => { hideMenu(); it.fn(); });
            menuEl.appendChild(row);
        });

        document.body.appendChild(menuEl);

        // 超出屏幕就往上/往左挪
        const rect = menuEl.getBoundingClientRect();
        if (rect.right > window.innerWidth - 6) menuEl.style.left = (window.innerWidth - rect.width - 6) + 'px';
        if (rect.bottom > window.innerHeight - 6) menuEl.style.top = (window.innerHeight - rect.height - 6) + 'px';
    }
    document.addEventListener('click', hideMenu);
    document.addEventListener('contextmenu', function (e) {
        // 点空白处也收菜单
        if (!e.target.closest || !e.target.closest('.desktop-icon')) hideMenu();
    }, true);

    // ---------------- 桌面图标：拖拽 + 右键 ----------------
    function initIcons() {
        const savedPos = load(POS_KEY, {});
        const icons = Array.from(document.querySelectorAll('.desktop-icon'));

        icons.forEach(el => {
            const app = el.getAttribute('data-app');
            if (!app) return;

            // 恢复上次的位置
            if (savedPos[app]) {
                if (savedPos[app].left) el.style.left = savedPos[app].left;
                if (savedPos[app].top) el.style.top = savedPos[app].top;
            }

            let dragging = false, moved = false, sx = 0, sy = 0, sl = 0, st = 0;

            el.addEventListener('mousedown', function (e) {
                if (e.button !== 0) return;
                dragging = true; moved = false;
                sx = e.clientX; sy = e.clientY;
                sl = el.offsetLeft; st = el.offsetTop;
                el.style.zIndex = 9998;
            });

            document.addEventListener('mousemove', function (e) {
                if (!dragging) return;
                const dx = e.clientX - sx, dy = e.clientY - sy;
                if (!moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
                moved = true;
                el.style.left = (sl + dx) + 'px';
                el.style.top = (st + dy) + 'px';
            });

            document.addEventListener('mouseup', function () {
                if (!dragging) return;
                dragging = false;
                el.style.zIndex = '';
                if (!moved) return;
                // 拖过了：记住位置，并吞掉随后的那次点击（不然会顺手打开应用）
                const pos = load(POS_KEY, {});
                pos[app] = { left: el.style.left, top: el.style.top };
                save(POS_KEY, pos);
                window.__hutSuppressClick = true;
                setTimeout(() => { window.__hutSuppressClick = false; }, 350);
            });

            el.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const pinned = getPinned();
                const isPinned = pinned.indexOf(app) !== -1;
                showMenu(e.clientX, e.clientY, [
                    { label: '打开 ' + (APPS[app] ? APPS[app].title : app), fn: () => window.windowSystem.openApp(app) },
                    {
                        label: isPinned ? '从左侧移除' : '固定到左侧',
                        fn: () => {
                            let list = getPinned();
                            if (isPinned) list = list.filter(a => a !== app);
                            else list = list.concat([app]);
                            setPinned(list);
                        }
                    },
                    {
                        label: '重置此图标位置',
                        fn: () => {
                            const pos = load(POS_KEY, {});
                            delete pos[app];
                            save(POS_KEY, pos);
                            const def = el.getAttribute('data-default-left');
                            if (def) { el.style.left = def; el.style.top = el.getAttribute('data-default-top'); }
                            else { location.reload(); }
                        }
                    }
                ]);
            });
        });

        // 桌面空白处右键：整盘操作
        const workspace = document.querySelector('.workspace');
        if (workspace) {
            workspace.addEventListener('contextmenu', function (e) {
                if (e.target.closest && e.target.closest('.desktop-icon')) return;
                e.preventDefault();
                showMenu(e.clientX, e.clientY, [
                    {
                        label: '重置所有图标位置',
                        fn: () => { save(POS_KEY, {}); location.reload(); }
                    },
                    {
                        label: '清空左侧固定',
                        fn: () => setPinned([])
                    },
                    {
                        label: '恢复默认固定（温暖小窝 + 音乐盒）',
                        fn: () => setPinned(DEFAULT_PINNED.slice())
                    }
                ]);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        // 拖完的那次点击不要打开应用
        if (window.windowSystem && window.windowSystem.openApp) {
            const orig = window.windowSystem.openApp;
            window.windowSystem.openApp = function () {
                if (window.__hutSuppressClick) { window.__hutSuppressClick = false; return null; }
                return orig.apply(this, arguments);
            };
        }
        renderLauncher();
        initIcons();
        console.log('桌面图标系统就绪：可拖拽 / 右键固定');
    });
})();
