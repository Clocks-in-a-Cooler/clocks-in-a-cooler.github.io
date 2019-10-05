//pick a random CSS theme
var colour_themes = [
    "blue.css",
    "red.css",
    "green.css",
    "purple.css",
];

var colour_theme = document.getElementById("colour_theme");

function choose_random_theme() {
    colour_theme.href = colour_themes[Math.floor(Math.random() * 4)];
}

addEventListener("click", choose_random_theme);

choose_random_theme();