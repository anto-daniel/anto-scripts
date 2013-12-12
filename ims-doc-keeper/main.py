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
        dict1 = {}
        for row in db.view(design_doc,group='true'):
            asset_type = row.key[0]
            if asset_type == asset:
                dict1[row.key[1]] = row.value
        mydict = collections.OrderedDict(sorted(dict1.items()))
        return mydict

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
        doc = db[docid]
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
        doc = db[docid]
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
        db.save(doc)
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
        if api.add_attributes(asset) == []:
            print "All Fields present"
        api.save_doc(asset)

if __name__ == "__main__":
    main()
