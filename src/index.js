(function ($) {
    $(() => {
        const DimensionOptionsButtons = $(".dimension-options button");
        const OrientationOptionsButtons = $(".orientation-options button");
        const dimensionEvents = function dimensionEvents() {
            DimensionOptionsButtons.on("click", function onClick() {
                DimensionOptionsButtons.removeClass("btn-success");
                $(this).addClass("btn-success");
            });
        };
        const orientationEvents = function orientationEvents() {
            OrientationOptionsButtons.on("click", function onClick() {
                OrientationOptionsButtons.removeClass("btn-success");
                $(this).addClass("btn-success");
            });
        };
        const setupEvents = function setupEvents() {
            dimensionEvents();
            orientationEvents();
        };
        const getWidth = function getWidth(dimensions) {
            return dimensions.localeCompare("Max") === 0 ? document.documentElement.clientWidth * 0.75 : dimensions.split("x")[0];
        };
        const getHeight = function getHeight(dimensions) {
            return dimensions.localeCompare("Max") === 0 ? document.documentElement.clientHeight - 4 : dimensions.split("x")[1];
        };
        const getQueryValue = function getQueryValue(orientation, width, height) {
            return orientation.localeCompare("landscape") === 0 ? `${width}x${height}` : `${height}x${width}`;
        };
        const conditionalURI = function conditionalURI(originalUri, queryPrefix, queryValue) {
            localStorage.setItem("dimensionsWxH", queryValue);
            return originalUri + queryPrefix + queryValue;
        };
        const newUri = function newUri(receiver) {
            const originalUri = receiver.attr("href");
            const queryPrefix = "?dimension=";
            const SelectedDimensionsButton = $(".dimension-options button.btn-success");
            const SelectedOrientationsButton = $(".orientation-options button.btn-success");
            const dimensions = SelectedDimensionsButton.attr("id");
            const width = getWidth(dimensions);
            const height = getHeight(dimensions);
            const orientation = SelectedOrientationsButton.attr("id");
            const queryValue = getQueryValue(orientation, width, height);

            return conditionalURI(originalUri, queryPrefix, queryValue);
        };
        const goToPaint = function goToPaint(uri) {
            window.location = uri;
        };
        const deferAction = function deferAction(e) {
            e.preventDefault();
        };
        const setup = function setup() {
            setupEvents();
            $("#jspaint-action").on("click", function onClick(e) {
                deferAction(e);
                goToPaint(newUri($(this)));
            });
        };
        const initOrientationAndDimension = function initOrientationAndDimension() {
            const defaultOrientationButton = $("#landscape");
            const defaultDimensionButton = $("#Max");

            defaultDimensionButton.trigger("click");
            defaultOrientationButton.trigger("click");
        };
        const init = function init() {
            initOrientationAndDimension();
        };
        const mustRunInSequence = function mustRunInSequence() {
            setup();
            init();
        };

        mustRunInSequence();
    });
}(jQuery));
