// 日记本模块 - diary-app.js
// 日记本功能（iframe集成）

const diaryApp = {
    // 初始化日记本
    init() {
        console.log('初始化日记本...');
        console.log('日记本初始化完成（iframe集成）');
    },
    
    // 填充日记窗口内容
    fillDiaryWindow() {
        const contentElement = document.getElementById('diary-window-content');
        if (!contentElement) return;
        
        contentElement.innerHTML = `
            <div class="diary-container">
                <h2>📖 小夜与秘银的日记本</h2>
                <p>记录我们的每一天，分享心情和感受。</p>
                
                <div style="margin: 20px 0; padding: 20px; background: rgba(255, 156, 214, 0.1); border-radius: 10px;">
                    <h3>日记本功能</h3>
                    <p>日记本使用独立的HTML文件，通过iframe集成到主页面中。</p>
                    <p>点击下方按钮打开完整的日记本界面：</p>
                    
                    <button onclick="diaryApp.openFullDiary()" style="margin-top: 15px; padding: 10px 20px; background: linear-gradient(135deg, #ff9cd6, #ff6bb5); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        打开完整日记本
                    </button>
                </div>
                
                <!-- iframe容器 -->
                <div id="diary-iframe-container" style="width: 100%; height: 400px; margin-top: 20px; display: none;">
                    <iframe id="diary-iframe" src="../diary-iframe.html" style="width: 100%; height: 100%; border: none; border-radius: 10px;"></iframe>
                </div>
                
                <div style="margin-top: 20px; font-size: 12px; color: #b8a2ff;">
                    <p><strong>功能说明</strong>：</p>
                    <ul style="margin-left: 20px;">
                        <li>日记记录和编辑</li>
                        <li>心情选择器（6种心情）</li>
                        <li>本地数据存储</li>
                        <li>数据导入导出</li>
                    </ul>
                </div>
            </div>
        `;
    },
    
    // 打开完整日记本
    openFullDiary() {
        const iframeContainer = document.getElementById('diary-iframe-container');
        const iframe = document.getElementById('diary-iframe');
        
        if (iframeContainer && iframe) {
            iframeContainer.style.display = 'block';
            
            // 加载日记本iframe
            iframe.src = '../diary-iframe.html';
            
            utils.showNotification('正在加载日记本...', 'info');
        } else {
            // 如果没有iframe，创建新窗口
            window.open('小夜的日记本.html', '_blank');
        }
    }
};

// 初始化函数
function initDiaryApp() {
    console.log('初始化日记本模块...');
    diaryApp.init();
    console.log('日记本模块初始化完成');
}

// 导出到全局
window.diaryApp = diaryApp;
window.initDiaryApp = initDiaryApp;
window.openFullDiary = diaryApp.openFullDiary.bind(diaryApp);