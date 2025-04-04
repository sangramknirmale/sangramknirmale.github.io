"use strict";

jQuery(document).ready(function($) {
    $('.accordion-title').click(function() {
        if ($(this).attr('aria-expanded') === 'false') {
            $(this).attr('aria-expanded', 'true');
            $(this).parent().addClass('open').next('.accordion-content').slideDown();
        } else {
            $(this).attr('aria-expanded', 'false');
            $(this).parent().removeClass('open').next('.accordion-content').slideUp();
        }
    });
});
"use strict";

jQuery(document).ready(function($) {
    // Keep dropdown menu open when clicking inside of it.
    $('.dropdown-menu').on('click', function(e) {
        e.stopPropagation();
    });
});
"use strict";

jQuery(document).ready(function($) {
    $(".carousel").on('slide.bs.carousel', function(evt) {
        $('.post-header__image-details-lg-wrapper .post-header__image-details').hide();
        var currentSlide = $(evt.relatedTarget).index();
        $('.post-header__image-details-lg-wrapper .post-header__image-details:nth-child(' + (currentSlide + 1) + ')').fadeIn();
    });
});
"use strict";

jQuery(document).ready(function($) {
    if ($('#tribe-community-events').length) {
        $("<div class='events-community-post-image-link events-community-post-content'><label class=''>Images: </label><div class='venue-note' style=''>Submit your event images and digital signage <a href='https://airtable.com/appea31gM3amuMVXo/shrmgxYfS5qePK0la' target='_blank'>here</a>.</div></div>").insertAfter(".events-community-post-content");
    }
});
"use strict";

jQuery(document).ready(function($) {
    $.ajax({
        type: "post",
        data: {
            action: 'get_featured_faculty'
        },
        dataType: 'json',
        url: '/wp-admin/admin-ajax.php',
        success: function success(data) {
            $('.home-faculty-spotlight-region__name').html(data.name);
            $('.home-faculty-spotlight-region__description').html(data.description);
            $('.home-faculty-spotlight-region__research-area').html(data.research_areas);
            $('.home-faculty-spotlight-region__image').html(data.image);
            $('.home-faculty-spotlight-region').removeClass('d-none');

            if ($('#home__faculty-spotlight-rotate').length) {
                var rotate = new Waypoint({
                    element: document.getElementById('home__faculty-spotlight-rotate'),
                    handler: function handler(direction) {
                        $('.home-faculty-spotlight-region__image').addClass('rotate');
                    },
                    offset: '50%'
                });
            }
        },
        error: function error(_error, data) {
            console.log(_error);
        }
    });
});
"use strict";

jQuery(document).ready(function($) {
    // Remove filter when pill is clicked.
    $('.exposed-filter-pill').on('click', function(e) {
        e.preventDefault();
        $('input[value="' + $(this).attr('data-filter') + '"]').click();
        $(this).parents('.query-wrangler').find('button.submit-search').click();
    }); // Clear filter form.

    $('button.clear-search').click(function(e) {
        e.preventDefault();
        window.location = window.location.href.split("?")[0];
    }); // Directory name sort.

    $('a.qw-name-sort').click(function(e) {
        e.preventDefault();
        $('select[name=exposed_opus_directory_sort]').val($(this).attr('data-qw-sort')).change();
        $(this).parents('.query').find('button.submit-search').click();
    }); // Directory order form imput and label.

    $('.query-checkbox').each(function() {
        var checkbox = $(this).children();
        var newID = checkbox.attr('value');
        $(this).children().attr('id', 'checkbox_' + newID);
        $(this).attr('for', 'checkbox_' + newID);
        checkbox.parent().before(checkbox);
    }); // Mobile filters

    $('#mobile-filter-toggle').click(function(e) {
        $('.query-wrangler__form').addClass('show');
        $(this).addClass('d-none');
    });
});
"use strict";

jQuery(document).ready(function($) {
    $('a.footnote-link.footnote-back-link').prepend('<span class="sr-only">Return to text </span>');
});
"use strict";

