// The default message to show in the code editor.
var editor_value = [
    '"""',
    "",
    "	Welcome to the Harold Web Development panel. Here, you can create and then execute",
    "	Python code that will run inside the instance of Harold that is linked. This allows",
    "	you to easily debug scripts, get show of variables, and directly interact with the",
    "	bots running instance.",
    "",
    "	Below, is the terminal. You can issue any command that is registered with Harold to",
    "	interact with it directly. (The commands are just standard commandline commands).",
    "",
    "	You can also resize the editor and shell using the vertical bar in the middle of the screen",
    "	and increase the size of the terminal by simply dragging the top of it upwards.",
    "",
    "	You can also set the langauge of the shell output, For example, if you are returning a JSON",
    "	dumped string, you can use 'setlang json' in the terminal below to enable the shell to use",
    "	JSON syntax highlighting!",
    "",
    "	To execute the code, you can either press F5, or enter 'execute' in the terminal below!",
    "	PS: Feel free to delete this comment block when you're ready!",
    "",
    '"""'
];

window.terminal = $("#terminal").terminal(function(cmd, term) {
    // We have to alias it like this, as the runCommand func
    // would not be defined yet.
    runCommand(cmd, term);
},
{
    greetings: "\n",
    clear: false,
    autocompleteMenu: true,
    completion: function(term, cmd) {
        return Object.keys(window.commands);
    }
});

require.config({ paths: { vs: '/assets/monaco/min/vs' } });
require(['vs/editor/editor.main'], function () {
    window.editor = monaco.editor.create(document.getElementById('editor'), {
        value: editor_value.join('\n'),
        language: 'python',
        theme: "vs-dark",
        automaticLayout: true
    });
    window.shell = monaco.editor.create(document.getElementById('shell'), {
        value: "The output of your code will be shown here! You can use 'setlang' to change the\nhighlighting for this panel!", 
        language: "plaintext",
        readOnly: true,
        automaticLayout: true
    });

    // Load the users information.
    load();

});