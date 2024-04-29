    $(function() {
        $('.calendar').pignoseCalendar();
        $('.calendar').pignoseCalendar({
            click: function(event, context) {
                /**
                 * @params this Element
                 * @params event MouseEvent
                 * @params context PignoseCalendarContext
                 * @returns void
                 */

                // This is clicked button Element.
                var $this = $(this);
                // console.log($(this).attr("data-date"));
                var modal_id = $(this).attr("data-date");
                modal_id = "#" + modal_id;
                console.log(modal_id);
                $(".pignose-calendar .pignose-calendar-unit").attr("data-toggle", "modal");
                $(this).attr("data-target", modal_id);
                // console.log($(".modal").attr("id"));
                // if($(".modal").attr("id"))
                $(modal_id).modal("show");
                // console.log($(this).attr("data-target"));
                // $(this).attr("data-target",)
                // You can access event parameter.
                event.preventDefault();
                // 
                // You can get target element in `context` variable, This element is same `$(this)`.
                var $element = context.element;

                // You can also get calendar element, It is calendar view DOM.
                var $calendar = context.calendar;
            }
        });
    });

    $(document).ready(function() {
        // $('.modal-news-slider').on('init', function(event, slick){
        //       console.log("initialised")
        //       $('.modal-news-slider').slick({
        //         infinite: false,
        //         direction   : "bottom",
        //         speed: 300,
        //         slidesToShow: 2,
        //         slidesToScroll: 2
        //     });
        // });

    })