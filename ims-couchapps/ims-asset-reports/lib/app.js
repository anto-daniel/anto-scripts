exports.views = {
  ims_asset_classification: {
    map: function (doc) {
      var op_str = [];

      //Sub-Routine to form the op_str for server assets

      //Check wheter physical(+physical) or virtual(-physical)
      function is_physical() {
        if (doc.physical == true && doc.physical != null) {
          op_str.push("+physical");
        }
        else {
          op_str.push("-physical");
        }
      };

      //check facter info is present(+facter) or not(-facter)
      function is_facter() {
        if (doc.virtual != null) {
          op_str.push("+facter");
        }
        else {
          op_str.push("-facter");
        }
      };

      //check if macid is present(+macid) or not(-macid)
      function is_macid() {
        if (doc.macid != null) {
          op_str.push("+macid");
        }
        else {
          op_str.push("-macid");
        }
      };

      //check if servername is present(+servername) or not(-servername)
      function is_servername() {
        if (doc.servername != null) {
          op_str.push("+servername");
        }
        else {
          op_str.push("-servername");
        }
      };

      //check if facter version is latest(+latest) or old(-latest) 
      function is_facter_version() {
        if (doc.version != null) {
          if (doc.version["ims-facter"] > "2.3") {
            op_str.push("+latest");
          }
          else {
            op_str.push("-latest");
          }
        }
        else {
          op_str.push("-latest");
        }
      };

      //Server Assets

      //Pre-Requisites Check (_id & itag)

      //Generate Meaningful User-friendly Keys for Assets

      //Server Assets

      //_id Check
      if (doc._id.indexOf("asset.server") >= 0 || doc._id.indexOf("asset.vm") >= 0) {

        //itag check
        if (doc.itag.match(/[A-Z]{2,3}[0-9](SR|VM)/)) {

          //Actual logic
          is_physical();
          is_facter();
          is_macid();
          is_servername();
          is_facter_version();

          //Get the O/P String Expression  
          var exp = op_str.join();


          if (exp == "+physical,-facter,-macid,-servername,-latest") {
            emit(["Invalid Physical", "Physical hosts without mandatory fields"], null);
          }
          else if (exp == "+physical,-facter,-macid,+servername,-latest") {
            emit(["Investigate-L1", "Servers without ims agent"], null);
          }
          else if (exp == "+physical,-facter,+macid,-servername,-latest") {
            emit(["In Progress Physical", "Physical hosts which are being commissioned"], null);
          }
          else if (exp == "+physical,-facter,+macid,+servername,-latest") {
            emit(["Investigate-L1", "Servers without ims agent"], null);
          }
          else if (exp == "+physical,+facter,+macid,-servername,-latest") {
            emit(["Investigate-L2", "Servers running old version of ims agent"], null);
          }
          else if (exp == "+physical,+facter,+macid,+servername,-latest") {
            emit(["Investigate-L2", "Servers running old version of ims agent"], null);
          }
          else if (exp == "+physical,+facter,+macid,-servername,+latest") {
            emit(["Valid Physical", "Valid physical servers"], null);
          }
          else if (exp == "+physical,+facter,+macid,+servername,+latest") {
            emit(["Valid Physical", "Valid physical servers"], null);
          }
          else if (exp == "-physical,+facter,+macid,-servername,-latest") {
            emit(["Investigate-L2", "Servers running old version of ims agent"], null);
          }
          else if (exp == "-physical,+facter,+macid,+servername,-latest") {
            emit(["Investigate-L2", "Servers running old version of ims agent"], null);
          }
          else if (exp == "-physical,+facter,+macid,-servername,+latest") {
            emit(["Valid VM", "Valid virtual machines"], null);
          }
          else if (exp == "-physical,+facter,+macid,+servername,+latest") {
            emit(["Valid VM", "Valid virtual machines"], null);
          }
          else {
            emit(["Invalid Server", "Unclassified server assets"], null);
          }
        }
      } //Network Assets
      else if (doc._id.indexOf("asset.network") >= 0) {
        if (doc.itag.match(/[A-Z]{2,3}[0-9](NW)/)) {
          if (doc.servername != null) {
            emit(["Valid Network", "Valid network assets"], null);
          }
          else {
            emit(["Invalid Network", "Network assets without servername field"], null);
          }
        }
      } //Storage Assets
      else if (doc._id.indexOf("asset.storage") >= 0) {
        if (doc.itag.match(/[A-Z]{2,3}[0-9](ST)/)) {
          if (doc.servername != null) {
            emit(["Valid Storage", "Valid storage assets"], null);
          }
          else {
            emit(["Invalid Storage", "Storage assets without servername field"], null);
          }
        }
      } //Service Assets
      else if (doc._id.indexOf("asset.service") >= 0) {
        if (doc.name != null && doc.environments != null) {
          emit(["Valid Service", "Valid service assets"], null);
        }
        else {
          emit(["Invalid Service", "Service assets without name & environments fields"], null);
        }
      } //Environment Assets
      else if (doc._id.indexOf("asset.environment") >= 0) {
        if (doc.name != null && doc.clusters != null) {
          emit(["Valid Environment", "Valid environment assets"], null);
        }
        else {
          emit(["Invalid Environment", "Environment assets without name & clusters fields"], null);
        }
      } //Cluster Assets
      else if (doc._id.indexOf("asset.cluster") >= 0) {
        if (doc.name != null && doc.hosts != null) {
          emit(["Valid Cluster", "Valid cluster assets"], null);
        }
        else {
          emit(["Invalid Cluster", "cluster assets without name & hosts fields"], null);
        }
      } //Invalid Assets
      else if (doc._id.indexOf("asset.invalid") >= 0) {
        emit(["Invalid Asset", "Unclassified assets"], null);
      } //IMS Assets
      else if (doc._id.indexOf("asset.attr_doc") >= 0 || doc._id.indexOf("asset.type_doc") >= 0) {
        emit(["Ims Asset", "IMS internal assets"]);
      }
      else if (doc._id.indexOf("asset.") >=0){
        emit["Others", "Miscellaneous assets"];
      }
      else {
        emit(["Invalid", "Unclassified records"], null);
      }
    },
    reduce: '_count'
  },
};
