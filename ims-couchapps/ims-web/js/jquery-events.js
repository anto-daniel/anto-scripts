

$(document).ready(function() {

	//******************************************************************All assets Table **************************************************************************
       
  dynamicTable=$('#report-table').dataTable( {
        "bProcessing": true,
        
      //  "sAjaxSource": 'http://192.168.56.101:5984/ims/_design/ims/_list/main/main?filter=servername,physical,itag,macid,switch,switchport',
        "sAjaxSource"   :'http://192.168.151.181:5984/ims/_design/ims/_list/main/main?filter=servername,physical,itag,macid,switch,switchport',
        "aoColumns": [
                        { "mData": "servername" },
                        { "mData": "physical" },
                        { "mData": "itag" },
                        { "mData": "macid" },
                        { "mData": "switch" },
                        { "mData": "switchport" }
                    ],

                    "sPaginationType": "bootstrap",
                    "oLanguage": {
                        "sLengthMenu": "_MENU_ records per page"
                    },
        "sDom": '<"clear">Tlrtip',
        "oTableTools": {
            "sSwfPath": "media/swf/copy_csv_xls_pdf.swf",
            "aButtons": [ "print","xls" ]
        }

      } );   
 

        //******************************************************************Unused assets Table **************************************************************************
       
        
        
        $('#unused-asset-table').dataTable( {
        "bProcessing": true,
        
        "sAjaxSource": 'http://192.168.56.101:5984/ims/_design/ims/_list/main/main',

        "aoColumns": [
                        { "mData": "servername" },
                        { "mData": "physical" },
                        { "mData": "itag" },
                        { "mData": "macid" },
                        { "mData": "switch" },
                        { "mData": "switchport" }
                    ],

                    "sPaginationType": "bootstrap",
                    "oLanguage": {
                        "sLengthMenu": "_MENU_ records per page"
                    },
        "sDom": 'T<"clear">lfrtip',
        "oTableTools": {
            "sSwfPath": "media/swf/copy_csv_xls_pdf.swf",
            "aButtons": [ "print","xls" ]
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        switch(aData[1]){
            case 'true':
                $(nRow).text("Physical")
                break;
            case 'Misc':
                $(nRow).css('background-color', '#D9EDF7')
                break;
            case 'Tasman':
                $(nRow).css('background-color', '#FFE4B5')
                break;
        	}
    	}


      } );   

        //******************************************************************Released assets Table **************************************************************************
       
        $('#released-asset-table-c').html( '<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered table-hover table-striped" id="released-asset-table"></table>' );
        
        $('#released-asset-table').dataTable( {
        "bProcessing": true,
        "sAjaxSource": 'sources/arrays.txt',
        "aoColumns": [
            { "sTitle": "Engine" },
            { "sTitle": "Browser" },
            { "sTitle": "Platform" },
            { "sTitle": "Version", "sClass": "center" },
            { "sTitle": "Grade", "sClass": "center" }
        ],
        
                    "sPaginationType": "bootstrap",
                    "oLanguage": {
                        "sLengthMenu": "_MENU_ records per page"
                    },
        "sDom": 'T<"clear">lfrtip',
        "oTableTools": {
            "sSwfPath": "media/swf/copy_csv_xls_pdf.swf",
            "aButtons": [ "print","xls" ]
        }


      } );   
    
  } );