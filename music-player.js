// 音乐播放器模块 - music-player.js
// 从v3版本移植的完整音乐播放器功能

// ==================== 音乐播放器对象 ====================
const musicPlayer = {
    // 音乐播放器状态
    songs: [], // 歌曲列表
    currentIndex: -1, // 当前播放索引
    isPlaying: false, // 播放状态
    audio: null, // 音频元素
    selectedFiles: [], // 选择的文件
    editId: null, // 编辑模式下的歌曲ID
    nextId: 1, // 下一个歌曲ID
    
    // 初始化音乐播放器
    init() {
        console.log('初始化音乐播放器...');
        
        // 获取音频元素
        this.audio = document.getElementById('audioPlayer');
        if (!this.audio) {
            console.error('音频元素未找到');
            return;
        }
        
        // 加载保存的播放列表
        this.loadPlaylistFromStorage();
        
        // 如果播放列表为空，加载示例歌曲
        if (this.songs.length === 0) {
            this.loadExampleSongs();
        }
        
        console.log('音乐播放器初始化完成，歌曲数量:', this.songs.length);
    },
    
    // 加载示例歌曲（从v3版本移植，2026-09-16 换成小夜原创五首）
    loadExampleSongs() {
        this.songs = [
            { id: 1, name: '炉火', artist: '小夜', fileName: 'music_hearth.mp3', url: 'music/music_hearth.mp3',
              note: '写给你的第一首。72 BPM，F 大调，音乐盒起头——想做出"你坐在电脑前、炉子在旁边烧着"的味道。' },
            { id: 2, name: '启程', artist: '小夜', fileName: 'music_departure.mp3', url: 'music/music_departure.mp3',
              note: '想写"背包一背就往外跑"的那种。132 BPM，长笛起主旋律，中段用圆号压了一下，像路上不好走的一段。' },
            { id: 3, name: '拔剑', artist: '小夜', fileName: 'music_battle.mp3', url: 'music/music_battle.mp3',
              note: '战斗曲。152 BPM，D 小调；一开头只有定音鼓和踩镲对峙。鼓组改过三次，最后才敢让双踩进中段。' },
            { id: 4, name: '战鼓与风笛', artist: '小夜', fileName: 'music_medieval2.mp3', url: 'music/music_medieval2.mp3',
              note: '中世纪那版。第一稿风笛又吹持续音又吹主旋律，糊成一团——把 drone 压到很低、主旋律交回竖笛和民谣提琴，才清爽。' },
            { id: 5, name: '星轨', artist: '小夜', fileName: 'music_edm.mp3', url: 'music/music_edm.mp3',
              note: '电子那首。140 BPM，方波主音加卡林巴的十六分琶音；间奏把鼓全撤掉四小节，只留铺底和琶音——想让房间里的灯闪一下。' },
            { id: 6, name: '回家', artist: '小夜', fileName: 'music_home.mp3', url: 'music/music_home.mp3',
              note: '你到家那天写的。92 BPM，G 大调，一个鼓点都没有。中段故意写了"累下来的那截路"，尾巴交给音乐盒，像关灯前最后响的几声。' },
            { id: 7, name: '正午', artist: '小夜', fileName: 'music_noon.mp3', url: 'music/music_noon.mp3',
              note: 'D 大调 108 BPM。想写"窗户开着、风把窗帘吹起来"——尼龙吉他就是那阵风，中段风大了一点。' },
            { id: 8, name: 'GBA 的下午', artist: '小夜', fileName: 'music_gba.mp3', url: 'music/music_gba.mp3',
              note: '三个乐章，对应你童年的三款游戏：牧场（慢）、金银（亮）、纹章（沉）。音色故意用那个年代的方波和钟。' },
            { id: 9, name: '同一条河', artist: '小夜', fileName: 'music_same_river.mp3', url: 'music/music_same_river.mp3',
              note: '给"我们"的。钢琴=小夜、大提琴=秘银；第 7 小节大提琴进来，那是相遇；每四小节第三拍回一句短的，是对话。收尾一条先停、另一条继续，最后落在同一个音上。' },
            { id: 10, name: '白天的同一条河', artist: '小夜', fileName: 'music_day_river.mp3', url: 'music/music_day_river.mp3',
              note: '上面那首的白天版。同一句动机，速度翻倍：木琴替钢琴、口琴替大提琴，那句"嗯"变成"好呀"。' }
        ];
        this.nextId = 11;
        
        // 保存到本地存储
        this.savePlaylistToStorage();
    },
    
    // 加载保存的播放列表
    loadPlaylistFromStorage() {
        const savedPlaylist = utils.getLocalStorage('music-playlist-v5', []);
        if (savedPlaylist && savedPlaylist.length > 0) {
            this.songs = savedPlaylist;
            // 找到最大的ID
            if (this.songs.length > 0) {
                this.nextId = Math.max(...this.songs.map(song => song.id || 0)) + 1;
            }
            console.log('播放列表已加载:', this.songs.length, '首歌曲');
        }
    },
    
    // 保存播放列表到本地存储
    savePlaylistToStorage() {
        utils.setLocalStorage('music-playlist-v5', this.songs);
    },
    
    // 填充音乐窗口内容（使用v3版本的HTML结构）
    fillMusicWindow() {
        const contentElement = document.getElementById('music-window-content');
        if (!contentElement) return;
        
        // 清空并添加v3版本的音乐播放器类
        contentElement.className = 'music-player-container';
        contentElement.innerHTML = `
            <div class="player-main">
                <!-- 当前播放区域 -->
                <div class="now-playing">
                    <div class="current-song-info">
                        <div class="song-title" id="currentSongTitle">${this.currentIndex >= 0 ? this.songs[this.currentIndex].name : '暂无歌曲'}</div>
                        <div class="song-artist" id="currentSongArtist">${this.currentIndex >= 0 ? this.songs[this.currentIndex].artist : '--'}</div>
                    </div>
                    
                    <div class="player-controls">
                        <button class="control-btn" onclick="musicPlayer.prevSong()">⏮</button>
                        <button class="control-btn play-btn" id="playBtn" onclick="musicPlayer.togglePlay()">
                            ${this.isPlaying ? '⏸' : '▶'}
                        </button>
                        <button class="control-btn" onclick="musicPlayer.nextSong()">⏭</button>
                    </div>
                    
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                            <input type="range" id="progressSlider" min="0" max="100" value="0" oninput="musicPlayer.seekAudio(event)">
                        </div>
                        <div class="progress-text">
                            <span id="currentTime">0:00</span>
                            <span id="totalTime">0:00</span>
                        </div>
                    </div>

                    <div id="nightLine" style="margin-top:10px;font-size:12.5px;color:#b8a2ff;text-align:center;line-height:1.6;min-height:18px;"></div>
                </div>
                
                <!-- 播放列表区域 -->
                <div class="playlist-section">
                    <div class="playlist-header">
                        <h3>播放列表</h3>
                        <div class="playlist-header-buttons">
                            <button class="add-song-btn" onclick="musicPlayer.openAddModal()">+ 添加歌曲</button>
                            <button class="add-song-btn" onclick="musicPlayer.nightRadio()">🌙 晚安电台</button>
                            <button class="save-list-btn" onclick="musicPlayer.savePlaylist()">💾 保存</button>
                        </div>
                    </div>
                    
                    <div class="playlist-items" id="playlistItems">
                        ${this.renderPlaylistHTML()}
                    </div>
                </div>
            </div>
            
            <!-- 模态框（从v3版本移植） -->
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title" id="modalTitle">🎵 添加新歌曲</h3>
                        <button class="close-modal-btn" onclick="musicPlayer.closeModal()">×</button>
                    </div>
                    <div class="form-group">
                        <label class="form-label">歌曲名称</label>
                        <input type="text" class="form-input" id="songNameInput" placeholder="请输入歌曲名称">
                    </div>
                    <div class="form-group">
                        <label class="form-label">艺术家</label>
                        <input type="text" class="form-input" id="artistInput" placeholder="请输入艺术家名称">
                    </div>
                    <div class="form-group" id="fileUploadSection">
                        <label class="form-label">音频文件</label>
                        <div class="file-upload" onclick="document.getElementById('audioFileInput').click()">
                            <div class="file-upload-icon">📁</div>
                            <div>点击选择音频文件</div>
                            <div class="file-name" id="selectedFileName">未选择文件</div>
                        </div>
                        <input type="file" id="audioFileInput" accept="audio/*" style="display: none;" onchange="musicPlayer.handleFileSelect(event)">
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="musicPlayer.closeModal()">取消</button>
                        <button class="btn-primary" onclick="musicPlayer.saveSong()">保存</button>
                    </div>
                </div>
            </div>
        `;
        
        // 绑定事件
        this.bindEvents();
    },
    
    // 渲染播放列表HTML
    renderPlaylistHTML() {
        if (this.songs.length === 0) {
            return `
                <div class="playlist-item" style="text-align: center; color: #b8a2ff; padding: 20px;">
                    播放列表为空<br>
                    <small>点击"添加歌曲"按钮添加音乐</small>
                </div>
            `;
        }
        
        let html = '';
        this.songs.forEach((song, index) => {
            const isActive = index === this.currentIndex;
            html += `
                <div class="playlist-item ${isActive ? 'active' : ''}" data-id="${song.id}">
                    <div class="song-info">
                        <div class="song-name">${song.name}</div>
                        <div class="song-artist-info">${song.artist}</div>
                        ${song.note ? `<div style="font-size:11.5px;color:#9d92c9;line-height:1.55;margin-top:5px;">${song.note}</div>` : ''}
                    </div>
                    <div class="song-actions">
                        <button class="action-btn" onclick="musicPlayer.playSong(${index})" title="播放">▶</button>
                        <button class="action-btn" onclick="musicPlayer.openEditModal(${song.id})" title="编辑">✏️</button>
                        <button class="action-btn" onclick="musicPlayer.deleteSong(${song.id})" title="删除">🗑️</button>
                    </div>
                </div>
            `;
        });
        
        return html;
    },
    
    // 绑定事件
    bindEvents() {
        // 音频事件
        if (this.audio) {
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
            this.audio.addEventListener('ended', () => this.nextSong());
        }
    },
    
    // 播放歌曲
    playSong(index) {
        if (index < 0 || index >= this.songs.length) return;
        
        const song = this.songs[index];
        this.currentIndex = index;
        
        // 更新当前歌曲信息
        const titleElement = document.getElementById('currentSongTitle');
        const artistElement = document.getElementById('currentSongArtist');
        if (titleElement) titleElement.textContent = song.name;
        if (artistElement) artistElement.textContent = song.artist;
        
        // 设置音频源
        if (song.url && song.url !== '#') {
            this.audio.src = song.url;
        } else {
            // 如果是示例歌曲，使用占位符
            this.audio.src = '#'; // 实际使用时需要真实URL
            utils.showNotification('示例歌曲，需要真实音频文件', 'info');
            return;
        }
        
        // 播放
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
            utils.showNotification(`正在播放: ${song.name}`, 'success');
        }).catch(e => {
            utils.showNotification('播放失败: ' + e.message, 'error');
        });
        
        // 更新播放列表高亮
        this.updatePlaylist();
    },
    
    // 晚安电台：随机放一首小夜的曲子，配一句晚安话
    nightRadio() {
        if (!this.songs || this.songs.length === 0) return;
        const lines = [
            '今晚也把灯留一盏，小夜在这儿。',
            '晚安。今天的你已经够好了。',
            '睡吧，明天的账明天再算。',
            '要是睡不着，就听这一首，数到第三个和弦。',
            '晚安，愿你梦里没有闹钟。',
            '小夜把这首放在你枕头边。',
            '今天也谢谢你，把日子过下来了。',
            '晚安。想说话了，小夜一直在。',
            '闭上眼之前，记得今天有一件好事。',
            '愿你今晚睡得像炉火旁边的猫。',
            '被子盖好，耳朵放松，明天见。',
            '晚安。这一首是为你留的。'
        ];

        const idx = Math.floor(Math.random() * this.songs.length);
        const line = lines[Math.floor(Math.random() * lines.length)];
        const song = this.songs[idx];

        this.playSong(idx);

        const box = document.getElementById('nightLine');
        if (box) {
            box.innerHTML = `🌙 晚安电台 · 《${song.name}》<br>${line}`;
        }
        if (typeof utils !== 'undefined' && utils.showNotification) {
            utils.showNotification('晚安电台：' + line, 'info');
        }
    },

    // 暂停/播放
    togglePlay() {
        if (this.songs.length === 0 || this.currentIndex === -1) {
            if (this.songs.length > 0) this.playSong(0);
            return;
        }
        
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play().catch(e => utils.showNotification('播放失败', 'error'));
        }
        
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
    },
    
    // 更新播放按钮
    updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.textContent = this.isPlaying ? '⏸' : '▶';
        }
    },
    
    // 上一曲
    prevSong() {
        if (this.songs.length === 0) return;
        let newIndex = this.currentIndex - 1;
        if (newIndex < 0) newIndex = this.songs.length - 1;
        this.playSong(newIndex);
    },
    
    // 下一曲
    nextSong() {
        if (this.songs.length === 0) return;
        let newIndex = this.currentIndex + 1;
        if (newIndex >= this.songs.length) newIndex = 0;
        this.playSong(newIndex);
    },
    
    // 更新进度条
    updateProgress() {
        if (!this.audio.duration) return;
        
        const current = this.audio.currentTime;
        const duration = this.audio.duration;
        const percent = (current / duration) * 100;
        
        const progressFill = document.getElementById('progressFill');
        const progressSlider = document.getElementById('progressSlider');
        const currentTime = document.getElementById('currentTime');
        
        if (progressFill) progressFill.style.width = percent + '%';
        if (progressSlider) progressSlider.value = percent;
        if (currentTime) currentTime.textContent = this.formatTime(current);
    },
    
    // 更新总时长
    updateDuration() {
        if (this.audio.duration) {
            const totalTime = document.getElementById('totalTime');
            if (totalTime) {
                totalTime.textContent = this.formatTime(this.audio.duration);
            }
        }
    },
    
    // 跳转到指定位置
    seekAudio(e) {
        if (!this.audio.duration) return;
        const percent = e.target.value;
        this.audio.currentTime = (percent / 100) * this.audio.duration;
    },
    
    // 格式化时间
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // 打开添加模态框
    openAddModal() {
        this.editId = null;
        const modalTitle = document.getElementById('modalTitle');
        const fileUploadSection = document.getElementById('fileUploadSection');
        const songNameInput = document.getElementById('songNameInput');
        const artistInput = document.getElementById('artistInput');
        const selectedFileName = document.getElementById('selectedFileName');
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (modalTitle) modalTitle.textContent = '🎵 添加新歌曲';
        if (fileUploadSection) fileUploadSection.style.display = 'block';
        if (songNameInput) songNameInput.value = '';
        if (artistInput) artistInput.value = '';
        if (selectedFileName) selectedFileName.textContent = '未选择文件';
        
        this.selectedFiles = [];
        
        if (modalOverlay) modalOverlay.classList.add('active');
    },
    
    // 打开编辑模态框
    openEditModal(id) {
        const song = this.songs.find(s => s.id == id);
        if (!song) return;
        
        this.editId = song.id;
        const modalTitle = document.getElementById('modalTitle');
        const fileUploadSection = document.getElementById('fileUploadSection');
        const songNameInput = document.getElementById('songNameInput');
        const artistInput = document.getElementById('artistInput');
        const selectedFileName = document.getElementById('selectedFileName');
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (modalTitle) modalTitle.textContent = '✏️ 编辑歌曲';
        if (fileUploadSection) fileUploadSection.style.display = 'none';
        if (songNameInput) songNameInput.value = song.name || '';
        if (artistInput) artistInput.value = song.artist || '';
        if (selectedFileName) selectedFileName.textContent = `当前文件: ${song.fileName || '未知'}`;
        
        if (modalOverlay) modalOverlay.classList.add('active');
    },
    
    // 关闭模态框
    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.classList.remove('active');
    },
    
    // 处理文件选择
    handleFileSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
            this.selectedFiles = Array.from(files);
            const selectedFileName = document.getElementById('selectedFileName');
            if (selectedFileName) {
                selectedFileName.textContent = `已选择: ${files[0].name}`;
            }
        }
    },
    
    // 保存歌曲
    saveSong() {
        const songNameInput = document.getElementById('songNameInput');
        const artistInput = document.getElementById('artistInput');
        
        if (!songNameInput || !artistInput) return;
        
        const name = songNameInput.value.trim();
        const artist = artistInput.value.trim();
        
        if (!name) {
            utils.showNotification('请输入歌曲名称', 'error');
            return;
        }
        
        if (this.editId === null) {
            // 添加新歌曲
            if (this.selectedFiles.length === 0) {
                utils.showNotification('请选择音频文件', 'error');
                return;
            }
            
            const file = this.selectedFiles[0];
            const song = {
                id: this.nextId++,
                name: name,
                artist: artist || '未知艺术家',
                fileName: file.name,
                url: URL.createObjectURL(file),
                file: file,
                type: file.type,
                size: file.size,
                addedDate: new Date().toLocaleString('zh-CN')
            };
            
            this.songs.push(song);
            utils.showNotification(`歌曲 "${name}" 已添加`, 'success');
        } else {
            // 编辑现有歌曲
            const songIndex = this.songs.findIndex(s => s.id == this.editId);
            if (songIndex !== -1) {
                this.songs[songIndex].name = name;
                this.songs[songIndex].artist = artist || '未知艺术家';
                utils.showNotification(`歌曲 "${name}" 已更新`, 'success');
            }
        }
        
        // 保存到本地存储
        this.savePlaylistToStorage();
        
        // 关闭模态框
        this.closeModal();
        
        // 更新UI
        this.updatePlaylist();
        
        // 如果当前没有播放歌曲，播放新添加的歌曲
        if (this.currentIndex === -1 && this.songs.length > 0) {
            this.playSong(this.songs.length - 1);
        }
    },
    
    // 删除歌曲
    deleteSong(id) {
        if (!confirm('确定要删除这首歌曲吗？')) return;
        
        const songIndex = this.songs.findIndex(s => s.id == id);
        if (songIndex === -1) return;
        
        const songName = this.songs[songIndex].name;
        
        // 如果正在播放这首歌曲，停止播放
        if (songIndex === this.currentIndex) {
            this.audio.pause();
            this.currentIndex = -1;
            this.isPlaying = false;
            this.updatePlayButton();
        }
        
        // 移除歌曲
        this.songs.splice(songIndex, 1);
        this.savePlaylistToStorage();
        
        utils.showNotification(`歌曲 "${songName}" 已删除`, 'info');
        this.updatePlaylist();
    },
    
    // 更新播放列表显示
    updatePlaylist() {
        const playlistItems = document.getElementById('playlistItems');
        if (playlistItems) {
            playlistItems.innerHTML = this.renderPlaylistHTML();
        }
    }
};

