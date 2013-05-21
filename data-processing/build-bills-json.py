import sunlight
import json
import urllib
sunlight.config.API_KEY = '1e1c9b31bf15440aacafe4125f221bf2'

signedbills = [['HF 1138', 'SF 971']]


for bill in signedbills:
  try:
    data = sunlight.openstates.bill_detail('MN','2013-2014',bill[0])
  except:
    data = {'title':'not found','created_at':'not found','updated_at':'not found','subjects':'not found','sources' : [{'url': 'not found'}],'votes': [],'sponsors':[]}
    
  try:
    companiondata = sunlight.openstates.bill_detail('MN','2011-2012',bill[1])
  except:
    companiondata = {'votes': [],'sponsors':[]}
  
  print data
  print companiondata