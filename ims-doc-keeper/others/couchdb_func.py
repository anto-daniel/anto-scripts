import couchdb
import json

server = couchdb.Server('http://imsadmin:imsadmin@newdb.corp.inmobi.com:5984')
db = server['ims']

def recur(subdoc, prefix):
    tmp = []
    for attr in subdoc:
        attr_type = type(subdoc[attr])
        if  attr_type == dict:
            if prefix is None:
                recur(subdoc[attr],attr)
            else: 
                prefix == attr
                recur(subdoc[attr],prefix+'.'+attr)
        else:
            if prefix is None:
       #         print attr
                tmp.append(attr)
            else:
        #        tmp.append(prefix+"."+attr)
                print prefix+"."+attr
    return tmp
 
for id in db:
    if "ec2" in id and not "attr_doc" in id:
        doc = db[id]
        print "\n\n"+doc['_id']+":\n"
        print recur(doc,None)



