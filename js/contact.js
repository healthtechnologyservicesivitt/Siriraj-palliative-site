/* ฟอร์มตัวอย่าง: ยังไม่ส่งข้อมูลจริง (ต้องเชื่อมระบบหลังบ้านภายหลัง) */
(function(){
 var f=document.getElementById('contact-form'),ok=f.querySelector('.form-ok'),btn=f.querySelector('button'),req=[].slice.call(f.querySelectorAll('[required]'));
 f.noValidate=true;
 req.forEach(function(i){i.addEventListener('input',function(){i.classList.remove('bad')})});
 f.addEventListener('submit',function(e){e.preventDefault();
  var bad=req.filter(function(i){var b=!i.checkValidity();i.classList.toggle('bad',b);return b});
  ok.style.display='block';
  if(bad.length){ok.className='form-ok err';ok.textContent='กรุณากรอกช่องที่มีกรอบสีแดงให้ครบ แล้วลองส่งอีกครั้งนะคะ';bad[0].focus();return}
  btn.disabled=true;btn.textContent='กำลังส่ง…';ok.style.display='none';
  setTimeout(function(){btn.disabled=false;btn.textContent='ส่งข้อความ';f.reset();ok.className='form-ok';ok.textContent='ขอบคุณค่ะ เราได้รับข้อความของคุณแล้ว 💜 (ตัวอย่างต้นแบบ)';ok.style.display='block'},800);
 });
})();
