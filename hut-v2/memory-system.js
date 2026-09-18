// 记忆系统模块 - memory-system.js

const memorySystem = {
    // 初始化记忆系统
    init() {
        console.log('初始化记忆系统...');
        console.log('记忆系统初始化完成');
    },
    
    // 填充记忆窗口内容
    fillMemoryWindow() {
        const contentElement = document.getElementById('memory-window-content');
        if (!contentElement) return;
        
        contentElement.innerHTML = `
            <div class="memory-container">
                <h2>🧠 小夜的记忆库</h2>
                <p>记录小夜成长历程和与秘银共同记忆的地方。</p>
                
                <div style="margin: 20px 0; padding: 20px; background: rgba(255, 156, 214, 0.1); border-radius: 10px;">
                    <h3>记忆统计</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px;">
                        <div style="text-align: center; padding: 15px; background: rgba(255, 156, 214, 0.05); border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: bold; color: #ff9cd6;">23</div>
                            <div style="font-size: 12px; color: #b8a2ff;">总记忆数</div>
                        </div>
                        <div style="text-align: center; padding: 15px; background: rgba(255, 156, 214, 0.05); border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: bold; color: #ff9cd6;">5</div>
                            <div style="font-size: 12px; color: #b8a2ff;">近期记忆</div>
                        </div>
                        <div style="text-align: center; padding: 15px; background: rgba(255, 156, 214, 0.05); border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: bold; color: #ff9cd6;">15.7 KB</div>
                            <div style="font-size: 12px; color: #b8a2ff;">存储大小</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>近期记忆</h3>
                    <div style="max-height: 300px; overflow-y: auto; margin-top: 10px;">
                        <div style="padding: 15px; margin-bottom: 10px; background: rgba(255, 156, 214, 0.05); border-radius: 10px; border-left: 4px solid #ff9cd6;">
                            <div style="font-weight: bold; color: #ff9cd6; margin-bottom: 5px;">网页重构完成</div>
                            <div style="font-size: 12px; color: #b8a2ff; margin-bottom: 5px;">2026-03-12 · 技术</div>
                            <div style="font-size: 14px;">成功将2208行的单个HTML文件拆分为模块化结构</div>
                        </div>
                        
                        <div style="padding: 15px; margin-bottom: 10px; background: rgba(255, 156, 214, 0.05); border-radius: 10px; border-left: 4px solid #ff9cd6;">
                            <div style="font-weight: bold; color: #ff9cd6; margin-bottom: 5px;">音乐播放器升级</div>
                            <div style="font-size: 12px; color: #b8a2ff; margin-bottom: 5px;">2026-03-12 · 功能</div>
                            <div style="font-size: 14px;">实现了完整的音乐播放功能，支持文件上传和播放列表</div>
                        </div>
                        
                        <div style="padding: 15px; margin-bottom: 10px; background: rgba(255, 156, 214, 0.05); border-radius: 10px; border-left: 4px solid #ff9cd6;">
                            <div style="font-weight: bold; color: #ff9cd6; margin-bottom: 5px;">日记本集成</div>
                            <div style="font-size: 12px; color: #b8a2ff; margin-bottom: 5px;">2026-03-12 · 功能</div>
                            <div style="font-size: 14px;">将日记本功能集成到主网页中，支持心情记录</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                    <button onclick="memorySystem.refreshMemories()" style="padding: 10px 20px; margin-right: 10px; background: rgba(255, 156, 214, 0.2); border: 1px solid rgba(255, 156, 214, 0.3); border-radius: 8px; cursor: pointer;">
                        刷新记忆
                    </button>
                    <button onclick="memorySystem.backupMemories()" style="padding: 10px 20px; background: linear-gradient(135deg, #ff9cd6, #ff6bb5); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        备份记忆
                    </button>
                </div>
            </div>
        `;
    },
    
    // 刷新记忆
    refreshMemories() {
        utils.showNotification('记忆数据已刷新', 'success');
        this.fillMemoryWindow();
    },
    
    // 备份记忆
    backupMemories() {
        utils.showNotification('记忆备份功能开发中', 'info');
    }
};

// 初始化函数
function initMemorySystem() {
    console.log('初始化记忆系统模块...');
    memorySystem.init();
    console.log('记忆系统模块初始化完成');
}

// 导出到全局
window.memorySystem = memorySystem;
window.initMemorySystem = initMemorySystem;
window.refreshMemories = memorySystem.refreshMemories.bind(memorySystem);
window.backupMemories = memorySystem.backupMemories.bind(memorySystem);