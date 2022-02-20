
window.addEventListener("keydown", function (e) { 	

    // F5 Execute shortcut.
    if (e.keyCode === 116) {
        e.preventDefault();
        executeCode();
    }

    // CTRL+S
    if ((e.keyCode == 83) && (e.ctrlKey)) {
        e.preventDefault();
        save();
    }

    // CTRL+R
    if ((e.keyCode == 82) && (e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        resizeTerminal(20);
        resizeEditors(50); 
        resetDroplets();
    }

}, false);

window.addEventListener("resize", function (e) {
    fixSizes();
}, false);

window.addEventListener("mousedown", function (e) {
    if ((e.ctrlKey) && (e.shiftKey)) {
        resizeEditors(100 - pxvw(e.clientX));
        resizeTerminal(100 - pxvh(e.clientY));
    }
}, false);
