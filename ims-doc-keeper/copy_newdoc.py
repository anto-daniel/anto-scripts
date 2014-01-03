#!/usr/bin/env python
""" script """

import couchdb
import collections
from difflib import Differ
import re
from config import imsconfig


class CopyAssetDoc:

    """ Main Class """

    def __init__(self):

        """ Constructor: Declaring couchdb and design doc variables """	

        ims = imsconfig()
        user = ims.ConfigSectionMap("credentials")['username']
        passwd = ims.ConfigSectionMap("credentials")['password']
        host = ims.ConfigSectionMap("hostinfo")['host']
        port = ims.ConfigSectionMap("hostinfo")['port']
        dbname = ims.ConfigSectionMap("db")['db']
        self.design_doc = ims.ConfigSectionMap("designdoc")['design']

        server = couchdb.Server('http://'+host+':'+port)
        server.resource.credentials = (user,passwd)
        self.db = server[dbname]
    
    def asset_types(self):
        
        """ returns all asset_types in the database """
        
        uniqassets = {}
        for row in self.db.view(self.design_doc,group='true'):
            if row.key[0] in uniqassets:
                pass
            else:
                uniqassets[row.key[0]] = 1
        return uniqassets.keys()

    def save_doc(self, asset):
        
        """ Saves the attributes in the doc.attr_doc:asset """
        
        docid = 'asset.attr_doc:'+asset
        newdocid = 'ims.attr_doc:'+asset
        doc = self.db[docid]
        print "copying "+docid+" to "+newdocid
        tmp1 = doc.copy()
        tmp1['_id'] = newdocid
        tmp1.pop('_rev')
        self.db[newdocid] = tmp1.copy()

        typeid = 'asset.type_doc:'+asset
        newtypeid = 'ims.type_doc:'+asset
        typedoc = self.db[typeid]
        print "copying "+typeid+" to "+newtypeid
        tmp2 = typedoc.copy()
        tmp2['_id'] = newtypeid
        tmp2.pop('_rev')
        self.db[newtypeid] = tmp2.copy()

       

def main():
    
    """ Main Function """
    
    api = CopyAssetDoc()
    assets = api.asset_types()
    for asset in assets:
        api.save_doc(asset)

if __name__ == "__main__":
    main()
