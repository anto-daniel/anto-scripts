import couchdb
import json

server = couchdb.Server('http://imsadmin:imsadmin@ims.corp.inmobi.com:5984')
db = server['ims']
#for id in db:
#    if "asset" in id:
#        doc = db[id]
 
map_fun = '''function(doc) {
      if(doc._id.match("^asset.*")) {
              pos1 = doc._id.indexOf('.'); pos2 = doc._id.indexOf(':');
              var asset_type = doc._id.slice(pos1+1,pos2);
              function recur(subdoc,prefix) {
                for (var p in subdoc) {
                    var obj_type = Object.prototype.toString.call(subdoc[p]);
                    if ( obj_type == "[object Object]") {
                        if(prefix == undefined) {
                            recur(subdoc[p],p);
                        }
                        else {
                            prefix = p;
                            recur(subdoc[p],prefix+'.'+p);
                        }
                    }
                    else {
                        var attr_data_type = typeof subdoc[p];
                        if (prefix == undefined) {
                            emit([asset_type, p], 1);
                        }
                        else {
                            emit([asset_type, prefix+'.'+p], 1);
                        }
                    }
                }
              }
              recur(doc);
        }
    }'''

reduce_fun = '''function(key, values, reduce) {
                return true;
          }'''

for row in db.query(map_fun, reduce_fun, group='true', startkey=['server',1,{}], endkey=['storage',1,{}]):
    keys = row.key
    #keys = keys[:9] + keys[14:]
    attr = keys[1]
    print "[ { \""+attr+"\": { \"doc\": \"\", \"type\": \"\" } ]"

