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
    
    draw_stars();
};

//fun features

// draw a city, for #sky
var palettes = {
    day: {
        farground: "rgb(156, 196, 199)",
        midground: "rgb(156, 170, 171)",
        nearground: "rgb(139, 140, 140)",
        unlit: "rgb(125, 219, 240)",
        lit: "rgb(230, 240, 140)",
        lit_chance: 0.1,
    },
    twilight: {
        farground: "rgb(88, 70, 94)",
        midground: "rgb(66, 54, 70)",
        nearground: "rgb(21, 17, 23)",
        unlit: "rgb(95, 62, 106)",
        lit: "rgb(230, 240, 140)",
        lit_chance: 0.5,
    },
    night: {
        farground: "rgb(25, 43, 57)",
        midground: "rgb(58, 63, 66)",
        nearground: "rgb(77, 84, 88)",
        unlit: "rgb(11, 33, 51)",
        lit: "rgb(230, 240, 140)",
        lit_chance: 0.2,
    },
};

var colour_palette = (function(hour) {
    if (hour < 5 || hour > 20) {
        return palettes.night;
    }
    if (hour < 8 || hour > 17) {
        return palettes.twilight;
    }
    return palettes.day;
})(new Date().getHours());

var sky_canvas    = document.getElementById("sky");
sky_canvas.width  = window.innerWidth;
sky_canvas.height = 600;
var sky_context   = sky_canvas.getContext("2d");

function Building() {
    this.floors  = Math.ceil(Math.random() * 18) + 6;
    this.columns = Math.floor(Math.random() * 4) + 5;
    this.window  = {};
    
    this.window.width  = Math.random() * 5 + 5;
    this.window.height = Math.random() * 3 + this.window.width;
    this.window.buffer = Math.random() * 5 + 2;
    
    this.width  = this.columns * this.window.width + this.window.buffer * (this.columns + 1);
    this.height = this.floors * this.window.height + this.window.buffer * (this.floors + 1);
}

/*
Building.prototype.window = {
    width: 5,
    height: 7,
    buffer: 2,
};*/

function draw_buildings(palette) {
    var x = Math.floor(Math.random() * 30 - 15);
    for (; x < window.innerWidth;) {
        var b = new Building();
        sky_context.save();
        sky_context.translate(x, 540 - b.height);
        // draw the building part
        sky_context.fillStyle = palette.farground;
        sky_context.fillRect(0, 0, b.width, b.height);
        // draw the windows
        for (var m = b.window.buffer; m < b.width; m += b.window.width + b.window.buffer) {
            for (var n = b.window.buffer; n < b.height; n += b.window.height + b.window.buffer) {
                if (Math.random() < palette.lit_chance) {
                    sky_context.fillStyle = palette.lit;
                } else {
                    sky_context.fillStyle = palette.unlit;
                }
                sky_context.fillRect(m, n, b.window.width, b.window.height);
            }
        }
        
        sky_context.restore();
        x += b.width + Math.random() * 20 + 5;
    }
    
    // rinse and repeat
    x = Math.floor(Math.random() * 30 - 15);
    for (; x < window.innerWidth;) {
        var b = new Building();
        sky_context.save();
        sky_context.translate(x, 540 - b.height);
        // draw the building part
        sky_context.fillStyle = palette.midground;
        sky_context.fillRect(0, 0, b.width, b.height);
        // draw the windows
        for (var m = b.window.buffer; m < b.width; m += b.window.width + b.window.buffer) {
            for (var n = b.window.buffer; n < b.height; n += b.window.height + b.window.buffer) {
                if (Math.random() < palette.lit_chance) {
                    sky_context.fillStyle = palette.lit;
                } else {
                    sky_context.fillStyle = palette.unlit;
                }
                sky_context.fillRect(m, n, b.window.width, b.window.height);
            }
        }
        
        sky_context.restore();
        x += b.width + Math.random() * 20 + 5;
    }
    
    x = Math.floor(Math.random() * 30 - 15);
    for (; x < window.innerWidth;) {
        var b = new Building();
        sky_context.save();
        sky_context.translate(x, 540 - b.height);
        // draw the building part
        sky_context.fillStyle = palette.nearground;
        sky_context.fillRect(0, 0, b.width, b.height);
        // draw the windows
        for (var m = b.window.buffer; m < b.width; m += b.window.width + b.window.buffer) {
            for (var n = b.window.buffer; n < b.height; n += b.window.height + b.window.buffer) {
                if (Math.random() < palette.lit_chance) {
                    sky_context.fillStyle = palette.lit;
                } else {
                    sky_context.fillStyle = palette.unlit;
                }
                sky_context.fillRect(m, n, b.window.width, b.window.height);
            }
        }
        
        sky_context.restore();
        x += b.width + Math.random() * 20 + 5;
    }
}

draw_buildings(colour_palette);

// meteors, for #atmosphere
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
    var angle   = Math.random() * Math.PI / 6 + Math.PI / 6;
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

// draw space, which means stars!
function draw_stars() {
    var space_canvas    = document.getElementById("space-canvas");
    var space           = document.getElementById("space");
    space_canvas.width  = space.clientWidth;
    space_canvas.height = space.clientHeight;
    var space_context   = space_canvas.getContext("2d");

    var star_colours = ["lightcyan", "white", "lemonchiffron", "rgb(250, 206, 140)", "rgb(255, 214, 214)"];

    for (var n = 0; n < Math.random() * 400 + 100; n++) {
        space_context.fillStyle = star_colours[Math.floor(Math.random() * 5)];
        space_context.beginPath();
        space_context.arc(Math.random() * space_canvas.width, Math.random() * space_canvas.height, 2, 0, Math.PI * 2);
        space_context.closePath();
        space_context.fill();
    }
}