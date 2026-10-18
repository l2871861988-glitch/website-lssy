const $ = s => document.querySelector(s);
const main = $('#main');
$('.skip').addEventListener('click',e=>{e.preventDefault();main.focus();});
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pages = [
  {id:'about',label:'About me',icon:'character.png'},
  {id:'projects',label:'My project',icon:'graduation.png'},
  {id:'internship',label:'My internship',icon:'computer.png'},
  {id:'subject',label:'Some subject',icon:'palette.png'}
];
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// The design sheets stay intact. CSS windows display only the selected artwork.
function slice(src,size,box,alt='',className=''){
  const [w,h]=size,[x,y,cw,ch]=box;
  return `<span class="slice ${className}" role="img" aria-label="${escapeHTML(alt)}" style="--ar:${cw}/${ch};background-image:url('${src}');background-size:${w/cw*100}% ${h/ch*100}%;background-position:${w===cw?0:x/(w-cw)*100}% ${h===ch?0:y/(h-ch)*100}%;background-repeat:no-repeat"></span>`;
}
function material(src,size,box,alt){return `<button class="material" data-image="${src}" data-caption="${escapeHTML(alt)}" data-box="${box.join(',')}" data-size="${size.join(',')}" aria-label="放大查看：${escapeHTML(alt)}">${slice(src,size,box,alt)}<span class="material-caption"><span>${alt}</span><span>点击查看 ↗</span></span></button>`;}
function footer(){return `<footer><nav class="footer-nav" aria-label="页尾导航">${pages.map(p=>`<a href="#/${p.id}">${p.label}</a>`).join('')}</nav><div class="foot"><a href="#/">© ${new Date().getFullYear()} LI SHUYAO</a><a href="#/about?section=information">Let's start ↗</a></div></footer>`;}
function hero(id,next){const p=pages.find(x=>x.id===id);return `<section class="hero" aria-label="${p.label}"><div class="hero-stage"><h1 class="${id==='internship'?'long':''}">${p.label}</h1><div class="emoji-follow"><img class="hero-object ${p.icon.split('.')[0]}" src="assets/${id==='about'?'character-smile.png':p.icon}" alt="${p.label} 栏目图标"></div><h1 aria-hidden="true" class="front-type ${id==='internship'?'long':''}">${p.label}</h1></div><a class="down" href="#/${id}?section=${next}" aria-label="向下浏览${p.label}"></a></section>`;}
function home(){return `<section class="home-hero"><h1>LI SHUYAO</h1><div class="home-art"><img src="assets/hero.png" alt="李姝瑶头像与毕业、创作和探索主题拼贴" fetchpriority="high"></div><a class="down" href="#/about?section=information" aria-label="开始认识李姝瑶"></a></section><nav class="home-index" aria-label="探索网站">${pages.map((p,i)=>`<a class="reveal" href="#/${p.id}"><small>0${i+1}</small><h2>${p.label}</h2><img src="assets/${p.icon}" alt=""></a>`).join('')}</nav>${footer()}`;}
function about(){return `${hero('about','information')}<section class="content information" id="information"><div class="info-mark reveal"><span>MY</span><b>Information</b></div><hr><div class="prose"><section class="reveal"><h2>我现在在做什么？</h2><p>目前在首尔高丽大学读研究生，学习方向为公共关系与品牌传播。<br>同时担任课程助教并获助教奖学金。</p><p>本科就读于韩国成均馆大学传媒专业，GPA4.22。毕业荣获专业前10%优秀学生称号。</p></section><section class="reveal"><h2>我的优点是？</h2><p><strong>学习能力组织能力强。</strong>从本科阶段的小组作业到研究生阶段的助教对接，一直在团队中领导大家前进；从零开始学习韩语到考出成绩，自如对话只用了6个月。</p><p><strong>适应力强。</strong>当然一开始我也有不懂的地方，从本科刚开学第一次提交作业没有得到好的分数，到最后课题得到教授表扬，这个过程中我会快速发现自己的不足迅速调整完善自己。</p></section><section class="reveal"><h2>我习惯怎样思考？</h2><p>从资料、访谈与反馈中梳理问题，再转化为清晰的表达。</p></section><section class="reveal"><h2>我的性格怎样？</h2><p><strong>擅长社交：</strong>在组织汇报等“大场面”不会怯场，必要时可以变成无敌E人；同时在社交时懂得把握分寸。</p><p><strong>双角性人格：</strong>同时具备钝角的圆滑和锐角的锋利。</p></section></div></section>${daily()}${footer()}`;}
function daily(){const src='reference/daily.png',size=[1448,1086];const crops=[[65,153,270,320],[1117,171,284,306],[32,524,280,330],[345,717,281,291],[1136,576,280,320]];return `<section class="daily" id="daily" aria-label="我的日常"><h2>My "daily" life 📖 🍾</h2><img class="daily-main" src="assets/thinking.png" alt="侧目思考的李姝瑶头像贴纸">${crops.map((b,i)=>`<div class="photo p${i+1}">${slice(src,size,b,['日常自拍','海边旅行','毕业留念','小组学习','课堂汇报'][i])}</div>`).join('')}</section>`;}
function projects(){return `${hero('projects','project-list')}<section class="project-choices" id="project-list"><h2 class="section-label reveal">project</h2><a href="#/project/inbody" class="project-card reveal"><div class="preview-art">${slice('reference/inbody.png',[1024,1536],[98,562,828,320],'InBody 品牌分析项目材料')}</div><div><span class="eyebrow">01 / Brand Communication</span><h2>In Body<br>Campaign</h2><p>InBody｜B2C品牌整合营销项目</p><span class="text-link">查看项目 <span>↗</span></span></div></a><a href="#/project/app" class="project-card reveal"><div class="preview-art">${slice('reference/app.png',[864,1821],[64,1588,736,210],'App 界面原型与视觉设计')}</div><div><span class="eyebrow">02 / User Research & UX</span><h2>APP Design<br>Campaign</h2><p>从用户访谈、需求洞察到 Figma 原型。</p><span class="text-link">查看项目 <span>↗</span></span></div></a></section>${footer()}`;}
function projectHeader(title){return `<section class="project-hero"><a class="back-link" href="#/projects?section=project-list">← My project</a><h1>${title}</h1><h2 class="section-label">project</h2></section>`;}
function inbody(){return `${projectHeader('In Body<span>Campaign</span>')}<article class="content prose"><div class="project-intro reveal"><h2>InBody｜B2C品牌整合营销项目</h2><p>以家庭健康管理为切入点，分析InBody从B2B向B2C拓展过程中的品牌传播问题，提出SNS互动与线下体验相结合的整合营销方案。</p></div><h2 class="reveal">个人贡献</h2><div class="project-step reveal"><h3>1. 品牌与竞品分析</h3><p>运用SWOT框架梳理InBody竞争优势及B2C传播痛点，对比3家竞品的品牌定位与营销策略。</p>${material('reference/inbody.png',[1024,1536],[98,562,828,320],'品牌与竞品分析材料')}</div><div class="project-step reveal"><h3>2. SNS活动策划</h3><p>设计Instagram话题互动、健康习惯打卡及Story模板活动，构建消费者参与机制。</p>${material('reference/inbody.png',[1024,1536],[98,973,828,247],'SNS 互动活动策划')}</div><div class="project-step reveal"><h3>3. 线下快闪设计</h3><p>策划“习惯之家”沉浸式体验空间，设计健康测试、产品体验及互动打卡流程。</p>${material('reference/inbody.png',[1024,1536],[98,1285,796,250],'项目材料总览')}</div></article><div class="next-project"><span>Next project</span><a href="#/project/app">APP Design Campaign ↗</a></div>${footer()}`;}
function appProject(){const src='reference/app.png',sz=[864,1821];return `${projectHeader('APP Design<span>Campaign</span>')}<article class="content prose"><div class="project-intro reveal"><h2>App UX设计｜<em class="en">Figma Prototype</em></h2><p>针对留学生在海外求职过程中信息筛选困难、岗位匹配不足、沟通效率低等问题，采访了15名求助学生，通过访谈记录与Affinity Wall归纳核心用户痛点，设计集个性化职位推荐、求职指导与沟通服务于一体的求职辅助App。</p></div><h2 class="reveal">主要内容</h2><div class="project-step reveal"><h3>1. 了解核心用户需求</h3><p>独立设计访谈提纲并访谈15位求职学生，通过访谈记录与Affinity Wall归纳核心用户痛点。</p>${material(src,sz,[64,411,736,330],'Affinity Wall · 用户访谈归纳')}</div><div class="project-step reveal"><h3>2. 需求洞察</h3><p>基于研究结果构建用户画像与使用场景，将用户需求转化为产品功能方向。</p>${material(src,sz,[64,815,736,323],'Persona · 用户画像')}</div><div class="project-step reveal"><h3>3. 交互设计</h3><p>绘制User Flow，规划个性化职位推荐、求职辅助及沟通模块的信息架构与操作流程。</p>${material(src,sz,[64,1213,736,305],'Brainstorming · 功能方向梳理')}</div><div class="project-step reveal"><h3>4. UI原型</h3><p>使用Figma完成App界面设计及部分交互原型，呈现从用户需求到产品设计的转化过程。</p>${material(src,sz,[64,1588,343,210],'App Logo 与主色设计')}<div style="height:35px"></div>${material(src,sz,[407,1588,393,210],'Figma · App 界面原型')}</div></article><div class="next-project"><span>Explore more</span><a href="#/internship">My internship ↗</a></div>${footer()}`;}
function internship(){return `${hero('internship','media')}<section class="media-stage" id="media"><h2>My media<span>experience</span></h2><div class="book-art">${slice('reference/media.png',[1536,1024],[532,222,538,732],'个人媒体经历主题书籍')}</div></section><section class="content" id="experience"><h2 class="section-label reveal">internship</h2><div class="prose"><section class="reveal"><h2>辽宁报社｜新媒体编辑实习生</h2><p class="date">2025.01—2025.02</p><ul><li><strong>内容编辑：</strong>新闻选题调研、稿件编辑与信息整合。</li><li><strong>社媒运营：</strong>参与公众号图文排版、发布及后台互动数据观察。</li></ul></section><section class="reveal"><h2>辽宁广播电视台｜新闻编辑实习生</h2><p class="date">2023.06—2023.09</p><ul><li><strong>视频制作：</strong>使用Avid进行新闻素材筛选、视频剪辑与结构调整。</li><li><strong>内容把控：</strong>完成画面与文稿匹配、内容校对及播出交付。</li></ul></section></div><div class="photos-plain reveal"><button class="material" data-image="assets/avid.jpg" data-caption="Avid 新闻剪辑学习笔记" aria-label="放大 Avid 学习笔记"><img src="assets/avid.jpg" alt="Avid新闻剪辑学习笔记原图" loading="lazy"></button><button class="material" data-image="assets/pass.jpg" data-caption="辽宁广播电视台实习记录" aria-label="放大电视台实习照片"><img src="assets/pass.jpg" alt="辽宁广播电视台实习通行证与建筑原图" loading="lazy"></button></div><div class="prose reveal"><h2>我锻炼出了什么技能？</h2><p class="skills">Content Editing · Social Media Content · Video Editing · Content Review</p></div></section>${footer()}`;}
function subject(){return `${hero('subject','some-subject')}<section class="content" id="some-subject"><h2 class="section-label reveal">Some subject</h2><div class="subject-body"><div class="prose"><section class="reveal"><h2>📱 小红书内容运营</h2><p>白天学习，晚上在小红书剪视频。</p><p>从封面排版到内容发布，亲自体验一条笔记从0到1的过程。</p></section><section class="reveal"><h2>📚 大学助教生活</h2><p>除了当学生，同时也在研究生阶段体验了助教生活。</p><p>整理作业、管理成绩、协助课堂，活动举办，我在这样的沟通环境中升级了自己多任务处理的能力。以及也算是体验了学生身份到“职场人”的转变。</p></section></div><img class="subject-art" src="assets/subject-cutout.png" alt="李姝瑶与大学生活主题巨型手机透明底拼贴" loading="lazy"></div></section>${footer()}`;}

