(function($){
  "use strict";

  $(function(){
    var CONSTANTS = {
        canvasId: "jspaint-canvas",
        containerId: "jspaint-paint-area",
        activeToolCursorClass: "working-with-tools",
        maintoolsClass: "main-tool",
        basicColors:
          [
            {id: '00FFFF', name:"Aqua"},
            {id: '000000', name:"Black"},
            {id: '0000FF', name:"Blue"},
            {id: 'FF00FF', name:"Fuchsia"},
            {id: '808080', name:"Gray"},
            {id: '008000', name:"Green"},
            {id: '00FF00', name:"Lime"},
            {id: '800000', name:"Maroon"},
            {id: '000080', name:"Navy"},
            {id: '808000', name:"Olive"},
            {id: '800080', name:"Purple"},
            {id: 'FF0000', name:"Red"},
            {id: 'C0C0C0', name:"Silver"},
            {id: '008080', name:"Teal"},
            {id: 'FFFFFF', name:"White"},
            {id: 'FFFF00', name:"Yellow"},
          ]
        },
        VARIABLES = {
          pencilToolRectWidth: 2,
          pencilToolRectHeight: 2,
          discRadius: 10
        },
        size = window.location.toString().split('?')[1].split('=')[1],
        sizeX = size.split('x')[0],
        sizeY = size.split('x')[1],
        jspaint = null,
        selectedAlternativeColor = '',
        selectedPrimaryColor = '',
        resetCanvasColor = 'white',
        context= null,

        generateBasicColorPalette = function(){
          var div1 = $('<div></div>');
          var div2 = $('<div></div>');
          var appendWhere = div1;
          for(var i = 0, len = CONSTANTS.basicColors.length; i < len; i++){
            appendWhere = i < len/2 ? div1 : div2;
            var hex = '#'+CONSTANTS.basicColors[i].id;
            var color = $('<div class="color" id="Color-Hex-'+hex+'" style="background-color: '+hex+';"></div>');
            color.appendTo(appendWhere);

          }
          div1.appendTo('.BasicColorPalette');
          div2.appendTo('.BasicColorPalette');

        },

        initializeCanvas = function(){
          var width = sizeX -2,
              height = sizeY -2;
              $('<canvas/>', { id: CONSTANTS.canvasId })
                .prop({'width': width,'height': height})
                .appendTo('#'+CONSTANTS.containerId);
          return $('#'+CONSTANTS.canvasId)[0].getContext('2d');
        },

        startFreeStyleSpeedDotsTool = function(){
          $('#'+CONSTANTS.canvasId).on("mousemove", function (event) {
            context.fillRect(
              (event.pageX - $(this).offset().left),
              (event.pageY - $(this).offset().top),
              2, 2
            );
          });
        },

        stopFreeStyleSpeedDotsTool = function(){
          $('#'+CONSTANTS.canvasId).off("mousemove");
        },

        CANVASAPI = {
          fillCirc: function(x, y, radius){
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            context.fill();
          }
        },

        startDiscTool = function(){
          $('#'+CONSTANTS.canvasId).on("click", function (event) {
            CANVASAPI.fillCirc(
              (event.pageX - $(this).offset().left),
              (event.pageY - $(this).offset().top),
              VARIABLES.discRadius
            );
          });
        },

        stopDiscTool = function(){
          $('#'+CONSTANTS.canvasId).off("click");
        },

        startSquareTool = function(){
          $('#'+CONSTANTS.canvasId).on("click", function (event) {
            context.fillRect(
              (event.pageX - $(this).offset().left),
              (event.pageY - $(this).offset().top),
              10, 10
            );
          });
        },

        stopSquareTool = function(){
          $('#'+CONSTANTS.canvasId).off("click");
        },

        generateHexColorStringFromThisElementsId = function (element){
          return '#'+element.attr('id').split('#')[1];
        },

        startPencilTool = function(options){
          $('#'+CONSTANTS.canvasId).on('mousemove', function(event){
            if(event.buttons !== undefined){
              if(event.buttons === 1){
                context.fillRect(
                  (event.pageX - $(this).offset().left),
                  (event.pageY - $(this).offset().top),
                  VARIABLES.pencilToolRectWidth, VARIABLES.pencilToolRectHeight
                );
              }
            }
          });
        },

        stopPencilTool = function(options){
          $('#'+CONSTANTS.canvasId).off('mousemove');
        },

        activateTool = function(options, start){
          if(activeTool !== null){
            activeTool.trigger('click');
          }
          $(options.tool).toggleClass('active-tool');
          start(options);
        },

        deactivateTool = function(options, stop){
          $(options.tool).toggleClass('active-tool');
          stop(options);
        },

        activeTool = null,

        registerFreeStyleSpeedDotsToolEvents = function(){
          $('#FreeStyleSpeedDotsTool').funcToggle('click',
            function(){
              activateTool({tool: this}, startFreeStyleSpeedDotsTool);
              activeTool = $(this);
            },
            function(){
              activeTool = null;
              deactivateTool({tool: this}, stopFreeStyleSpeedDotsTool);
            }
          );
        },

        activateDiscContextMenu = function(options){
          var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
          var increase = $('<div></div>').attr('id', options.increaseDiscSize.id).addClass('menu-item');
          var increaseIcon = $('<i></i>').addClass(options.increaseDiscSize.icon);
          var anchorIncrease = $('<a></a>').css('font-size', '20px').on('click', function(){
            VARIABLES.discRadius += 2;
            $(this).attr('title', VARIABLES.discRadius);
          });
          increaseIcon.appendTo(anchorIncrease);
          anchorIncrease.appendTo(increase);
          var decrease = $('<div></div>').attr('id', options.decreaseDiscSize.id).addClass('menu-item');
          var decreaseIcon = $('<i></i>').addClass(options.decreaseDiscSize.icon);
          var anchorDecrease = $('<a></a>').css('font-size', '20px').on('click', function(){
            VARIABLES.discRadius = VARIABLES.discRadius-2===0? 2:VARIABLES.discRadius-2;
            $(this).attr('title', VARIABLES.discRadius);
          });
          decreaseIcon.appendTo(anchorDecrease);
          anchorDecrease.appendTo(decrease);
          increase.appendTo(div);
          decrease.appendTo(div);
          div.appendTo($(options.containerSelectionCriterion));
        },

        deactivateDiscContextMenu = function(options){
          $('#'+options.id).remove();
        },

        getDiscContextMenuOptions = function(){
          return {
            tool: this,
            id: 'DiscContextMenu',
            increaseDiscSize : {
              id: 'increaseDiscSize',
              icon: 'glyphicon glyphicon-circle-arrow-up',
              containerId: 'DiscContextMenu'
            },
            decreaseDiscSize : {
              id: 'decreaseDiscSize',
              icon: 'glyphicon glyphicon-circle-arrow-down',
              containerId: 'DiscContextMenu'
            },
            containerSelectionCriterion: '.contextual-tool-bar'
          };
        },

        registerDiscToolEvents = function(){
          $('#DiscTool').funcToggle('click',
            function(){
              activateTool({tool: this}, startDiscTool);
              activateDiscContextMenu(getDiscContextMenuOptions());
              activeTool = $(this);
            },
            function(){
              activeTool = null;
              deactivateTool({tool: this}, stopDiscTool);
              deactivateDiscContextMenu(getDiscContextMenuOptions());
            }
          );
        },

        activatePencilContextMenu = function(options){
          var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
          var increase = $('<div></div>').attr('id', options.increaseDotSize.id).addClass('menu-item');
          var increaseIcon = $('<i></i>').addClass(options.increaseDotSize.icon);
          var anchorIncrease = $('<a></a>').css('font-size', '20px').on('click', function(){
            VARIABLES.pencilToolRectWidth += 2;
            VARIABLES.pencilToolRectHeight = VARIABLES.pencilToolRectWidth;
            $(this).attr('title', VARIABLES.pencilToolRectWidth);
          });
          increaseIcon.appendTo(anchorIncrease);
          anchorIncrease.appendTo(increase);
          var decrease = $('<div></div>').attr('id', options.decreaseDotSize.id).addClass('menu-item');
          var decreaseIcon = $('<i></i>').addClass(options.decreaseDotSize.icon);
          var anchorDecrease = $('<a></a>').css('font-size', '20px').on('click', function(){
            VARIABLES.pencilToolRectWidth = VARIABLES.pencilToolRectWidth-2===0? 2:VARIABLES.pencilToolRectWidth-2;
            VARIABLES.pencilToolRectHeight = VARIABLES.pencilToolRectWidth;
            $(this).attr('title', VARIABLES.pencilToolRectWidth);
          });
          decreaseIcon.appendTo(anchorDecrease);
          anchorDecrease.appendTo(decrease);
          increase.appendTo(div);
          decrease.appendTo(div);
          div.appendTo($(options.containerSelectionCriterion));
        },

        deactivatePencilContextMenu = function(options){
          $('#'+options.id).remove();
        },

        getPencilContextMenu = function(){
          return {
            tool: this,
            id: 'PencilContextMenu',
            increaseDotSize : {
              id: 'increaseDotSize',
              icon: 'glyphicon glyphicon-circle-arrow-up',
              containerId: 'PencilContextMenu'
            },
            decreaseDotSize : {
              id: 'decreaseDotSize',
              icon: 'glyphicon glyphicon-circle-arrow-down',
              containerId: 'PencilContextMenu'
            },
            containerSelectionCriterion: '.contextual-tool-bar'
          };
        },

        registerPencilToolEvents = function(){
          $('#PencilTool').funcToggle('click',
            function(){
              activateTool({tool: this}, startPencilTool);
              activatePencilContextMenu(getPencilContextMenu());
              activeTool = $(this);
            },
            function(){
              activeTool = null;
              deactivateTool({tool: this}, stopPencilTool);
              deactivatePencilContextMenu(getPencilContextMenu());
            }
          );
        },

        registerColorEvents = function(){
          $('.color')
            .on('click', function(){
              selectedPrimaryColor = context.fillStyle = generateHexColorStringFromThisElementsId($(this));
            })
            .on('contextmenu', function(){
              selectedAlternativeColor = generateHexColorStringFromThisElementsId($(this));
            });
        },

        registerAllColorsPickerEvents = function(options){
          $('#'+options.containerId + ' #'+options.toolId).on('input', function(){
            selectedPrimaryColor = context.fillStyle = $(this).val();
          });
        },

        registerSaveImageEvents = function(options){
          $('#'+options.toolId).on('click', function(){
            window.open($('#'+CONSTANTS.canvasId)[0].toDataURL("image/png"), "_blank");
          });
        },
        registerResetCanvasEvents = function(options){
          $('#'+options.toolId).on('click', function(){
            var canvas = $('#'+CONSTANTS.canvasId)[0];
            var canvasHeight = canvas.height;
            var canvasWidth = canvas.width;
            var context = canvas.getContext('2d');
            context.save();
            context.transform(1, 0, 0, 1, 0, 0);
            context.fillStyle = resetCanvasColor;

            context.fillRect(0,0, canvasWidth, canvasHeight);
            context.restore();
          });
        },

        registerSquareToolEvents = function(options){
          $('#'+options.toolId).funcToggle('click',
            function(){
              activateTool({tool: this}, startSquareTool);
              activeTool = $(this);
            },
            function(){
              activeTool = null;
              deactivateTool({tool: this}, stopSquareTool);
            }
          );
        },

        registerEvents = function (){
          registerColorEvents();
          registerPencilToolEvents();
          registerDiscToolEvents();
          registerFreeStyleSpeedDotsToolEvents();
          registerAllColorsPickerEvents({toolId: 'allColorsPicker', containerId:'HTML5ColorPicker'});
          registerSaveImageEvents({toolId: 'save-as-image', containerId: 'SaveImageButton'});
          registerResetCanvasEvents({toolId: 'reset-canvas', containerId: 'ResetCanvas'});
          registerSquareToolEvents({toolId: 'SquareTool', containerId: 'jspaint-tools'});
        },

        mustAssignDimensionsToCanvasContainer = function(){
          $('#jspaint-paint-area').css({
            width: sizeX, height: sizeY
          });
        },

        initializeToolsInfo = function(){
          $('.'+CONSTANTS.maintoolsClass).attr('title', 'Click to activate;\nRight-click to deactivate;');
        },

        initializeTopTakerWidget = function(){
          $('.top-taker').TopTaker({'theme': 'dark'});
        },

        init = function (){
          mustAssignDimensionsToCanvasContainer();
          context = initializeCanvas();
          initializeToolsInfo();
          initializeTopTakerWidget();
          generateBasicColorPalette();
          registerEvents();
          $('#PencilTool').trigger('click');
        },
        tests = function(){
          if(window.location.href.startsWith("file://")){
            mocha.setup('bdd');
            mocha.reporter('html');
            var assert = chai.assert;

            var runEventTest = function(options){
              describe("Events are installed properly for "+options.name, function(){
                var tool = $(options.selectionCriterion);
                var events = $._data(tool[0], "events");
                it("There is exactly one event.", function(){
                  assert(1, events.length);
                });
                it("There is exactly one click event.", function(){
                  assert(events.click !== "undefined");
                });
              });
            },
            checkingForInstalledEvents = function(){
              runEventTest({name: "PencilTool", selectionCriterion: '#PencilTool'});
              runEventTest({name: "SpeedDot", selectionCriterion: '#FreeStyleSpeedDotsTool'});
              runEventTest({name: "SquareTool", selectionCriterion: '#SquareTool'});
              runEventTest({name: "SquareTool", selectionCriterion: '#SquareTool'});
              runEventTest({name: "Reset Canvas", selectionCriterion: '#reset-canvas'});
              runEventTest({name: "Save Image", selectionCriterion: '#save-as-image'});
              runEventTest({name: "Color Picker", selectionCriterion: '#allColorsPicker'});
              runEventTest({name: "DiscTool", selectionCriterion: '#DiscTool'});
              runEventTest({name: "Basic colors", selectionCriterion: '.color'});
            };
            describe('Testing.', function(){
              checkingForInstalledEvents();
            });
          }
          if (navigator.userAgent.indexOf('PhantomJS') < 0) {
            mocha.run();
          }
        },
        mustRunInSequence = function(){
          init();
          tests();
        };
        mustRunInSequence();
  });
})(jQuery);
