
/*
    Droplets are the name for plugins in the Harold IDE system.
    They feature a simple structure of a static "droplet.html" file
    and an optional "droplet.js" file to run along side it, and finally
    an optional stylesheet "style.css". 

    The static HTML file "droplet.html" is read and then a new div is
    created on the main webpage in the "#droplets" div.

    This layout makes them "drag'n drop" as no modification to any file
    including the main index is required, the autoloader below will handle
    all the setup.
*/

function getUnix() {
    return parseInt(new Date().getTime() / 1000);
}

function addFile(url, type, target = document.body) {
    var fileTypeSpecifications = {
        "js": {
            "element": "script",
            "attributes": {
                "type": "text/javascript",
                "src": url
            }
        },
        "css": {
            "element": "link",
            "attributes": {
                "type": "text/css",
                "rel": "stylesheet",
                "href": url
            }
        }
    }
    if (!(Object.keys(fileTypeSpecifications).includes(type.toLowerCase()))) {
        throw "Invalid import type " + type;
    }
    var fileInfo = fileTypeSpecifications[type.toLowerCase()];
    var element = document.createElement(fileInfo["element"]);
    
    // Add the attributes to the element created.
    var attribute_names = Object.keys(fileInfo["attributes"]);
    for (let i = 0; i < attribute_names.length; i++) {
        element.setAttribute(attribute_names[i], fileInfo["attributes"][attribute_names[i]]);
    }

    // Append the created element to the target.
    target.appendChild(element);
    return element;
}

function loadDropletOtherFiles(name) {
    if (files["css"].includes(name)) {
        addFile("/discord/ide/droplets/" + name + "/style.css?" + getUnix(), "css");
        console.log("   - Adding 'style.css' for '" + name + "'");
    }
    if (files["js"].includes(name)) {
        addFile("/discord/ide/droplets/" + name + "/droplet.js?" + getUnix(), "js");
        console.log("   - Adding 'droplet.js' for '" + name + "'");
    }
    window.dropletStates[name] = false;
    console.log("[DROPLETS] Finished loading " + name + ".");    
}

function loadDroplet(name) {
    var droplet = document.createElement("div");
    var dropletsDiv = document.getElementById("droplets");

    droplet.setAttribute("class", "droplet");
    droplet.setAttribute("id", name);
    
    $.get("/discord/ide/droplets/" + name + "/droplet.txt?" + getUnix(), function(html) {

        droplet.innerHTML = html;
        dropletsDiv.appendChild(droplet);
        loadDropletOtherFiles(name);

    }).fail(function() {
        
        console.error("Droplet '" + name + "' does not have a valid HTML file to load.");
        
    });

}

// Load the droplets gathered from the autoloader.
for (let i = 0; i < droplets.length; i++) {
    loadDroplet(droplets[i])
}