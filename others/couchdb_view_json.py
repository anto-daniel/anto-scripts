import couchdb
import json

server = couchdb.Server('http://imsadmin:imsadmin@ims.corp.inmobi.com:5984')
db = server['ims']

print "{ \n"
for row in db.view('_design/tmp/_view/all_attributes_bug_fix',group='true'):
    asset_type = row.key[0]
    if asset_type == "network":
        print " \""+row.key[1]+"\": {\"doc\": \"\", \"type\": \"\" },"
print "} \n"
