(function($, undefined) { //top taker
    "use strict";
    $.widget("anubhav.TopTaker", {
        options: {
            theme: "",
            text: "TOP",
            hiddenClass: "hide-top-taker",
            positionClass: "fixpos",
            cursorClass: "pointer",
            scrollPositionY: "100",
            imageElement: "<i class='icon'></i>",
            iconClass: "icon-arrow-up"
        },
        _create: function() {
            var self = this,
                container = self.element,
                options = self.options,
                theme = options.theme !== '' ? 'top-taker-' + options.theme : '',
                imageElement = $(options.imageElement).addClass(options.iconClass).css('margin', '0 2px 0 0'),
                hiddenClass = options.hiddenClass,
                scrollPositionY = options.scrollPositionY,
                theTopTaker = $('<div class="top-taker"></div>')
                .addClass(theme)
                .addClass(hiddenClass)
                .addClass(options.positionClass)
                .addClass(options.cursorClass)
                .append(imageElement)
                .append(options.text)
                .bind('click', function() {
                    window.scrollTo(0, 0);
                });

            $(window).bind('scroll', function() {
                if (window.scrollY > scrollPositionY) {
                    $(theTopTaker).removeClass(hiddenClass);
                }
                if (window.scrollY < scrollPositionY) {
                    $(theTopTaker).addClass(hiddenClass);
                }
            });

            $(container).append(theTopTaker);
        },
        destroy: function() {
            $(theTopTaker).unbind('click');
            $(window).unbind('scroll');
            $(container).html('');
        }
    });
})(jQuery);
