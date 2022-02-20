
// Load script when document is ready.
$( document ).ready(function() {
    
    // Initialise resize bars.
    resizeTerminal(20);
    resizeEditors(50);

    // Misc view things.
    fixSizes();

})

$(window).ready(function() {
    console.log("[MAIN] Finished loading the body, Removing loading display.");
    endLoading();
})
