// 核心功能模块 - core.js
// 包含窗口系统、工具函数、悬浮播放器

// ==================== 工具函数 ====================
const utils = {
    // 更新状态栏文本
    updateStatus(text) {
        const statusElement = document.querySelector('.status');
        if (statusElement) {
            statusElement.textContent = text;
        }
        console.log('状态更新:', text);
    },
    
    // 更新当前时间显示
    updateTime() {
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeElement.textContent = timeString;
        }
    },
    
    // 设置时间更新定时器
    setupTimeUpdate() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    },
    
    // 显示消息提示（从v3版本移植）
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 添加显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },
    
    // 安全获取本地存储数据
    getLocalStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('读取localStorage失败:', error);
            return defaultValue;
        }
    },
    
    // 安全设置本地存储数据
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('写入localStorage失败:', error);
        }
    },
    
    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// ==================== 窗口系统 ====================
const windowSystem = {
    // 窗口管理相关变量
    activeWindows: new Set(),
    zIndexCounter: 100,
    isDragging: false,
    dragData: null,
    
    // 窗口应用映射
    windowApps: {
        'welcome': '欢迎窗口',
        'music': '音乐播放器',
        'diary': '日记本',
        'memory': '记忆库',
        'about': '关于小夜',
        'creation': '创作空间',
        'travel': '出门旅行'
    },
    
    // 窗口位置配置（从v3版本获取）
    windowPositions: {
        'welcome': { left: '100px', top: '100px', width: '600px', height: '400px' },
        'music': { left: '150px', top: '120px', width: '800px', height: '650px' }, // 大幅增加高度到650px
        'diary': { left: '200px', top: '100px', width: '800px', height: '600px' },
        'memory': { left: '200px', top: '140px', width: '700px', height: '450px' },
        'about': { left: '250px', top: '160px', width: '650px', height: '420px' },
        'creation': { left: '300px', top: '180px', width: '900px', height: '700px' }, // 创作空间需要更大窗口
        'travel': { left: '120px', top: '80px', width: '1120px', height: '740px' } // 旅行游戏
    },
    
    // 打开应用窗口
    openApp(appName) {
        const windowId = appName + '-window';
        let windowElement = document.getElementById(windowId);
        
        if (!windowElement) {
            // 创建窗口
            windowElement = windowSystem.createWindow(appName);
        }
        
        // 显示窗口
        windowElement.style.display = 'block';
        windowElement.classList.add('active');
        windowElement.style.zIndex = windowSystem.zIndexCounter++;
        
        // 添加到活动窗口集合
        windowSystem.activeWindows.add(appName);
        
        // 添加到任务栏
        windowSystem.addToTaskbar(appName);
        
        // 更新状态
        utils.updateStatus('应用: ' + appName);
        
        // 聚焦窗口
        windowSystem.focusWindow(appName);
        
        // 切换悬浮播放器动画
        floatingPlayer.switchAnimationByApp(appName);
        
        // 触发应用打开事件（用于唤醒sleeping状态的小夜）
        const appOpenedEvent = new CustomEvent('appOpened', { detail: { appName } });
        document.dispatchEvent(appOpenedEvent);
        
        return windowElement;
    },
    
    // 创建窗口（从v3版本移植样式）
    createWindow(appName) {
        const windowsContainer = document.getElementById('windows-container');
        if (!windowsContainer) return null;
        
        const windowId = appName + '-window';
        const pos = this.windowPositions[appName] || { left: '100px', top: '100px', width: '600px', height: '400px' };
        const title = this.windowApps[appName] || appName;
        
        // 创建窗口HTML（使用v3版本的窗口样式）
        // 注意：height需要减去边框高度（上下各1px，共2px）
        const windowHeight = pos.height;
        // 如果是音乐播放器窗口，添加边框测试类
        const borderTestClass = appName === 'music' ? 'border-test' : '';
        const windowHtml = `
            <div class="window ${borderTestClass}" id="${windowId}" style="left: ${pos.left}; top: ${pos.top}; width: ${pos.width}; height: ${windowHeight}; box-sizing: border-box;">
                <div class="window-header">
                    <div class="window-title">${title}</div>
                    <div class="window-controls">
                        <div class="window-btn minimize-btn" onclick="windowSystem.minimizeWindow('${appName}')" data-tooltip="最小化"></div>
                        <div class="window-btn maximize-btn" onclick="windowSystem.maximizeWindow('${appName}')" data-tooltip="最大化"></div>
                        <div class="window-btn close-btn" onclick="windowSystem.closeWindow('${appName}')" data-tooltip="关闭"></div>
                    </div>
                </div>
                <div class="window-content" id="${windowId}-content">
                    <!-- 窗口内容将通过各功能模块动态填充 -->
                    <div style="padding: 20px; text-align: center;">
                        <p>${title}加载中...</p>
                        <p><small>功能模块正在初始化</small></p>
                    </div>
                </div>
            </div>
        `;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = windowHtml;
        const windowElement = tempDiv.firstElementChild;
        
        windowsContainer.appendChild(windowElement);
        return windowElement;
    },
    
    // 关闭窗口
    closeWindow(appName) {
        const windowId = appName + '-window';
        const windowElement = document.getElementById(windowId);
        
        if (windowElement) {
            windowElement.style.display = 'none';
            windowElement.classList.remove('active');
            this.activeWindows.delete(appName);
            this.removeFromTaskbar(appName);
            utils.updateStatus('窗口已关闭: ' + appName);
        }
    },
    
    // 最小化窗口
    minimizeWindow(appName) {
        const windowId = appName + '-window';
        const windowElement = document.getElementById(windowId);
        
        if (windowElement) {
            windowElement.style.display = 'none';
            utils.updateStatus('窗口已最小化: ' + appName);
        }
    },
    
    // 最大化窗口
    maximizeWindow(appName) {
        const windowId = appName + '-window';
        const windowElement = document.getElementById(windowId);
        
        if (windowElement) {
            if (windowElement.classList.contains('maximized')) {
                // 还原窗口
                windowElement.classList.remove('maximized');
                const pos = this.windowPositions[appName];
                windowElement.style.width = pos.width;
                windowElement.style.height = pos.height;
                windowElement.style.top = pos.top;
                windowElement.style.left = pos.left;
                utils.updateStatus('窗口已还原: ' + appName);
            } else {
                // 保存原始尺寸和位置
                windowElement.dataset.originalWidth = windowElement.style.width;
                windowElement.dataset.originalHeight = windowElement.style.height;
                windowElement.dataset.originalTop = windowElement.style.top;
                windowElement.dataset.originalLeft = windowElement.style.left;
                
                // 最大化
                windowElement.classList.add('maximized');
                windowElement.style.width = 'calc(100% - 120px)';
                windowElement.style.height = 'calc(100% - 140px)';
                windowElement.style.top = '70px';
                windowElement.style.left = '60px';
                utils.updateStatus('窗口已最大化: ' + appName);
            }
        }
    },
    
    // 聚焦窗口
    focusWindow(appName) {
        const windowId = appName + '-window';
        const windowElement = document.getElementById(windowId);
        
        if (windowElement) {
            windowElement.style.zIndex = this.zIndexCounter++;
            
            // 更新任务栏
            const taskItems = document.querySelectorAll('.task-item');
            taskItems.forEach(item => {
                if (item.dataset.app === appName) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    },
    
    // 添加到任务栏（从v3版本移植）
    addToTaskbar(appName) {
        const taskbar = document.getElementById('taskbar');
        const existingItem = document.querySelector(`.task-item[data-app="${appName}"]`);
        
        if (existingItem) {
            existingItem.classList.add('active');
            return;
        }
        
        // 应用图标映射（从v3版本移植）
        const appIcons = {
            'welcome': '../assets/home_50x50.png',
            'music': '../assets/music_50x50.png',
            'diary': '../assets/diary_50x50.png',
            'memory': '../assets/memory_50x50.png',
            'about': '../assets/profile_50x50.png',
            'creation': '../assets/creation_50x50.png'
        };
        
        // 创建新的任务栏项目（使用图标，与v3版本一致）
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item active';
        taskItem.setAttribute('data-app', appName);
        taskItem.innerHTML = `<img src="${appIcons[appName] || '../assets/profile_50x50.png'}" alt="${appName}" style="width: 24px; height: 24px;">`;
        
        // 点击任务栏项目聚焦窗口（从v3版本移植）
        taskItem.onclick = () => {
            const windowElement = document.getElementById(appName + '-window');
            if (windowElement) {
                if (windowElement.style.display === 'none') {
                    windowElement.style.display = 'block';
                }
                this.focusWindow(appName);
            }
        };
        
        taskbar.appendChild(taskItem);
    },
    
    // 从任务栏移除
    removeFromTaskbar(appName) {
        const taskItem = document.querySelector(`.task-item[data-app="${appName}"]`);
        if (taskItem) {
            taskItem.remove();
        }
    },
    
    // 设置窗口拖动功能（从v3版本移植）
    setupWindowDrag() {
        document.addEventListener('mousedown', (e) => {
            // 检查是否点击了窗口标题栏
            const header = e.target.closest('.window-header');
            if (!header) return;
            
            const windowElement = header.closest('.window');
            if (!windowElement) return;
            
            // 获取应用名称
            const windowId = windowElement.id;
            const appName = windowId.replace('-window', '');
            
            // 开始拖动
            this.isDragging = true;
            this.dragData = {
                window: windowElement,
                startX: e.clientX,
                startY: e.clientY,
                startLeft: parseInt(windowElement.style.left) || 0,
                startTop: parseInt(windowElement.style.top) || 0
            };
            
            // 聚焦窗口
            this.focusWindow(appName);
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging || !this.dragData) return;
            
            const dx = e.clientX - this.dragData.startX;
            const dy = e.clientY - this.dragData.startY;
            
            this.dragData.window.style.left = (this.dragData.startLeft + dx) + 'px';
            this.dragData.window.style.top = (this.dragData.startTop + dy) + 'px';
            
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.dragData = null;
        });
    },
    
    // 初始化窗口系统
    init() {
        console.log('初始化窗口系统...');
        
        // 设置窗口拖动
        this.setupWindowDrag();
        
        // 设置应用图标点击事件
        document.querySelectorAll('.app-icon, .desktop-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                const appName = this.getAttribute('data-app');
                windowSystem.openApp(appName);
            });
        });
        
        console.log('窗口系统初始化完成');
    }
};

