//pick a css colour theme based on the time of day

var themes = {
    day     : "day.css",
    night   : "night.css",
    twilight: "twilight.css",
};

function pick_theme() {
    var hour = new Date().getHours();
    
    /*
        0:00 to 4:59   -> night
        5:00 to 7:59   -> twilight
        8:00 to 17:59  -> day
        18:00 to 20:59 -> twilight
        21:00 to 23:59 -> night
    */
    
    var theme;
    
    if (hour < 5 || hour > 20) {
        theme = themes.night;
    } else if (hour < 8 || hour > 17) {
        theme = themes.twilight;
    } else {
        theme = themes.day;
    }
    
    document.getElementById("colour_theme").href = theme;
}

pick_theme();

//scroll to the bottom of the page
window.scrollTo(0, document.body.scrollHeight);

var body = document.body;
var background = document.getElementById("background");

background.style.height = body.clientHeight + "px";

var canvas = document.getElementById("atmosphere");
canvas.width = window.innerWidth; canvas.height = 100;

//fun features
var meteors = [];
function draw_meteors() {
    var n = Math.floor(Math.random() * 9) + 3;
}