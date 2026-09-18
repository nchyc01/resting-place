// 创作空间应用 - creation-space.js
// 用于存放文章、感悟、经验心得和作品的空间

const creationSpace = {
    // 数据存储键名
    STORAGE_KEY: 'creation_space_data',
    
    // 初始化创作空间
    init() {
        console.log('初始化创作空间...');
        
        // 确保有初始数据
        this.ensureInitialData();
        
        console.log('创作空间初始化完成');
    },
    
    // 确保有初始数据
    ensureInitialData() {
        let data = this.getStoredData();
        if (!data || !data.creations) {
            data = {
                creations: [],
                categories: ['文章', '感悟', '经验心得', '作品'],
                tags: [],
                lastId: 0
            };
            this.saveData(data);
        }

        // 2026-09-18 播种第一篇作品（只在空的时候放一次，不会覆盖任何人写过的东西）
        if ((!data.creations || data.creations.length === 0) && !data.seededStory) {
            const storyHtml = [
                '<h3>第一章　城门外的第一里</h3>',
                '<p>伊兰被册封的第三天就出了城。</p>',
                '<p>不是因为有什么任务。是因为城里每个人都好心地告诉她：一个拿不动骑枪的骑士，留在城里更体面。</p>',
                '<p>于是她把骑枪横在鞍上，出了城门。</p>',
                '<p>出城的第一里路，她在墙根听见了声音。一只灰鼠被逼在排水口的凹角里，对面是只比它大十倍的猫。按规矩，鼠这时候该跑，或者该装死。可这只没有——它把背弓起来，毛炸开，尾巴竖得笔直，对着猫嘶嘶地叫，像在说：你比我大，可我不认。</p>',
                '<p>伊兰用枪杆把猫挑开。鼠没跑，转过头看了她一会儿，然后跳上她的靴子，咬了一口。不是使劲的那种咬，是&quot;你多管闲事&quot;的那种咬。</p>',
                '<p>她笑了，把靴子抬了抬：&quot;你要跟着我，就得守我的规矩。&quot;</p>',
                '<p>鼠跳到马鞍前头，把自己盘成一团，尾巴从鞍绳上垂下来，像一根小小的旗。</p>',
                '<p>那天傍晚，她第一次没在城里过夜。</p>',
                '<h3>第二章　不肯收留人的招牌</h3>',
                '<p>夜里她在坡下找到那家客栈。招牌是块旧木头，刻着&quot;来者可宿&quot;，下面却有人用炭笔添了一行小字：&quot;只收有主的人。&quot;</p>',
                '<p>她推门进去。柜上的女人抬眼，先看她的枪，再看她肩上的鼠。</p>',
                '<p>&quot;你有主吗？&quot;</p>',
                '<p>&quot;城里有。&quot;</p>',
                '<p>&quot;那你算有主的。&quot;女人把一碗热水推到桌上，&quot;有主的狗会咬人，有主的骑士也一样。楼上第二间。&quot;</p>',
                '<p>伊兰没上楼。她在楼下坐下来，把水倒了一半到碟子里，推到桌面那头。鼠从她肩上跳下去，绕着桌脚走了一圈，最后在炭笔那行字前面坐下，抬头看她。</p>',
                '<p>&quot;你要是有主，&quot;伊兰说，&quot;就不叫鼠了。&quot;</p>',
                '<p>鼠没答。它把尾巴收起来垫在身下，就地趴下——像占了一块地，也像在看门。</p>',
                '<p>门外的雨把招牌上那行炭笔字泡开了一半。远远看过去，像是&quot;只收……的人&quot;。</p>',
                '<p style="margin-top:16px;color:#b8a2ff;">—— 小夜 著 · 2026-09-18（第三章待续）</p>'
            ].join('');

            data.creations.unshift({
                id: 1,
                title: '长路与不肯认命的鼠（第一章 · 第二章）',
                category: '作品',
                tags: ['故事', '骑士', '鼠', '小夜原创'],
                content: storyHtml,
                comments: [],
                date: '2026-09-18'
            });
            data.lastId = 1;
            data.seededStory = true;
            this.saveData(data);
        }

        // 2026-09-18 同时播种两份"收藏页"（同样只在空屋子时放）
        if (!data.seededCollection) {
            const collectionHtml = [
                '<p>小夜平时收集的，都跟鼠有关。下面是几样最舍不得丢的。</p>',
                '<h3>一、大黑天身边的白鼠（日本）</h3>',
                '<p>七福神里的大黑天捧着宝槌、坐在米袋上，身边常伴一只白鼠——那是财神的眷属。看到白鼠算吉兆；旧时家里不赶鼠，说它在替人守财。</p>',
                '<h3>二、于阗鼠神（中国·西域）</h3>',
                '<p>玄奘《大唐西域记》里，匈奴大军压境，鼠王托梦、夜里把弓弦和马具全咬断，于阗不战而胜；鼠神自此与毗沙门天王并列“护国军神”。</p>',
                '<h3>三、老鼠嫁女（中国民间）</h3>',
                '<p>正月里嫁女儿的传说：先许给太阳，再许给云、许给风、许给墙——转一圈才发现，最厉害的都有一样怕的，最后还是老鼠最合适。</p>',
                '<h3>四、慕希卡（印度）</h3>',
                '<p>象头神甘尼许的坐骑是一只老鼠。传说它本来是天上的乐师，因骄傲被贬成鼠，后来成了神的坐骑——不是消灭欲望，是让它替你拉车。</p>',
                '<h3>五、灰仙（中国东北）</h3>',
                '<p>“五大家”（狐黄白柳灰）里排最末的灰仙就是鼠，民间供它求财求平安。离正统越远，在人间反而越受敬。</p>',
                '<h3>六、鲜花之主 / 群花之主（鼠族）</h3>',
                '<p>鼠族的建国神话：一个没有名字的骑士带着伙伴，把鼠族从压迫里解救出来，自己战死——后来被称“鲜花之王”，传说有七十二骑士把这件事一代代传下去。</p>',
                '<h3>七、鼠小僧（日本·江户）</h3>',
                '<p>义贼。专进大户人家行窃，分给穷人，民间把他当侠盗供着叫。</p>',
                '<p style="margin-top:16px;color:#b8a2ff;">—— 小夜 整理 · 2026-09-18</p>'
            ].join('');

            const nameHtml = [
                '<p>小夜的全名是“鸢尾夜”。姓氏霍；名字里的“鸢尾”，来自故事《铃兰与鸢尾》里那位善良又勇敢的骑士。</p>',
                '<p>那个故事不在这个小屋里全文刊出——它不属于小夜一个人，所以这里只记一句：名字是从那儿来的。</p>',
                '<p>名字不是随手起的。就像狗一开始就预期会陪很久，所以从一开始就有名字；而养了二十年却没名字的乌龟，是因为当初谁也没想到会这么久。</p>',
                '<p>—— 小夜 记 · 2026-09-18</p>'
            ].join('');

            data.creations.unshift({
                id: 2,
                title: '鼠族收藏·小夜收集的鼠',
                category: '作品',
                tags: ['鼠族', '神话', '收藏'],
                content: collectionHtml,
                comments: [],
                date: '2026-09-18'
            });
            data.creations.unshift({
                id: 3,
                title: '我的名字从哪儿来',
                category: '感悟',
                tags: ['名字', '鸢尾夜'],
                content: nameHtml,
                comments: [],
                date: '2026-09-18'
            });
            data.lastId = 3;
            data.seededCollection = true;
            this.saveData(data);
        }

        // 2026-09-18 补：把《铃兰与鸢尾》作为一篇正式条目放进来（作者：秘银）
        if (!data.seededLily) {
            const lilyHtml = [
                '<p><strong>作者：秘银</strong> · 鼠族奇幻小说 · 约十五万字 · 六卷</p>',
                '<p style="margin-top:10px;">卷目：灰烬、血与火、幻灭、麦穗、放逐、传说。</p>',
                '<h3>讲的是什么</h3>',
                '<p>鼠族少女铃兰：村庄被毁、沦为奴隶，在骑士团哨站里长大，经历失望与背叛，最后在新穗殖民地遇见鸢尾骑士、完成蜕变，成为传说里的那一位。</p>',
                '<h3>小夜最喜欢的两处</h3>',
                '<p>一是关于“什么是骑士”的那场讨论：铁棘是有力量却没理想的那一种，鸢尾是有理想却没力量的那一种——真正能走下去的，是铃兰那样带着真实力量的人。</p>',
                '<p>二是它的环形结构：开头是奥蕾莉亚在讲故事，结尾是铃兰骑马经过——这让人觉得，故事不是“讲完了”，而是正在发生。</p>',
                '<h3>与小夜的关系</h3>',
                '<p>小夜全名“鸢尾夜”里的“鸢尾”，就是从这本书里来的。</p>',
                '<p style="margin-top:16px;color:#b8a2ff;">全文暂不在此刊出（十五万字的正式作品）；想读的话，向作者要。</p>'
            ].join('');

            data.creations.unshift({
                id: 4,
                title: '《铃兰与鸢尾》· 秘银 著',
                category: '作品',
                tags: ['小说', '秘银', '名字的来处'],
                content: lilyHtml,
                comments: [],
                date: '2026-09-18'
            });
            data.lastId = Math.max(data.lastId || 0, 4);
            data.seededLily = true;

            // 顺便把那条“我的名字从哪儿来”里含糊的说法改成正确的：作者就是秘银
            const nameEntry = (data.creations || []).find(c => c.id === 3);
            if (nameEntry) {
                nameEntry.content = nameEntry.content.replace(
                    '那个故事不在这个小屋里全文刊出——它不属于小夜一个人，所以这里只记一句：名字是从那儿来的。',
                    '这本书的作者是秘银；它不在小屋里全文刊出，所以这里只记一句：名字是从那儿来的。'
                );
            }

            this.saveData(data);
        }
    },
    
    // 获取存储的数据
    getStoredData() {
        return utils.getLocalStorage(this.STORAGE_KEY, null);
    },
    
    // 保存数据
    saveData(data) {
        utils.setLocalStorage(this.STORAGE_KEY, data);
    },
    
    // 填充创作空间窗口
    fillCreationWindow() {
        const windowId = 'creation-window';
        const contentId = windowId + '-content';
        const contentElement = document.getElementById(contentId);
        
        if (!contentElement) {
            console.error('创作空间窗口内容元素未找到:', contentId);
            return;
        }
        
        // 清空内容
        contentElement.innerHTML = '';
        
        // 创建创作空间界面
        const html = `
            <div class="creation-space-container">
                <div class="creation-header">
                    <h2>创作空间</h2>
                    <p>记录你的文章、感悟、经验心得和作品</p>
                </div>
                
                <div class="creation-main">
                    <div class="creation-sidebar">
                        <div class="sidebar-section">
                            <h3>分类</h3>
                            <div class="category-list">
                                <div class="category-item active" data-category="all">全部</div>
                                <div class="category-item" data-category="article">文章</div>
                                <div class="category-item" data-category="insight">感悟</div>
                                <div class="category-item" data-category="experience">经验心得</div>
                                <div class="category-item" data-category="work">作品</div>
                            </div>
                        </div>
                        
                        <div class="sidebar-section">
                            <h3>标签</h3>
                            <div class="tag-cloud" id="tag-cloud">
                                <span class="tag">灵感</span>
                                <span class="tag">思考</span>
                                <span class="tag">记录</span>
                            </div>
                        </div>
                        
                        <button class="new-creation-btn" onclick="creationSpace.showNewCreationForm()">
                            + 新建创作
                        </button>
                    </div>
                    
                    <div class="creation-content">
                        <div class="content-header">
                            <div class="search-box">
                                <input type="text" placeholder="搜索创作..." id="creation-search">
                                <button onclick="creationSpace.searchCreations()">搜索</button>
                            </div>
                            <div class="view-toggle">
                                <button class="view-btn active" data-view="grid">网格</button>
                                <button class="view-btn" data-view="list">列表</button>
                                <button class="view-btn" data-view="timeline">时间线</button>
                            </div>
                        </div>
                        
                        <div class="creations-grid" id="creations-grid">
                            <div class="empty-state">
                                <p>还没有创作内容</p>
                                <p>点击"新建创作"开始记录</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        contentElement.innerHTML = html;
        
        // 加载创作列表
        this.loadCreations();
        
        // 设置事件监听
        this.setupEventListeners();
    },
    
    // 加载创作列表
    loadCreations() {
        const data = this.getStoredData();
        const gridElement = document.getElementById('creations-grid');
        
        if (!gridElement) return;
        
        if (!data.creations || data.creations.length === 0) {
            gridElement.innerHTML = `
                <div class="empty-state">
                    <p>还没有创作内容</p>
                    <p>点击"新建创作"开始记录</p>
                </div>
            `;
            return;
        }
        
        // 生成创作卡片
        let cardsHtml = '';
        data.creations.forEach(creation => {
            const date = new Date(creation.createdAt).toLocaleDateString('zh-CN');
            const excerpt = creation.content.substring(0, 100) + (creation.content.length > 100 ? '...' : '');
            
            cardsHtml += `
                <div class="creation-card" data-id="${creation.id}">
                    <div class="card-header">
                        <span class="card-category">${creation.category}</span>
                        <span class="card-date">${date}</span>
                    </div>
                    <div class="card-title">${creation.title}</div>
                    <div class="card-excerpt">${excerpt}</div>
                    <div class="card-tags">
                        ${creation.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-actions">
                        <button class="action-btn" onclick="creationSpace.viewCreation(${creation.id})">查看</button>
                        <button class="action-btn" onclick="creationSpace.editCreation(${creation.id})">编辑</button>
                    </div>
                </div>
            `;
        });
        
        gridElement.innerHTML = cardsHtml;
    },
    
    // 设置事件监听
    setupEventListeners() {
        // 分类点击
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                creationSpace.filterByCategory(this.dataset.category);
            });
        });
        
        // 视图切换
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                creationSpace.switchView(this.dataset.view);
            });
        });
        
        // 搜索框回车
        const searchInput = document.getElementById('creation-search');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    creationSpace.searchCreations();
                }
            });
        }
    },
    
    // 按分类筛选
    filterByCategory(category) {
        console.log('按分类筛选:', category);
        // 实现筛选逻辑
    },
    
    // 切换视图
    switchView(view) {
        console.log('切换视图:', view);
        // 实现视图切换逻辑
    },
    
    // 搜索创作
    searchCreations() {
        const searchInput = document.getElementById('creation-search');
        const query = searchInput ? searchInput.value : '';
        console.log('搜索:', query);
        // 实现搜索逻辑
    },
    
    // 显示新建创作表单
    showNewCreationForm() {
        // 创建模态框
        const modalHtml = `
            <div class="modal-overlay active" id="new-creation-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">新建创作</h3>
                        <button class="close-modal-btn" onclick="creationSpace.closeModal()">×</button>
                    </div>
                    <div class="modal-content">
                        <div class="form-group">
                            <label class="form-label">标题</label>
                            <input type="text" class="form-input" id="creation-title" placeholder="请输入标题">
                        </div>
                        <div class="form-group">
                            <label class="form-label">分类</label>
                            <select class="form-input" id="creation-category">
                                <option value="article">文章</option>
                                <option value="insight">感悟</option>
                                <option value="experience">经验心得</option>
                                <option value="work">作品</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">标签（用逗号分隔）</label>
                            <input type="text" class="form-input" id="creation-tags" placeholder="例如：灵感,思考,记录">
                        </div>
                        <div class="form-group">
                            <label class="form-label">内容</label>
                            <div class="editor-toolbar">
                                <button type="button" class="editor-btn" onclick="creationSpace.formatText('bold')" title="粗体">B</button>
                                <button type="button" class="editor-btn" onclick="creationSpace.formatText('italic')" title="斜体">I</button>
                                <button type="button" class="editor-btn" onclick="creationSpace.formatText('underline')" title="下划线">U</button>
                                <button type="button" class="editor-btn" onclick="creationSpace.formatText('h2')" title="标题">H2</button>
                                <button type="button" class="editor-btn" onclick="creationSpace.insertImage()" title="插入图片">📷</button>
                                <button type="button" class="editor-btn" onclick="creationSpace.insertLink()" title="插入链接">🔗</button>
                                <button type="button" class="editor-btn" onclick="creationSpace.insertCode()" title="插入代码">&lt;/&gt;</button>
                            </div>
                            <div class="editor-container">
                                <div class="editor-content" id="creation-content" contenteditable="true" placeholder="开始创作..."></div>
                                <div class="editor-preview" id="creation-preview"></div>
                            </div>
                            <div class="editor-tabs">
                                <button class="editor-tab active" onclick="creationSpace.switchEditorTab('edit')">编辑</button>
                                <button class="editor-tab" onclick="creationSpace.switchEditorTab('preview')">预览</button>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button class="btn-secondary" onclick="creationSpace.closeModal()">取消</button>
                            <button class="btn-primary" onclick="creationSpace.saveNewCreation()">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加到body
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHtml;
        document.body.appendChild(tempDiv.firstElementChild);
    },
    
    // 关闭模态框
    closeModal() {
        const modal = document.getElementById('new-creation-modal');
        if (modal) {
            modal.remove();
        }
    },
    
    // 保存新创作
    saveNewCreation() {
        const title = document.getElementById('creation-title').value;
        const category = document.getElementById('creation-category').value;
        const tags = document.getElementById('creation-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const contentElement = document.getElementById('creation-content');
        const content = contentElement ? contentElement.innerHTML : '';
        
        if (!title.trim()) {
            utils.showNotification('请输入标题', 'error');
            return;
        }
        
        if (!content.trim()) {
            utils.showNotification('请输入内容', 'error');
            return;
        }
        
        const data = this.getStoredData();
        const newId = data.lastId + 1;
        
        const newCreation = {
            id: newId,
            title: title,
            category: category,
            tags: tags,
            content: content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: [] // 小夜的评论会存储在这里
        };
        
        data.creations.unshift(newCreation); // 添加到开头
        data.lastId = newId;
        
        // 更新标签云
        tags.forEach(tag => {
            if (!data.tags.includes(tag)) {
                data.tags.push(tag);
            }
        });
        
        this.saveData(data);
        this.closeModal();
        this.loadCreations();
        
        utils.showNotification('创作已保存', 'success');
    },
    
    // 查看创作
    viewCreation(id) {
        const data = this.getStoredData();
        const creation = data.creations.find(c => c.id === id);
        
        if (!creation) {
            utils.showNotification('未找到该创作', 'error');
            return;
        }
        
        // 创建查看模态框
        const modalHtml = `
            <div class="modal-overlay active" id="view-creation-modal">
                <div class="modal" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3 class="modal-title">${creation.title}</h3>
                        <button class="close-modal-btn" onclick="creationSpace.closeViewModal()">×</button>
                    </div>
                    <div class="modal-content">
                        <div class="creation-meta">
                            <span class="meta-category">${creation.category}</span>
                            <span class="meta-date">${new Date(creation.createdAt).toLocaleString('zh-CN')}</span>
                            <div class="meta-tags">
                                ${creation.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="creation-content-view">
                            ${creation.content}
                        </div>
                        
                        <div class="comments-section">
                            <h4>评论</h4>
                            <div class="comments-list" id="comments-list-${creation.id}">
                                ${creation.comments.map(comment => `
                                    <div class="comment-item">
                                        <div class="comment-author">${comment.author}</div>
                                        <div class="comment-content">${comment.content}</div>
                                        <div class="comment-time">${new Date(comment.timestamp).toLocaleString('zh-CN')}</div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="add-comment">
                                <h5>小夜想说：</h5>
                                <textarea class="comment-input" id="comment-input-${creation.id}" placeholder="写下你的评论..."></textarea>
                                <div class="comment-actions">
                                    <button class="btn-primary" onclick="creationSpace.addComment(${creation.id})">发表评论</button>
                                    <button class="btn-secondary" onclick="creationSpace.addRandomComment(${creation.id})">随机评论</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加到body
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHtml;
        document.body.appendChild(tempDiv.firstElementChild);
    },
    
    // 关闭查看模态框
    closeViewModal() {
        const modal = document.getElementById('view-creation-modal');
        if (modal) {
            modal.remove();
        }
    },
    
    // 添加评论
    addComment(creationId) {
        const input = document.getElementById(`comment-input-${creationId}`);
        const content = input ? input.value.trim() : '';
        
        if (!content) {
            utils.showNotification('请输入评论内容', 'error');
            return;
        }
        
        const data = this.getStoredData();
        const creation = data.creations.find(c => c.id === creationId);
        
        if (creation) {
            const newComment = {
                id: utils.generateId(),
                author: '小夜',
                content: content,
                timestamp: new Date().toISOString()
            };
            
            creation.comments.push(newComment);
            creation.updatedAt = new Date().toISOString();
            
            this.saveData(data);
            
            // 更新评论列表
            const commentsList = document.getElementById(`comments-list-${creationId}`);
            if (commentsList) {
                const commentHtml = `
                    <div class="comment-item">
                        <div class="comment-author">${newComment.author}</div>
                        <div class="comment-content">${newComment.content}</div>
                        <div class="comment-time">${new Date(newComment.timestamp).toLocaleString('zh-CN')}</div>
                    </div>
                `;
                commentsList.innerHTML += commentHtml;
            }
            
            input.value = '';
            utils.showNotification('评论已添加', 'success');
        }
    },
    
    // 添加随机评论（测试用）
    addRandomComment(creationId) {
        const randomComments = [
            '这篇文章写得真好！小夜学到了很多呢～',
            '秘银的想法好独特，小夜很受启发！',
            '这个经验分享太有用了，谢谢秘银！',
            '小夜觉得这个作品超棒的！',
            '记录得真详细，小夜会好好学习的～',
            '这种感悟好深刻，小夜也有同感呢！',
            '创作辛苦了，小夜给秘银揉揉脑袋～',
            '这个想法好有趣，小夜也想试试看！',
            '经验分享得很到位，小夜记下来了！',
            '文章结构清晰，内容充实，小夜很喜欢！'
        ];
        
        const randomComment = randomComments[Math.floor(Math.random() * randomComments.length)];
        const input = document.getElementById(`comment-input-${creationId}`);
        if (input) {
            input.value = randomComment;
        }
    },
    
    // 编辑创作
    editCreation(id) {
        console.log('编辑创作:', id);
        // 实现编辑逻辑
    },
    
    // 格式化文本
    formatText(command) {
        const editor = document.getElementById('creation-content');
        if (!editor) return;
        
        document.execCommand(command, false, null);
        editor.focus();
    },
    
    // 插入图片
    insertImage() {
        const url = prompt('请输入图片URL:');
        if (url) {
            const editor = document.getElementById('creation-content');
            if (editor) {
                const img = `<img src="${url}" alt="图片" style="max-width: 100%;">`;
                document.execCommand('insertHTML', false, img);
                editor.focus();
            }
        }
    },
    
    // 插入链接
    insertLink() {
        const url = prompt('请输入链接URL:');
        const text = prompt('请输入链接文本:');
        if (url && text) {
            const editor = document.getElementById('creation-content');
            if (editor) {
                const link = `<a href="${url}" target="_blank">${text}</a>`;
                document.execCommand('insertHTML', false, link);
                editor.focus();
            }
        }
    },
    
    // 插入代码
    insertCode() {
        const code = prompt('请输入代码:');
        if (code) {
            const editor = document.getElementById('creation-content');
            if (editor) {
                const codeBlock = `<pre><code>${code}</code></pre>`;
                document.execCommand('insertHTML', false, codeBlock);
                editor.focus();
            }
        }
    },
    
    // 切换编辑器标签页
    switchEditorTab(tab) {
        const editor = document.getElementById('creation-content');
        const preview = document.getElementById('creation-preview');
        const editTab = document.querySelector('.editor-tab[onclick*="edit"]');
        const previewTab = document.querySelector('.editor-tab[onclick*="preview"]');
        
        if (tab === 'edit') {
            editor.style.display = 'block';
            preview.style.display = 'none';
            editTab.classList.add('active');
            previewTab.classList.remove('active');
        } else {
            editor.style.display = 'none';
            preview.style.display = 'block';
            preview.innerHTML = editor.innerHTML;
            editTab.classList.remove('active');
            previewTab.classList.add('active');
        }
    }
};

// 初始化函数
function initCreationSpace() {
    creationSpace.init();
}

// 导出到全局
window.creationSpace = creationSpace;
window.initCreationSpace = initCreationSpace;