let currentRoute='',navToken=0,lastFocus=null;
let revealObserver;
function activate(){
  revealObserver?.disconnect();
  revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.07});
  document.querySelectorAll('.reveal').forEach(e=>revealObserver.observe(e));
  document.querySelectorAll('.material').forEach(el=>el.addEventListener('click',()=>{lastFocus=el;const d=$('#image-viewer');d.querySelector('#viewer-art').innerHTML=el.dataset.box?slice(el.dataset.image,el.dataset.size.split(',').map(Number),el.dataset.box.split(',').map(Number),el.dataset.caption):`<img src="${el.dataset.image}" alt="${escapeHTML(el.dataset.caption)}">`;d.querySelector('p').textContent=el.dataset.caption;d.showModal();}));
  window.siteMotion?.mount();
}
function setMenu(open,restore=true){
  const menu=$('#navigation'),toggle=$('#menu-toggle');
  if(open){lastFocus=document.activeElement;menu.hidden=false;document.body.classList.add('menu-open');toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','关闭菜单');requestAnimationFrame(()=>menu.querySelector('a').focus({preventScroll:true}));}
  else{menu.hidden=true;document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','打开菜单');if(restore)toggle.focus({preventScroll:true});}
}
$('#menu-toggle').addEventListener('click',()=>setMenu($('#navigation').hidden));
$('#navigation').addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false,false);});
document.addEventListener('keydown',e=>{
  if(!$('#navigation').hidden){if(e.key==='Escape'){setMenu(false);return;}if(e.key==='Tab'){const links=[$('#menu-toggle'),...$('#navigation').querySelectorAll('a'),$('#header .start')];const i=links.indexOf(document.activeElement);e.preventDefault();links[(i+(e.shiftKey?-1:1)+links.length)%links.length].focus();}}
});
$('#image-viewer>.round').addEventListener('click',()=>$('#image-viewer').close());
$('#image-viewer').addEventListener('click',e=>{if(e.target===$('#image-viewer'))$('#image-viewer').close();});
$('#image-viewer').addEventListener('close',()=>lastFocus?.focus({preventScroll:true}));
async function render(){
  const token=++navToken;
  const [path,query='']=(location.hash.slice(1)||'/').split('?');
  const target=new URLSearchParams(query).get('section');
  const routes={'/':home,'/about':about,'/projects':projects,'/project/inbody':inbody,'/project/app':appProject,'/internship':internship,'/subject':subject};
  const route=routes[path]?path:'/';
  const changed=currentRoute!==route;
  if(!$('#navigation').hidden)setMenu(false,false);
  if(changed){
    if(currentRoute&&!reduced){$('.page-curtain').classList.remove('play');void $('.page-curtain').offsetWidth;$('.page-curtain').classList.add('play');await new Promise(r=>setTimeout(r,260));}
    if(token!==navToken)return;
    window.siteMotion?.clear();currentRoute=route;main.innerHTML=routes[route]();main.dataset.route=route;document.body.classList.toggle('is-home',route==='/');
    document.title=`${({'/':'首页','/about':'About me','/projects':'My project','/project/inbody':'In Body Campaign','/project/app':'APP Design Campaign','/internship':'My internship','/subject':'Some subject'})[route]} · LI SHUYAO`;
    window.scrollTo({top:0,behavior:'instant'});activate();
  }
  if(target){requestAnimationFrame(()=>document.getElementById(target)?.scrollIntoView({behavior:changed?'instant':reduced?'instant':'smooth'}));}
  else if(!changed)window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});
  window.parent.postMessage({type:'site-route',route,target},location.origin);
}
$('.page-curtain').addEventListener('animationend',()=>$('.page-curtain').classList.remove('play'));
window.addEventListener('hashchange',render);
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#/"]');if(a&&a.getAttribute('href')===location.hash){e.preventDefault();render();}});
let ticking=false;
window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const y=window.scrollY;document.body.classList.toggle('scrolled',y>80);if(!reduced){const a=$('.home-art');if(a)a.style.translate=`0 ${Math.min(y*.16,130)}px`;const daily=$('.daily');if(daily){const r=daily.getBoundingClientRect();daily.style.setProperty('--offset',`${Math.max(-35,Math.min(35,-r.top*.035))}px`);}}ticking=false;});},{passive:true});
window.addEventListener('message',e=>{if(e.origin!==location.origin)return;if(e.data?.type==='preview-menu')setMenu(!!e.data.open,false);if(e.data?.type==='preview-position')requestAnimationFrame(()=>{if(e.data.target)document.getElementById(e.data.target)?.scrollIntoView({behavior:'instant'});else window.scrollTo({top:0,behavior:'instant'});});});
render();
