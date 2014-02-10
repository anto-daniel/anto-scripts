#!/usr/bin/env python
""" This script takes care of Active Tasks happeing on CouchDB and make sure Replication happening on multiple configured ims hosts"""

import couchdb
from config import imsconfig


class Replication:

    """ Main Class"""

    def __init__(self):

        """Constructor method: Declaring CouchDB Variables """

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
        self.active_tasks = server.tasks()

    def active_states(self):

        """ Checks the active states in CouchDB """

        for task in self.active_tasks:
                print task

        
def main():

    """ Main Function """
    repl = Replication()
    print repl.design_doc
    print repl.active_states()


if __name__ == "__main__":
    main()
