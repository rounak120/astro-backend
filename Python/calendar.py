import requests as req
from bs4 import BeautifulSoup
import re


r = req.get('http://www.seasky.org/astronomy/astronomy-calendar-current.html')
soup = BeautifulSoup(r.content, 'html.parser')
s = soup.find_all('div', id=re.compile('^right-column-content'))
s=s[1]
sublist=s.find_all('li')
lis=[]
di={}
m=0
for i in sublist:
  date=i.find_all('span')[0].text
  title=i.find_all('span')[1].text
  s=len(date)+len(title)+4
  para=i.find('p').text[s:]
  di[m]={"date":date,"title":title,"description":para}
  m+=1
print(di)



