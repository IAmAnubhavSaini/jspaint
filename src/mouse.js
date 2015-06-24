MouseTrack = function () {
        var canvas = $("canvas.AYOM.AYOM2#TrackArea")[0],
            parentOffset = $(canvas).offset(),
            coordLogArea = $(".AYOM.AYOM2#Log"),
            coordLog = function (event) {

                return "[" + event.pageX + ", " + event.pageY + "]; relative: [" + (event.pageX - parseInt(parentOffset.left)) + ", " + (event.pageY - parseInt(parentOffset.top)) + "]";
            },
            context = canvas.getContext("2d"),
            pixelSize = 2,
            color = "#000000",
            backgroundColor = "#FFffFF";

        $(canvas).on("mousemove", function (event) {
            $(coordLogArea).text(coordLog(event));
            context.fillRect((event.pageX - parseInt(parentOffset.left)), (event.pageY - parseInt(parentOffset.top)), pixelSize, pixelSize);
        });

        $("#Clear").click(function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
        });

        $("#Apply").click(function () {
            pixelSize = $("#Size").val();
            context.fillStyle = $("#Color").val();
        });

    };
