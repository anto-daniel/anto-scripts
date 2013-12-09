import couchdb
import json
server = couchdb.Server("http://imsadmin:imsadmin@newdb.corp.inmobi.com:5984")
db = server['ims-test']
doc = db['sample']
doc1 = db['asset.attr_doc:sample']
print doc1

def recur(datadict,prefix):
    list1 = []
    for k, v in datadict.iteritems():
        if prefix is None:
            if type(v) == dict:
                print k+"->"+datadict[k].__str__()
                recur(v,prefix)
            else:
                print k+"->"+datadict[k].__str__()

   # return k

print recur(doc1,None)
