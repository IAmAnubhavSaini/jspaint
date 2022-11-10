(function ($) {
    "use strict";

    $(function () {
        const DimensionOptionsButtons = $('.dimension-options button');
        const OrientationOptionsButtons = $('.orientation-options button');
        const dimensionEvents = function () {
            DimensionOptionsButtons
                .on('click', function () {
                    DimensionOptionsButtons.removeClass('btn-success');
                    $(this).addClass('btn-success');
                });
        };
        const orientationEvents = function () {
            OrientationOptionsButtons
                .on('click', function () {
                    OrientationOptionsButtons.removeClass('btn-success');
                    $(this).addClass('btn-success');
                });
        };
        const setupEvents = function () {
            dimensionEvents();
            orientationEvents();
        };
        const getWidth = function (dimensions) {
            return dimensions.localeCompare('Max') === 0 ? document.documentElement.clientWidth * 0.8 : dimensions.split('x')[0];
        };
        const getHeight = function (dimensions) {
            return dimensions.localeCompare('Max') === 0 ? document.documentElement.clientHeight - 4 : dimensions.split('x')[1];
        };
        const getQueryValue = function (orientation, width, height) {
            return orientation.localeCompare('landscape') === 0 ? width + 'x' + height : height + 'x' + width;
        };
        const conditionalURI = function (originalUri, queryPrefix, queryValue) {
            localStorage.setItem('dimensionsWxH', queryValue);
            return originalUri + queryPrefix + queryValue;
        };
        const newUri = function (receiver) {
            const originalUri = receiver.attr('href');
            const queryPrefix = '?dimension=';
            const SelectedDimensionsButton = $('.dimension-options button.btn-success');
            const SelectedOrientationsButton = $('.orientation-options button.btn-success');
            const dimensions = SelectedDimensionsButton.attr('id');
            const width = getWidth(dimensions);
            const height = getHeight(dimensions);
            const orientation = SelectedOrientationsButton.attr('id');
            const queryValue = getQueryValue(orientation, width, height);

            return conditionalURI(originalUri, queryPrefix, queryValue);
        };
        const goToPaint = function (uri) {
            window.location = uri;
        };
        const deferAction = function (e) {
            e.preventDefault();
        };
        const setup = function () {
            setupEvents();
            $('#jspaint-action')
                .on('click', function (e) {
                    deferAction(e);
                    goToPaint(newUri($(this)));
                });
        };
        const initOrientationAndDimension = function () {
            const defaultOrientationButton = $('#landscape');
            const defaultDimensionButton = $('#Max');

            defaultDimensionButton.trigger('click');
            defaultOrientationButton.trigger('click');
        };
        const init = function () {
            initOrientationAndDimension();
        };
        const mustRunInSequence = function () {
            setup();
            init();
        };

        mustRunInSequence();
    });
})(jQuery);
