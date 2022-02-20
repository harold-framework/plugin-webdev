require.config({ paths: { vs: '/assets/monaco/min/vs' } });
require(['vs/editor/editor.main'], function () {
    window.var_inspector_view = monaco.editor.create(document.getElementById('var-inspection-view'), {
        language: 'plaintext',
        theme: "vs-dark",
        automaticLayout: true
    });
});

$(document).ready(function() {
    window.var_inspector_updator = null;
    window.commands["inspect"] = function(args) {
        if (args.length == 0) { window.terminal.error("Missing inspection target variable."); return; };
        if (["", " "].includes(args[0])) { window.terminal.error("Missing inspection target variable."); return; };
        
        if (isDropletActive("var-inspection")) { window.terminal.error("There is already an active variable inspection."); return; };
        preformVarInspection(args[0]);
    }
});

/*
    Here, we should preform the inital variable inspection.
    We contact the API and request the current state of the variable
    and also what the datatype is, to set the highlighting on the inspector
    view.
*/
function preformVarInspection(variable) {
    startLoading(); // Start loading.
    
    $.post("/discord/ide/droplets/var-inspection/api/getVariable", {"variable": variable}, function(data) {
        updateVarInspectionFromAPI(data);
        if (data.success) {
            
            // Start the updater.
            window.var_inspector_updator = setInterval(function() {
                updateVarInspector(variable);
            }, 2000);

            // Show the droplet.
            showDroplet("var-inspection");

        }

        endLoading();

    });
}

function updateVarInspector(variable) {
    $.post("/discord/ide/droplets/var-inspection/api/getVariable", {"variable": variable}, function(data) {
        updateVarInspectionFromAPI(data);
    });
}

function updateVarInspectionFromAPI(data) {
    if (data.success) {

        // Only update the langauge set if it differs from the current.
        if (window.var_inspector_view.getModel().getLanguageIdentifier().language !== data.language) {
            monaco.editor.setModelLanguage(window.var_inspector_view.getModel(), data.language);
        }

        // Only update the value if it differs from the current.
        if (window.var_inspector_view.getValue() !== data.inspection) {
            window.var_inspector_view.setValue(data.inspection);
        }

    } else {
        window.terminal.error(data.error_message);
    }

}

document.getElementById("var-inspection").addEventListener("hideDroplet", function (e) {
    // Kill the updator when hidden.
    if (window.var_inspector_updator !== null) { 
        clearInterval(window.var_inspector_updator);
        window.var_inspector_updator = null;
    }
    window.var_inspector_view.setValue("");
}, false)
