;
var JSPaint = function($){
  "use strict";
  var InitializePaintArea = function(containerId, canvasId){
    var width = $('#'+containerId).css('width').replace('px','');
    var height = $('#'+containerId).css('height').replace('px','');
    console.log(width+", "+height);
    var canvas = $('<canvas/>', { id: canvasId })
                      .prop({
                        'width': width,
                        'height': height
                       });
    $('#'+containerId).append(canvas);
    return $('#'+canvasId)[0].getContext('2d');
  }
  return{
    InitializePaintArea : InitializePaintArea
  }
};
