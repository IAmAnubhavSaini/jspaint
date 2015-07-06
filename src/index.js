(function ($) {
    "use strict";

    $(function () {
        var
        dimensionEvents = function () {
            $('.dimension-options button')
            .on('click', function () {
                $('.dimension-options button').removeClass('btn-success');
                $(this).addClass('btn-success');
            });
        },

        orientationEvents = function () {
            $('.orientation-options button')
                .on('click', function () {
                    $('.orientation-options button').removeClass('btn-success');
                    $(this).addClass('btn-success');
                });
        },

        setupEvents = function () {
            dimensionEvents();
            orientationEvents();
        },

        getWidth = function (selected) {
            return selected.localeCompare('Max') === 0 ?
                    document.documentElement.clientWidth - 21 :
                    $('.dimension-options button.btn-success').attr('id').split('x')[0];
        },

        getHeight = function (selected) {
            return selected.localeCompare('Max') === 0 ?
                    document.documentElement.clientHeight :
                    $('.dimension-options button.btn-success').attr('id').split('x')[1];
        },

        getQueryValue = function (orientation, width, height) {
            return orientation.localeCompare('landscape') === 0 ?
                    width + 'x' + height :
                    height + 'x' + width;
        },

        newUri = function (receiver) {
            var
            originalUri = receiver.attr('href'),
            queryPrfix = '?dimension=',
            selected = $('.dimension-options button.btn-success').attr('id'),
            width = getWidth(selected),
            height = getHeight(selected),
            orientation = $('.orientation-options button.btn-success').attr('id'),
            queryValue = getQueryValue(orientation, width, height);

            return originalUri + queryPrfix + queryValue;
        },

        takeMeToPaint = function (uri) {
            window.location = uri;
        },

        deferLinkAction = function (e) {
            e.preventDefault();
        },

        setup = function () {
            setupEvents();
            $('#jspaint-action')
                .on('click', function (e) {
                    deferLinkAction(e);
                    takeMeToPaint(newUri($(this)));
                });
        },

        init = function () {
            $('#600x400, #landscape').trigger('click');
            $('.top-taker').TopTaker({ 'theme': 'dark' });
        },

        mustRunInSequence = function () {
            setup();
            init();
        };
        mustRunInSequence();
    });
})(jQuery);
