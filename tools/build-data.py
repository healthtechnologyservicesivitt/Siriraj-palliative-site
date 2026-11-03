"""สร้าง data/data.js จาก data/*.json (ใช้สำหรับเปิดไฟล์ในเครื่องแบบดับเบิลคลิก)
รันด้วย: python3 tools/build-data.py   (เว็บที่ deploy แล้วอ่าน data/*.json โดยตรง ไม่ต้องรัน)"""
import json,os
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','data')
d={n:json.load(open(os.path.join(R,n+'.json'),encoding='utf-8'))['items'] for n in('articles','stories')}
open(os.path.join(R,'data.js'),'w',encoding='utf-8').write('window.SITE_DATA='+json.dumps(d,ensure_ascii=False)+';\n')
print('data/data.js updated')
