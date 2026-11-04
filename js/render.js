/* วาดบทความ/เรื่องสั้นจาก data/*.json  (เพิ่ม-แก้เนื้อหาที่ไฟล์ข้อมูล ไม่ต้องแก้ HTML) */
(function(){
 var B=document.body.dataset.base||'',IMG=window.IMGMAP||{},data={articles:[],stories:[]};
 function src(p){p=String(p||'').replace(/^\//,'');return IMG[p]||(B+p)}
 function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function href(id){return window.ARTICLE_HREF?ARTICLE_HREF(id):B+'pages/article.html?id='+encodeURIComponent(id)}
 function page(n){return window.PAGE_HREF?PAGE_HREF(n):B+'pages/'+n+'.html'}
 function paras(t){return String(t||'').split(/\n\s*\n/).filter(function(x){return x.trim()}).map(function(x){return '<p>'+esc(x.trim()).replace(/\n/g,'<br>')+'</p>'}).join('')}
 
 /* เนื้อหาบทความแบบ Markdown (หัวข้อย่อย ตัวหนา/เอียง ลิงก์ รูป รายการ คำอ้างอิง) — escape HTML ก่อนเสมอ และรับเฉพาะลิงก์ที่ปลอดภัย */
 function safeUrl(u){u=String(u||'').replace(/&amp;/g,'&').trim();if(/^(https?:|mailto:|tel:|#)/i.test(u))return u;if(/^[a-z][a-z0-9+.-]*:/i.test(u)||/^\/\//.test(u))return '';return src(u)}
 function inline(t){var keep=[];function hold(h){keep.push(h);return '\u0000'+(keep.length-1)+'\u0000'}
  t=esc(t).replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;.*?&quot;)?\)/g,function(m,a,u){var s=safeUrl(u);return s?hold('<img src="'+esc(s)+'" alt="'+a+'">'):a})
   .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;.*?&quot;)?\)/g,function(m,a,u){var s=safeUrl(u);return s?hold('<a href="'+esc(s)+'"'+(/^https?:/i.test(s)?' target="_blank" rel="noopener"':'')+'>'+a+'</a>'):a});
  t=t.replace(/\*\*(.+?)\*\*|__(.+?)__/g,function(m,a,b){return '<strong>'+(a||b)+'</strong>'}).replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)|(^|[^_\w])_([^_\n]+)_(?!\w)/g,function(m,p1,a,p2,b){return (p1||p2||'')+'<em>'+(a||b)+'</em>'});
  return t.replace(/\u0000(\d+)\u0000/g,function(m,i){return keep[+i]})}
 function md(text){var L=String(text||'').replace(/\r\n?/g,'\n').split('\n'),o=[],p=[],list=null,q=[];
  function fp(){if(p.length){o.push('<p>'+p.map(inline).join('<br>')+'</p>');p=[]}}
  function fl(){if(list){o.push('<'+list.t+'>'+list.i.map(function(x){return '<li>'+inline(x)+'</li>'}).join('')+'</'+list.t+'>');list=null}}
  function fq(){if(q.length){o.push('<blockquote>'+q.map(inline).join('<br>')+'</blockquote>');q=[]}}
  function all(){fp();fl();fq()}
  L.forEach(function(l){var m;
   if(!l.trim()){all();return}
   if(m=l.match(/^(#{1,6})\s+(.*)$/)){all();var n=m[1].length<=2?2:m[1].length===3?3:4;o.push('<h'+n+'>'+inline(m[2])+'</h'+n+'>');return}
   if(/^\s*([-*_])(\s*\1){2,}\s*$/.test(l)){all();o.push('<hr>');return}
   if(m=l.match(/^>\s?(.*)$/)){fp();fl();q.push(m[1]);return}
   if(m=l.match(/^\s*[-*+]\s+(.*)$/)){fp();fq();if(!list||list.t!=='ul'){fl();list={t:'ul',i:[]}}list.i.push(m[1]);return}
   if(m=l.match(/^\s*\d+[.)]\s+(.*)$/)){fp();fq();if(!list||list.t!=='ol'){fl();list={t:'ol',i:[]}}list.i.push(m[1]);return}
   fl();fq();p.push(l.trim())});
  all();return o.join('')}
 var MON=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
 function fmtDate(d){var m=String(d||'').match(/^(\d{4})-(\d{2})-(\d{2})/);return m&&MON[+m[2]-1]?(+m[3])+' '+MON[+m[2]-1]+' '+(+m[1]+543):String(d||'')}
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
  el.innerHTML='<a class="back" href="'+page('articles')+'">← บทความทั้งหมด</a><h1>'+esc(a.title)+'</h1>'+(a.date?'<p class="meta">'+esc(fmtDate(a.date))+'</p>':'')+(a.image?'<img class="cover" src="'+src(a.image)+'" alt="">':'')+'<div class="prose">'+md(a.body||a.excerpt)+'</div>';
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
