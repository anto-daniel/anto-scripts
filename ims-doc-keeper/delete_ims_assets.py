#!/usr/bin/env python
""" script to delete unwanted docs """

import couchdb

couch = couchdb.Server('http://localhost:5984')
couch.resource.credentials = ('imsadmin','imsadmin')
database = couch['ims']

for docid in database:
    if "ims.attr_doc" in docid or "ims.type_doc" in docid:
        print "deleting db: "+docid
        doc = database[docid]
        database.delete(doc)
    else:
        #print "existing db: "+docid
        pass