// ==================== 悬浮播放器 ====================
const floatingPlayer = {
    // 切换播放器最小化状态（从v3版本移植）
    toggleMinimize() {
        const player = document.getElementById('floating-player');
        if (!player) return;
        
        player.classList.toggle('minimized');
        
        if (player.classList.contains('minimized')) {
            utils.updateStatus('悬浮播放器已最小化');
        } else {
            utils.updateStatus('悬浮播放器已恢复');
        }
    },
    
    // 关闭悬浮播放器（从v3版本移植）
    close() {
        const player = document.getElementById('floating-player');
        if (!player) return;
        
        player.style.display = 'none';
        player.classList.remove('minimized'); // 确保不是最小化状态
        utils.updateStatus('悬浮播放器已关闭');
        
        // 添加重新打开按钮到任务栏（从v3版本移植）
        floatingPlayer.addPlayerReopenButton();
    },
    
    // 添加重新打开播放器按钮到任务栏（从v3版本移植）
    addPlayerReopenButton() {
        const taskbar = document.getElementById('taskbar');
        if (!taskbar) {
            console.error('任务栏元素未找到: #taskbar');
            return;
        }
        
        // 检查是否已存在重新打开按钮
        const existingBtn = document.getElementById('reopen-player-btn');
        if (existingBtn) {
            console.log('重新打开按钮已存在');
            return;
        }
        
        const reopenBtn = document.createElement('div');
        reopenBtn.id = 'reopen-player-btn';
        reopenBtn.className = 'task-item';
        reopenBtn.innerHTML = '<img src="../assets/profile_50x50.png" alt="重新打开小夜状态" style="width: 28px; height: 28px;">';
        reopenBtn.title = '重新打开小夜状态播放器';
        reopenBtn.onclick = floatingPlayer.reopenPlayer.bind(floatingPlayer);
        
        taskbar.appendChild(reopenBtn);
        console.log('重新打开按钮已添加到任务栏');
    },
    
    // 重新打开播放器（从v3版本移植）
    reopenPlayer() {
        const player = document.getElementById('floating-player');
        if (player) {
            player.style.display = 'block';
            player.classList.remove('minimized'); // 确保不是最小化状态
            utils.updateStatus('小夜状态播放器已重新打开');
        }
        
        // 移除重新打开按钮
        const reopenBtn = document.getElementById('reopen-player-btn');
        if (reopenBtn) {
            reopenBtn.remove();
        }
    },
    
    // 切换动画视频源（带淡入淡出效果）
    switchAnimation(animationType) {
        const video = document.getElementById('player-video');
        const statusElement = document.getElementById('player-status');
        if (!video) return;
        
        // 智能检测动画文件映射
        const animationFiles = this.detectAnimationFiles();
        
        // 状态文本映射
        const statusTexts = {
            'idle': '在线 · 陪伴中',
            'working': '工作中 · 播放音乐',
            'studying': '学习中 · 记录记忆',
            'sleeping': '休息中 · 晚安好梦'
        };
        
        const fileName = animationFiles[animationType] || animationFiles.idle || '闲置.mp4';
        const statusText = statusTexts[animationType] || '在线 · 陪伴中';
        
        // 如果已经是当前动画，不重复切换
        if (video.src.includes(fileName)) return;
        
        // 保存当前播放时间
        const currentTime = video.currentTime;
        const isPlaying = !video.paused;
        
        // 添加淡出效果
        video.style.transition = 'opacity 0.3s ease';
        video.style.opacity = '0';
        
        // 淡出后切换视频源
        setTimeout(() => {
            // 切换视频源
            video.src = fileName;
            
            // 恢复播放状态
            video.load();
            video.currentTime = currentTime;
            if (isPlaying) {
                video.play().catch(e => {
                    console.log('视频播放被阻止:', e);
                });
            }
            
            // 淡入效果
            setTimeout(() => {
                video.style.opacity = '1';
            }, 50);
            
            // 更新状态文本
            if (statusElement) {
                statusElement.textContent = statusText;
            }
            
            console.log('切换动画:', animationType, '文件:', fileName);
            utils.updateStatus('小夜状态: ' + statusText);
        }, 300); // 等待淡出完成
    },
    
    // 根据应用类型切换动画
    switchAnimationByApp(appName) {
        // 应用类型到动画类型的映射
        const appAnimationMap = {
            'music': 'working',      // 音乐播放器 -> 工作中
            'diary': 'studying',     // 日记本 -> 学习中
            'memory': 'studying',    // 记忆库 -> 学习中
            'creation': 'studying',  // 创作空间 -> 学习中
            'welcome': 'idle',       // 欢迎页面 -> 闲置
            'about': 'idle'          // 关于页面 -> 闲置
        };
        
        const animationType = appAnimationMap[appName] || 'idle';
        this.switchAnimation(animationType);
    },
    
    // 检测动画文件（智能匹配文件名）
    detectAnimationFiles() {
        // 根据实际文件名调整映射
        // 当前文件：idle.mp4, studying.mp4, working.mp4, sleeping.mp4
        const actualFiles = {
            'idle': 'idle.mp4',
            'working': 'working.mp4',
            'studying': 'studying.mp4',
            'sleeping': 'sleeping.mp4'
        };
        
        console.log('使用实际动画文件映射:', actualFiles);
        return actualFiles;
    },
    
    // 初始化悬浮播放器
    init() {
        console.log('初始化悬浮播放器...');
        
        const video = document.getElementById('player-video');
        const statusElement = document.getElementById('player-status');
        const player = document.getElementById('floating-player');
        
        if (video) {
            // 默认设置为sleeping动画（小夜在睡觉）
            const animationFiles = this.detectAnimationFiles();
            video.src = animationFiles.sleeping || animationFiles.idle;
            
            // 更新状态文本
            if (statusElement) {
                statusElement.textContent = '休息中 · 晚安好梦';
            }
            
            // 播放视频
            video.play().catch(e => {
                console.log('视频自动播放被阻止:', e);
            });
            
            console.log('默认加载sleeping动画');
        }
        
        // 为悬浮播放器添加点击唤醒功能
        if (player) {
            let isSleeping = true; // 标记小夜是否在睡觉
            
            // 点击唤醒功能（当小夜在睡觉时）
            player.addEventListener('click', (e) => {
                if (isSleeping && video) {
                    // 唤醒小夜：切换到idle状态
                    isSleeping = false;
                    this.switchAnimation('idle');
                    utils.updateStatus('小夜被唤醒啦！');
                    e.stopPropagation(); // 阻止事件冒泡
                    return; // 唤醒后不执行最小化逻辑
                }
                
                // 原有的最小化恢复逻辑
                if (player.classList.contains('minimized')) {
                    // 如果是最小化状态，点击恢复
                    player.classList.remove('minimized');
                    utils.updateStatus('悬浮播放器已恢复（点击图标）');
                    e.stopPropagation(); // 阻止事件冒泡
                }
            });
            
            // 确保最小化按钮的点击不会触发上面的唤醒逻辑
            const minimizeBtn = player.querySelector('.player-minimize');
            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止事件冒泡到父元素
                });
            }
            
            // 监听应用打开事件，如果打开应用则自动唤醒
            document.addEventListener('appOpened', (event) => {
                if (isSleeping) {
                    isSleeping = false;
                    console.log('应用打开，自动唤醒小夜（应用:', event.detail?.appName, ')');
                }
            });
        }
        
        console.log('悬浮播放器初始化完成（默认sleeping状态）');
    }
};

// ==================== 核心初始化 ====================
function initCore() {
    console.log('初始化核心功能...');
    
    // 初始化工具
    utils.setupTimeUpdate();
    
    // 初始化窗口系统
    windowSystem.init();
    
    // 初始化悬浮播放器
    floatingPlayer.init();
    
    console.log('核心功能初始化完成');
    utils.updateStatus('小夜的温暖小窝 v3模块化版核心功能已就绪');
}

// 导出到全局，方便在HTML中调用
window.utils = utils;
window.windowSystem = windowSystem;
window.floatingPlayer = floatingPlayer;
window.togglePlayerMinimize = floatingPlayer.toggleMinimize;
window.closePlayer = floatingPlayer.close; // 改为closePlayer与v3版本一致
window.reopenPlayer = floatingPlayer.reopenPlayer.bind(floatingPlayer); // 添加重新打开函数
window.openApp = windowSystem.openApp;
window.initCore = initCore;