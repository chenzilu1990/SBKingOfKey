{
	 
	
	function template(thisObj)
	{	

		var scriptName = "SBKingOfKeyBeta7.26";

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
					 
					var cmd = my_palette.grp.cmd;
					
					 

					if (selPros.length != 0) {
						//遍历选中属性
 						 
						
						 
						 
							var layerTra = selLayer.transform;
							if (layerTra.position.isTimeVarying || layerTra.anchorPoint.isTimeVarying || layerTra.scale.isTimeVarying || layerTra.rotation.isTimeVarying ) {
								alert("第" + selLayer.index + "图层 ：" + selLayer.name + "的transform属性下存在关键帧或者表达式,该类图层暂时不支持整合，此图层将被忽略。");
							} else {


								if ((layerTra.rotation.value != 0) || (layerTra.scale.value[0] != 100) || (layerTra.scale.value[1] != 100)) {
									alert("第" + selLayer.index + "图层 ：" + selLayer.name + "的scale属性或者rotation属性的值并非原始值,该类图层暂时不支持整合，此图层将被忽略。");	
								} else {
									var compW = activeComp.width;
									var compH = activeComp.height;
									var halfW = compW * 0.5;
									var halfH = compH * 0.5;
									var frameDuration = activeComp.frameDuration;
									var currTime = activeComp.time;
									if ( (layerTra.anchorPoint.value[0] == halfW) && (layerTra.anchorPoint.value[1] == halfH) && (layerTra.position.value[0] == halfW) && (layerTra.position.value[1] == halfH) ) {

										var selPro = selPros[0];
										 
										if (!selPro.isMask) {
											alert("请选择一个Mask");
											return;
										}

										var mask = selPro;
										 
										var path = mask.property("ADBE Mask Shape");
										var path1 = selLayer.mask(1).property("ADBE Mask Shape");
										 
									 	if (path.isTimeVarying) {

											var pathValue = path.valueAtTime(currTime, false);
									 	} else {
									 		var pathValue = path.value;
									 	}
										 
									 	if (path1.numKeys == 1) {
									 		path1.setValueAtTime(currTime, pathValue);
									 		path1.setValueAtTime(currTime - frameDuration, copyPath(pathValue, [2 * compW, 0]));	
									 		path1.setValueAtTime(currTime + frameDuration, copyPath(pathValue, [2 * compW, 0]));	
									 	} else {

										 	if (path1.keyTime(1) == currTime) {
										 		path1.setValueAtTime(currTime, pathValue);
										 		path1.setValueAtTime(currTime - frameDuration, copyPath(pathValue, [2 * compW, 0]));
										 		activeComp.time = currTime - frameDuration;	
										 	} else if (path1.keyTime(path1.numKeys) == currTime) {
										 		path1.setValueAtTime(currTime, pathValue);
										 		path1.setValueAtTime(currTime + frameDuration, copyPath(pathValue, [2 * compW, 0]));
										 		activeComp.time = currTime + frameDuration;	
										 	}
									 	}
										
										if (mask.propertyIndex != 1) {
									 		
									 		 
									 		mask.remove();	
									 	}
										 
										
										selLayer.selected = true;
										
										activeComp.openInViewer();
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
	 
									} else {
										alert("层位移或者锚点位移");
										 
	 
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

		//刷新
		function onRefreshBtnClick()
		{
			my_palette.grp.cmd.listBox.removeAll();
			var activeItem = app.project.activeItem;
			if ((activeItem == null) || !(activeItem instanceof CompItem)) {
				alert("请选择或打开一个合成.", scriptName);
			} else {
				var selectedLayers = activeItem.selectedLayers;
				if (activeItem.selectedLayers.length == 0)  {
					alert("至少选择一个图层或者mask", scriptName);
				} else {

					app.beginUndoGroup(scriptName);

					var activeComp = activeItem;
					var selLayer = activeComp.selectedLayers[0];
					var selPros = selLayer.selectedProperties;
            
					var maskGroup = selLayer.mask;
					 

					if (selPros.length == 0) {		//只选中图层，没选中mask



						for (var i = 0; i < selectedLayers.length; i++) {		//遍历选中的图层
							 
							var aSelLayer = selectedLayers[i];
							var maskGroup = aSelLayer.mask;
							if (maskGroup.numProperties == 0) alert("第" + aSelLayer.index + "图层没有马赛克");		//选中的图层没有mask
							for (var k = maskGroup.numProperties - 1; k >= 0; k--) {		//遍历选中图层的mask

								 

								var masksArr = aSelLayer.mask;
							
								for (var j = masksArr.numProperties - 1; j >= 0; j--) {
									var oneMask = masksArr(j + 1);
									my_palette.grp.cmds.listBox.add("item", oneMask.name);


								}



							}
						}



					} else {

						for (var i = selPros.length - 1; i >= 0; i--) {
					 	 	var aMask = selPros[i];

					 	 	//挑选出mask
					 	 	
					 	 	if (aMask.matchName == "ADBE Mask Atom") {
					 	 		 
				 	 			var maskName = aMask.name;

		 						var dupLayer = selLayer.duplicate();
		 						dupLayer.moveAfter(selLayer);
								dupLayer.name = maskName;

								var masksArr = dupLayer.mask;
								
								for (var j = masksArr.numProperties - 1; j >= 0; j--) {
									var oneMask = masksArr(j + 1);
									if (oneMask.name != maskName) oneMask.remove();

								}

					 	 	}

						}
								
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
								}, \
								cmds: Group { \
									alignment:['fill','center'], \
									collectButton: Button { text:'一键逐帧', alignment:['fill','center'] }, \
								}, \
							}";
				


 





				my_palette.margins = [10,10,10,10];
				my_palette.grp = my_palette.add(res);  
				
				// for (var i = 0; i < 1; i++) {
				// 	my_palette.grp.cmd.listBox.add("item", "maskName");
				// }
 


				// Workaround to ensure the edittext text color is black, even at darker UI brightness levels.
				var winGfx = my_palette.graphics;
				var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);
				
				// my_palette.grp.cmd.refreshBtn.onClick = onRefreshBtnClick;
				// onRefreshBtnClick();
				my_palette.grp.cmds.collectButton.onClick = onCollectClick;
				// my_palette.grp.cmd.nameStyleButton1.value = true;
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