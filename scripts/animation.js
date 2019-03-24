var timerID;
var nn = 1;
var speed = "normal";

var speedNum = {
    "low"    : 2000,
    "normal" : 500,
    "high"   : 100
};

$(function(){

    var isFocus = 0;

    $("#linkURL").click(function(){
        $(this).select();
    });

    $("#playButton").click(function(){
        setTimer();
    });

    $("#pauseButton").click(function(){
        pause();
    });

//setTimer();

    $("[name=speed]").change(function(){
        speed = $(this).val();
//	if($("#pauseButton").css("display") == "inline-block"){

        clearInterval(timerID);
        setTimer();
//	}
    })


    $( "#slider" ).slider({
        range: "min",
        min: 1,
        max: 64,
        value: nowYosokuValue,
        slide: function( event, ui ) {
            pause();
            updateImage(ui.value);
        },
        stop: function(){
            $(this).find(".ui-slider-handle").blur();
        }
    });

    $("#slider").find(".ui-slider-handle").css({"cursor":"pointer"});
    $("#pauseButton").hide();
    $("#nextButton").click(function(){
        var val = $( "#slider" ).slider( "value" );
        val = val < 64 ? val+1 : 1;
        $("#slider").slider("value",val);
        pause();
        updateImage();
    });

    $("#preButton").click(function(){
        var val = $( "#slider" ).slider( "value" );
        val = val > 1 ? val-1 : 64;
        $("#slider").slider("value",val);
        pause();
        updateImage();
    });



});

function updateImage(n){

    var num = n ? n : $( "#slider" ).slider( "value" );
    $("#num").html(num);
    $("#image").attr("src","https://pm25.jp/yosoku/parts/casu/" + yosokuYMD + "/" + toZero(num)+".png");
    var linkURL = "https://pm25.jp/m/" + yosokuYMD + "/" + (num<64 ? toZero(num)+1 : 1) + "/";
    $("#movie_link").prop("href",linkURL);
    $("#linkURL").val(linkURL);

}

function pause(){
    clearInterval(timerID);
    $("#pauseButton").hide();
    $("#playButton").show();
}

function setTimer(){

    $("#playButton").hide();
    $("#pauseButton").show();


    timerID = setInterval(function(){

        var val = $( "#slider" ).slider( "value" );
        val = val < 64 ? val+1 : 1;
        $( "#slider" ).slider( "value", val );
        updateImage();

    },speedNum[speed]);

}

function toZero(n){
    return n < 10 ? "0"+n : n;
}