/* ค้นหาบทความ (กรองการ์ดในหน้า) */
var q=document.getElementById('q'),cards=[].slice.call(document.querySelectorAll('.art')),empty=document.querySelector('.empty');
var cnt=document.createElement('p');cnt.className='count';cnt.setAttribute('aria-live','polite');document.getElementById('search-form').after(cnt);
function run(){var v=q.value.trim().toLowerCase(),n=0;cards.forEach(function(c){var s=c.textContent.toLowerCase().indexOf(v)>-1;c.parentElement.style.display=s?'':'none';if(s)n++});empty.style.display=n?'none':'block';cnt.textContent=v&&n?'พบ '+n+' บทความ':''}
q.addEventListener('input',run);document.getElementById('search-form').addEventListener('submit',function(e){e.preventDefault();run()});
