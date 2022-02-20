
$( document ).ready(function() {

    // Add default commands:
    var default_commands = {
        "clear": function() { window.terminal.clear(); },
        "execute": executeCode,
        "setlang": function(args) {
            if (args.length == 0) { window.terminal.error("Missing langauge argument!"); return; };
            monaco.editor.setModelLanguage(window.shell.getModel(), args[0]);
        },
        "save": save,
        "load": load,
        "reset-sizes": function() {	
            resizeTerminal(20);
            resizeEditors(50);
            window.terminal.echo("Reset the size of the Terminal and Editor.");
        },
        "hide": function(args) {
            if (args.length == 0) { window.terminal.error("Invalid hide target. Use 'shell', 'terminal' or 'editor'."); return; };
            if (!(["shell", "terminal", "editor"].includes(args[0].toLowerCase()))) { window.terminal.error("Invalid target. Try 'shell', 'terminal' or 'editor'."); return; };
            var targetTranslations = {
                "shell": [resizeEditors, 0],
                "terminal": [resizeTerminal, 0],
                "editor": [resizeEditors, 100]
            };

            var target_data = targetTranslations[args[0].toLowerCase()];
            target_data[0](target_data[1]);
            window.terminal.echo("Successfully hid the '" + args[0].toLowerCase() + "'");
        }
    };

    // Push the commands into the main window commands.
    if (typeof window.commands == "undefined") {
        window.commands = default_commands;
    } else {
        var default_command_names = Object.keys(default_commands);
        for (let i = 0; i < default_command_names.length; i++) {
            window.commands[default_command_names[i]] = default_commands[default_command_names[i]];
        }
    }

})

function runCommand(command, terminal) {
    var args = [];
    if (command.includes(" ")) {
        // There is a space, It may be a command with arguments.
        args = command.split(" ").slice(1);
        command = command.split(" ")[0].toLowerCase();
    } else {
        command = command.toLowerCase();
    }
    
    if (!(command in window.commands)) {
        window.terminal.error(command + " is not a recognised command!");
        return;
    }

    if (window.commands[command] == null) {
        $.post("/api/discord/ide/runCommand", {"command": command, "arguments": JSON.stringify(args)}, function(data) {
            window.terminal.echo(data);
            callCommandExecutedEvent(command, args, true);
        });
    } else {
        window.commands[command](args);
        callCommandExecutedEvent(command, args, false);
    }
}