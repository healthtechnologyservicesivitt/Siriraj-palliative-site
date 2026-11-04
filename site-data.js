/* ข้อมูลหน้าเว็บ (ข้อความ/รูป/เมนู) จาก data/pages/*.json  — แก้ได้ที่หลังบ้าน /admin > หน้าเว็บ
   ถ้าโหลดข้อมูลไม่ได้ เว็บจะแสดงข้อความเดิมที่เขียนไว้ใน HTML (ไม่พัง) */
(function(){
 var body=document.body,B=body.dataset.base||'',PAGE=body.dataset.page||'';
 var local=window.SITE_DATA&&window.SITE_DATA.pages,INLINE=!!local&&(location.protocol==='file:'||!!window.SITE_INLINE);
 var PATH={home:'index.html',posts:'pages/posts.html',about:'pages/about.html',articles:'pages/articles.html',knowledge:'pages/knowledge.html',stories:'pages/stories.html',media:'pages/media.html',contact:'pages/contact.html'};
 var ICONS={
  body:'<circle cx="12" cy="5" r="2.5"/><path d="M12 8v6m0 0l-3 6m3-6l3 6M6 10.5l6-1.5 6 1.5"/>',
  heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  spirit:'<circle cx="12" cy="12" r="3.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
  family:'<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
  social:'<circle cx="8" cy="8" r="2.5"/><circle cx="16.5" cy="9" r="2"/><path d="M3.5 19c0-3 2-5 4.5-5s4.5 2 4.5 5M14 14.5c2.5-.5 6.5.5 6.5 4.5"/>',
  plan:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4M9 15l2 2 4-4"/>'};
 var cache={};

 function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function src(p){p=String(p||'');if(/^(https?:|data:)/.test(p))return p;p=p.replace(/^\//,'');return (window.IMGMAP&&IMGMAP[p])||(B+p)}
 /* ลิงก์: ถ้ากรอกลิงก์เอง ใช้ลิงก์นั้น ไม่งั้นใช้หน้าที่เลือก (page = รหัสหน้า) */
 function link(p,u){u=String(u||'').trim();
  if(u)return /^(https?:|mailto:|tel:|#)/i.test(u)?u:B+u.replace(/^\//,'');
  return p&&PATH[p]?(window.PAGE_HREF&&p!=='home'?PAGE_HREF(p):B+PATH[p]):''}
 function ext(h){return /^https?:/i.test(h)?' target="_blank" rel="noopener"':''}
 function paras(t){return String(t||'').split(/\n\s*\n/).filter(function(x){return x.trim()}).map(function(x){
  return '<p>'+esc(x.trim()).replace(/\*\*(.+?)\*\*/g,'<b class="pu">$1</b>').replace(/\n/g,'<br>')+'</p>'}).join('')}
 function wrap(h,inner,cls){return h?'<a'+(cls?' class="'+cls+'"':'')+' href="'+esc(h)+'"'+ext(h)+'>'+inner+'</a>':inner}

 function peek(n){
  if(INLINE)return local[n]||null;
  try{var v=localStorage.getItem('sd:'+n);return v?JSON.parse(v):null}catch(e){return null}}
 function get(n){
  if(!cache[n]){
   var fb=(local&&local[n])||null;
   cache[n]=INLINE?Promise.resolve(fb):fetch(B+'data/pages/'+n+'.json',{cache:'no-cache'})
    .then(function(r){if(!r.ok)throw 0;return r.json()})
    .then(function(d){if(n==='settings'||n==='contact'){try{localStorage.setItem('sd:'+n,JSON.stringify(d))}catch(e){}}return d})
    .catch(function(){return fb});
  }
  return cache[n]}
 function pick(o,path){return String(path).split('.').reduce(function(a,k){return a==null?a:a[k]},o)}
 function empty(v){return v==null||String(v).trim()===''}

 /* เติมข้อความตาม data-f / data-fp / data-fsrc / data-falt  (data-from = ไฟล์ข้อมูลที่ใช้ ถ้าไม่ระบุ = ไฟล์ของหน้านั้น) */
 function bind(d,from){
  function mine(el){return (el.dataset.from||PAGE)===from}
  [].forEach.call(document.querySelectorAll('[data-f]'),function(el){if(!mine(el))return;var v=pick(d,el.dataset.f);
   el.textContent=empty(v)?'':v;
   if(el.hasAttribute('data-opt')){var w=el.closest('[data-optwrap]')||el;w.style.display=empty(v)?'none':''}});
  [].forEach.call(document.querySelectorAll('[data-fp]'),function(el){if(!mine(el))return;var v=pick(d,el.dataset.fp);if(!empty(v))el.innerHTML=paras(v)});
  [].forEach.call(document.querySelectorAll('[data-fsrc]'),function(el){if(!mine(el))return;var v=pick(d,el.dataset.fsrc);if(!empty(v))el.setAttribute('src',src(v))});
  [].forEach.call(document.querySelectorAll('[data-falt]'),function(el){if(!mine(el))return;var v=pick(d,el.dataset.falt);if(v!=null)el.setAttribute('alt',v)});
 }
 function list(name){return document.querySelector('[data-list="'+name+'"]')}
 function fill(name,arr,fn){var el=list(name);if(el&&Array.isArray(arr)&&arr.length)el.innerHTML=arr.map(fn).join('')}
 function ph(i){return i?'<img src="'+esc(src(i))+'" alt="">':'<div class="ph"></div>'}
 function done(root){if(window.SiteFixImgs)SiteFixImgs(root||document);document.dispatchEvent(new Event('site:rendered'))}

 var R={
  home:function(d){
   bind(d,'home');
   var h=d.hero||{},b=document.querySelector('.hero .btn');
   if(b&&!empty(h.button_text)){b.textContent=h.button_text;var l=link(h.button_page,h.button_url);if(l){b.href=l;if(ext(l))b.target='_blank'}}
   fill('intro-cards',(d.intro||{}).cards,function(c){var l=link(c.page,c.url);
    return '<article class="card">'+ph(c.image)+'<div class="body"><h3>'+wrap(l,esc(c.title))+'</h3><p>'+esc(c.text)+'</p></div></article>'});
   fill('care-items',(d.care||{}).items,function(c){var l=link(c.page,c.url);
    return '<div class="mini"><span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[c.icon]||ICONS.heart)+'</svg></span><div><h4>'+wrap(l,esc(c.title))+'</h4><p>'+esc(c.text)+'</p></div></div>'});
  },
  about:function(d){
   bind(d,'about');
   fill('services',d.services,function(s){return '<div class="svc">'+ph(s.image)+'<div class="svc-text"><h3>'+esc(s.title)+'</h3><p>'+esc(s.text)+'</p></div></div>'});
  },
  contact:function(d){bind(d,'contact')},
  media:function(d){
   bind(d,'media');
   var el=list('gallery'),im=(d.images||[]).filter(function(x){return x&&x.image});
   if(!el||!im.length)return;
   function fig(x){return '<figure><img src="'+esc(src(x.image))+'" alt="'+esc(x.alt||'')+'"></figure>'}
   function cols(a){var c1=a.filter(function(_,i){return i%2===0}),c2=a.filter(function(_,i){return i%2===1});
    return '<div class="mcol">'+c1.map(fig).join('')+'</div>'+(c2.length?'<div class="mcol">'+c2.map(fig).join('')+'</div>':'')}
   var h='',i=0;
   /* รูปแบบเดิมของแบบ: ชุดละ 7 รูป = แถวบน 2 คอลัมน์ (4 รูป) + แถวล่างคอลัมน์เล็ก 2 รูป กับรูปใหญ่ 1 รูป */
   while(im.length-i>=7){var g=im.slice(i,i+7);
    h+='<div class="mrow r1">'+cols(g.slice(0,4))+'</div><div class="mrow r3"><div class="mcol">'+fig(g[4])+fig(g[6])+'</div>'+fig(g[5])+'</div>';i+=7}
   while(i<im.length){var g2=im.slice(i,i+4);h+='<div class="mrow r1">'+cols(g2)+'</div>';i+=4}
   el.innerHTML=h;
  }
 };

 window.SiteData={get:get,peek:peek,link:link,src:src,esc:esc,ext:ext,paras:paras,PATH:PATH,ready:null};

 /* วาดเนื้อหาของหน้านี้ + ส่วนที่ดึงจากไฟล์ติดต่อ (หน้าหลักมีแถบติดต่อ) */
 var jobs=[];
 if(R[PAGE])jobs.push(get(PAGE).then(function(d){if(d)R[PAGE](d)}));
 if(PAGE==='home')jobs.push(get('contact').then(function(d){if(d)bind(d,'contact')}));
 window.SiteData.ready=Promise.all(jobs).then(function(){done(document)}).catch(function(){});
})();
