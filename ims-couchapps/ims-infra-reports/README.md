IMS Infra Report
----------------

 This couchapp module gives the list of servers details by using key values of
 * ITag
 * Rack Number
 * HostName
 * Vendor
 * IPAddress
 * Switch
 * Expiry Date

 Used Kanso, couchdb to  develop Infra Reports.

* list/app.js - JavaScript code which uses map functions to get the required data using key [Hostname, Team, Vendor ..] from document id
* kanson.json - this is properties of kanson which loads attachements, properties, JS, modules, properties
* Kanso app uses couchdb to get the list of server details by querying with key fields and shows/views the result in browser
