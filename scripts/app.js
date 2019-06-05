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
        value: nowValue,
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
    $("#image").attr("src","https://pm25.jp/yosoku/parts/casu/" + YMD + "/" + toZero(num)+".png");
    var linkURL = "https://pm25.jp/m/" + YMD + "/" + (num<64 ? toZero(num)+1 : 1) + "/";
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
function init( latitude, longitude, outputId ) {
    var output = $(outputId);
    showStation(latitude,longitude,output);
}


function showStation(lat,lng, output) {
    output.html("<h2>Pollutants & Weather conditions:</h2>")
    output.append($("<div/>").html("Loading..."))
    output.append($("<div/>").addClass("cp-spinner cp-meter"))

    $.getJSON("//api.waqi.info/feed/geo:"+lat+";"+lng+"/?token=20a84400e93585c059c5ffa3c8b047f1acd93edb",function(result){

        output.html("<h2>Pollutants & Weather conditions:</h2>")
        if (!result || (result.status!="ok")) {
            output.append("Sorry, something wrong happend: ")
            if (result.data) output.append($("<code>").html(result.data))
            return
        }

        var names = {
            pm25: "PM<sub>2.5</sub>",
            pm10: "PM<sub>10</sub>",
            o3: "Ozone",
            no2: "Nitrogen Dioxide",
            so2: "Sulphur Dioxide",
            co: "Carbon Monoxyde",
            t: "Temperature",
            w: "Wind",
            r: "Rain (precipitation)",
            h: "Relative Humidity",
            d: "Dew",
            p: "Atmostpheric Pressure"
        }

        output.append($("<div>").html("Station: "+result.data.city.name+" on "+result.data.time.s))

        var table = $("<table/>").addClass("result")
        output.append(table)

        for (var specie in result.data.iaqi) {
            var aqi = result.data.iaqi[specie].v
            var tr = $("<tr>");
            tr.append($("<td>").html(names[specie]||specie))
            tr.append($("<td>").html(colorize(aqi,specie)))
            table.append(tr)
        }
    })
}
function colorize(aqi, specie ) {
    specie = specie || "aqi"
    if (["pm25", "pm10", "no2", "so2", "co", "o3", "aqi"].indexOf(specie) < 0) return aqi;

    var spectrum = [
        {a: 0, b: "#cccccc", f: "#ffffff"},
        {a: 50, b: "#009966", f: "#ffffff"},
        {a: 100, b: "#ffde33", f: "#000000"},
        {a: 150, b: "#ff9933", f: "#000000"},
        {a: 200, b: "#cc0033", f: "#ffffff"},
        {a: 300, b: "#660099", f: "#ffffff"},
        {a: 500, b: "#7e0023", f: "#ffffff"}
    ];


    var i = 0;
    for (i = 0; i < spectrum.length - 2; i++) {
        if (aqi == "-" || aqi <= spectrum[i].a) break;
    }
    ;
    return $("<div/>")
        .html(aqi)
        .css("font-size", "120%")
        .css("min-width", "30px")
        .css("text-align", "center")
        .css("background-color", spectrum[i].b)
        .css("color", spectrum[i].f)
}
// TODO add service worker code here
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

app.se