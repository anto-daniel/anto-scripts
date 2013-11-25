import couchdb
import json
import collections
import difflib
from difflib import Differ
import sys
import re
from couchdb.mapping import Document, TextField, IntegerField, DateTimeField

user = 'imsadmin'
passwd =  'imsadmin'
host = 'newdb.corp.inmobi.com'
port = '5984'
design_doc =  '_design/sa_reports/_view/all_attributes'
server = couchdb.Server('http://'+user+':'+passwd+'@'+host+':'+port)
db = server['ims-test']

def uniq(input):
    output = []
    for x in input:
        if x not in output:
            output.append(x)
    return output

def view_assets():
    tmp = []
    for row in db.view(design_doc,group='true'):
        asset_type = row.key[0]
        tmp.append(asset_type)
    return uniq(tmp)

def view_attributes(asset):
    attributes = []
    for row in db.view(design_doc,group='true'):
        asset_type = row.key[0]
        if asset_type == asset:
            attributes.append(row.key[1])
    return attributes 

def view_doc_attributes(asset):
    tmplist2 = []
    docid = 'asset.attr_doc:'+asset
    doc = db[docid]
    od = collections.OrderedDict(sorted(doc.iteritems()))
    for attr in od:
        tmplist2.append(attr)
    return tmplist2

def update_attributes(asset):
    docid = 'asset.attr_doc:'+asset
    doc = db[docid]
    list1 = view_attributes(asset)
    list2 = view_doc_attributes(asset)
    addfields = []
    for d in Differ().compare(list1,list2):
        matchAddField = re.match( r'^\-(.*)', d, re.M|re.I) 
        if matchAddField:
            field = matchAddField.group(1)
            addfields.append(field[1:])
    return addfields

def delete_attributes():
    docid = 'asset.attr_doc:'+asset
    doc = db[docid]
    delfields = []
    list1 = view_attributes(asset)
    list2 = view_doc_attributes(asset)
    for d in Differ().compare(list1,list2):
        matchDelField = re.match( r'^\+(.*)', d, re.M|re.I) 
        if matchDelField:
            field = matchDelField.group(1)
            delfields.append(field[1:])
    return delfields

def save_attr(asset):
    docid = 'asset.attr_doc:'+asset
    doc = db[docid]
    tmp1 = []
    for addattr in update_attributes(asset):
    #    print addattr
        ch = '.'
        if ch in addattr:
            sample = addattr.rpartition(".")
#            print sample[0]
            if sample[0] in addattr:
                if sample[0] not in tmp1:
                    tmp1.append(sample[0])
    #                print tmp1
    #        doc[sample[0]] = "{ "+sample[2]+"\":\" { \"doc\": "", \"type\": "" } }"
    #        print doc[sample[0]]
        else:
           # print addattr
     #       print addattr
            tmp1.append(addattr)
            #doc[addattr] = { "doc": "", "type":"" }
            #db.save(doc)
    #print tmp1
    for att in tmp1:
        #print att
        doc[att] = { "doc": "", "type":"" }
        db.save(doc)

def main():
    for asset in view_assets():
        docid = 'asset.attr_doc:'+asset
        field_add = update_attributes(asset)
        if field_add == []:
            print "all fields are present in "+docid
        else:
            for attr in field_add:
                print "Field "+attr+" will be added in "+docid+" "
        save_attr(asset)

if __name__ == "__main__":
    main()
