
function resizeElement(element) {

    var startX, startY;

    function initDrag(e) {
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
        window.addEventListener('mousemove', doDrag, false);
        window.addEventListener('mouseup', stopDrag, false);
        addClassesToAll(["disabled"]);
    }
    function doDrag(e) {
        element.style.width = (startWidth + e.clientX - startX) + 'px';
        element.style.height = (startHeight + e.clientY - startY) + 'px';
    }
    function stopDrag(e) {
        window.removeEventListener("mousemove", doDrag, false);
        window.removeEventListener("mouseup", stopDrag, false);
        removeClassesFromAll(["disabled"]);
    }

    // Remove all old resizers.
    for (let resizer of element.getElementsByTagName("resizer")) {
        resizer.remove();
    }

    var resizer = document.createElement("resizer");
    resizer.className = "resizer";
    
    element.appendChild(resizer);
    resizer.addEventListener("mousedown", initDrag, false);

}