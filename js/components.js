/* Header + footer shared by every page. Edit the menu here once. */
(function(){
 var b=document.body, base=b.dataset.base||'', page=b.dataset.page||'';
 var menu=[['home','หน้าหลัก','index.html'],['posts','โพสต์','pages/posts.html'],['about','เกี่ยวกับ','pages/about.html'],
  ['articles','บทความ','pages/articles.html'],['knowledge','ความรู้','pages/knowledge.html'],
  ['stories','เรื่องสั้น','pages/stories.html'],['media','สื่อ','pages/media.html'],['contact','ติดต่อเรา','pages/contact.html']];
 var links=menu.map(function(m){return '<a href="'+base+m[2]+'"'+(m[0]===page?' class="active" aria-current="page"':'')+'>'+m[1]+'</a>'}).join('');
 var header='<header class="site-header"><div class="wrap"><a class="logo" href="'+base+'index.html"><img src="'+base+'images/logo.png" alt="ศูนย์บริรักษ์ ศิริราช"></a>'+
  '<button class="nav-toggle" aria-label="เมนู" aria-expanded="false">☰</button><nav class="nav" aria-label="เมนูหลัก">'+links+'</nav></div></header>';
 var footer='<footer class="site-footer"><div class="wrap"><div class="foot"><div><img src="'+base+'images/logo.png" alt="ศูนย์บริรักษ์ ศิริราช">'+
  '<p class="tag">พื้นที่แห่งความรู้และการดูแล สำหรับผู้ป่วย ครอบครัว และผู้ดูแล</p></div>'+
  '<div><h4>เมนู</h4><ul><li>Palliative Care</li><li>ความรู้</li><li>ข่าวสาร</li><li>ดาวน์โหลด</li></ul></div>'+
  '<div><h4>ข้อมูลสำหรับผู้ป่วย</h4><ul><li>ผู้ป่วย</li><li>ครอบครัว</li><li>ผู้ดูแล</li></ul></div>'+
  '<div><h4>ติดต่อเรา</h4><ul><li>0-2XXX-XXXX</li><li>palliative@example.ac.th</li></ul></div></div>'+
  '<div class="copy">© 2569 ศูนย์บริรักษ์ ศิริราช สงวนลิขสิทธิ์</div></div></footer>';
 var h=document.getElementById('site-header'),f=document.getElementById('site-footer');
 if(h)h.outerHTML=header; if(f)f.outerHTML=footer;
 var t=document.querySelector('.nav-toggle'),n=document.querySelector('.nav');
 t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o)});
 /* รูปที่ยังไม่มีไฟล์ -> แสดงกล่องสีแทน */
 document.querySelectorAll('img').forEach(function(i){i.addEventListener('error',function(){i.removeAttribute('src');i.classList.add('ph')});if(i.complete&&!i.naturalWidth)i.dispatchEvent(new Event('error'))});
})();
