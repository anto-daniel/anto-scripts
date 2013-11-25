import couchdb
import json

server = couchdb.Server('http://imsadmin:imsadmin@newdb.corp.inmobi.com:5984')
db = server['ims']

doc = db["asset.attr_doc:storage"]
docjson = json.dumps(doc.keys())
print docjson
