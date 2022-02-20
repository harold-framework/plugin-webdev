function callCommandExecutedEvent(cmd, args, rmt) {
    document.dispatchEvent(
        new CustomEvent("commandExecuted", {
            detail: {
                command: cmd,
                arguments: args,
                remote: rmt
            },
            bubbles: true,
            cancelable: true,
            composed: false
        })
    )
}

function startLoading() {
    addClassesToAll(["disabled", "blury"]);
    document.getElementById("loading").style.display = "block";
}

function endLoading() {
    removeClassesFromAll(["disabled", "blury"]);
    document.getElementById("loading").style.display = "none";
}

function pxvh(px) {
    return px * (100 / document.documentElement.clientHeight);
}
function pxvw(px) {
    return px * (100 / document.documentElement.clientWidth);
}

// Save the contents of the code editor.
function save() {
    window.localStorage.setItem("editor-last-code", window.editor.getValue());
    window.localStorage.setItem("editor-last-lang", window.shell.getModel().getLanguageIdentifier().language);
}
function load() {
    var last_code = window.localStorage.getItem("editor-last-code");
    var last_lang = window.localStorage.getItem("editor-last-lang");

    // Actually act upon the states.
    if (last_code !== null) { window.editor.setValue(last_code); };
    if (last_lang !== null) { monaco.editor.setModelLanguage(window.shell.getModel(), last_lang); };
}

// Now that the loading function is defined, Start loading.
// The loading will end in the body onload event.
startLoading();
