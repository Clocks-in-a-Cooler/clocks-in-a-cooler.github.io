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

var body       = document.body;
var background = document.getElementById("background");

var atmosphere_canvas    = document.getElementById("atmosphere");
atmosphere_context       = atmosphere_canvas.getContext("2d");
atmosphere_canvas.width  = window.innerWidth;
atmosphere_canvas.height = 100;

window.onload = function() {
    pick_theme();
    background.style.height = body.clientHeight + "px";
    
    //scroll to the bottom of the page
    window.scrollTo(0, document.body.scrollHeight);
};

//fun features
var meteors = [];

function Meteor(x, angle) {
    this.x = x; this.y = 0;
    
    this.angle  = angle;
    this.active = true;
}

Meteor.prototype.speed = 1.2;
Meteor.prototype.colour = {r: 255, g: 218, b: 185};

Meteor.prototype.get_alpha = function() {
    return -1 * Math.abs(this.y - 50) / 50 + 1;
};

Meteor.prototype.get_colour = function() {
    return "rgba(" + this.colour.r + ", " + this.colour.g + ", " + this.colour.b + ", " + this.get_alpha() + ")";
};

Meteor.prototype.update = function(lapse) {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    
    if (this.y > 125) {
        this.active = false;
    }
};

Meteor.prototype.draw = function(cxt) {
    cxt.fillStyle = this.get_colour();
    cxt.beginPath();
    cxt.arc(this.x, this.y, 3, this.angle - Math.PI / 2, this.angle + Math.PI / 2);
    cxt.closePath();
    cxt.fill();
    cxt.beginPath();
    cxt.moveTo(this.x + Math.cos(this.angle - Math.PI / 2) * 3, this.y + Math.sin(this.angle - Math.PI / 2) * 3);
    cxt.lineTo(this.x - Math.cos(this.angle) * 30, this.y - Math.sin(this.angle) * 30);
    cxt.lineTo(this.x + Math.cos(this.angle + Math.PI / 2) * 3, this.y + Math.sin(this.angle + Math.PI / 2) * 3);
    cxt.closePath();
    cxt.fill();
}

function create_meteor() {
    var x       = Math.random() * window.innerWidth;
    var angle   = Math.random() * Math.PI / 3;
    var timeout = Math.floor(Math.random() * 500) + 250;
    
    meteors.push(new Meteor(x, angle));
    setTimeout(create_meteor, timeout);
}

var last_time = null;
function animate(time) {
    if (last_time == null) {
        var lapse = 0;
    } else {
        var lapse = time - last_time;
    }
    last_time = time;
    
    meteors = meteors.filter(m => { return m.active; });
    
    atmosphere_context.clearRect(0, 0, window.innerWidth, 100);
    meteors.forEach(m => { m.update(lapse); m.draw(atmosphere_context); });
    
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
create_meteor();