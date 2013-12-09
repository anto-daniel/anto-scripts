import couchdb
import json

server = couchdb.Server('http://imsadmin:imsadmin@newdb.corp.inmobi.com:5984')
db = server['ims-test']
doc = db['sample']


def recur(subdoc,prefix):
    for attr in subdoc:
        attr_type = type(subdoc[attr])
        dp = { "doc": "", "type": "" }
        if  attr_type == dict:
            if prefix is None:
                if doc.has_key(attr):
                    print attr+"1: present"
                    recur(subdoc[attr],attr)
                else:
                    print "1: need to save "+attr
                    doc[attr] = {}
                    db.save(doc)
                    recur(subdoc[attr],attr)
            else:
           #     prefix = attr
                if doc.has_key(attr):
                    print "2: present"+prefix+'.'+attr
                    recur(subdoc[attr],prefix+'.'+attr)
                else:
                    print "2: need to save ["+prefix+"]["+attr+"]"
                    doc[prefix][attr] = {}
                    db.save(doc)
                    d = "["+prefix+"]["+attr+"]"
                    print d
                    recur(subdoc[attr],prefix+'.'+attr)
        else:
            if doc.has_key(attr):
                print ""+attr+": is present"
            else:
                print "Final: "+attr
                #print subdoc[attr]
                #doc[attr] = { "doc": "", "type": "" }
                #db.save(doc)
            

doc1 = db['asset.attr_doc:sample']
print doc1
recur(doc1,None)
 



