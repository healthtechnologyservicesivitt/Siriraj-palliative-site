"""สร้าง data/data.js จาก data/*.json และ data/pages/*.json (ใช้สำหรับเปิดไฟล์ในเครื่องแบบดับเบิลคลิก)
รันด้วย: python3 tools/build-data.py   (เว็บที่ deploy แล้วอ่าน JSON โดยตรง ไม่ต้องรัน)"""
import json,os,runpy
runpy.run_path(os.path.join(os.path.dirname(os.path.abspath(__file__)),'build-articles.py'))  # รวมบทความรายชิ้นก่อน
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','data')
def load(p): return json.load(open(os.path.join(R,p),encoding='utf-8'))
d={n:load(n+'.json')['items'] for n in('articles','stories')}
d['pages']={n:load('pages/'+n+'.json') for n in('settings','home','about','contact','media')}
open(os.path.join(R,'data.js'),'w',encoding='utf-8').write('window.SITE_DATA='+json.dumps(d,ensure_ascii=False)+';\n')
print('data/data.js updated')
