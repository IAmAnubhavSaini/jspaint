;
var JSPaint = function($){
  "use strict";
  var InitializePaintArea = function(containerId, canvasId){
    var canvas = $('<canvas/>', { id: canvasId })
                      .css({
                        'min-height':'400px',
                        'min-width':'600px',
                        'width': '100%',
                        'height': '100%'
                       });
    $('#'+containerId).append(canvas);
    return $('#'+canvasId)[0].getContext('2d');
  }
  return{
    InitializePaintArea : InitializePaintArea
  }
};
