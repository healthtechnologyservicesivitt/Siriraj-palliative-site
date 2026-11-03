/* ฟอร์มติดต่อ: ส่งเข้า Netlify Forms เมื่อขึ้นเว็บจริง
   ถ้าเปิดไฟล์ในเครื่อง หรือเปิดพรีวิว จะเป็นโหมดตัวอย่าง (ไม่ส่งข้อมูลจริง) */
(function(){
 var f=document.getElementById('contact-form'),ok=f.querySelector('.form-ok'),btn=f.querySelector('button[type="submit"]'),req=[].slice.call(f.querySelectorAll('[required]'));
 var demo=location.protocol==='file:'||!!window.SITE_INLINE;
 f.noValidate=true;
 req.forEach(function(i){i.addEventListener('input',function(){i.classList.remove('bad')})});
 function say(cls,msg){ok.className='form-ok'+(cls?' '+cls:'');ok.textContent=msg;ok.style.display='block'}
 f.addEventListener('submit',function(e){e.preventDefault();
  var bad=req.filter(function(i){var b=!i.checkValidity();i.classList.toggle('bad',b);return b});
  if(bad.length){say('err','กรุณากรอกช่องที่มีกรอบสีแดงให้ครบ แล้วลองส่งอีกครั้งนะคะ');bad[0].focus();return}
  btn.disabled=true;btn.textContent='กำลังส่ง…';ok.style.display='none';
  var send=demo?new Promise(function(r){setTimeout(r,800)}):
   fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()}).then(function(r){if(!r.ok)throw 0});
  send.then(function(){f.reset();say('','ขอบคุณค่ะ เราได้รับข้อความของคุณแล้ว 💜'+(demo?' (โหมดตัวอย่าง ยังไม่ได้ส่งจริง)':''))})
   .catch(function(){say('err','ส่งข้อความไม่สำเร็จ ลองอีกครั้ง หรือติดต่อทางโทรศัพท์/อีเมลของศูนย์ฯ')})
   .then(function(){btn.disabled=false;btn.textContent='ส่งข้อความ'});
 });
})();
