ckan.module('ngsiviewchart',function(jQuery,_){
    return{
        options:{
            i18n:{error:_('An error occurred: %(text)s %(error)s')},
            parameters:{contentType:'application/json',
                            dataType:'json',
                            dataConverter:function(data){return JSON.stringify(data,null,2);},
                            language:'json',type:'GET'}},
        initialize:function(){
            var self=this;
            var p;
            p=this.options.parameters;

            if(typeof(view_enable) == 'undefined'){
                view_enable = [];
                view_enable[0] = true;
                resource_url = preload_resource['url']
            }

	    function makeGraph(DygraphContent, range_s){
     		new Dygraph(
          		document.getElementById("chart"),
          		DygraphContent,
          		{
           		 fillGraph: 'true',
			 connectSeparatedPoints: 'true',
			 axisLabelFontSize: 10,
           		 legend: 'always',
           		 labelsDivStyles: { 'textAlign': 'right' },
			 showRangeSelector: range_s,
          		}
      		);
	    }

            if(view_enable[0]){
                jQuery.ajax(resource_url,{
                    type:p.type,
                    contentType:p.contentType,
                    dataType:p.dataType,
                    success:function(data,textStatus,jqXHR){
                        if(preload_resource['format'].toLowerCase() == 'ngsi-h'){
                            document.getElementById('chart').style.height = '400px';
                            document.getElementById('chart').style.border = '1px solid rgba(0, 0, 0, 0.15)';

                            if(typeof(data.contextResponses) != 'undefined'){
                                var entity_id = '';
                                var attribute_name = '';
                                var attributes = [];
				var h_list = ['Date'];
				var v_list = [];
				var d_list = [];
                                for(i=0;i<data.contextResponses.length;i++){
                                    attributes = data.contextResponses[i].contextElement.attributes;
                                    for(e=0;e<attributes.length;e++){
					var i_a = data.contextResponses[i].contextElement.id+"_"+attributes[e].name;
					h_list[h_list.length] = i_a; 
                                        for(z=0;z<attributes[e].values.length;z++){
					    var d = attributes[e].values[z].recvTime.substring(0,10).replace(/-/gi, "/");
					    var h = attributes[e].values[z].recvTime.substring(11,19)
				            var g_date = d+" "+h;
					    var value  = parseFloat(attributes[e].values[z].attrValue);
					    temp_data = [g_date, value];
					    temp_data_c = [attributes[e].values[z].recvTime, value];
					    v_list[v_list.length] = [Date.parse(attributes[e].values[z].recvTime), i_a, temp_data];
					    d_list[d_list.length] = [Date.parse(attributes[e].values[z].recvTime), i_a, temp_data_c];
		                        }
                                    }
				}

				if(v_list.length == 0){
                                    document.getElementById('chart').style.display = 'none';
                                    document.getElementById('chart').style.border = '0px';
				}

				function sortFunction(a, b) {
    				    if (a[0] === b[0]) {
        				return 0;
    				    }
    				    else {
        				return (a[0] < b[0]) ? -1 : 1;
    				    }
				}

				v_list = v_list.sort(sortFunction);
				d_list = d_list.sort(sortFunction);
				
                                var csvContent = h_list.join(", ")+"%0A";
                                var DygraphContent =  h_list.join(", ")+"\n";

                                for(var z=0;z<v_list.length;z++){
				    var tempArray = new Array(h_list.length);
				    var tempArray_c = new Array(h_list.length);

				    tempArray[0] = v_list[z][2][0];
				    tempArray_c[0] = d_list[z][2][0];

  				    tempArray[h_list.indexOf(v_list[z][1])] = v_list[z][2][1];
                                    tempArray_c[h_list.indexOf(d_list[z][1])] = d_list[z][2][1];

				    var l = 0;						
				    for(var r=0;r<h_list.length;r++){
					var c = z + r;
					if(c <= v_list.length - 1){
				   	    if(v_list[z][0] == v_list[c][0]){
						if (v_list[z][1] != v_list[c][1]){
					    	    tempArray[h_list.indexOf(v_list[c][1])] = v_list[c][2][1];
						    tempArray_c[h_list.indexOf(d_list[c][1])] = d_list[c][2][1];
						    l = r;
						}
			   		    }
					}
			   	    }
				    z += l;
				    DygraphContent += tempArray.join(", ")+"\n";
				    csvContent += tempArray_c.join(", ")+"%0A";
                                }
				var range_s = true;
				if(h_list.length>=3){range_s = false;}
                                makeGraph(DygraphContent, range_s);


			        var dbtn ="<div id='buttonbar'><a id='dbtn' class='btn btn-primary'><b>Download</b></a></div>";
                                $("#chart").before(dbtn);
				document.getElementById('dbtn').addEventListener('click', function () {

                                        if(preload_resource['name'] == ''){var filename = 'Unnamed resource';}
					else{var filename = preload_resource['name'];}
					var a = document.createElement('a');
					if(v_list.length != 0){
						a.href        = 'data:attachment/csv,' + csvContent;
						a.target      = '_blank';
						a.download    = filename+'.csv';
					}
					else{
                                                a.href        = 'data:attachment/json,' + JSON.stringify(data);
                                                a.target      = '_blank';
                                                a.download    = filename+'.json';

					}
					document.body.appendChild(a);
					a.click();
				}, false);
                            }
                        }
                    },
                    error:function(jqXHR,textStatus,errorThrown){
                        if(textStatus=='error'&&jqXHR.responseText.length){
                            document.getElementById('chart').style.height = '0px';
                            document.getElementById('chart').style.border = '0px';
                        }
                        else{document.getElementById('chart').style.height = '0px';;
                            document.getElementById('chart').style.border = '0px';}}
                });
            }
        }
    }
});

