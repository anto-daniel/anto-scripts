#!/usr/bin/env python
""" script to delete unwanted docs """

import couchdb
from config import imsconfig


class DeleteDoc:
    
    def __init__(self):
       
        ims = imsconfig()
        user = ims.ConfigSectionMap("credentials")['username']
        passwd = ims.ConfigSectionMap("credentials")['password']
        host = ims.ConfigSectionMap("hostinfo")['host']
        port = ims.ConfigSectionMap("hostinfo")['port']
        dbname = ims.ConfigSectionMap("db")['db']
        self.design_doc = ims.ConfigSectionMap("designdoc")['design']
        couch = couchdb.Server('http://'+host+':'+port)
        couch.resource.credentials = (user, passwd)
        self.database = couch[dbname]

    def delete_doc(self):
        for docid in self.database:
            if "ims.attr_doc" in docid or "ims.type_doc" in docid:
                print "deleting db: "+docid
                doc = self.database[docid]
                self.database.delete(doc)
            else:
                #print "existing db: "+docid
                pass
def main():

    """ Main Function """
    deldb = DeleteDoc()
    deldb.delete_doc()


if __name__ == "__main__":
    main()
