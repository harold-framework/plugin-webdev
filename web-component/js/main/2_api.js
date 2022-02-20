
function executeCode() {
    if ((window.editor.getValue() == editor_value.join('\n')) || (window.editor.getValue() == "")) {
        window.terminal.error("There is no code to execute.");
    } else {
        startLoading();
        $.post("/api/discord/ide/execute", {"code": window.editor.getValue()}, function(data) {
            if (data.success) {
                if (data.output != null) { window.shell.setValue(data.output); } else { window.shell.setValue(""); };
                if (data.stdout != null) { window.terminal.echo(data.stdout); };

            } else {
                window.terminal.error(data.error_message);
            }
            endLoading();
        })
    }
}


$( document ).ready(function() {

    $.get("/api/discord/ide/commands", function(data) {
        // Gather all commands from the API.
        if (data.success) {
            for (var i = 0; i < data.commands.length; i++) {
                if (!(data.commands[i] in window.commands)) {
                    window.commands[data.commands[i]] = null;
                }
            }
            window.terminal.echo("Successfully loaded external commands!");
        } else {
            window.terminal.error("Failed to load external commands!");
        }
    });

});

