"""รวมบทความรายชิ้น content/articles/*.json  ->  data/articles.json  (ที่หน้าเว็บอ่าน)
- ข้ามบทความที่ติ๊ก "ฉบับร่าง"
- รหัสลิงก์ (id) = ชื่อไฟล์
- เรียง: มีวันที่ -> ใหม่ไปเก่า, ไม่มีวันที่ -> ตามช่อง "ลำดับ" แล้วตามชื่อไฟล์
รันอัตโนมัติตอน Netlify deploy (ดู netlify.toml) และรันเองได้: python3 tools/build-articles.py"""
import json,os,re,glob
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
SRC=os.path.join(ROOT,'content','articles'); OUT=os.path.join(ROOT,'data','articles.json')
ISO=re.compile(r'^\d{4}-\d{2}-\d{2}')
def main():
    if not os.path.isdir(SRC):
        print('build-articles: ไม่พบ content/articles — ใช้ data/articles.json เดิม'); return
    dated,undated,skipped=[],[],0
    for p in sorted(glob.glob(os.path.join(SRC,'*.json'))):
        try: d=json.load(open(p,encoding='utf-8'))
        except Exception as e: print('build-articles: ข้ามไฟล์เสีย',os.path.basename(p),e); continue
        if not isinstance(d,dict) or not str(d.get('title','')).strip(): print('build-articles: ข้าม (ไม่มีหัวข้อ)',os.path.basename(p)); continue
        if d.get('draft') in (True,'true','True'): skipped+=1; continue
        try: order=int(d.get('order'))
        except Exception: order=9999
        date=str(d.get('date') or '')[:10]
        a={'id':os.path.splitext(os.path.basename(p))[0],'title':d['title'],'image':d.get('image') or '','excerpt':d.get('excerpt') or '',
           'body':d.get('body') or '','date':date if ISO.match(date) else '','featured':d.get('featured') in (True,'true','True'),'_o':order}
        (dated if a['date'] else undated).append(a)
    dated.sort(key=lambda x:(x['_o'],x['id'])); dated.sort(key=lambda x:x['date'],reverse=True)
    undated.sort(key=lambda x:(x['_o'],x['id']))
    items=dated+undated
    for a in items: a.pop('_o')
    os.makedirs(os.path.dirname(OUT),exist_ok=True)
    json.dump({'items':items},open(OUT,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
    print('build-articles: %d บทความ (ข้ามฉบับร่าง %d)'%(len(items),skipped))
main()
