import couchdb
import json
import collections
import difflib
from difflib import Differ
import sys
import re
import ConfigParser
from config import imsconfig


Config = ConfigParser.ConfigParser()
Config.read("config/config.ini")
ims = imsconfig() 
user = ims.ConfigSectionMap("credentials")['username']
passwd = ims.ConfigSectionMap("credentials")['password']
host = ims.ConfigSectionMap("hostinfo")['host']
port = ims.ConfigSectionMap("hostinfo")['port']
dbname = ims.ConfigSectionMap("db")['db']
design_doc = ims.ConfigSectionMap("designdoc")['design']

server = couchdb.Server('http://'+user+':'+passwd+'@'+host+':'+port)
db = server[dbname]


class couchdb_api():


    def uniq(self, input):
        output = []
        for x in input:
            if x not in output:
                output.append(x)
        return output

    def view_assets(self):
        tmp = []
        for row in db.view(design_doc,group='true'):
            asset_type = row.key[0]
            tmp.append(asset_type)
        uniqassets = self.uniq(tmp)
        return uniqassets

    def view_attributes(self, asset):
        attributes = []
        for row in db.view(design_doc,group='true'):
            asset_type = row.key[0]
            if asset_type == asset:
                attributes.append(row.key[1])
        return attributes 

    def view_doc_attributes(self, asset):
        tmplist2 = []
        docid = 'asset.attr_doc:'+asset
        doc = db[docid]
        od = collections.OrderedDict(sorted(doc.iteritems()))
        for attr in od:
            tmplist2.append(attr)
        return tmplist2

    def add_attributes(self, asset):
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
        docid = 'asset.attr_doc:'+asset
        doc = db[docid]
        tmp1 = []
        for addattr in self.add_attributes(asset):
            tmp1.append(addattr)
        for atr in tmp1:
            ch = '.'
            if ch not in atr:
                print docid+": Adding field :"+atr
                doc[atr] = { "doc": "", "type":"" }
        db.save(doc)
        t = []
        for att in tmp1:
            attrs = att.rsplit(".")
            t.append(attrs[0])
        sam = self.uniq(t)
        for x in tmp1:
            for y in sam:
                ch = '.'
                if y in x and ch in x:
                    z = x.rsplit('.')
                    z2 = z[1]
                    print docid+": Adding attribute :"+z2
                    doc[y][z2] = { "doc": "", "type":"" }
        db.save(doc)

def main():
    api = couchdb_api()
    assets = api.view_assets()
    for asset in assets:
        docid = 'asset.attr_doc:'+asset
        field_add = api.add_attributes(asset)
        if field_add == []:
            print docid+": All fields are present."
        #else:
        #    for i in field_add:
        #        print i
        api.save_attr(asset)

if __name__ == "__main__":
    main()
