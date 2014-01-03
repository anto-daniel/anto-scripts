import couchdb
import json

server = couchdb.Server("http://localhost:5984")
db = server['ims']

for id in db:
    doc = db[id]
    for i in doc:
        if "other" in i:
            print i 
