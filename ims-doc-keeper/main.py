import couchdb
import json
import collections
import difflib
from difflib import Differ
import sys
import re
import ConfigParser
from config import imsconfig


class asset_doc():

    """ Main Class """

    def __init__(self):
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
        for row in self.db.view(self.design_doc,group='true'):
            if row.key[0] in uniqassets:
                pass
            else:
                uniqassets[row.key[0]] = 1;
        return uniqassets.keys()

    def view_attributes(self, asset):
        
        """ returns all attributes for a particular asset which is passed as an argument """
        dict1 = {}
        for row in self.db.view(self.design_doc,group='true'):
            asset_type = row.key[0]
            if asset_type == asset:
                dict1[row.key[1]] = row.value
        mydict = collections.OrderedDict(sorted(dict1.items()))
        return mydict

    def view_doc_attributes(self, asset):
        
        """ returns all attributes for the particular doc.attr_doc:asset[server,network,....] """
        
        tmplist2 = []
        docid = 'asset.attr_doc:'+asset
        doc = self.db[docid]
        od = collections.OrderedDict(sorted(doc.iteritems()))
        for attr in od:
            elem1 = re.match( r'^\_id', attr, re.M)
            elem2 = re.match( r'^\_rev', attr, re.M)
            if not (elem1 or elem2):
                tmplist2.append(attr)
        return tmplist2

    def add_attributes(self, asset):
        
        """ returns attributes which are not there in the asset document [doc.attr_doc:asset] """
        
        docid = 'asset.attr_doc:'+asset
        doc = self.db[docid]
        list1 = self.view_attributes(asset).keys()
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
        doc = self.db[docid]
        list1 = self.view_attributes(asset).keys()
        list2 = self.view_doc_attributes(asset)
        delfields = []
        for d in Differ().compare(list1,list2):
            matchDelField = re.match( r'^\+(.*)', d, re.M|re.I) 
            if matchDelField:
                fld = matchDelField.group(1)
                delfields.append(fld[1:])
        return delfields

    def save_doc(self, asset):
        
        """ Saves the attributes in the doc.attr_doc:asset """
        
        docid = 'asset.attr_doc:'+asset
        doc = self.db[docid]
        for addatr in self.add_attributes(asset):
            if addatr in doc:
                print "Attribute: "+addatr+" already exist"
            else:
                print "Adding Attribute: "+addatr
                doc[addatr] =  { "doc": "", "type": self.view_attributes(asset)[addatr] } 
        for delatr in self.del_attributes(asset):
            if delatr in doc:
                print "Deleting: "+delatr
                doc.pop(delatr)
            else:
                print "no need"
        self.db.save(doc)
        for att in doc:
            if "_id" not in att and "_rev" not in att:
                if "doc" not in doc[att]:
                    print att+": attribute has no doc field present"
                    print "Adding doc field in "+att
                    doc[att]['doc'] = ""
                elif "type" not in doc[att]:
                    print att+": attribute has no type field present"
                    print "Adding type field in "+att
                    doc[att]['type'] = self.view_attributes(asset)[att]
                else:
                    pass
        self.db.save(doc)
        

def main():
    
    """ Main Function """
    
    api = asset_doc()
    assets = api.asset_types()
    for asset in assets:
        docid = 'asset.attr_doc:'+asset
        typeid = 'asset.type_doc:'+asset
        if docid not in api.db:
            print docid+" not exists"
            print "creating "+docid
            api.db.save({"_id": ""+docid+""})
        if typeid not in api.db:
            print typeid+" not exists"
            print "creating "+typeid
            api.db.save({"_id": ""+typeid+"", "doc_text": "", "doc_url": "", "name": ""+asset+""})
        if api.add_attributes(asset) == []:
            print asset+": All Fields present"
        api.save_doc(asset)

if __name__ == "__main__":
    main()
