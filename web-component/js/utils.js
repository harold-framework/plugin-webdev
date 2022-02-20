function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function getUnix() {
    return parseInt(new Date().getTime() / 1000);
}

function addClassesToElement(element, classes) {
    for (let i = 0; i < classes.length; i++) {
        if (!(element.classList.contains(classes[i]))) {
            element.classList.add(classes[i]);
        }   
    }
}
function removeClassesFromElement(element, classes) {
    for (let i = 0; i < classes.length; i++) {
        if (element.classList.contains(classes[i])) {
            element.classList.remove(classes[i]);
        }   
    }
}

function addClassesToAll(classes) {
    
    addClassesToElement(document.getElementById("workspace"), classes);
    var droplets = getDroplets();
    for (let i = 0; i < droplets.length; i++) {
        addClassesToElement(document.getElementById(droplets[i]), classes);
    }
}

function removeClassesFromAll(classes) {
    
    removeClassesFromElement(document.getElementById("workspace"), classes);
    var droplets = getDroplets();
    for (let i = 0; i < droplets.length; i++) {
        removeClassesFromElement(document.getElementById(droplets[i]), classes);
    }
}