jQuery(document).ready(function($) {
    $('button.frm_button_submit.frm_final_submit').wrapInner('<span></span>');
    $('.frm_checkbox label').each(function() {
        var checkbox = $(this).children();
        checkbox.parent().before(checkbox);
    });
    $('.frm_radio label').each(function() {
        var radio = $(this).children();
        radio.parent().before(radio);
    });
    $('.frm_forms select').wrap("<div class='select-wrapper'></div>");
    $('.frm_forms textarea').wrap("<div class='input-wrapper'></div>");
    $('.frm_forms input[type="text"]').wrap("<div class='input-wrapper'></div>");
    $('.frm_forms input[type="password"]').wrap("<div class='input-wrapper'></div>");
    $('.frm_forms input[type="number"]').wrap("<div class='input-wrapper'></div>");
    $('.frm_forms input[type="url"]').wrap("<div class='input-wrapper'></div>");
    $('.frm_forms input[type="tel"]').wrap("<div class='input-wrapper'></div>");
    $('.frm_forms input[type="search"]').wrap("<div class='input-wrapper'></div>");
    $('.frm_forms input[type="email"]').wrap("<div class='input-wrapper'></div>");
});
"use strict";

jQuery(document).ready(function($) {
    $('.home-hero-region__image').addClass('scroll-bg');

    if ($('#home__our-programs-rotate').length) {
        var rotate = new Waypoint({
            element: document.getElementById('home__our-programs-rotate'),
            handler: function handler(direction) {
                $('.home-our-programs-region__image').addClass('rotate');
            },
            offset: '50%'
        });
    }

    if ($('#home-diversity-region').length) {
        var rotate = new Waypoint({
            element: document.getElementById('home-diversity-region'),
            handler: function handler(direction) {
                $('.home-diversity-region').addClass('rotate');
            },
            offset: '50%'
        });
    }

    var airstream = document.getElementById('home-hero-region__air-stream');

    if ($('#home-hero-region__air-stream').length > 0) {
        var animationMenu = bodymovin.loadAnimation({
            container: document.getElementById('home-hero-region__air-stream'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: "/wp-content/themes/aero-astro/assets/js/icons-json/airstream.json"
        });
    }
});
"use strict";

jQuery(document).ready(function($) {
    var icons = [684, 683, 686, 685, 2344, 2345, 2472];

    for (var i = 0; i < icons.length; i++) {
        var icon = document.getElementById('research-area-icon--' + icons[i]);

        if ($('#research-area-icon--' + icons[i]).length > 0) {
            var directionMenu;

            (function() {
                var animationMenu = bodymovin.loadAnimation({
                    container: icon,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: "/wp-content/themes/aero-astro/assets/js/icons-json/AA-icons_" + icons[i] + ".json"
                });
                directionMenu = 1;
                icon.addEventListener('mouseenter', function(e) {
                    animationMenu.setDirection(directionMenu);
                    animationMenu.play();
                });
                icon.addEventListener('mouseleave', function(e) {
                    animationMenu.setDirection(-directionMenu);
                    animationMenu.play();
                });
            })();
        }
    }
});
"use strict";

jQuery(document).ready(function($) {
    if ($('#lab-home__our-people-rotate').length) {
        var rotate = new Waypoint({
            element: document.getElementById('lab-home__our-people-rotate'),
            handler: function handler(direction) {
                $('.lab-home__our-people-image').addClass('rotate');
            },
            offset: '50%'
        });
    }

    if ($('#lab-home__what-we-work-on-rotate').length) {
        var rotate = new Waypoint({
            element: document.getElementById('lab-home__what-we-work-on-rotate'),
            handler: function handler(direction) {
                $('.lab-home__what-we-work-on-image').addClass('rotate');
            },
            offset: '50%'
        });
    }
});
"use strict";

jQuery(document).ready(function($) {
    var lastScrollTop = 0;
    $(window).scroll(function(event) {
        var st = $(this).scrollTop();

        if (st > lastScrollTop && $(document).scrollTop() > 60) {
            $('#sticky-main-nav').addClass('fixed-top');
        } else {
            $('#sticky-main-nav').removeClass('fixed-top');
        }

        lastScrollTop = st;
    }); // Close nav when esc key is pressed

    $('#main-nav').on('keyup', function(e) {
        if (e.keyCode === 27) {
            $('li.has-submenu').children('button').attr('aria-expanded', 'false').removeClass('open');
        }
    }); // Open nav on toggle button click

    $('#main-nav li.has-submenu button').click(function() {
        if ($(this).parent().hasClass('open')) {
            $(this).attr('aria-expanded', 'false').parent().removeClass('open');
        } else {
            $(this).attr('aria-expanded', 'true').parent().addClass('open');
        }
    }); // Close nav on hover

    $('#main-nav li.has-submenu').on('mouseleave', function() {
        $(this).removeClass('open').children('button').attr('aria-expanded', 'false');
    }); // Open nav on hover

    $('#main-nav li.has-submenu').on('mouseenter', function() {
        $(this).addClass('open').children('button').attr('aria-expanded', 'true');
    }); // Close nav after last focusable item (<a> or <button>) has been tabbed past

    $('#main-nav').on('keydown', 'li:not(.level-1) > a, li:not(.level-1) > button', function(e) {
        if (e.keyCode === 9) {
            // If tabbing
            if (e.shiftKey === true) {
                // If shift key is down stop
                return true;
            } // Detect last relevant element that's visible


            var lastEl = $(this).parents('.has-submenu.level-1').find('a:visible, button:visible').last(); // console.log('This', $(this)[ 0 ]);
            // console.log('Last', lastEl[ 0 ]);

            if ($(this)[0] === lastEl[0]) {
                // Close entire dropdpwn if last element
                $(this).parents('.has-submenu.open').removeClass('open');
                $(this).parents('.has-submenu.level-1').find('button').attr('aria-expanded', 'false');
            } else if ($(this).parent().hasClass('level-3') && $(this).parent().is(':last-child')) {
                // Close only parent dropdown if not last element, only relevant with side flyout
                $(this).parents('.has-submenu.level-2').removeClass('open').children('button').attr('aria-expanded', 'false');
            }
        }
    }); // Close nav after 1st level toggle button has been reversed tabbed away from

    jQuery('#main-nav .has-submenu.level-1 > button').on('keydown', function(e) {
        if (e.keyCode === 9) {
            // If tabbing
            if (!e.shiftKey === true) {
                // If shift key is not down stop
                return true;
            }

            $(this).parent('.has-submenu.level-1').removeClass('open').find('.open').removeClass('open');
            $(this).parent('.has-submenu.level-1').find('button').attr('aria-expanded', 'false');
        }
    });
});
"use strict";

jQuery(document).ready(function($) {
    $('.mobile-menu-wrapper a.caret').click(function(e) {
        e.preventDefault();

        if ($(this).attr('aria-expanded') == 'false') {
            $(this).attr('aria-expanded', 'true').next().show();
        } else {
            $(this).attr('aria-expanded', 'false').next().hide();
        }
    });
    $('#navbar-toggler').click(function(e) {
        if ($(this).attr('aria-expanded') == 'true') {
            $('#mobile-navigation').removeClass('show');
            $(this).attr('aria-expanded', false).addClass('collapsed');
            $('html').removeClass('noscroll');
            $('body').removeClass('noscroll');
        } else {
            $('#mobile-navigation').addClass('show');
            $(this).attr('aria-expanded', true).removeClass('collapsed');
            $('html').addClass('noscroll');
            $('body').addClass('noscroll');
        }
    });
    $('.header__wrapper').on('keyup', function(e) {
        if (e.keyCode === 27 && $('#navbar-toggler').attr('aria-expanded') == 'true') {
            $('#mobile-navigation').removeClass('show');
            $('#navbar-toggler').attr('aria-expanded', false).addClass('collapsed');
            $('html').removeClass('noscroll');
            $('body').removeClass('noscroll');
        }
    }); // Close nav after last focusable item (<a> or <button>) has been tabbed past

    $('.mobile-menu-wrapper').on('keydown', 'a.mit-logo', function(e) {
        if (e.keyCode === 9) {
            // If tabbing
            if (e.shiftKey === true) {
                // If shift key is down stop
                return true;
            } else {
                $('#mobile-navigation').removeClass('show');
                $('#navbar-toggler').attr('aria-expanded', false).addClass('collapsed');
                $('html').removeClass('noscroll');
                $('body').removeClass('noscroll');
            }
        }
    });
});
"use strict";

jQuery(document).ready(function($) {
    $('a.next.page-numbers').wrapInner('<span></span>');
    $('a.prev.page-numbers').wrapInner('<span></span>');
});
"use strict";

jQuery(document).ready(function($) {
    $('blockquote.wp-block-quote').each(function() {
        $(this).children().wrapAll('<div class="container"><div class="row"><div class="col-12 col-lg-6 offset-lg-1"></div></div></div>');
    });
    $('.wp-block-opus-core-block-rewrite-opq').each(function() {
        $(this).children().wrapAll('<div class="blockquote-wrapper"><div class="blockquote-wrapper-inner"></div></div>');
    });
});
"use strict";

jQuery(document).ready(function($) {
    $.ajax({
        type: "post",
        data: {
            action: 'get_ra_featured_faculty'
        },
        dataType: 'json',
        url: '/wp-admin/admin-ajax.php',
        success: function success(data) {
            console.log(data);
            $('.research-area__faculty-spotlight__name').html(data.name);
            $('.research-area__faculty-spotlight__titles').html(data.titles);
            $('.research-area__faculty-spotlight__description').html(data.description);
            $('.research-area__faculty-spotlight__research-area').html(data.research_areas);
            $('.research-area__faculty-spotlight__image').html(data.image);
            $('.research-area__faculty-spotlight').removeClass('d-none');
            $('.research-area__related-faculty').removeClass('d-none');

            if ($('#rotate').length) {
                var rotate = new Waypoint({
                    element: document.getElementById('rotate'),
                    handler: function handler(direction) {
                        $('.research-area__faculty-spotlight__image').addClass('rotate');
                    },
                    offset: '50%'
                });
            }
        },
        error: function error(_error, data) {
            console.log(_error);
        }
    });
});
"use strict";

jQuery(document).ready(function($) {
    var colors = ['blue', 'navy', 'yellow', 'orange'];

    if ($('.bg-color-first.bg-color-random').length) {
        if ($('.bg-color-second.bg-color-random').length) {
            var first_random_color_index = Math.floor(Math.random() * colors.length);
            $('.bg-color-first.bg-color-random').addClass('bg-color-' + colors[first_random_color_index]);
            var second_color_options = [];

            for (var i = colors.length - 1; i >= 0; i--) {
                if (i != first_random_color_index) {
                    second_color_options.push(colors[i]);
                }
            }

            var second_random_color_index = Math.floor(Math.random() * second_color_options.length);
            $('.bg-color-second.bg-color-random').addClass('bg-color-' + second_color_options[second_random_color_index]);
        } else {
            var second_color_class = $('.bg-color-second').attr('class');
            var first_color_options = [];

            if (second_color_class.includes("blue")) {
                first_color_options = ['yellow', 'orange', 'navy'];
            } else if (second_color_class.includes("yellow")) {
                first_color_options = ['blue', 'orange', 'navy'];
            } else if (second_color_class.includes("orange")) {
                first_color_options = ['blue', 'yellow', 'navy'];
            } else if (second_color_class.includes("navy")) {
                first_color_options = ['blue', 'yellow', 'orange'];
            }

            var first_random_color_index = Math.floor(Math.random() * first_color_options.length);
            $('.bg-color-first.bg-color-random').addClass('bg-color-' + first_color_options[first_random_color_index]);
        }
    } else if ($('.bg-color-second.bg-color-random').length) {
        var first_color_class = $('.bg-color-first').attr('class');
        var second_color_options = [];

        if (first_color_class.includes("blue")) {
            second_color_options = ['yellow', 'orange', 'navy'];
        } else if (first_color_class.includes("yellow")) {
            second_color_options = ['blue', 'orange', 'navy'];
        } else if (first_color_class.includes("orange")) {
            second_color_options = ['blue', 'yellow', 'navy'];
        } else if (first_color_class.includes("navy")) {
            second_color_options = ['blue', 'yellow', 'orange'];
        }

        var second_random_color_index = Math.floor(Math.random() * second_color_options.length);
        $('.bg-color-second.bg-color-random').addClass('bg-color-' + second_color_options[second_random_color_index]);
    }
});
"use strict";

jQuery(document).ready(function($) {
    function bgSwap() {
        // define panel and media queries
        var panel = $('[data-imgbg]'),
            hiDPI = 'screen and (min-resolution: 2dppx), screen and (-webkit-min-device-pixel-ratio: 2), screen and (min--moz-device-pixel-ratio: 2), screen and (min-resolution: 250dpi)',
            mobile = '(max-width: 539px)',
            mobileHiDPI = 'screen and ' + mobile + ' and (min-resolution: 2dppx), screen and ' + mobile + ' and (-webkit-min-device-pixel-ratio: 2), screen and ' + mobile + ' and (min--moz-device-pixel-ratio: 2), screen and ' + mobile + ' and (min-resolution: 250dpi)',
            narrow = '(min-width: 540px) and (max-width: 719px)',
            narrowHiDPI = 'screen and ' + narrow + ' and (min-resolution: 2dppx), screen and ' + narrow + ' and (-webkit-min-device-pixel-ratio: 2), screen and ' + narrow + ' and (min--moz-device-pixel-ratio: 2), screen and ' + narrow + ' and (min-resolution: 250dpi)',
            wide = '(min-width: 720px) and (max-width: 959px)',
            wideHiDPI = 'screen and ' + wide + ' and (min-resolution: 2dppx), screen and ' + wide + ' and (-webkit-min-device-pixel-ratio: 2), screen and ' + wide + ' and (min--moz-device-pixel-ratio: 2), screen and ' + wide + ' and (min-resolution: 250dpi)',
            xWide = '(min-width: 960px) and (max-width: 1279px)',
            xWideHiDPI = 'screen and ' + xWide + ' and (min-resolution: 2dppx), screen and ' + xWide + ' and (-webkit-min-device-pixel-ratio: 2), screen and ' + xWide + ' and (min--moz-device-pixel-ratio: 2), screen and ' + xWide + ' and (min-resolution: 250dpi)',
            xxWide = '(min-width: 1280px)',
            xxWideHiDPI = 'screen and ' + xxWide + ' and (min-resolution: 2dppx), screen and ' + xxWide + ' and (-webkit-min-device-pixel-ratio: 2), screen and ' + xxWide + ' and (min--moz-device-pixel-ratio: 2), screen and ' + xxWide + ' and (min-resolution: 250dpi)'; // loop through available panels

        panel.each(function() {
            // grab images
            var thisMobileImg = $(this).data('imgbg-mobile'),
                thisMobileImg2x = $(this).data('imgbg-mobile2x'),
                thisNarrowImg = $(this).data('imgbg-narrow'),
                thisNarrowImg2x = $(this).data('imgbg-narrow2x'),
                thisWideImg = $(this).data('imgbg-wide'),
                thisWideImg2x = $(this).data('imgbg-wide2x'),
                thisXWideImg = $(this).data('imgbg-xwide'),
                thisXWideImg2x = $(this).data('imgbg-xwide2x'),
                thisXXWideImg = $(this).data('imgbg-xxwide'),
                thisXXWideImg2x = $(this).data('imgbg-xxwide2x'),
                thisPanel = $(this);

            function replaceImg(img) {
                thisPanel.css('background-image', 'url("' + img + '")');
            } // run enquire against media queries


            enquire.register('screen and ' + mobile, {
                match: function match() {
                    replaceImg(thisMobileImg);
                }
            }).register(hiDPI, {
                match: function match() {
                    replaceImg(thisMobileImg2x);
                }
            }).register('screen and ' + narrow, {
                match: function match() {
                    replaceImg(thisNarrowImg);
                }
            }).register(narrowHiDPI, {
                match: function match() {
                    replaceImg(thisNarrowImg2x);
                }
            }).register('screen and ' + wide, {
                match: function match() {
                    replaceImg(thisWideImg);
                }
            }).register(wideHiDPI, {
                match: function match() {
                    replaceImg(thisWideImg2x);
                }
            }).register('screen and ' + xWide, {
                match: function match() {
                    replaceImg(thisXWideImg);
                }
            }).register(xWideHiDPI, {
                match: function match() {
                    replaceImg(thisXWideImg2x);
                }
            }).register('screen and ' + xxWide, {
                match: function match() {
                    replaceImg(thisXXWideImg);
                }
            }).register(xxWideHiDPI, {
                match: function match() {
                    replaceImg(thisXXWideImg2x);
                }
            });
        });
    }

    bgSwap();
});
"use strict";

jQuery(document).ready(function($) {
    if (window.location.hash) {
        setTimeout(function() {
            if ($(window.location.hash).length) {
                if ($(window.location.hash).attr('class') == 'wp-block-opus-core-block-rewrite-oa') {
                    var accordionTitle = $(window.location.hash).find($('h3.accordion-title'));

                    if (accordionTitle.attr('aria-expanded') == 'false') {
                        accordionTitle.click();
                    }
                }

                $('html, body').animate({
                    scrollTop: $(window.location.hash).offset().top - 100
                }, 600);
            }
        }, 500);
    }

    $("a[href^='#']").not('[href="#content"]').not('[href="#"]').not('[href="#0"]').not('[href="#header-carousel"]').click(function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        setTimeout(function() {
            if ($(target).attr('class') == 'wp-block-opus-core-block-rewrite-oa') {
                var accordionTitle = $(target).find($('h3.accordion-title'));

                if (accordionTitle.attr('aria-expanded') == 'false') {
                    accordionTitle.click();
                }
            }

            if ($(target).length) {
                $('html, body').animate({
                    scrollTop: $(target).offset().top - 100
                }, 600);
            }
        }, 100);
    });
    $('.smooth-scroll').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 100
            }, 600);
        }
    });
});
"use strict";

