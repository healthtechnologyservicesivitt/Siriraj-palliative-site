/* Header + footer shared by every page.
   เมนู/ชื่อเว็บ/โลโก้/ลิงก์ footer แก้ได้ที่หลังบ้าน (หน้าเว็บ > ตั้งค่าทั่วไป) — ค่าด้านล่างเป็นค่าเริ่มต้นสำรอง */
(function(){
 var b=document.body, base=b.dataset.base||'', page=b.dataset.page||'', SD=window.SiteData;
 var LABEL={home:'หน้าหลัก',posts:'โพสต์',about:'เกี่ยวกับ',articles:'บทความ',knowledge:'ความรู้',stories:'เรื่องสั้น',media:'สื่อ',contact:'ติดต่อเรา'};
 var ORDER=['home','posts','about','articles','knowledge','stories','media','contact'];
 var DEF={site_name:'ศูนย์บริรักษ์ ศิริราช',tagline:'พื้นที่แห่งความรู้และการดูแล สำหรับผู้ป่วย ครอบครัว และผู้ดูแล',logo:'images/logo.png',
  menu:ORDER.map(function(k){return {page:k,label:LABEL[k],show:true}}),
  footer_columns:[{title:'เมนู',links:[{label:'Palliative Care'},{label:'ความรู้',page:'knowledge'},{label:'ข่าวสาร'},{label:'ดาวน์โหลด'}]},
   {title:'ข้อมูลสำหรับผู้ป่วย',links:[{label:'ผู้ป่วย'},{label:'ครอบครัว'},{label:'ผู้ดูแล'}]}],
  footer_contact_title:'ติดต่อเรา',copyright:'© 2569 ศูนย์บริรักษ์ ศิริราช สงวนลิขสิทธิ์'};
 var DEFC={phone:'0-2XXX-XXXX',email:'palliative@example.ac.th',hours:''};
 function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function has(v){return v!=null&&String(v).trim()!==''}
 function href(p){return SD?SD.link(p):base+(p==='home'?'index.html':'pages/'+p+'.html')}
 function imgSrc(p){return SD?SD.src(p):base+String(p||'').replace(/^\//,'')}

 function menuItems(s){
  var seen={},out=[];
  (s.menu||[]).forEach(function(m){var k=m.page||m.key;if(!LABEL[k]||seen[k])return;seen[k]=1;out.push({page:k,label:has(m.label)?m.label:LABEL[k],show:m.show!==false})});
  ORDER.forEach(function(k){if(!seen[k])out.push({page:k,label:LABEL[k],show:true})}); /* หน้าที่ขาดหายไปจะกลับมาเอง ไม่ให้เมนูพัง */
  return out.filter(function(m){return m.show})}

 function build(s,c){
  s=s||DEF;c=c||DEFC;
  var name=has(s.site_name)?s.site_name:DEF.site_name,logo=imgSrc(has(s.logo)?s.logo:DEF.logo);
  var links=menuItems(s).map(function(m){return '<a href="'+esc(href(m.page))+'"'+(m.page===page?' class="active" aria-current="page"':'')+'>'+esc(m.label)+'</a>'}).join('');
  var header='<header class="site-header"><div class="wrap"><a class="logo" href="'+esc(href('home'))+'"><img src="'+esc(logo)+'" alt="'+esc(name)+'"></a>'+
   '<button class="nav-toggle" aria-label="เมนู" aria-expanded="false">☰</button><nav class="nav" aria-label="เมนูหลัก">'+links+'</nav></div></header>';
  var cols=(s.footer_columns||[]).map(function(col){
   return '<div><h4>'+esc(col.title)+'</h4><ul>'+(col.links||[]).map(function(l){var h=SD?SD.link(l.page,l.url):'';
    return '<li>'+(h?'<a href="'+esc(h)+'"'+(SD?SD.ext(h):'')+'>'+esc(l.label)+'</a>':esc(l.label))+'</li>'}).join('')+'</ul></div>'}).join('');
  var ct=[c.phone,c.email,c.hours].filter(has).map(function(x){return '<li>'+esc(x)+'</li>'}).join('');
  var footer='<footer class="site-footer"><div class="wrap"><div class="foot"><div><img src="'+esc(logo)+'" alt="'+esc(name)+'">'+
   '<p class="tag">'+esc(has(s.tagline)?s.tagline:DEF.tagline)+'</p></div>'+cols+
   '<div><h4>'+esc(has(s.footer_contact_title)?s.footer_contact_title:'ติดต่อเรา')+'</h4><ul>'+ct+'</ul></div></div>'+
   '<div class="copy">'+esc(has(s.copyright)?s.copyright:DEF.copyright)+'</div></div></footer>';
  return {header:header,footer:footer,name:name};
 }

 function fixImgs(root){
  [].forEach.call((root||document).querySelectorAll('img'),function(i){
   if(i.dataset.fx)return;i.dataset.fx=1;
   i.addEventListener('error',function(){i.removeAttribute('src');i.classList.add('ph')});
   if(i.complete&&!i.naturalWidth&&i.getAttribute('src'))i.dispatchEvent(new Event('error'))})}
 window.SiteFixImgs=fixImgs;

 function wire(){
  var t=document.querySelector('.nav-toggle'),n=document.querySelector('.nav');
  if(t&&n)t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o)});
 }
 function title(name){var t=document.title,i=t.lastIndexOf(' | ');if(i>-1)document.title=t.slice(0,i)+' | '+name}

 /* ครั้งแรก: ใช้ข้อมูลที่จำไว้จากการเข้าชมครั้งก่อน (หรือค่าเริ่มต้น) เพื่อไม่ให้เมนูกะพริบ */
 var s0=SD&&SD.peek('settings'),c0=SD&&SD.peek('contact'),first=build(s0,c0);
 var h=document.getElementById('site-header'),f=document.getElementById('site-footer');
 if(h)h.outerHTML=first.header; if(f)f.outerHTML=first.footer;
 wire();fixImgs(document);if(s0)title(first.name);

 /* จากนั้นอ่านข้อมูลล่าสุด ถ้าต่างจากเดิมค่อยวาดใหม่ */
 if(SD)Promise.all([SD.get('settings'),SD.get('contact')]).then(function(r){
  if(!r[0]&&!r[1])return;
  var nx=build(r[0],r[1]);
  if(nx.header!==first.header){var hh=document.querySelector('.site-header');if(hh){hh.outerHTML=nx.header;wire()}}
  if(nx.footer!==first.footer){var ff=document.querySelector('.site-footer');if(ff)ff.outerHTML=nx.footer}
  fixImgs(document);title(nx.name);document.addEventListener('site:rendered',function(){title(nx.name)});
 }).catch(function(){});
})();
