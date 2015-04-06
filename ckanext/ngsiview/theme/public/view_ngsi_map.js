

ckan.module('ngsiviewmap',function(jQuery,_){
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
        if(view_enable[0]){
            jQuery.ajax(resource_url,{
                type:p.type,
                contentType:p.contentType,
                dataType:p.dataType,
                success:function(data,textStatus,jqXHR){
                    var i;
                    var pos_list = new Array();
                    var listlat = new Array();
                    var listlon = new Array();


                    if(typeof(data.contextElement) != 'undefined'){
                        var contextElement = data;
                        data = {};
                        data['contextResponses'] = [contextElement];
                    }

                    if(typeof(data.contextResponses) != 'undefined'){
                        for(i=0;i<data.contextResponses.length;i++){
                            var lat = '';
                            var lon = '';
                            var e;
                            var info = new String();
                            if('attributes' in data.contextResponses[i]['contextElement']){
                                var attributes = data.contextResponses[i]['contextElement']['attributes'];
                                for(e=0;e<attributes.length;e++){
                                    if(attributes[e].name == 'position'){
                                        var cd = attributes[e].value.split(",");
                                        var dat = {}
                                        dat.pos = [parseFloat(cd[1]),parseFloat(cd[0])];
                                        dat.name = data.contextResponses[i]['contextElement']['id'];
                                        var x;
                                        info += "<table style='font-size:85%;line-height:90%;'>";
                                        for(x=0;x<attributes.length;x++){
                                            info += "<tr><td><div><strong>"+attributes[x].name+" : </strong></div></td><td><div>"+attributes[x].value+"</div></td></tr>";
                                        }
                                        info += "</table>";
                                        dat.attrib = info;
                                        pos_list[pos_list.length] = dat;
                                        listlat[listlat.length] = parseFloat(cd[0]);
                                        listlon[listlon.length] = parseFloat(cd[1]);
                                    }
                                    if(attributes[e].type == 'urn:x-ogc:def:phenomenon:IDAS:1.0:latitude'){
                                        lat = parseFloat(attributes[e].value);
                                    }
                                    if(attributes[e].type == 'urn:x-ogc:def:phenomenon:IDAS:1.0:longitude'){
                                        lon = parseFloat(attributes[e].value);
                                    }
                                }
                            }
                            if(lat.length != 0 && lon.length !=0){
                                var dat = {}
                                dat.pos = [lon,lat];
                                dat.name = data.contextResponses[i]['contextElement']['id'];
                                var x;
                                for(x=0;x<attributes.length;x++){
                                    info += "<div><strong>"+attributes[x].name+"</strong> : "+attributes[x].value+"</div>";
                                }
                                dat.attrib = info;
                                pos_list[pos_list.length] = dat;
                                listlat[listlat.length] = lat;
                                listlon[listlon.length] = lon;
                            }
                        }
                    }

                    if (pos_list.length == 0){
                        document.getElementById('map').style.height = '0px';
                        document.getElementById('map').style.border = '0px';
                    }

                var x;
                x=$(document);
                x.launch_map(pos_list);

                },
                error:function(jqXHR,textStatus,errorThrown){
                    if(textStatus=='error'&&jqXHR.responseText.length){
                        document.getElementById('map').style.height = '0px';
                        document.getElementById('map').style.border = '0px';
                    }
                    else{document.getElementById('map').style.height = '0px';;
                        document.getElementById('map').style.border = '0px';}}});
            }
            else{
                document.getElementById('map').style.height = '0px';
                document.getElementById('map').style.border = '0px';
            }
	    }};});
