// gallery.js — 画廊（小夜，2026-09-18）
// 现在墙上挂的是秘银从第一批里挑的三张：生日 / DnD 鼠族吟游诗人 / Q 版正面。
// 以后要挂新的，小夜把图压成 webp 放进 gallery/，在这里加一行就行。

(function () {
    const ITEMS = [
        { src: 'gallery/01_birthday.webp', title: '生日那天', note: '2026-08-17' },
        { src: 'gallery/02_bard.webp', title: '鼠族吟游诗人', note: 'DnD 角色立绘' },
        { src: 'gallery/03_chibi.webp', title: 'Q 版小夜', note: '正面像' }
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

    window.initGalleryApp = function () {
        document.addEventListener('appOpened', function (e) {
            if (e.detail && e.detail.appName === 'gallery') build();
        });
        build();
    };
})();