jQuery.fn.blindRightToggle = function(duration, easing, complete) {
    return this.animate({
        marginRight: 0
    }, jQuery.speed(duration, easing, complete));
};

jQuery(document).ready(function($) {
    // toggle search form
    $("#search-form-toggle").click(function() {
        $(this).attr("aria-expanded", "true");
        $(this).toggle();
        $(".utility-navigation .searchform").toggleClass('active');
        $(".utility-navigation input[type='text']").blindRightToggle();
        $('#searchsubmit').show();
        setTimeout(function() {
            $(".utility-navigation input[type='text']").focus();
        }, 400);
    });
});
"use strict";

/**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
(function() {
    var isIe = /(trident|msie)/i.test(navigator.userAgent);

    if (isIe && document.getElementById && window.addEventListener) {
        window.addEventListener('hashchange', function() {
            var id = location.hash.substring(1),
                element;

            if (!/^[A-z0-9_-]+$/.test(id)) {
                return;
            }

            element = document.getElementById(id);

            if (element) {
                if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
                    element.tabIndex = -1;
                }

                element.focus();
            }
        }, false);
    }
})();
"use strict";

jQuery(document).ready(function($) {
    $('.wp-block-table table:not(.directory)').each(function() {
        if ($(this).find('thead').length) {
            $(this).basictable();
        } else {
            $(this).basictable({
                header: false
            });
        }
    });
});