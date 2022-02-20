
document.getElementById("disco").addEventListener("showDroplet", function() {
    var discoElement = document.getElementById("disco");
    window.discoInterval = setInterval(function() {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        discoElement.style.backgroundColor = "#" + randomColor;
    }, 50);
})

document.getElementById("disco").addEventListener("hideDroplet", function() {
    clearInterval(window.discoInterval);
})