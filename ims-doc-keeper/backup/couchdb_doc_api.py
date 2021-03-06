#!/usr/bin/env python
""" Script is used to find diff and add attributes """

import couchdb
import collections
from difflib import Differ
import re
from config import imsconfig




class AssetDoc:

    """ Class couchdb_api which calls functions to save additional attributes in doc api """

    def __init__(self):
        
        """ Constructor. Initialising variables """

        ims = imsconfig() 
        user = ims.ConfigSectionMap("credentials")['username']
        passwd = ims.ConfigSectionMap("credentials")['password']
        host = ims.ConfigSectionMap("hostinfo")['host']
        port = ims.ConfigSectionMap("hostinfo")['port']
        dbname = ims.ConfigSectionMap("db")['db']
        self.design_doc = ims.ConfigSectionMap("designdoc")['design']
        server = couchdb.Server('http://'+user+':'+passwd+'@'+host+':'+port)
        self.db = server[dbname]

    def uniq(self, input):
        
        """ returns uniq assets in database """
        
        output = []
        for x in input:
            if x not in output:
                output.append(x)
        return output

    def view_assets(self):
        
        """ returns all assets in the database """
        
        tmp = []
        for row in db.view(design_doc,group='true'):
            asset_type = row.key[0]
            tmp.append(asset_type)
        uniqassets = self.uniq(tmp)
        return uniqassets

    def view_attributes(self, asset):
        
        """ returns all attributes in all the docs in the database """
        
        attributes = []
        for row in self.db.view(self.design_doc, group='true'):
            asset_type = row.key[0]
            if asset_type == asset:
                attributes.append(row.key[1])
        return attributes 

    def view_doc_attributes(self, asset):
        
        """ returns all attributes in the doc.attr_doc:asset """
        
        tmplist2 = []
        docid = 'asset.attr_doc:'+asset
        doc = db[docid]
        od = collections.OrderedDict(sorted(doc.iteritems()))
        for attr in od:
            tmplist2.append(attr)
        return tmplist2

    def add_attributes(self, asset):
        
        """ returns attributes which needs to be added in the doc.attr_doc:asset """
        
        docid = 'asset.attr_doc:'+asset
        doc = db[docid]
        list1 = self.view_attributes(asset)
        list2 = self.view_doc_attributes(asset)
        addfields = []
        for d in Differ().compare(list1,list2):
            matchAddField = re.match( r'^\-(.*)', d, re.M|re.I) 
            if matchAddField:
                field = matchAddField.group(1)
                addfields.append(field[1:])
        return addfields

    def delete_attributes(self, asset):
        
        """ returns attributes which needs to be deleted in the doc.attr_doc:asset """
        
        docid = 'asset.attr_doc:'+asset
        doc = db[docid]
        delfields = []
        list1 = self.view_attributes(asset)
        list2 = self.view_doc_attributes(asset)
        for d in Differ().compare(list1,list2):
            matchDelField = re.match( r'^\+(.*)', d, re.M|re.I) 
            if matchDelField:
                field = matchDelField.group(1)
                delfields.append(field[1:])
        return delfields

    def save_attr(self, asset):
        
        """ Saves the attributes in the doc.attr_doc:asset """
        
        docid = 'asset.attr_doc:'+asset
        doc = db[docid]
        tmp1 = []
        for addattr in self.add_attributes(asset):
            tmp1.append(addattr)
        for atr in tmp1:
            ch = '.'
            if ch not in atr:
                if atr in doc:
                    print "Attribute already exist"
                else:
                    print docid+": Adding field :"+atr
                    doc[atr] = { "doc": "", "type":"" }
                    db.save(doc)
            else:
                fld = atr.rsplit(".")
                x = fld[0]
                y = fld[1]
                if atr in doc:
                    print "its there"
                else:
                    if x not in doc:
                        print x+": its not there . adding .."
                        doc[x] = { "doc": "", "type":"" }
                        db.save(doc)
                    else:
                        if y not in doc[x]:
                            print x+": its there. "+y+": not there. Adding "+y
                            doc[x][y] = { "doc": "", "type":"" }  
                            db.save(doc)
                        else:
                            print "Attribute "+x+"."+y+" exist"

        

def main():
    
    """ Main Function """
    
    api = couchdb_api()
    assets = api.view_assets()
    for asset in assets:
        docid = 'asset.attr_doc:'+asset
        print asset
        if docid not in db:
            print docid+" not exists"
            print "creating "+docid
            db.save({"_id": ""+docid+""})
        field_add = api.add_attributes(asset)
        if field_add == []:
            print docid+": All fields are present."
        else:
            for i in field_add:
            #    print i
                pass
        api.save_attr(asset)

if __name__ == "__main__":
    main()
