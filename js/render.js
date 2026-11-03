/* วาดบทความ/เรื่องสั้นจาก data/*.json  (เพิ่ม-แก้เนื้อหาที่ไฟล์ข้อมูล ไม่ต้องแก้ HTML) */
(function(){
 var B=document.body.dataset.base||'',IMG=window.IMGMAP||{},data={articles:[],stories:[]};
 function src(p){p=String(p||'').replace(/^\//,'');return IMG[p]||(B+p)}
 function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function href(id){return window.ARTICLE_HREF?ARTICLE_HREF(id):B+'pages/article.html?id='+encodeURIComponent(id)}
 function page(n){return window.PAGE_HREF?PAGE_HREF(n):B+'pages/'+n+'.html'}
 function paras(t){return String(t||'').split(/\n\s*\n/).filter(function(x){return x.trim()}).map(function(x){return '<p>'+esc(x.trim()).replace(/\n/g,'<br>')+'</p>'}).join('')}
 function done(){document.dispatchEvent(new Event('site:rendered'))}
 function load(){
  if(window.SITE_DATA&&(location.protocol==='file:'||window.SITE_INLINE))return Promise.resolve(window.SITE_DATA);
  return Promise.all(['articles','stories'].map(function(n){return fetch(B+'data/'+n+'.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw 0;return r.json()})}))
   .then(function(a){return {articles:a[0].items||[],stories:a[1].items||[]}})
   .catch(function(){if(window.SITE_DATA)return window.SITE_DATA;throw 0});
 }
 function card(a){return '<div><article class="card art">'+(a.image?'<img class="thumb" src="'+src(a.image)+'" alt="">':'<div class="thumb ph"></div>')+
  '<div class="body"><h3><a href="'+href(a.id)+'">'+esc(a.title)+'</a></h3><p>'+esc(a.excerpt)+'</p><a class="more" href="'+href(a.id)+'">อ่านเพิ่มเติม →</a></div></article></div>'}
 function grid(el){
  var size=6,pg=1,q=document.getElementById('q'),cnt=document.querySelector('.count'),emp=document.querySelector('.empty'),pager=document.querySelector('.pager');
  function draw(){
   var v=q?q.value.trim().toLowerCase():'',all=data.articles.filter(function(a){return !v||(a.title+' '+a.excerpt).toLowerCase().indexOf(v)>-1}),pages=Math.max(1,Math.ceil(all.length/size));
   if(pg>pages)pg=pages;var list=v?all:all.slice((pg-1)*size,pg*size);
   el.innerHTML=list.map(card).join('');emp.style.display=all.length?'none':'block';cnt.textContent=v&&all.length?'พบ '+all.length+' บทความ':'';
   var h='';if(!v&&pages>1){for(var i=1;i<=pages;i++)h+='<a href="#"'+(i===pg?' class="on" aria-current="page"':'')+' data-p="'+i+'">'+i+'</a>';h+='<a href="#" data-p="'+pages+'">หน้าสุดท้าย</a>'}
   pager.innerHTML=h;done()}
  pager.addEventListener('click',function(e){var a=e.target.closest('a[data-p]');if(!a)return;e.preventDefault();pg=+a.dataset.p;draw();var s=document.querySelector('.search');if(s)s.scrollIntoView()});
  if(q){q.addEventListener('input',function(){pg=1;draw()});document.getElementById('search-form').addEventListener('submit',function(e){e.preventDefault();draw()})}
  draw();
 }
 function home(el){
  var f=data.articles.filter(function(a){return a.featured}),rest=data.articles.filter(function(a){return !a.featured}),m=f[0]||data.articles[0];if(!m)return;
  var o=f.slice(1).concat(rest).filter(function(a){return a!==m}).slice(0,2);
  el.innerHTML='<article class="feat-main">'+(m.image?'<img src="'+src(m.image)+'" alt="">':'<div class="ph"></div>')+'<div class="body"><h3>'+esc(m.title)+'</h3><p>'+esc(m.excerpt)+'</p><a class="chip" href="'+href(m.id)+'">อ่านบทความ</a></div></article>'+
   '<div class="feat-list"><small>บทความอื่น ๆ</small>'+o.map(function(a){return '<div class="item"><h4>'+esc(a.title)+'</h4><a class="chip" href="'+href(a.id)+'">อ่านบทความ</a></div>'}).join('')+'<a class="btn" href="'+page('articles')+'">ดูบทความทั้งหมด</a></div>';
 }
 function stories(el){
  el.innerHTML=data.stories.map(function(s){var ext=/^https?:/.test(s.link||'');
   return '<article class="story">'+(s.cover?'<img src="'+src(s.cover)+'" alt="ปก'+esc(s.title)+'">':'<div class="ph"></div>')+'<div><h2>'+esc(s.title)+'</h2><p class="by">ผู้แต่ง : '+esc(s.author)+'</p><p>'+esc(s.description)+'</p><a class="btn btn-sm" href="'+esc(s.link||'#')+'"'+(ext?' target="_blank" rel="noopener"':'')+'>อ่าน</a></div></article>'}).join('');
 }
 function detail(el,id){
  var a=data.articles.filter(function(x){return x.id===id})[0];
  if(!a){el.innerHTML='<a class="back" href="'+page('articles')+'">← บทความทั้งหมด</a><p class="blank">ไม่พบบทความนี้</p>';return}
  el.innerHTML='<a class="back" href="'+page('articles')+'">← บทความทั้งหมด</a><h1>'+esc(a.title)+'</h1>'+(a.date?'<p class="meta">'+esc(a.date)+'</p>':'')+(a.image?'<img class="cover" src="'+src(a.image)+'" alt="">':'')+'<div class="prose">'+paras(a.body||a.excerpt)+'</div>';
  if(!window.SITE_INLINE)document.title=a.title+' | ศูนย์บริรักษ์ ศิริราช';done();
 }
 var ready=load().then(function(d){data=d;
  var g=document.querySelector('[data-render="articles-grid"]');if(g)grid(g);
  var h=document.querySelector('[data-render="home-articles"]');if(h)home(h);
  var s=document.querySelector('[data-render="stories"]');if(s)stories(s);
  var t=document.querySelector('[data-render="article-detail"]');if(t&&!window.SITE_INLINE)detail(t,new URLSearchParams(location.search).get('id'));
  done()}).catch(function(){document.querySelectorAll('[data-render]').forEach(function(e){e.innerHTML='<p class="blank">โหลดเนื้อหาไม่ได้ (ถ้าเปิดไฟล์ในเครื่อง ให้ตรวจว่ามีไฟล์ data/data.js)</p>'})});
 document.addEventListener('click',function(e){var a=e.target.closest('a[href="#"]');if(a)e.preventDefault()});
 window.SiteRender={ready:ready,detail:detail};
})();