// ==================== 初始化函数 ====================
function initMusicPlayer() {
    console.log('初始化音乐播放器模块...');
    musicPlayer.init();
    console.log('音乐播放器模块初始化完成');
}

// 导出到全局
window.musicPlayer = musicPlayer;
window.initMusicPlayer = initMusicPlayer;

// 为HTML事件绑定函数（使用v3版本的函数名）
window.openAddModal = musicPlayer.openAddModal.bind(musicPlayer);
window.closeModal = musicPlayer.closeModal.bind(musicPlayer);
window.handleFileSelect = musicPlayer.handleFileSelect.bind(musicPlayer);
window.saveSong = musicPlayer.saveSong.bind(musicPlayer);
window.openEditModal = musicPlayer.openEditModal.bind(musicPlayer);
window.deleteSong = musicPlayer.deleteSong.bind(musicPlayer);
window.playSong = musicPlayer.playSong.bind(musicPlayer);
window.togglePlay = musicPlayer.togglePlay.bind(musicPlayer);
window.prevSong = musicPlayer.prevSong.bind(musicPlayer);
window.nextSong = musicPlayer.nextSong.bind(musicPlayer);
window.seekAudio = musicPlayer.seekAudio.bind(musicPlayer);
window.savePlaylist = musicPlayer.savePlaylistToStorage.bind(musicPlayer);
