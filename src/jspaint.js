(function ($) {
    $(function () {
        const saveCanvasState = window.JSPAINT.saveCanvasState;
        var initializeCanvas = function (options) {
                var canvas = $("<canvas/>", {
                    id: options.canvasId,
                })
                    .prop({
                        width: options.width,
                        height: options.height,
                    })
                    .appendTo("#" + options.canvasContainerId);

                return canvas[0];
            },
            initializeContext = function (options) {
                var sizeX = options.sizeX || 600,
                    sizeY = options.sizeY || 400,
                    width = sizeX - 2,
                    height = sizeY - 2,
                    canvas = null;

                options.width = width;
                options.height = height;
                canvas = initializeCanvas(options);
                return canvas.getContext("2d");
            },
            generateHexColorStringFromThisElementsId = function (element) {
                return "#" + element.attr("id").split("#")[1];
            },
            registerColorEvents = function () {
                function updatePrimaryColor(selectedPrimaryColor) {
                    $("label#primary-color-name").html(selectedPrimaryColor);
                }

                function updataAlternativeColorLabel(selectedAlternativeColor) {
                    $("label#alternative-color-name").html(
                        window.JSPAINT.selectedAlternativeColor,
                    );
                }

                $(".color")
                    .attr(
                        "title",
                        "Left click for primary color, Right click for alternative color.",
                    )
                    .attr("data-toggle", "tooltip")
                    .attr("data-placement", "bottom")
                    .on("click", function () {
                        window.JSPAINT.selectedPrimaryColor =
                            context.fillStyle =
                                generateHexColorStringFromThisElementsId(
                                    $(this),
                                );
                        $("#SelectedPrimaryColor").css(
                            "background-color",
                            window.JSPAINT.selectedPrimaryColor,
                        );
                        updatePrimaryColor(window.JSPAINT.selectedPrimaryColor);
                    })
                    .on("contextmenu", function (e) {
                        e.preventDefault();
                        window.JSPAINT.selectedAlternativeColor =
                            generateHexColorStringFromThisElementsId($(this));
                        $("#SelectedAlternativeColor").css(
                            "background-color",
                            window.JSPAINT.selectedAlternativeColor,
                        );
                        updataAlternativeColorLabel(
                            window.JSPAINT.selectedAlternativeColor,
                        );
                    });
                updatePrimaryColor(window.JSPAINT.selectedPrimaryColor);
                updataAlternativeColorLabel(
                    window.JSPAINT.selectedAlternativeColor,
                );
            },
            registerAllColorsPickerEvents = function (options) {
                $("#" + options.toolId).on("input", function () {
                    window.JSPAINT.selectedPrimaryColor = context.fillStyle =
                        $(this).val();
                });
            },
            registerSaveImageEvents = function (options) {
                $("#" + options.toolId).on("click", function () {
                    const canvasElement = $("#" + CONSTANTS.canvasId)[0];
                    const base64ImageUrl = canvasElement.toDataURL();
                    const newWindow = window.open("_blank");
                    newWindow.document.write(
                        "Right click and open in a new tab.<br/><iframe src='" +
                            base64ImageUrl +
                            "' style='border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;' allowfullscreen></iframe>",
                    );
                });
            },
            registerResetCanvasEvents = function (options) {
                $("#" + options.toolId).on("click", function () {
                    var canvasId =
                            "#" + (options.canvasId || CONSTANTS.canvasId),
                        canvas = $(canvasId)[0],
                        canvasHeight = canvas.height,
                        canvasWidth = canvas.width,
                        context = canvas.getContext("2d");

                    context.clearRect(0, 0, canvasWidth, canvasHeight);
                    CanvasState = [];
                });
            },
            registerUndoEvents = function (options) {
                $(options.toolSelection).on("click", function () {
                    var state = CanvasState.pop();
                    if (state !== undefined) {
                        context.putImageData(state, 0, 0);
                    }
                });
                $(options.canvasId).on("mousedown", function () {
                    saveCanvasState({
                        startX: 0,
                        startY: 0,
                        width: $(this).width(),
                        height: $(this).height(),
                    });
                });
            },
            registerEvents = function () {
                registerColorEvents();
                registerAllColorsPickerEvents({
                    toolId: "allColorsPicker",
                    containerId: "HTML5ColorPicker",
                });
                registerSaveImageEvents({
                    toolId: "save-as-image",
                    containerId: "SaveImageButton",
                });
                registerResetCanvasEvents({
                    toolId: "reset-canvas",
                    containerId: "ResetCanvas",
                });
                registerUndoEvents({
                    toolSelection: "#undo-button",
                    canvasId: "#" + CONSTANTS.canvasId,
                });
            },
            mustAssignDimensionsToCanvasContainer = function () {
                if (sizeX > 2500) {
                    sizeX = 2500;
                } else if (sizeX < 320) {
                    sizeX = 320;
                }
                if (sizeY > 2500) {
                    sizeY = 2500;
                } else if (sizeY < 320) {
                    sizeY = 320;
                }
                $("#jspaint-paint-area").css({
                    width: sizeX,
                    height: sizeY,
                });
            },
            init = function () {
                mustAssignDimensionsToCanvasContainer();
                context = initializeContext({
                    sizeX: sizeX,
                    sizeY: sizeY,
                    canvasId: CONSTANTS.canvasId,
                    canvasContainerId: CONSTANTS.canvasContainerId,
                });
                window.JSPAINT.Color.generateBasicColorPalette({
                    appendHere: ".BasicColorPalette",
                    basicColors: CONSTANTS.basicColors,
                });
                registerEvents();
                $("#PencilTool").trigger("click");
                $('[data-toggle="tooltip"]').tooltip();
                $("#SelectedPrimaryColor").css(
                    "background-color",
                    window.JSPAINT.selectedPrimaryColor,
                );
                $("#SelectedAlternativeColor").css(
                    "background-color",
                    window.JSPAINT.selectedAlternativeColor,
                );
            };
        init();
    });
})(jQuery);
