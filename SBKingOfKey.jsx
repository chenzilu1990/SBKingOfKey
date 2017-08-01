{
	 
	
	function template(thisObj)
	{	

		var scriptName = "SBKingOfKey7.26";

		//一键整合
		function onCollectClick()
		{
			 
			var activeItem = app.project.activeItem;
			if ((activeItem == null) || !(activeItem instanceof CompItem)) {
				alert("请选择或打开一个合成.", scriptName);
			} else {
				var selectedLayers = activeItem.selectedLayers;
				if (selectedLayers.length == 0) {
					alert("至少选择一个图层或者mask", scriptName);
				} else {
					app.beginUndoGroup(scriptName);
					
					var activeComp = activeItem;
					var selLayer = activeComp.selectedLayers[0];
					var selPros = selLayer.selectedProperties;
					// var maskGroup = selLayer.mask;
					var cmd = my_palette.grp.cmd;
					
					// var solidItem = selLayer.source;
					// var aSolid = activeComp.layers.add(solidItem);
					// aSolid.moveAfter(selectedLayers[selectedLayers.length - 1]);
 				// 	aSolid.name = "一键整合";

					if (selPros.length != 0) {
						//遍历选中属性
 						 
						
						 
						 
							var layerTra = selLayer.transform;
							if (layerTra.position.isTimeVarying || layerTra.anchorPoint.isTimeVarying || layerTra.scale.isTimeVarying || layerTra.rotation.isTimeVarying ) {
								alert("第" + selLayer.index + "图层 ：" + selLayer.name + "的transform属性下存在关键帧或者表达式,该类图层暂时不支持整合，此图层将被忽略。");
							} else {


								if ((layerTra.rotation.value != 0) || (layerTra.scale.value[0] != 100) || (layerTra.scale.value[1] != 100)) {
									alert("第" + selLayer.index + "图层 ：" + selLayer.name + "的scale属性或者rotation属性的值并非原始值,该类图层暂时不支持整合，此图层将被忽略。");	
								} else {
									var halfW = activeComp.width * 0.5;
									var halfH = activeComp.height * 0.5;

									if ( (layerTra.anchorPoint.value[0] == halfW) && (layerTra.anchorPoint.value[1] == halfH) && (layerTra.position.value[0] == halfW) && (layerTra.position.value[1] == halfH) ) {

										
										var mask = selPros[0];
										var path = mask.property("ADBE Mask Shape");
									 	
									 	if (path.isTimeVarying) {

											var pathValue = path.valueAtTime(activeComp.time, false);
									 	} else {
									 		var pathValue = path.value;
									 		path.addKey(activeComp.time);
									 	}
									 
										var compW = activeComp.width;
										var compH = activeComp.height;
										 
										path.addKey(activeComp.time + activeComp.frameDuration);
										path.addKey(activeComp.time - activeComp.frameDuration);
											
										path.setValueAtTime(activeComp.time + activeComp.frameDuration , copyPath(pathValue, [2 * compW, 0]));
										path.setValueAtTime(activeComp.time - activeComp.frameDuration , copyPath(pathValue, [2 * compW, 0]));
										 

										//拷贝路径
										function copyPath(path, aSelLayerOffset) 
										{
											var aPath = new Shape();
										 	maskVertices = new Array();
											for (var i=0; i<path.vertices.length; i++)
								                maskVertices[maskVertices.length] = [path.vertices[i][0]+aSelLayerOffset[0], path.vertices[i][1]+aSelLayerOffset[1]];

											aPath.vertices = maskVertices;
											aPath.inTangents = path.inTangents;
											aPath.outTangents = path.outTangents;
											aPath.closed = path.closed;
											return aPath;
										}

										activeComp.openInViewer();
										// alert(cmd.nameStyleButton1.value == true);
										if (cmd.nameStyleButton1.value == true) {
											activeComp.time +=  activeComp.frameDuration;	
										} else if (cmd.nameStyleButton2.value == true){
											activeComp.time -=  activeComp.frameDuration;
										} else if (cmd.nameStyleButton3.value == true) {
											//nothing

										} else {
											alert("请选择一个你喜欢Roto方向");
											return ;
										}
										
										mask.selected = false;
	 
									} else {

										var aSelLayerXoffset = layerTra.position.value[0] - layerTra.anchorPoint.value[0] ;
										var aSelLayerYoffset = layerTra.position.value[1] - layerTra.anchorPoint.value[1] ;
										var aSelLayerOffset = [aSelLayerXoffset, aSelLayerYoffset];

										 
										//遍历选中图层的所有mask
						
		 
										for (var j = 0; j < selPros.length; j++) {
										 
											var aMask = selPros[j];
											var addMask = aSolid.mask.addProperty("ADBE Mask Atom");
											addMask.color = aMask.color;
											var maskPath = aMask.property("ADBE Mask Shape");
											 									 
											emuMaskPathWithOffset(maskPath, addMask, aSelLayerOffset);
											addMask.name = selLayer.name + "-"  + aMask.name; 
										}
	 
									}

											 
				 					

								} 
								 
							}

 	 

						 
							 
						 



					} else {
						 
						activeComp.openInViewer();
					}

     
					app.endUndoGroup();
					
					 
				}
			}	
		}

		 
		// 
		// This function puts up a modal dialog asking for a scale_factor.
		// Once the user enters a value, the dialog closes, and the script scales the comp.
		// 
		function BuildAndShowUI(thisObj)
		{
			// Create and show a floating palette.
			var my_palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable:true});
			if (my_palette != null)
			{
				var res = 
							"group { \
								orientation:'row', alignment:['fill','left'], alignChildren:['center','top'], spacing:5, margins:[0,0,0,0], \
								cmd: Group { \
									alignment:['fill','center'], \
									nameStyleButton1: RadioButton { text:'从前往后', alignment:['fill','left'] }, \
									nameStyleButton2: RadioButton { text:'从后往前', alignment:['fill','left'] }, \
									nameStyleButton3: RadioButton { text:'时前时后', alignment:['fill','left'] }, \
								}, \
								cmds: Group { \
									alignment:['fill','center'], \
									collectButton: Button { text:'一键逐帧', alignment:['fill','center'] }, \
								}, \
							}";
				


 





				my_palette.margins = [10,10,10,10];
				my_palette.grp = my_palette.add(res);  
				
				 


				// Workaround to ensure the edittext text color is black, even at darker UI brightness levels.
				var winGfx = my_palette.graphics;
				var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);
				 
				
				my_palette.grp.cmds.collectButton.onClick = onCollectClick;
				my_palette.grp.cmd.nameStyleButton1.value = true;
				my_palette.onResizing = my_palette.onResize = function () {this.layout.resize();}
			}
			
			return my_palette;
		}
		
		
		 
		// 
		// The main script.
		//
		if (parseFloat(app.version) < 8) {
			alert("This script requires After Effects CS3 or later.", scriptName);
			return;
		}
		
		var my_palette = BuildAndShowUI(thisObj);
		if (my_palette != null) {
			if (my_palette instanceof Window) {

				my_palette.center();
				my_palette.show();
			} else {

				my_palette.layout.layout(true);
				my_palette.layout.resize();
			}
		} else {
			alert("Could not open the user interface.", scriptName);
		}
	}
	
	
	template(this);
}