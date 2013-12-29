IMS Infra BulkLoad
==================

This is a classic CouchApp - where we serve a User Interface that will
be used by the Infra team to:

1. Upload an excel sheet containing asset information
2. Call ims-infra-utils' xls parser (node.js) app to get diff between xls and database state computed
3. Shows diff to the user where the user can confirm specific change or ignore them
4. POST to _bulk_docs to create / update these documents

