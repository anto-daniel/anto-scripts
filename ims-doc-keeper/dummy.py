import couchdb
import ConfigParser
from config import imsconfig
from itertools import chain

ims = imsconfig()
user = ims.ConfigSectionMap("credentials")['username']
passwd = ims.ConfigSectionMap("credentials")['password']
host = ims.ConfigSectionMap("hostinfo")['host']
port = ims.ConfigSectionMap("hostinfo")['port']
dbname = ims.ConfigSectionMap("db")['db']
design_doc = ims.ConfigSectionMap("designdoc")['design']

print user, passwd, host, port, dbname



server = couchdb.Server('http://'+user+':'+passwd+'@'+host+':'+port)
db = server[dbname]

def asset_types():

    uniqassets = {}
    for row in db.view(design_doc,group='true'):
        if row.key[0] in uniqassets:
            #print "already exists "
            pass
        else:
            uniqassets[row.key[0]] = 1;
    return uniqassets.keys()

print asset_types()

        

