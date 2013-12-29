Pre-requisites:

couchdb, ims-nodejs

Description:

This package is used to validate IDP documents

Testing Intsructions:

1. clone 'ims-couchapps' repo

2. cd repo

3. cd ims-idp-validate

4. kanso install

5. npm install

6. sudo chmod +x run

7. ./run your-db-name

Note:

1. Default DB name is ims-test

2. Replace the default values with the actual Couch URI & DB name in ~/ims-idp-validate/test/config.json and pass the same as ARG for run script

3. Refer the run script for greater details
