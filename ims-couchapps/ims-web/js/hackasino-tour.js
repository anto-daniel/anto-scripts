$(function() {
    $("#demo").click(function() {
	start_tour();
    });
});

function start_tour() {
    var tour = new Tour({container: ".tooler",
			 onNext: function (e) {
			     if (e['_current'] === 3) {
				 var min = 0, max = 25;
				 $("#myslider").slider('setValue', [min, max]);
				 load_Data(min, max);
			     }
			     if (e['_current'] === 4) {
				 var min = 70, max = 100;
				 $("#myslider").slider('setValue', [min, max]);
				 load_Data(min, max);
			     }
			 },
			 onPrev: function (e) {
			     if (e['_current'] === 5) {
				 var min = 0, max = 25;
				 $("#myslider").slider('setValue', [min, max]);
				 load_Data(min, max);
			     }
			     if (e['_current'] === 6) {
				 var min = 70, max = 100;
				 $("#myslider").slider('setValue', [min, max]);
				 load_Data(min, max);
			     }
			 }

			});
    tour.addSteps([
	{
            element: "#ims", // string (jQuery selector) - html element next to which the step popover should be shown
	    placement: "bottom",
            title: "This hack is powered by the IMS API platform: InMobi's Single Source of Truth about all things infrastructure",
            content: ""
	},
	{
	    orphan: true,
	    placement: "top",
            title: "We measure capacity utilisation data from all of InMobi's infrastructure and wish to help reduce InMobi's TCO of IT assets.",
            content: ""
	},
	{
	    element: ".sliderhandle0",
	    placement: "bottom",
	    title: "Hosts with Net Performance below this mark will not be shown.",
	    content: ""
	},
	{
	    element: ".sliderhandle1",
	    placement: "bottom",
	    title: "Hosts with Net Performance above this mark will not be shown",
	    content: ""
	},
	{
	    element: ".sliderhandle1",
	    placement: "right",
	    title: "For example, here is the list of all servers whose Net Capacity Utilization is below 25%.",
	    content: ""
	},
	{
	    element: ".sliderhandle0",
	    placement: "left",
	    title: "Another example: Hosts with most utilization",
	    content: ""
	},
	{
	    element: "#unused-asset-table_filter",
	    placement: "right",
	    title: "Wondering about your hosts? Search here by their fqdn or by any of these listed fields",
	    content: ""
	},
	{
	    element: "#selfld",
	    placement: "right",
	    title: "Take ownership of your host. Select the hosts you own"
	},
	{
	    element: "#claimbutton",
	    placement: "top",
	    title: "Fill up a brief form as to what you intend to do with the hosts you own and claim ownership"
	}
    ]);
    tour.restart();
    //console.log("xyz");
}
