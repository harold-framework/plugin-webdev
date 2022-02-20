
// Initialise dropletStates.
window.dropletStates = {};
window.dropletsFocusOrder = [];

const showDropletEvent = new Event("showDroplet");
const hideDropletEvent = new Event("hideDroplet");

function showDroplet(id) {
    if (!(getDroplets().includes(id))) { throw "Droplet '" + id + "' does not exist."; };
    
    var elem = document.getElementById(id);

    resetPosition(elem);
    dragElement(elem);
    resizeElement(elem);
    
    elem.style.display = "block";
    elem.dispatchEvent(showDropletEvent);
    window.dropletStates[id] = true;

    elem.addEventListener("mousedown", function(e) {
        focusDroplet(id);
    })

}

function focusDroplet(id) {
    if (!(getDroplets().includes(id))) { throw "Droplet '" + id + "' does not exist."; };

    // Ensure that all the droplets are in the dropletsFocusOrder.
    // This is so we can continue to update all their positions in
    // relativity to eachother.
    var allDroplets = getDroplets();
    for (let i = 0; i < allDroplets.length; i++) {
        if (!(window.dropletsFocusOrder.includes(allDroplets[i]))) {
            window.dropletsFocusOrder.push(allDroplets[i]);
        }
    }

    // If the droplet is already in the order, Remove it.
    if (window.dropletsFocusOrder.includes(id)) {
        window.dropletsFocusOrder.splice(window.dropletsFocusOrder.indexOf(id), 1);
    }

    // Add the droplet to the end of the array.
    window.dropletsFocusOrder.push(id);

    // Update the zIndex of every droplet relative to the dropletsFocusOrder.
    for (let i = 0; i < window.dropletsFocusOrder.length; i++) {
        var dropletDiv = document.getElementById(window.dropletsFocusOrder[i]);
        dropletDiv.style.zIndex = 11 + i;
    }
}

function hideDroplet(id) {
    if (!(getDroplets().includes(id))) { throw "Droplet '" + id + "' does not exist."; };
    
    var elem = document.getElementById(id);
    elem.style.display = "none";
    elem.dispatchEvent(hideDropletEvent);
    window.dropletStates[id] = false;
}

function isDropletActive(id) {
    if (getDroplets().includes(id)) {
        return window.dropletStates[id];
    } else {
        return false;
    }
}

function getDroplets() {
    return Object.keys(window.dropletStates);
}

function getActiveDroplets() {
    var allDropletStates = Object.keys(window.dropletStates);
    var activeDroplets = [];
    for (let i = 0; i < allDropletStates.length; i++) {
        if (window.dropletStates[allDropletStates[i]] == true) {
            activeDroplets.push(allDropletStates[i]);
        }
    }
    return activeDroplets;
}

function resetDropletsFocus() {
    var droplets = getDroplets();
    for (let i = 0; i < droplets.length; i++) {
        document.getElementById(droplets[i]).style.zIndex = "10";
    }
    window.dropletsFocusOrder = [];
}

function resetDropletsPosition() {
    var droplets = getDroplets();
    for (let i = 0; i < droplets.length; i++) {
        resetPosition(document.getElementById(droplets[i]));
    }
}

function resetDropletsSize() {
    var droplets = getDroplets();
    for (let i = 0; i < droplets.length; i++) {
        var dropletDiv = document.getElementById(droplets[i]);
        dropletDiv.style.width = "50vw";
        dropletDiv.style.height = "50vh";
    }
}

function resetDroplets() {
    resetDropletsFocus();
    resetDropletsPosition();
    resetDropletsSize();
}

$(window).ready(function() {
    window.commands["hide-droplets"] = function(args) {
        var activeDroplets = getActiveDroplets();
        if (activeDroplets.length > 0) {
            for (let i = 0; i < activeDroplets.length; i++) {
                window.terminal.echo("Hid active droplet '" + activeDroplets[i] + "'.");
                hideDroplet(activeDroplets[i]);
            }
        } else {
            window.terminal.error("There are no active droplets!");
        }
    }
    window.commands["active-droplets"] = function(args) {
        var activeDroplets = getActiveDroplets();
        if (activeDroplets.length > 0) {
            for (let i = 0; i < activeDroplets.length; i++) {
                window.terminal.echo("Active droplet found: '" + activeDroplets[i] + "'.");
            }
        } else {
            window.terminal.error("There are no active droplets!");
        }
    }
})
