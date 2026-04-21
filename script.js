--- script.js (原始)


+++ script.js (修改后)
(function(){
    // ===== ДАННЫЕ =====
    let users = JSON.parse(localStorage.getItem('u')) || [];
    let matches = JSON.parse(localStorage.getItem('m')) || [];
    let mutedUsers = JSON.parse(localStorage.getItem('muted')) || [];
    if(!users.some(u=>u.nick==='Barry Dylan')) users.push({nick:'Barry Dylan',pass:'locer228',admin:true,souls:1000,streak:0,lastClaim:null,avatar:'',wall:[],joined:'2025-01-01',matches:42,wins:28});
    localStorage.setItem('u', JSON.stringify(users));

    let curUser = JSON.parse(localStorage.getItem('cur')) || null;
    let theme = localStorage.getItem('th') || 'yellow';
    let isDark = localStorage.getItem('darkMode') !== 'false';

    // Состояние экрана
    let mainScreenShown = localStorage.getItem('mainScreen') !== 'false';
    let hasEntered = sessionStorage.getItem('hasEntered') === 'true';

    // Инициализация
    applyTheme(theme, isDark);

    // ===== ГЛАВНЫЙ ЭКРАН (п.6) =====
    function initMainScreen() {
        if(!hasEntered) {
            // Создаём частицы
            const container = document.getElementById('mainParticles');
            for(let i = 0; i < 40; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                p.style.left = Math.random() * 100 + '%';
                p.style.animationDuration = (3 + Math.random() * 5) + 's';
                p.style.animationDelay = Math.random() * 3 + 's';
                p.style.width = (2 + Math.random() * 4) + 'px';
                p.style.height = p.style.width;
                container.appendChild(p);
            }
            document.getElementById('mainScreen').classList.remove('hidden');
        } else {
            document.getElementById('mainScreen').classList.add('hidden');
            if(mainScreenShown) {
                showLanding();
            } else {
                enterApp();
            }
        }
    }

    document.getElementById('enterBtn').addEventListener('click', () => {
        sessionStorage.setItem('hasEntered', 'true');
        const screen = document.getElementById('mainScreen');
        screen.style.opacity = '0';
        screen.style.transform = 'scale(1.1)';
        setTimeout(() => {
            screen.classList.add('hidden');
            showLanding();
        }, 600);
    });

    function showLanding() {
        document.getElementById('landing').classList.add('active');
    }

    function enterApp() {
        document.getElementById('app').classList.add('visible');
        updateUI();
        renderNews();
        showRating('top');
        renderChat();
    }

    initMainScreen();

    // ===== НОВОСТИ =====
    const newsData = [
        {title:"Quinn: «Киберспорт в Deadlock — говно.»", url:"https://deadlock.ru/", date:"20 Апр", icon:"🎙️"},
        {title:"Bebop Hookwars теперь в Deadlock!", url:"https://deadlock.ru/", date:"13 Апр", icon:"🪝"},
        {title:"Обновление от 11 апреля", url:"https://deadlock.ru/", date:"12 Апр", icon:"🛠️"},
        {title:"Пляжная коллекция скинов", url:"https://deadlock.ru/", date:"10 Апр", icon:"🏖️"},
        {title:"Баг на турнире ABRAHAMS", url:"https://deadlock.ru/", date:"9 Апр", icon:"⚠️"},
        {title:"Балансировка 26.03", url:"https://deadlock.ru/", date:"26 Мар", icon:"⚖️"},
        {title:"Глобальное обновление", url:"https://deadlock.ru/", date:"22 Мар", icon:"🌟"},
        {title:"Обновления патча", url:"https://deadlock.ru/", date:"11 Мар", icon:"📝"}
    ];
    function renderNews(){
        document.getElementById('newsContent').innerHTML = newsData.map(n=>`
            <div class="news-card"><div class="news-img">${n.icon}</div><div class="news-content">
            <a href="${n.url}" target="_blank" rel="noopener">${n.title}</a><div class="news-date">${n.date}</div></div></div>
        `).join('');
    }

    function updateUI(){
        if(curUser){
            document.getElementById('loggedOut').classList.add('hidden');
            document.getElementById('loggedIn').classList.remove('hidden');
            document.getElementById('userNick').textContent=curUser.nick;
            document.getElementById('adminBadge').classList.toggle('hidden',!curUser.admin);
            let u = users.find(u=>u.nick===curUser.nick);
            document.getElementById('soulAmount').textContent = u?.souls || 0;
            document.getElementById('signatureName').textContent = curUser.nick;
            // Обновляем эмодзи в сайдбаре
            const emojis = {'yellow':'⚜️','ruby':'🔥','emerald':'🌿','sapphire':'🌊','terracotta':'🌅','turquoise':'🧿','lavender':'🔮','pearl':'🌙'};
            document.getElementById('sidebarLogo').textContent = emojis[theme] || '⚜️';
        } else {
            document.getElementById('loggedOut').classList.remove('hidden');
            document.getElementById('loggedIn').classList.add('hidden');
            document.getElementById('signatureName').textContent = 'Barry Dylan';
        }
    }

    // ===== ТЕМА =====
    function applyTheme(t, dark) {
        document.body.className = 'theme-' + t;
        if(!dark) document.body.classList.add('light-mode');
        document.querySelectorAll('.theme-dot').forEach(d=>d.classList.remove('active'));
        document.querySelector(`.theme-dot[data-theme="${t}"]`)?.classList.add('active');
        const emojis = {'yellow':'⚜️','ruby':'🔥','emerald':'🌿','sapphire':'🌊','terracotta':'🌅','turquoise':'🧿','lavender':'🔮','pearl':'🌙'};
        document.getElementById('themeEmoji').textContent = emojis[t] || '⚜️';
        document.getElementById('sidebarLogo').textContent = emojis[t] || '⚜️';
        localStorage.setItem('th', t);
        localStorage.setItem('darkMode', dark ? 'true' : 'false');
    }

    document.querySelectorAll('.theme-dot').forEach(d=>d.addEventListener('click',()=>{
        theme = d.dataset.theme;
        applyTheme(theme, isDark);
        document.querySelectorAll('.theme-dot').forEach(td=>td.classList.remove('active'));
        d.classList.add('active');
    }));

    document.getElementById('saveTheme').addEventListener('click',()=>{
        const selected = document.querySelector('.theme-dot.active')?.dataset.theme || theme;
        isDark = !document.getElementById('darkModeToggle').checked; // checked = светлая
        applyTheme(selected, isDark);
        document.getElementById('settingsPanel').classList.remove('visible');
    });

    // ✅ ПОЛЗУНОК: unchecked = тёмная, checked = светлая (п.3)
    document.getElementById('darkModeToggle').addEventListener('change', function() {
        isDark = !this.checked; // checked = светлая (false для isDark)
        applyTheme(theme, isDark);
    });
    document.getElementById('darkModeToggle').checked = !isDark; // Если тёмная - чекбокс выключен

    // ===== ПРОФИЛЬ (п.7 - улучшенный) =====
    function getRankName(score) {
        if(score>=20000) return {name:'CURSED',cls:'cursed'};
        if(score>=18000) return {name:'ETERNUS',cls:'eternus'};
        if(score>=17000) return {name:'ASCENDANT',cls:'ascendant'};
        if(score>=15000) return {name:'PHANTOM',cls:'phantom'};
        if(score>=13000) return {name:'ORACLE',cls:'oracle'};
        if(score>=11000) return {name:'ARCHON',cls:'archon'};
        if(score>=10000) return {name:'EMISSARY',cls:'emissary'};
        if(score>=8000) return {name:'RITUALIST',cls:'ritualist'};
        if(score>=7000) return {name:'ARCANIST',cls:'arcanist'};
        if(score>=5000) return {name:'ALCHEMIST',cls:'alchemist'};
        if(score>=4000) return {name:'SEEKER',cls:'seeker'};
        return {name:'INITIATE',cls:'initiate'};
    }

    function renderProfile(nick){
        let u = users.find(u=>u.nick===nick); if(!u) return;
        let cont = document.getElementById('profileContent');
        let rank = getRankName(u.souls);
        let achievements = [];
        if(u.souls>=1000) achievements.push('💎 Богач');
        if(u.streak>=7) achievements.push('🔥 Стрик 7 дней');
        if(u.streak>=30) achievements.push('⭐ Месячный воин');
        if(u.admin) achievements.push('👑 Админ');
        if((u.matches||0)>=10) achievements.push('⚔️ Ветеран');
        if((u.wins||0)>=20) achievements.push('🏆 Чемпион');
        if(!u.avatar) u.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nick)}&background=${theme==='yellow'?'c9a53b':theme==='ruby'?'b22234':theme==='emerald'?'238a63':'2563eb'}&color=fff&size=200`;
        let wall = u.wall || [];

        let html = `<div class="profile-page">
            <div class="profile-header">
                <div class="profile-avatar-section">
                    <div class="profile-avatar-wrapper">
                        <img src="${u.avatar}" class="profile-avatar" id="avatarImg" title="Сменить аватар">
                        <input type="file" id="avatarUpload" accept="image/*" style="display:none;">
                        <div class="profile-avatar-badge" id="avatarBadge">📷</div>
                    </div>
                    <div class="profile-name">${u.nick}</div>
                    <div class="profile-rank-display"><span class="rank-badge ${rank.cls}">${rank.name}</span></div>
                    <div class="profile-souls-big">✨ ${u.souls.toLocaleString()} душ</div>
                </div>
                <div class="profile-stats">
                    <div class="stat-card"><div class="stat-value">${u.souls?.toLocaleString()||0}</div><div class="stat-label">Души</div></div>
                    <div class="stat-card"><div class="stat-value">${u.streak||0}</div><div class="stat-label">Дней стрик</div></div>
                    <div class="stat-card"><div class="stat-value">${u.matches||0}</div><div class="stat-label">Матчей</div></div>
                </div>
            </div>

            <div class="profile-section">
                <h3>🏆 Достижения</h3>
                <div class="achievements-grid">
                    ${achievements.length ? achievements.map(a=>`<span class="ach-badge">${a}</span>`).join('') : '<span style="color:var(--text-secondary);">Пока нет достижений</span>'}
                </div>
            </div>

            <div class="profile-section">
                <h3>📝 Стена</h3>
                <div class="wall-posts" id="wallPosts">
                    ${wall.length ? wall.slice(-10).reverse().map(p=>`<div class="wall-post"><p>${p.text||''}</p>${p.img?`<img src="${p.img}" onclick="openFullscreen(this.src)">`:''}<div class="wall-post-date">${p.date||''}</div></div>`).join('') : '<p style="color:var(--text-secondary);text-align:center;padding:1rem;">Пусто... Напиши что-нибудь!</p>'}
                </div>`;

        if(curUser && curUser.nick===u.nick){
            html += `<div class="wall-input">
                <input type="text" id="wallText" placeholder="Что нового?">
                <input type="file" id="wallImageInput" accept="image/*" style="display:none;">
                <button class="game-btn" id="wallImageBtn">🖼️</button>
                <button class="game-btn" id="wallPostBtn">Опубликовать</button>
            </div>`;
        }
        html += `</div></div>`;
        cont.innerHTML = html;

        if(curUser && curUser.nick===u.nick){
            document.getElementById('avatarImg').addEventListener('click', ()=>document.getElementById('avatarUpload').click());
            document.getElementById('avatarBadge').addEventListener('click', ()=>document.getElementById('avatarUpload').click());
            document.getElementById('avatarUpload').addEventListener('change', function(e){
                let file = e.target.files[0]; if(!file) return;
                let reader = new FileReader();
                reader.onload = ev=>{ u.avatar=ev.target.result; localStorage.setItem('u',JSON.stringify(users)); renderProfile(u.nick); };
                reader.readAsDataURL(file);
            });
            document.getElementById('wallImageBtn').addEventListener('click', ()=>document.getElementById('wallImageInput').click());

            let wallImageFile = null;
            document.getElementById('wallImageInput').addEventListener('change', function(e){ wallImageFile=e.target.files[0]; });

            document.getElementById('wallPostBtn').addEventListener('click', ()=>{
                let text = document.getElementById('wallText').value.trim();
                if(!text && !wallImageFile) { alert('Напишите текст или добавьте картинку!'); return; }
                let post = {text: text||'', img: '', date: new Date().toLocaleDateString('ru-RU')};
                let saveAndRender = ()=>{
                    u.wall = u.wall || []; u.wall.push(post);
                    localStorage.setItem('u', JSON.stringify(users)); renderProfile(u.nick);
                };
                if(wallImageFile){
                    let reader = new FileReader();
                    reader.onload = ev=>{ post.img=ev.target.result; saveAndRender(); };
                    reader.readAsDataURL(wallImageFile);
                } else { saveAndRender(); }
                document.getElementById('wallText').value=''; wallImageFile=null;
            });
        }
    }

    // ===== ИГРЫ =====
    let bjGame = {deck:[],player:[],dealer:[],gameOver:true};
    function initBJ(){
        bjGame={deck:[],player:[],dealer:[],gameOver:false};
        for(let i=0;i<4;i++) for(let j=2;j<=11;j++) bjGame.deck.push(j);
        bjGame.deck.sort(()=>Math.random()-0.5);
        bjGame.player.push(bjGame.deck.pop(),bjGame.deck.pop());
        bjGame.dealer.push(bjGame.deck.pop(),bjGame.deck.pop());
    }
    function bjSum(c){return c.reduce((a,b)=>a+b,0);}
    function bjRender(cont,u){
        let pS=bjSum(bjGame.player),dS=bjSum(bjGame.dealer);
        let html=`<div class="game-card"><h3>🃏 Блекджек</h3><p class="souls-balance">✨ ${u.souls} душ</p>`;
        if(bjGame.gameOver){
            html+=`<div class="bj-cards"><div class="bj-hand"><div class="bj-hand-title">Дилер</div><div class="bj-cards-display"><div class="bj-card">${bjGame.dealer[0]}</div><div class="bj-card hidden">?</div></div><div class="bj-sum">${dS}</div></div>
            <div class="bj-hand"><div class="bj-hand-title">Ты</div><div class="bj-cards-display">${bjGame.player.map(c=>`<div class="bj-card">${c}</div>`).join('')}</div><div class="bj-sum">${pS}</div></div></div>`;
            if(pS>21) html+=`<p class="bj-result lose">Перебор!</p>`;
            else if(dS>21) html+=`<p class="bj-result win">Дилер перебрал! +${u.bjBet*2} ✨</p>`;
            else if(pS>dS) html+=`<p class="bj-result win">Победа! +${u.bjBet*2} ✨</p>`;
            else if(pS<dS) html+=`<p class="bj-result lose">Поражение -${u.bjBet} ✨</p>`;
            else html+=`<p class="bj-result push">Ничья</p>`;
            html+=`<div class="bet-input"><label>Ставка:</label><input type="number" id="bjBet" value="10" min="1" max="${u.souls}"></div><button class="action-btn primary" id="bjStart">✨ Начать</button>`;
        } else {
            html+=`<div class="bj-cards"><div class="bj-hand"><div class="bj-hand-title">Дилер</div><div class="bj-cards-display"><div class="bj-card">${bjGame.dealer[0]}</div><div class="bj-card hidden">?</div></div></div>
            <div class="bj-hand"><div class="bj-hand-title">Ты</div><div class="bj-cards-display">${bjGame.player.map(c=>`<div class="bj-card">${c}</div>`).join('')}</div><div class="bj-sum">${pS}</div></div></div>`;
            html+=`<div class="action-buttons"><button class="action-btn secondary" id="bjHit">🃏 Ещё</button><button class="action-btn primary" id="bjStand">✅ Хватит</button></div>`;
        }
        html+=`</div>`; cont.innerHTML=html;
        if(bjGame.gameOver){
            document.getElementById('bjStart')?.addEventListener('click',()=>{
                let bet=parseInt(document.getElementById('bjBet')?.value);
                if(!bet||bet<=0||bet>u.souls) return alert('Неверная ставка');
                u.bjBet=bet; u.souls-=bet; initBJ(); bjRender(cont,u);
            });
        } else {
            document.getElementById('bjHit')?.addEventListener('click',()=>{
                bjGame.player.push(bjGame.deck.pop());
                if(bjSum(bjGame.player)>21){bjGame.gameOver=true;u.souls-=u.bjBet;}
                bjRender(cont,u);
            });
            document.getElementById('bjStand')?.addEventListener('click',()=>{
                while(bjSum(bjGame.dealer)<17) bjGame.dealer.push(bjGame.deck.pop());
                bjGame.gameOver=true;
                let p=bjSum(bjGame.player),d=bjSum(bjGame.dealer);
                if(d>21||p>d) u.souls+=u.bjBet*2; else if(p===d) u.souls+=u.bjBet;
                localStorage.setItem('u',JSON.stringify(users)); updateUI(); bjRender(cont,u);
            });
        }
    }

    function renderSoul(tab){
        let cont=document.getElementById('soulContent');
        if(!curUser){cont.innerHTML='<div class="game-card"><h3>🔐 Войди</h3><p>Нужно войти в аккаунт</p><button class="game-btn" onclick="document.getElementById(\'loginBtn\').click()">Войти</button></div>';return;}
        let u=users.find(u=>u.nick===curUser.nick);
        if(tab==='daily'){
            let today=new Date().toDateString(),yesterday=new Date(Date.now()-864e5).toDateString();
            let canClaim=u.lastClaim!==today;
            if(u.lastClaim!==today&&u.lastClaim) u.streak=0;
            let rewards=[500,750,1000,1500,2000,3000,5000],next=rewards[Math.min(u.streak,6)];
            let html=`<div class="game-card"><h3>🎁 Ежедневный бонус</h3><p class="souls-balance">✨ ${u.souls} душ</p><div class="daily-streak">`;
            for(let i=0;i<7;i++){let s=i<u.streak?'completed':(i===u.streak&&canClaim?'current':'pending');html+=`<div class="streak-day ${s}">${i+1}</div>`;}
            html+=`</div><p class="streak-info">Серия: <span>${u.streak} дн.</span> | +${next} ✨</p><button class="action-btn primary" id="claimDailyBtn" ${canClaim?'':'disabled'}>${canClaim?'✨ Забрать':'✅ Получено'}</button></div>`;
            cont.innerHTML=html;
            if(canClaim) document.getElementById('claimDailyBtn').addEventListener('click',()=>{
                u.streak=(u.lastClaim===yesterday)?u.streak+1:1; u.souls+=rewards[Math.min(u.streak-1,6)]; u.lastClaim=today;
                localStorage.setItem('u',JSON.stringify(users)); updateUI(); renderSoul('daily');
            });
        } else if(tab==='bet'){ cont.innerHTML='<div class="game-card"><h3>🎲 Ставки</h3><p>Скоро...</p><div style="margin-top:1rem;font-size:3rem;">🚧</div></div>'; }
        else if(tab==='blackjack'){ bjRender(cont,u); }
        else if(tab==='dice'){
            cont.innerHTML=`<div class="game-card"><h3>🎲 Кубик</h3><p class="souls-balance">✨ ${u.souls} душ</p>
            <div class="bet-input"><label>Ставка:</label><input type="number" id="diceBet" value="10" min="1" max="${u.souls}"></div>
            <div class="dice-grid"><div class="dice-btn" data-bet="1-3">1-3 (x2)</div><div class="dice-btn" data-bet="4-6">4-6 (x2)</div><div class="dice-btn" data-bet="even">Чёт (x2)</div><div class="dice-btn" data-bet="odd">Нечёт (x2)</div></div>
            <div class="dice-grid-full">${[1,2,3,4,5,6].map(n=>`<div class="dice-number" data-bet="${n}">${n} (x6)</div>`).join('')}</div>
            <div id="diceResult" class="dice-result"></div></div>`;
            document.querySelectorAll('.dice-btn,.dice-number').forEach(b=>b.addEventListener('click',()=>{
                let bet=parseInt(document.getElementById('diceBet')?.value); if(!bet||bet<=0||bet>u.souls) return alert('Неверная ставка');
                let type=b.dataset.bet,roll=Math.floor(Math.random()*6)+1,win=false;
                if(type==='1-3'&&roll<=3) win=true; else if(type==='4-6'&&roll>=4) win=true;
                else if(type==='even'&&roll%2===0) win=true; else if(type==='odd'&&roll%2===1) win=true;
                else if(parseInt(type)===roll) win=true;
                let mult=type.length>2?2:6; let r=document.getElementById('diceResult');
                if(win){u.souls+=bet*(mult-1);r.className='dice-result win';r.innerHTML=`✅ ${roll}! +${bet*(mult-1)} ✨`;}
                else{u.souls-=bet;r.className='dice-result lose';r.innerHTML=`❌ ${roll}. -${bet} ✨`;}
                localStorage.setItem('u',JSON.stringify(users)); updateUI(); renderSoul('dice');
            }));
        }
    }

    // ===== ЧАТ =====
    let chatMessages = JSON.parse(localStorage.getItem('chat')) || [];
    function renderChat(){
        document.getElementById('chatMessages').innerHTML = chatMessages.slice(-50).map(m=>
            `<div class="chat-message"><span class="nick">${m.nick}:</span> ${m.text||''}${m.img?`<br><img src="${m.img}" onclick="openFullscreen(this.src)">`:''}</div>`
        ).join('');
    }
    function saveChat(){ localStorage.setItem('chat',JSON.stringify(chatMessages.slice(-100))); }

    document.getElementById('chatHeader').addEventListener('click',(e)=>{
        if(!e.target.closest('button')){
            let c=document.getElementById('chatContainer');
            c.classList.toggle('chat-minimized');
            if(!c.classList.contains('chat-minimized')){c.classList.remove('expanded');c.classList.remove('wide');}
        }
    });

    // Кнопка закрытия
    document.getElementById('closeChatBtn').addEventListener('click',(e)=>{
        e.stopPropagation();
        let c=document.getElementById('chatContainer');
        c.classList.add('chat-minimized');
        c.classList.remove('expanded','wide');
    });

    document.getElementById('expandChatBtn').addEventListener('click',(e)=>{
        e.stopPropagation(); let c=document.getElementById('chatContainer');
        if(c.classList.contains('chat-minimized')) c.classList.remove('chat-minimized');
        else if(c.classList.contains('expanded')){c.classList.remove('expanded');c.classList.add('chat-minimized');}
        else c.classList.add('expanded');
    });
    document.getElementById('resizeChatBtn').addEventListener('click',(e)=>{
        e.stopPropagation(); let c=document.getElementById('chatContainer');
        if(c.classList.contains('chat-minimized')) c.classList.remove('chat-minimized');
        if(c.classList.contains('wide')){c.classList.remove('wide','expanded');} else {c.classList.add('wide');c.classList.remove('expanded');}
    });

    document.getElementById('chatSend').addEventListener('click',()=>{
        let inp=document.getElementById('chatInput');
        if(!inp.value.trim()||!curUser) return;
        if(mutedUsers.includes(curUser.nick)){alert('Ты в муте!');return;}
        chatMessages.push({nick:curUser.nick,text:inp.value.trim()}); renderChat(); saveChat(); inp.value='';
    });
    document.getElementById('chatInput').addEventListener('keypress',e=>{if(e.key==='Enter')document.getElementById('chatSend').click();});
    document.getElementById('attachImageBtn').addEventListener('click',()=>document.getElementById('chatImageInput').click());
    document.getElementById('chatImageInput').addEventListener('change',function(e){
        let file=e.target.files[0]; if(!file||!curUser) return;
        let reader=new FileReader(); reader.onload=ev=>{chatMessages.push({nick:curUser.nick,text:'',img:ev.target.result});renderChat();saveChat();};
        reader.readAsDataURL(file);
    });

    window.openFullscreen = function(src){
        let div=document.createElement('div'); div.className='img-backdrop';
        let img=document.createElement('img'); img.src=src; img.className='fullscreen-img';
        div.onclick=img.onclick=()=>{div.remove();img.remove();};
        document.body.append(div,img);
    };

    // ===== НАВИГАЦИЯ =====
    const tabs={news:document.getElementById('tab-news'),rating:document.getElementById('tab-rating'),tournament:document.getElementById('tab-tournament'),match:document.getElementById('tab-match'),info:document.getElementById('tab-info'),souls:document.getElementById('tab-souls'),profile:document.getElementById('tab-profile')};
    document.querySelectorAll('.sidebar-btn[data-tab]').forEach(b=>b.addEventListener('click',function(){
        let tab=this.dataset.tab; Object.values(tabs).forEach(t=>t.classList.add('hidden')); tabs[tab].classList.remove('hidden');
        document.querySelectorAll('.sidebar-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active');
        if(tab==='rating') showRating('top'); if(tab==='match') showMatch('find'); if(tab==='souls') renderSoul('daily');
        if(tab==='profile' && curUser) renderProfile(curUser.nick);
    }));

    document.getElementById('userNick').addEventListener('click',()=>{
        if(!curUser) return;
        renderProfile(curUser.nick);
        Object.values(tabs).forEach(t=>t.classList.add('hidden')); tabs.profile.classList.remove('hidden');
        document.querySelectorAll('.sidebar-btn').forEach(b=>b.classList.remove('active'));
    });

    const subContent=document.getElementById('subContent');
    document.querySelectorAll('[data-sub]').forEach(s=>s.addEventListener('click',function(){
        let sub=this.dataset.sub; document.querySelectorAll('[data-sub]').forEach(s=>s.classList.remove('active')); this.classList.add('active');
        let clone=document.getElementById('tpl-'+sub).cloneNode(true); clone.classList.remove('hidden'); subContent.innerHTML=''; subContent.appendChild(clone);
    }));

    const ratingContent=document.getElementById('ratingContent');
    function showRating(t){
        document.querySelectorAll('[data-rating]').forEach(s=>s.classList.remove('active'));
        document.querySelector(`[data-rating="${t}"]`).classList.add('active');
        let clone=document.getElementById('tpl-'+t).cloneNode(true); clone.classList.remove('hidden');
        ratingContent.innerHTML=''; ratingContent.appendChild(clone);
    }
    document.querySelectorAll('[data-rating]').forEach(s=>s.addEventListener('click',function(){showRating(this.dataset.rating);}));

    const matchContent=document.getElementById('matchContent');
    function showMatch(t){
        document.querySelectorAll('[data-match]').forEach(s=>s.classList.remove('active'));
        document.querySelector(`[data-match="${t}"]`).classList.add('active');
        if(t==='find'){renderMatches();} else {
            let clone=document.getElementById('tpl-create-match').cloneNode(true); clone.classList.remove('hidden');
            matchContent.innerHTML=''; matchContent.appendChild(clone);
        }
    }
    function renderMatches(){
        let cont=document.createElement('div');
        if(!matches.length) cont.innerHTML='<div class="empty-state"><div class="empty-state-icon">🔍</div><p>Нет матчей</p></div>';
        else matches.forEach((m,i)=>{
            let c=document.createElement('div'); c.className='match-card';
            c.innerHTML=`<h4>${m.name}</h4><div class="match-meta"><span>${m.mode}</span><span>📅 ${m.date?.replace('T',' ')||'-'}</span></div>
            ${m.players?.length?`<div class="match-players">${m.players.map(p=>`<span class="match-player">${p}</span>`).join('')}</div>`:''}
            <button class="match-join" data-i="${i}">Подключиться</button>`;
            cont.appendChild(c);
        });
        matchContent.innerHTML=''; matchContent.appendChild(cont);
        document.querySelectorAll('.match-join').forEach(b=>b.addEventListener('click',function(){
            let m=matches[+this.dataset.i]; if(!curUser) return alert('Войди!');
            if(!m.players) m.players=[];
            if(!m.players.includes(curUser.nick)){m.players.push(curUser.nick);localStorage.setItem('m',JSON.stringify(matches));}
            alert(`Ты в "${m.name}"!\nУчастники: ${m.players.join(', ')}`);
        }));
    }
    document.querySelectorAll('[data-match]').forEach(s=>s.addEventListener('click',function(){showMatch(this.dataset.match);}));
    document.addEventListener('click',e=>{
        if(e.target.id==='createMatchBtn'){
            let name=document.getElementById('matchName')?.value.trim(),mode=document.getElementById('matchMode')?.value,date=document.getElementById('matchDate')?.value;
            if(!name||!date) return alert('Заполни все поля');
            matches.push({name,mode,date,players:curUser?[curUser.nick]:[]});
            localStorage.setItem('m',JSON.stringify(matches)); showMatch('find');
        }
    });

    document.querySelectorAll('[data-soul]').forEach(s=>s.addEventListener('click',function(){
        document.querySelectorAll('[data-soul]').forEach(s=>s.classList.remove('active')); this.classList.add('active'); renderSoul(this.dataset.soul);
    }));

    // ===== АДМИНКА =====
    let adminMode='users';
    function renderAdmin(){
        let cont=document.getElementById('adminContent');
        if(adminMode==='users') cont.innerHTML=`<div class="admin-user-list">${users.map(u=>`<div class="admin-user-item"><div class="admin-user-info"><div class="admin-user-nick ${u.admin?'admin':''}">${u.nick}</div><div class="admin-user-souls">✨ ${u.souls||0}</div></div><div>${u.admin?'👑':''}</div></div>`).join('')}</div>`;
        else if(adminMode==='souls'){
            cont.innerHTML=`<div class="admin-user-list">${users.map(u=>`<div class="admin-user-item"><span>${u.nick}</span><div class="admin-souls-form"><input type="number" id="souls_${u.nick.replace(/\s/g,'_')}" class="admin-souls-input" placeholder="Сумма" min="1"><button class="admin-souls-btn" data-nick="${u.nick}">Выдать</button></div></div>`).join('')}</div>`;
            document.querySelectorAll('.admin-souls-btn').forEach(b=>b.addEventListener('click',function(){
                let nick=this.dataset.nick,amt=parseInt(document.getElementById('souls_'+nick.replace(/\s/g,'_'))?.value);
                if(!amt||amt<=0) return alert('Введи сумму');
                let u=users.find(u=>u.nick===nick); u.souls=(u.souls||0)+amt;
                localStorage.setItem('u',JSON.stringify(users)); renderAdmin(); if(curUser?.nick===nick) updateUI();
            }));
        } else if(adminMode==='admins'){
            cont.innerHTML=`<div class="admin-user-list">${users.map(u=>`<div class="admin-user-item"><div class="admin-user-info"><div class="admin-user-nick">${u.nick}</div><div class="admin-user-souls">${u.admin?'👑 Админ':'Пользователь'}</div></div><button class="admin-toggle-btn ${u.admin?'remove-admin':'make-admin'}" data-nick="${u.nick}">${u.admin?'Снять':'Дать'} права</button></div>`).join('')}</div>`;
            document.querySelectorAll('.admin-toggle-btn').forEach(b=>b.addEventListener('click',function(){
                let u=users.find(u=>u.nick===this.dataset.nick);
                if(u?.nick===curUser?.nick) return alert('Себя нельзя!');
                u.admin=!u.admin; localStorage.setItem('u',JSON.stringify(users)); renderAdmin(); updateUI();
            }));
        } else if(adminMode==='mutes'){
            cont.innerHTML=`<div class="admin-user-list">${users.map(u=>`<div class="admin-user-item"><div class="admin-user-info"><div class="admin-user-nick">${u.nick}</div><div class="admin-user-souls">${mutedUsers.includes(u.nick)?'🔇 В муте':'✅ Активен'}</div></div><button class="admin-toggle-btn ${mutedUsers.includes(u.nick)?'unmute':'mute'}" data-nick="${u.nick}">${mutedUsers.includes(u.nick)?'Размутить':'Замутить'}</button></div>`).join('')}</div>`;
            document.querySelectorAll('.admin-toggle-btn').forEach(b=>b.addEventListener('click',function(){
                let nick=this.dataset.nick;
                if(mutedUsers.includes(nick)) mutedUsers=mutedUsers.filter(n=>n!==nick); else mutedUsers.push(nick);
                localStorage.setItem('muted',JSON.stringify(mutedUsers)); renderAdmin();
            }));
        }
    }
    document.querySelectorAll('[data-admin]').forEach(s=>s.addEventListener('click',function(){
        adminMode=this.dataset.admin; document.querySelectorAll('[data-admin]').forEach(s=>s.classList.remove('active')); this.classList.add('active'); renderAdmin();
    }));

    // ===== АВТОРИЗАЦИЯ =====
    let authMode='login';
    document.getElementById('loginBtn').addEventListener('click',()=>{authMode='login';document.getElementById('authTitle').textContent='ВХОД';document.getElementById('authPanel').classList.add('visible');});
    document.getElementById('regBtn').addEventListener('click',()=>{authMode='register';document.getElementById('authTitle').textContent='РЕГИСТРАЦИЯ';document.getElementById('authPanel').classList.add('visible');});
    document.getElementById('authToggle').addEventListener('click',e=>{e.preventDefault();authMode=authMode==='login'?'register':'login';document.getElementById('authTitle').textContent=authMode==='login'?'ВХОД':'РЕГИСТРАЦИЯ';document.getElementById('authToggleText').textContent=authMode==='login'?'Нет аккаунта?':'Уже есть?';});
    document.getElementById('togglePass').addEventListener('click',()=>{let p=document.getElementById('authPass');p.type=p.type==='password'?'text':'password';this.textContent=p.type==='password'?'👁️':'🙈';});
    document.getElementById('closeAuth').addEventListener('click',()=>document.getElementById('authPanel').classList.remove('visible'));
    document.getElementById('authSubmit').addEventListener('click',()=>{
        let n=document.getElementById('authNick').value.trim(),p=document.getElementById('authPass').value;
        if(!n||!p){document.getElementById('authErr').textContent='Заполни поля';return;}
        if(authMode==='register'){
            if(users.some(u=>u.nick===n)){document.getElementById('authErr').textContent='Ник занят';return;}
            users.push({nick:n,pass:p,admin:false,souls:100,streak:0,lastClaim:null,avatar:'',wall:[],matches:0,wins:0});
            localStorage.setItem('u',JSON.stringify(users)); curUser={nick:n,admin:false}; localStorage.setItem('cur',JSON.stringify(curUser));
            updateUI(); document.getElementById('authPanel').classList.remove('visible');
        } else {
            let u=users.find(u=>u.nick===n&&u.pass===p); if(!u){document.getElementById('authErr').textContent='Неверно';return;}
            curUser={nick:u.nick,admin:u.admin}; localStorage.setItem('cur',JSON.stringify(curUser));
            updateUI(); document.getElementById('authPanel').classList.remove('visible');
        }
    });
    document.getElementById('logoutBtn').addEventListener('click',()=>{curUser=null;localStorage.removeItem('cur');updateUI();});

    function openSettings(){
        document.querySelectorAll('.theme-dot').forEach(d=>d.classList.remove('active'));
        document.querySelector(`.theme-dot[data-theme="${theme}"]`)?.classList.add('active');
        document.getElementById('darkModeToggle').checked = !isDark;
        document.getElementById('settingsPanel').classList.add('visible');
    }
    document.getElementById('settingsBtn')?.addEventListener('click', openSettings);
    document.getElementById('settingsBtnInline').addEventListener('click', openSettings);
    document.getElementById('closeSettings').addEventListener('click',()=>document.getElementById('settingsPanel').classList.remove('visible'));
    document.getElementById('logoutSettings').addEventListener('click',()=>{curUser=null;localStorage.removeItem('cur');updateUI();document.getElementById('settingsPanel').classList.remove('visible');});
    document.getElementById('changeNick').addEventListener('click',()=>{
        let nn=document.getElementById('newNick').value.trim(); if(!nn) return;
        if(users.some(u=>u.nick===nn&&u.nick!==curUser?.nick)){document.getElementById('nickErr').textContent='Занят';return;}
        let u=users.find(u=>u.nick===curUser?.nick); if(u){
            u.nick=nn; localStorage.setItem('u',JSON.stringify(users)); curUser.nick=nn; localStorage.setItem('cur',JSON.stringify(curUser));
            updateUI(); document.getElementById('settingsPanel').classList.remove('visible');
        }
    });
    document.getElementById('adminPanelBtn').addEventListener('click',()=>{document.getElementById('adminPanel').classList.add('visible');renderAdmin();});
    document.getElementById('closeAdmin').addEventListener('click',()=>document.getElementById('adminPanel').classList.remove('visible'));

    // ===== ДИНАМИЧНАЯ КНОПКА ПЕЧАТИ (п.5) =====
    let sealClicks=0, audioCtx=null;

    function playScarySound(){
        try{
            if(!audioCtx) audioCtx=new(window.AudioContext||window.webkitAudioContext)();
            if(audioCtx.state==='suspended') audioCtx.resume();
            let osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),filter=audioCtx.createBiquadFilter();
            osc.type='sine'; osc.frequency.setValueAtTime(55,audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(25,audioCtx.currentTime+1.5);
            filter.type='lowpass'; filter.frequency.setValueAtTime(200,audioCtx.currentTime); filter.Q.value=15;
            gain.gain.setValueAtTime(0.35,audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+1.8);
            osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime+1.8);
            setTimeout(()=>{
                let o2=audioCtx.createOscillator(),g2=audioCtx.createGain();
                o2.type='triangle'; o2.frequency.setValueAtTime(110,audioCtx.currentTime);
                g2.gain.setValueAtTime(0.15,audioCtx.currentTime); g2.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+1);
                o2.connect(g2); g2.connect(audioCtx.destination); o2.start(); o2.stop(audioCtx.currentTime+1);
            },400);
        }catch(e){}
    }

    function createSealParticles(x,y){
        const container = document.getElementById('sealParticles');
        for(let i=0;i<12;i++){
            const p = document.createElement('div');
            p.className = 'seal-particle';
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            const angle = (Math.PI * 2 / 12) * i;
            const dist = 60 + Math.random() * 80;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            p.style.setProperty('--tx', tx+'px');
            p.style.setProperty('--ty', ty+'px');
            p.style.animation = `sealParticleBurst ${0.4+Math.random()*0.3}s ease forwards`;
            p.style.width = (3+Math.random()*5)+'px';
            p.style.height = p.style.width;
            container.appendChild(p);
            setTimeout(()=>p.remove(), 800);
        }
    }

    document.getElementById('sealBtn').addEventListener('click',(e)=>{
        sealClicks++;

        // Обновляем точки
        const dots = document.querySelectorAll('.click-dot');
        if(sealClicks <= 3) dots[sealClicks-1].classList.add('filled');

        // Анимация кнопки
        const btn = document.getElementById('sealBtn');
        btn.classList.remove('click-1','click-2','click-3');
        void btn.offsetWidth; // reflow
        btn.classList.add('click-' + Math.min(sealClicks, 3));

        // Частицы
        const rect = btn.getBoundingClientRect();
        createSealParticles(rect.left + rect.width/2, rect.top + rect.height/2);

        // Текст
        const counterText = document.getElementById('counterText');
        if(sealClicks === 1) counterText.textContent = 'Печать треснула...';
        else if(sealClicks === 2) counterText.textContent = 'Сила пробивается!';
        else if(sealClicks >= 3) counterText.textContent = 'ПЕЧАТЬ СОРВАНА!';

        if(sealClicks >= 3){
            setTimeout(()=>{
                document.getElementById('landing').classList.add('hidden');
                document.getElementById('overlay').classList.add('visible');
                document.getElementById('overlayMsg').textContent = 'ПЕЧАТЬ СОРВАНА';
                setTimeout(()=>{
                    document.getElementById('overlay').classList.remove('visible');
                    setTimeout(()=>{
                        document.getElementById('overlay').classList.add('visible');
                        document.getElementById('overlayMsg').textContent = 'ПОКРОВИТЕЛИ НЕГОДУЮТ';
                        document.body.classList.add('shake-hard');
                        playScarySound();
                        setTimeout(()=>{
                            document.body.classList.remove('shake-hard');
                            document.getElementById('overlay').classList.remove('visible');
                            localStorage.setItem('mainScreen','false');
                            enterApp();
                        }, 2200);
                    }, 120);
                }, 1100);
            }, 400);
        }
    });

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    document.getElementById('subContent').appendChild(document.getElementById('tpl-banpick').cloneNode(true));
    document.getElementById('subContent').firstChild.classList.remove('hidden');

    function handleResize() {
        const chat = document.getElementById('chatContainer');
        if(window.innerWidth < 600) { chat.style.width='95%'; chat.style.left='2.5%'; chat.style.right='2.5%'; }
        else { chat.style.width=''; chat.style.left=''; chat.style.right=''; }
    }
    window.addEventListener('resize', handleResize); handleResize();
})();