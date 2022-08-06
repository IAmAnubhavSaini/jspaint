(function ($) {
    "use strict";

    $(function () {
        var DimensionOptionsButtons = $('.dimension-options button'),
            OrientationOptionsButtons = $('.orientation-options button'), LocalStorageAvailable = function () {
                return localStorage !== undefined && localStorage !== null;
            },

            dimensionEvents = function () {
                DimensionOptionsButtons
                    .on('click', function () {
                        DimensionOptionsButtons.removeClass('btn-success');
                        $(this).addClass('btn-success');
                    });
            },

            orientationEvents = function () {
                OrientationOptionsButtons
                    .on('click', function () {
                        OrientationOptionsButtons.removeClass('btn-success');
                        $(this).addClass('btn-success');
                    });
            },

            setupEvents = function () {
                dimensionEvents();
                orientationEvents();
            },

            getWidth = function (dimensions) {
                return dimensions.localeCompare('Max') === 0 ? document.documentElement.clientWidth - 21 : dimensions.split('x')[0];
            },

            getHeight = function (dimensions) {
                return dimensions.localeCompare('Max') === 0 ? document.documentElement.clientHeight : dimensions.split('x')[1];
            },

            getQueryValue = function (orientation, width, height) {
                return orientation.localeCompare('landscape') === 0 ? width + 'x' + height : height + 'x' + width;
            },

            conditionalURI = function (originalUri, queryPrfix, queryValue) {
                var uri = '';
                if (LocalStorageAvailable) {
                    localStorage.setItem('dimensionsWxH', queryValue);
                    uri = originalUri;
                } else {
                    uri = originalUri + queryPrfix + queryValue;
                }
                return uri;
            },

            newUri = function (receiver) {
                var originalUri = receiver.attr('href'), queryPrfix = '?dimension=',
                    SelectedDimensionsButton = $('.dimension-options button.btn-success'),
                    SelectedOrientationsButton = $('.orientation-options button.btn-success'),
                    dimensions = SelectedDimensionsButton.attr('id'), width = getWidth(dimensions),
                    height = getHeight(dimensions), orientation = SelectedOrientationsButton.attr('id'),
                    queryValue = getQueryValue(orientation, width, height),
                    uri = conditionalURI(originalUri, queryPrfix, queryValue);

                return uri;
            },

            goToPaint = function (uri) {
                window.location = uri;
            },

            deferAction = function (e) {
                e.preventDefault();
            },

            setup = function () {
                setupEvents();
                $('#jspaint-action')
                    .on('click', function (e) {
                        deferAction(e);
                        goToPaint(newUri($(this)));
                    });
            },

            initTopTakerWidget = function () {
                $('.top-taker').TopTaker({
                    'theme': 'dark'
                });
            },

            initOrientationAndDimension = function () {
                var defaultOrientationButton = $('#landscape'), defaultDimensionButton = $('#600x400');

                defaultDimensionButton.trigger('click');
                defaultOrientationButton.trigger('click');
            },

            init = function () {
                initOrientationAndDimension();
                initTopTakerWidget();
            },

            mustRunInSequence = function () {
                setup();
                init();
            };

        mustRunInSequence();
    });
})(jQuery);
