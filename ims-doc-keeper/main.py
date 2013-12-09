import couchdb
import json
import collections
import difflib
from difflib import Differ
import sys
import re
import ConfigParser
from config import imsconfig


ims = imsconfig() 
user = ims.ConfigSectionMap("credentials")['username']
passwd = ims.ConfigSectionMap("credentials")['password']
host = ims.ConfigSectionMap("hostinfo")['host']
port = ims.ConfigSectionMap("hostinfo")['port']
dbname = ims.ConfigSectionMap("db")['db']
design_doc = ims.ConfigSectionMap("designdoc")['design']

server = couchdb.Server('http://'+host+':'+port)
server.resource.credentials = (user,passwd)
db = server[dbname]


class asset_doc():

    """ Main Class """

    def create_deep_dict(self ,value, layers, doc):
        data = {}
        layer = layers[0]
        if layers[1:]:
            data[layer] = self.create_deep_dict(value, layers[1:], doc)
        else:
            data[layer] = value
        
        return data


    def asset_types(self):
        
        """ returns all asset_types in the database """
        
        uniqassets = {}
        for row in db.view(design_doc,group='true'):
            if row.key[0] in uniqassets:
                pass
            else:
                uniqassets[row.key[0]] = 1;
        return uniqassets.keys()

    def view_attributes(self, asset):
        
        """ returns all attributes for a particular asset which is passed as an argument """
        
        attributes = []
        for row in db.view(design_doc,group='true'):
            asset_type = row.key[0]
            if asset_type == asset:
                attributes.append(row.key[1])
        return attributes 

    def view_doc_attributes(self, asset):
        
        """ returns all attributes for the particular doc.attr_doc:asset[server,network,....] """
        
        tmplist2 = []
        docid = 'asset.attr_doc:'+asset
        doc = db[docid]
        od = collections.OrderedDict(sorted(doc.iteritems()))
        for attr in od:
            tmplist2.append(attr)
        return tmplist2

    def add_attributes(self, asset):
        
        """ returns attributes which are not there in the asset document [doc.attr_doc:asset] """
        
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

    def del_attributes(self, asset):
        
        """ returns attributes which are not there in the asset document [doc.attr_doc:asset] """
        
        docid = 'asset.attr_doc:'+asset
        doc = db[docid]
        list1 = self.view_attributes(asset)
        list2 = self.view_doc_attributes(asset)
        delfields = []
        for d in Differ().compare(list1,list2):
            matchDelField = re.match( r'^\+(.*)', d, re.M|re.I) 
            if matchDelField:
                field = matchDelField.group(1)
                delfields.append(field[1:])
        return delfields

    def save_doc(self, asset):
        
        """ Saves the attributes in the doc.attr_doc:asset """
        
        docid = 'asset.attr_doc:'+asset
        doc = db[docid]
        tmp1 = []
        for atr in self.add_attributes(asset):
            if atr in doc:
                print "Attribute already exist"
            else:
                print docid+": Adding field :"+atr
                doc[atr] = { "doc": "", "type":"" }
        db.save(doc)

        for delatr in self.del_attributes(asset):
            if delatr in doc:
                print "deleting attr: "+delatr
                doc.pop(delatr)
        db.save(doc)

        

def main():
    
    """ Main Function """
    
    api = asset_doc()
    assets = api.asset_types()
    for asset in assets:
        docid = 'asset.attr_doc:'+asset
        print asset
        if docid not in db:
            print docid+" not exists"
            print "creating "+docid
            db.save({"_id": ""+docid+""})
        diff_attr = api.add_attributes(asset)
        if diff_attr == []:
            print docid+": All fields are present."
        api.save_doc(asset)

if __name__ == "__main__":
    main()
