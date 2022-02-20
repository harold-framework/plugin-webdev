
function resizeTerminal(vh) {

    // Do not allow any resize less than 20 or more than 90.
    if (vh < 0.8) { vh = 0.8; };
    if (vh > 90) { vh = 90; };

    document.getElementById("editor").style.height = (100 - vh) + "vh";
    document.getElementById("shell").style.height = (100 - vh) + "vh";
    document.getElementById("terminal").style.height = vh + "vh"; 

    // Fix resizers.
    document.getElementById("horizontal_resizer").style.top = document.getElementById("terminal").offsetTop + "px";
    document.getElementById("vertical_resizer").style.bottom = document.documentElement.clientHeight - document.getElementById("terminal").offsetTop + "px";

    return true;

}
function resizeEditors(vw) {
    if (vw < 0.5) { vw = 0.5; };
    if (vw > 99.9) { vw = 99.9; };

    document.getElementById("editor").style.width = 100 - vw + "vw";
    document.getElementById("shell").style.width = vw + "vw";
    
    // Move the resizer.
    document.getElementById("vertical_resizer").style.left = document.getElementById("editor").offsetWidth + "px";

    return true;

}
function fixResizers() {
    resizeEditors(document.getElementById("shell").style.width.slice(0, -2));
    resizeTerminal(document.getElementById("terminal").style.height.slice(0, -2));
}

document.getElementById("horizontal_resizer").onmousedown = function (e) {
    e = e || window.event;
    e.preventDefault();
    document.onmouseup = function () {
        document.onmouseup = null;
        document.onmousemove = null;
    }
    document.onmousemove = function (e) {
        e = e || window.event;
        e.preventDefault();

        resizeTerminal(100 - pxvh(e.clientY));
        
    }
}
document.getElementById("vertical_resizer").onmousedown = function (e) {
    e = e || window.event;
    e.preventDefault();
    document.onmouseup = function () {
        document.onmouseup = null;
        document.onmousemove = null;
    }
    document.onmousemove = function (e) {
        e = e || window.event;
        e.preventDefault();
        
        resizeEditors(100 - pxvw(e.clientX));
    }
}

function fixSizes() {

    fixResizers();		// Fix the resizer bars positions.

}
