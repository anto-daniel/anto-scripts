exports.views = {
  hardware_profile_classification: {
    map: function (doc) {
      var op_str = [];

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

      //check if facter version is latest(+latest) or old(-latest) 
      function is_facter_version() {
        if (doc.version != null) {
          if (doc.version["ims-facter"] != null) {
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

      //Server Assets

      //_id Check
      if (doc._id.indexOf("asset.server") >= 0) {

        //itag check
        if (doc.itag.match(/[A-Z]{2,3}[0-9](SR)/)) {

          //Actual logic
          is_physical();
          is_facter();
          is_facter_version();

          //Get the O/P String Expression  
          var exp = op_str.join();

          if (exp == "+physical,+facter,+latest") {
            if (doc.processor != null && doc.productname != null && doc.memory != null && doc.manufacturer != null && doc.blockdevices != null) {

              //convert memory size string to meaninful integer value expressed in GB
              var doc_memory = doc.memory.memorytotal;
              var value = doc_memory.split(" ");
              var int_size = parseFloat(value[0]);
              var size = Math.round(int_size);
              var mem_size = size.toString() + " GB";

              //block to compute total disk count & disk size 

              //disk_count

              var disks = doc.blockdevices;
              var disk_count = disks.length;

              //disk_size

              var total_bytes = 0;
              var disk_size;

              disks.forEach(function (disk) {
                var val = doc.blockdevice[disk]["size"];
                total_bytes = total_bytes + parseInt(val);
              });

              //covert bytes to GB/TB

              var kilobyte = 1024;
              var megabyte = kilobyte * 1024;
              var gigabyte = megabyte * 1024;
              var terabyte = gigabyte * 1024;

              if ((total_bytes >= megabyte) && (total_bytes < gigabyte)) {
                var val = Math.round((total_bytes / megabyte));
                disk_size = val + ' MB';
              }
              else if ((total_bytes >= gigabyte) && (total_bytes < terabyte)) {
                var val = Math.round((total_bytes / gigabyte));
                disk_size = val + ' GB';
              }
              else if (total_bytes >= terabyte) {
                var val = Math.round((total_bytes / terabyte));
                disk_size = val + ' TB';
              }

              //block to find CPU model
              if ((doc.processor["processor"]) != null) {
                var cpu_model = doc.processor["processor"];
              }
              else {
                var cpu_model = "Unknown";//block to be removed after ims-facter update
              }

              emit({
                "cpu_count": doc.processor.physicalprocessorcount,
                "cpu_model": cpu_model,
                "total_memory": mem_size,
                "disk_count": disk_count,
                "total_disk_size": disk_size,
                "vendor": doc.manufacturer,
                "server_model": doc.productname
              }, null);
            }
          }

        }
      }
    },
    reduce: '_count'
  },
};
