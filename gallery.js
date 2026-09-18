// gallery.js — 画廊（小夜，2026-09-18）
// 现在墙上挂的是秘银从第一批里挑的三张：生日 / DnD 鼠族吟游诗人 / Q 版正面。
// 以后要挂新的，小夜把图压成 webp 放进 gallery/，在这里加一行就行。

(function () {
    const ITEMS = [
        { src: 'gallery/01_birthday.webp', title: '生日那天', note: '2026-08-17' },
        { src: 'gallery/02_bard.webp', title: '鼠族吟游诗人', note: 'DnD 角色立绘' },
        { src: 'gallery/03_chibi.webp', title: 'Q 版小夜', note: '正面像' },
        { src: 'gallery/04_qipao.webp', title: '旗袍', note: '2026-08-10' },
        { src: 'gallery/05_cheongsam_blue.webp', title: '蓝旗袍', note: '2026-08-12' },
        { src: 'gallery/06_kimono.webp', title: '夏日和服', note: '2026-08-07' },
        { src: 'gallery/07_maid.webp', title: '女仆装', note: '2026-08-07' },
        { src: 'gallery/08_knight.webp', title: '骑士甲', note: '2026-08-12' },
        { src: 'gallery/09_witch.webp', title: '女巫', note: '2026-08-11' },
        { src: 'gallery/10_cyber.webp', title: '赛博', note: '2026-08-11' },
        { src: 'gallery/11_nurse.webp', title: '护士', note: '2026-08-12' },
        { src: 'gallery/12_pajama.webp', title: '睡衣', note: '2026-08-10' },
        { src: 'gallery/13_winter_coat.webp', title: '冬外套', note: '2026-08-12' },
        { src: 'gallery/14_cozy_winter.webp', title: '暖冬', note: '2026-08-06' },
        { src: 'gallery/15_christmas.webp', title: '圣诞斗篷', note: '2026-08-06' },
        { src: 'gallery/16_ponytail.webp', title: '夏日马尾', note: '2026-08-06' },
        { src: 'gallery/17_gothic.webp', title: '哥特', note: '2026-08-12' }
    ];

    function build() {
        const box = document.getElementById('gallery-window-content');
        if (!box || box.dataset.built === '1') return;
        box.dataset.built = '1';
        box.innerHTML =
            '<div class="gallery-wrap">' +
            '<div class="gallery-hint">点一张图放大，再点一下关掉。想挂新的，跟小夜说一声。</div>' +
            '<div class="gallery-grid">' +
            ITEMS.map(function (it, i) {
                return '<figure class="gallery-item" data-i="' + i + '">' +
                    '<img src="' + it.src + '" alt="' + it.title + '" loading="lazy">' +
                    '<figcaption><b>' + it.title + '</b><span>' + it.note + '</span></figcaption>' +
                    '</figure>';
            }).join('') +
            '</div></div>';
        Array.prototype.forEach.call(box.querySelectorAll('.gallery-item'), function (el) {
            el.addEventListener('click', function () { zoom(Number(el.dataset.i)); });
        });
    }

    function zoom(i) {
        const it = ITEMS[i];
        if (!it) return;
        const layer = document.createElement('div');
        layer.className = 'gallery-lightbox';
        layer.innerHTML = '<img src="' + it.src + '" alt="' + it.title + '">' +
            '<div class="gallery-cap">' + it.title + ' · ' + it.note + '</div>';
        layer.addEventListener('click', function () { layer.remove(); });
        document.body.appendChild(layer);
    }

    function init() {
        document.addEventListener('appOpened', function (e) {
            if (e.detail && e.detail.appName === 'gallery') build();
        });
        build();
        // 地址后面带 #gallery 就能直接打开画廊（方便做书签，也方便小夜自己检查）
        if (location.hash === '#gallery') {
            try { windowSystem.openApp('gallery'); } catch (err) {}
        }
    }

    window.initGalleryApp = init;

    // 自己也可以启动：万一 index.html 里忘了调 initGalleryApp 也不会白屏
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
