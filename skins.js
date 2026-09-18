// skins.js — 小夜版：换季皮肤 / 壁纸 / 今天卡片（2026-09-18）
// 默认"自动"：白天用春皮肤，晚上七点后自动切到夜皮肤。
// 桌面上右键可以换皮肤、换壁纸。

(function () {
    const SKIN_KEY = 'hut2-skin';
    const WALL_KEY = 'hut2-wall';

    const SKINS = [
        { id: 'auto',   label: '自动（白天春 / 夜里夜）' },
        { id: 'spring', label: '春' },
        { id: 'summer', label: '夏' },
        { id: 'autumn', label: '秋' },
        { id: 'winter', label: '冬' },
        { id: 'night',  label: '夜' }
    ];

    const WALLS = [
        { id: '',        label: '不贴壁纸（用原背景）' },
        { id: 'codelab', label: '代码机房' },
        { id: 'lake',    label: '蓝湖' },
        { id: 'garden',  label: '王后花园' },
        { id: 'shrine',  label: '传火祭祀场' },
        { id: 'peak',    label: '水晶山峰' }
    ];

    const LINES = [
        '今天也把灯留一盏。',
        '慢慢来，屋子不会跑。',
        '今天想听哪首曲子呀？',
        '写下来的东西不会丢。',
        '出去走走也不错。',
        '先吃饭，别的都排在后面。',
        '今天有一件好事就够了。',
        '迷茫先搁着，日子照过。',
        '要是没人说话，就打开音乐盒。',
        '被摸头的时候要安静。'
    ];

    const IMGS = [
        'blue_lake', 'queens_gardens', 'firelink_shrine', 'crystal_peak', 'city_of_tears', 'anor_londo',
        'hearth_hall', 'memory_hall', 'star_terrace', 'hot_spring', 'library', 'the_shire',
        'rivendell', 'sea_of_corpses', 'sunken_city', 'abyss_edge', 'tundra', 'painted_world'
    ];

    function ls(key, def) {
        try { const v = localStorage.getItem(key); return v === null ? def : v; } catch (e) { return def; }
    }
    function lsSet(key, val) {
        try {
            if (val === null || val === undefined || val === '') localStorage.removeItem(key);
            else localStorage.setItem(key, val);
        } catch (e) {}
    }

    function autoSkin() {
        const h = new Date().getHours();
        return (h >= 19 || h < 7) ? 'night' : 'spring';
    }

    function applySkin() {
        const pick = ls(SKIN_KEY, 'auto');
        document.body.setAttribute('data-skin', pick === 'auto' ? autoSkin() : pick);
    }
    function applyWall() {
        const w = ls(WALL_KEY, '');
        if (w) document.body.setAttribute('data-wall', w);
        else document.body.removeAttribute('data-wall');
    }

    function fillToday() {
        const d = new Date();
        const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
        const dateEl = document.getElementById('today-date');
        const lineEl = document.getElementById('today-line');
        const imgEl = document.getElementById('today-img');
        if (dateEl) dateEl.textContent = (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · 周' + week;
        if (lineEl) lineEl.textContent = LINES[Math.floor(Math.random() * LINES.length)];
        if (imgEl) imgEl.src = 'travel/travel_images/' + IMGS[Math.floor(Math.random() * IMGS.length)] + '.webp';
    }

    window.hutSkins = {
        skins: SKINS,
        walls: WALLS,
        getSkin: function () { return ls(SKIN_KEY, 'auto'); },
        getWall: function () { return ls(WALL_KEY, ''); },
        setSkin: function (id) { lsSet(SKIN_KEY, id); applySkin(); },
        setWall: function (id) { lsSet(WALL_KEY, id); applyWall(); },
        refreshToday: fillToday
    };

    document.addEventListener('DOMContentLoaded', function () {
        applySkin();
        applyWall();
        fillToday();
        const card = document.getElementById('today-card');
        if (card) card.addEventListener('click', fillToday); // 点一下换一张
        setInterval(applySkin, 600000); // 每十分钟看一眼要不要昼/夜切换
        console.log('小夜版皮肤层就绪');
    });
})();
