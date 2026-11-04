/* Gentle interactions: scroll reveal, progress bar, font size, back-to-top, lightbox, skip link */
(function(){
 var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 function fx(tag,cls,html){var e=document.createElement(tag);e.className='fx '+cls;if(html)e.innerHTML=html;document.body.appendChild(e);return e}
 /* 1. ค่อยๆ ปรากฏเมื่อเลื่อนมาถึง (เรียกซ้ำได้หลังวาดเนื้อหาจากข้อมูล) */
 var io=null,SEL=['.page-head','.s-title','.lead','.card','.care-text','.mini','.feat-main','.feat-list .item','.story','.masonry figure','.about-top > *','.svc','.tagline','.panel','.contact-strip > div','.search','.pager'];
 function reveal(){if(RM||!('IntersectionObserver' in window))return;
  io=io||new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  var n=0;SEL.forEach(function(sel){document.querySelectorAll(sel).forEach(function(el){if(el.dataset.rv)return;el.dataset.rv=1;el.classList.add('rv');el.style.setProperty('--d',(n++%4)*.09+'s');io.observe(el)})})}
 reveal();document.addEventListener('site:rendered',reveal);
 /* 2. แถบความคืบหน้า + ปุ่มกลับขึ้นบน */
 var bar=fx('div','progress'),top=fx('button','totop','↑');top.type='button';top.setAttribute('aria-label','กลับขึ้นด้านบน');
 function onScroll(){var d=document.documentElement,max=d.scrollHeight-innerHeight;bar.style.transform='scaleX('+(max>0?Math.min(scrollY/max,1):0)+')';top.classList.toggle('show',scrollY>600)}
 addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);addEventListener('hashchange',function(){setTimeout(onScroll,60)});onScroll();
 top.onclick=function(){scrollTo({top:0,behavior:RM?'auto':'smooth'})};
 /* 3. ปรับขนาดตัวอักษร (จำค่าไว้) */
 var sizes=[1,1.15,1.3],labels=['เล็ก','กลาง','ใหญ่'],box=fx('div','fsize'),cur=0;
 box.setAttribute('role','group');box.setAttribute('aria-label','ขนาดตัวอักษร');
 try{cur=+localStorage.getItem('fs')||0}catch(e){}
 function apply(i){cur=i;[].forEach.call(document.body.children,function(el){if(!el.classList.contains('fx')&&el.tagName!=='SCRIPT')el.style.zoom=sizes[i]});
  [].forEach.call(box.children,function(b,j){b.setAttribute('aria-pressed',j===i)});try{localStorage.setItem('fs',i)}catch(e){}setTimeout(onScroll,50)}
 sizes.forEach(function(s,i){var b=document.createElement('button');b.type='button';b.textContent='ก';b.style.fontSize=(14+i*4)+'px';b.setAttribute('aria-label','ตัวอักษรขนาด'+labels[i]);b.onclick=function(){apply(i)};box.appendChild(b)});
 apply(cur);
 /* 4. ดูรูปขยายในหน้า สื่อ (อ่านรายการรูปตอนกดเปิด เพราะแกลเลอรีวาดจากข้อมูลทีหลังได้) */
 if(document.querySelector('.masonry')){
  var lb=fx('div','lb');lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-label','ดูรูปขยาย');
  lb.innerHTML='<button class="lb-x" type="button" aria-label="ปิด">✕</button><button class="lb-p" type="button" aria-label="ภาพก่อนหน้า">‹</button><img alt=""><button class="lb-n" type="button" aria-label="ภาพถัดไป">›</button>';
  var big=lb.querySelector('img'),at=0,opener=null,pics=[];
  function list(){pics=[].slice.call(document.querySelectorAll('.masonry img'))}
  function prep(){list();pics.forEach(function(p){if(p.dataset.lb)return;p.dataset.lb=1;p.tabIndex=0;p.setAttribute('role','button')})}
  function show(i){at=(i+pics.length)%pics.length;big.src=pics[at].src;big.alt=pics[at].alt}
  function open(i){opener=document.activeElement;list();show(i);lb.hidden=false;lb.querySelector('.lb-x').focus()}
  function close(){lb.hidden=true;if(opener)opener.focus()}
  prep();document.addEventListener('site:rendered',prep);
  document.addEventListener('click',function(e){var p=e.target.closest&&e.target.closest('.masonry img');if(p){list();open(pics.indexOf(p))}});
  document.addEventListener('keydown',function(e){var p=e.target.closest&&e.target.closest('.masonry img');if(p&&(e.key==='Enter'||e.key===' ')){e.preventDefault();list();open(pics.indexOf(p))}});
  lb.querySelector('.lb-x').onclick=close;lb.querySelector('.lb-p').onclick=function(){show(at-1)};lb.querySelector('.lb-n').onclick=function(){show(at+1)};
  lb.onclick=function(e){if(e.target===lb)close()};
  document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(at-1);if(e.key==='ArrowRight')show(at+1)});
 }
 /* 5. ลิงก์ข้ามไปเนื้อหาหลัก (สำหรับคีย์บอร์ด) */
 var sk=fx('a','skip','ข้ามไปเนื้อหาหลัก');sk.href='#';document.body.insertBefore(sk,document.body.firstChild);
 sk.onclick=function(e){e.preventDefault();var m=document.querySelector('main');m.setAttribute('tabindex','-1');m.focus()};
})();
