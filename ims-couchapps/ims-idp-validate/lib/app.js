exports.validate_doc_update = function (newDoc, oldDoc, userCtx) {

  //Asset Type and Primary Key
  var docid = newDoc._id;
  var ast = docid.split(":");
  var atype = ast[0].split(".");
  var asset = atype[0];
  var asset_type = atype[1];

  //Helper Functions to validate & throw forbidden 

  function require(field_name) {
    if (!newDoc[field_name]) {
      var msg = field_name + " field is required";
      throw ({"forbidden": msg});
    }
  };

  function is_arr(field_name) {
    if (!(Array.isArray(newDoc[field_name]))) {
      var msg = field_name + " should be an array";
      throw ({"forbidden": msg});
    }
  };

  function pkey(field_name) {
    if (newDoc[field_name] != ast[1]) {
      var msg = field_name + " should be same as the unique part of id";
      throw ({"forbidden": msg});
    }
  };

  //RegEx Validation [a-z]

  function regx_az(field_name, value) {
    var exp = /^[a-z-_]+$/;
    if (Array.isArray(value)) {
      value.forEach(function (v) {
        var match = v.match(exp);
        var msg = field_name + "  array can contain only [a-z] and underscore";
        if (match == null) {
          throw ({"forbidden": msg});
        }
      });
    }
    else {
      var match = value.match(exp);
      var msg = field_name + "  field can contain only [a-z] and underscore";
      if (match == null) {
        throw ({"forbidden": msg});
      }
    }
  };

  //RegEx Validation[a-z0-9]

  function regx_aznum(field_name, value) {
    var exp = /^[a-z0-9-_]+$/;
    if (Array.isArray(value)) {
      value.forEach(function (v) {
        var match = v.match(exp);
        var msg = field_name + "  array can contain only [a-z], [0-9] & underscore";
        if (match == null) {
          throw ({"forbidden": msg});
        }
      });
    }
    else {
      var match = value.match(exp);
      var msg = field_name + "  field can contain only [a-z], [0-9] & underscore";
      if (match == null) {
        throw ({"forbidden": msg});
      }
    }
  };

  //Valid IP Test

  function valid_ip(field_name, value) {
    var exp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    var match = value.match(exp);
    var msg = "enter a valid " + field_name;
    if (match == null) {
      throw ({"forbidden": msg});
    }
  };

  //Valid Host_Name Test

  function valid_host(field_name, value) {
    var exp = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/;
    var match = value.match(exp);
    var msg = "enter a valid " + field_name;
    if (match == null) {
      throw ({"forbidden": msg});
    }
  }

  //Access Control 
  function access(newDoc, oldDoc, userCtx) {
    if (newDoc.allow_access && newDoc.access) {
      throw ({"forbidden": "invalid access specification"});
    }
    else {
      if (newDoc.allow_access) {
        if (newDoc.allow_access == '*') {
          return true;
        }
      }
      else if (newDoc.access) {
        for (e in newDoc.access) {
          if (newDoc.access[e] == userCtx["name"]) {
            return true;
          }
        }
      }
      else if (oldDoc) {
        if (oldDoc.allow_access) {
          if (oldDoc.allow_access == '*') {
            return true;
          }
        }
        else if (oldDoc.access) {
          for (e in oldDoc.access) {
            if (oldDoc.access[e] == userCtx["name"]) {
              return true;
            }
          }
        }
        else {
          throw ({
            forbidden: 'access denied'
          });
        }
      }
      else {
        throw ({forbidden: 'access denied'});
      }
    }
  }

  if (!(newDoc._deleted)) {
    //Validation Test Logic 
    if (asset == "asset") {
      //Service Asset
      if (asset_type == "service") {
        //Mandatory Fields
        require("name");
        require("environments");

        //Primary Key    
        pkey("name");

        //Environments Attribute   
        is_arr("environments");
        regx_az("environments", newDoc.environments);
        access(newDoc, oldDoc, userCtx)
      }
      else if (asset_type == "environment") { //Environment Asset
        //Mandatory Fields
        require("name");
        require("clusters");
        //Primary Key
        pkey("name");

        //Clusters Attribute                       
        is_arr("clusters");
        regx_aznum("clusters", newDoc.clusters);
        access(newDoc, oldDoc, userCtx)
      }
      else if (asset_type == "cluster") { //Cluster Asset
        //Mandatory Fields
        require("name");
        require("cluster_type");
        require("vip");
        require("colo");
        require("lb");
        require("hosts");
        //Primary Key
        pkey("name");

        //Cluster Attribute 
        if (newDoc.cluster_type != null) {
          regx_az("cluster_type", newDoc.cluster_type);
        }

        //Vip Attribute 
        if (newDoc.vip) {
          valid_ip("vip", newDoc.vip);
        }

        //Colo Attribute
        if (newDoc.colo) {
          regx_aznum("colo", newDoc.colo);
        }

        //Lb Attribute
        if (newDoc.lb) {
          valid_host("lb", newDoc.lb);
        }

        //Hosts Attribute
        is_arr("hosts");
        access(newDoc, oldDoc, userCtx)
      }
    }

  }
}
