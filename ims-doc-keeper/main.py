#!/usr/bin/env python
""" This script adds and deletes attributes in the asset
 attribute and type document   """
import couchdb
import collections
from difflib import Differ
import re
from config import imsconfig


class AssetDoc:

    """ Main Class """

    def __init__(self):

        """  Constructor: Declaring couchdb variables """

        ims = imsconfig()
        user = ims.ConfigSectionMap("credentials")['username']
        passwd = ims.ConfigSectionMap("credentials")['password']
        host = ims.ConfigSectionMap("hostinfo")['host']
        port = ims.ConfigSectionMap("hostinfo")['port']
        dbname = ims.ConfigSectionMap("db")['db']
        self.design_doc = ims.ConfigSectionMap("designdoc")['design']

        server = couchdb.Server('http://'+host+':'+port)
        server.resource.credentials = (user, passwd)
        self.database = server[dbname]

    def asset_types(self):

        """ returns all asset_types in the database """

        uniqassets = {}
        for row in self.database.view(self.design_doc, group='true'):
            if row.key[0] in uniqassets:
                pass
            else:
                uniqassets[row.key[0]] = 1
        return uniqassets.keys()

    def view_attributes(self, asset):

        """ returns all attributes for each asset """
        dict1 = {}
        for row in self.database.view(self.design_doc, group='true'):
            asset_type = row.key[0]
            if asset_type == asset:
                dict1[row.key[1]] = row.value
        mydict = collections.OrderedDict(sorted(dict1.items()))
        return mydict

    def view_doc_attributes(self, asset):

        """ returns all attributes for doc.attr_doc:<asset> """

        tmplist2 = []
        docid = 'asset.attr_doc:'+asset
        doc = self.database[docid]
        orderdata = collections.OrderedDict(sorted(doc.iteritems()))
        for attr in orderdata:
            elem1 = re.match(r'^\_id', attr, re.M)
            elem2 = re.match(r'^\_rev', attr, re.M)
            if not (elem1 or elem2):
                tmplist2.append(attr)
        return tmplist2

    def add_attributes(self, asset):

        """ returns attributes which are not there in asset doc """

        list1 = self.view_attributes(asset).keys()
        list2 = self.view_doc_attributes(asset)
        addfields = []
        for dif in Differ().compare(list1, list2):
            matchaddfield = re.match(r'^\-(.*)', dif, re.M | re.I)
            if matchaddfield:
                field = matchaddfield.group(1)
                addfields.append(field[1:])
        return addfields

    def del_attributes(self, asset):

        """ attributes should not there in the asset doc """

        list1 = self.view_attributes(asset).keys()
        list2 = self.view_doc_attributes(asset)
        delfields = []
        for dif in Differ().compare(list1, list2):
            matchdelfield = re.match(r'^\+(.*)', dif, re.M | re.I)
            if matchdelfield:
                fld = matchdelfield.group(1)
                delfields.append(fld[1:])
        return delfields

    def save_doc(self, asset):

        """ Saves the attributes in the doc.attr_doc:asset """

        docid = 'asset.attr_doc:'+asset
        doc = self.database[docid]
        for addatr in self.add_attributes(asset):
            if addatr in doc:
                print "Attribute: "+addatr+" already exist"
            else:
                print "Adding Attribute: "+addatr
                doc[addatr] = {
                                "doc": "", 
                                "type": self.view_attributes(asset)[addatr]
                              }
        for delatr in self.del_attributes(asset):
            if delatr in doc:
                print "Deleting: "+delatr
                doc.pop(delatr)
            else:
                pass
        self.database.save(doc)
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
        self.database.save(doc)


def main():

    """ Main Function """

    api = AssetDoc()
    assets = api.asset_types()
    for asset in assets:
        docid = 'asset.attr_doc:'+asset
        typeid = 'asset.type_doc:'+asset
        if docid not in api.database:
            print docid+" not exists"
            print "creating "+docid
            api.database.save({"_id": ""+docid+""})
        if typeid not in api.database:
            print typeid+" not exists"
            print "creating "+typeid
            api.database.save({
                                "_id": ""+typeid+"", 
                                "doc_text": "", 
                                "doc_url": "", 
                                "name": ""+asset+""
                              })
        if api.add_attributes(asset) == []:
            print asset+": All Fields present"
        api.save_doc(asset)

if __name__ == "__main__":
    main()
