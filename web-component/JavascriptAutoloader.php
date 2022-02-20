<?php

MagicRoutes::createRoute("/discord/ide/autoload", function(string $target) {
    HeaderController::set("Content-Type", "application/javascript");

    // If the requested target is "droplets" then we should call 
    if ($target === "droplets") {

        
        $validDroplets = [];
        $files = [
            "css" => [],
            "js" => []
        ];
        
        $dropletDirectories = [];
        foreach (scandir(APP_PATH . "/components/harold_dev/pages/discord/ide/droplets") as $file) {
            if (is_dir(APP_PATH . "/components/harold_dev/pages/discord/ide/droplets/" . $file) && (!in_array($file, [".", ".."]))) {
                array_push($dropletDirectories, $file);
            }
        }
        foreach ($dropletDirectories as $droplet) {
            if (file_exists(APP_PATH . "/components/harold_dev/pages/discord/ide/droplets/" . $droplet)) {
        
                array_push($validDroplets, $droplet);
        
                if (file_exists(APP_PATH . "/components/harold_dev/pages/discord/ide/droplets/" . $droplet . "/style.css")) { array_push($files["css"], $droplet); };
                if (file_exists(APP_PATH . "/components/harold_dev/pages/discord/ide/droplets/" . $droplet . "/droplet.js")) { array_push($files["js"], $droplet); };
        
            }
        }

        $compiledJavascript = "var droplets = ". json_encode($validDroplets) .";\nvar files = ". json_encode($files) . ";\n";
        $compiledJavascript .= file_get_contents(APP_PATH . "/components/harold_dev/js/droplets_autoload.js");
        die($compiledJavascript);

    }

    $javascriptFiles = [
        "head" => [
            "0_globals.js",
            "dragger.js",
            "droplets.js",
            "resizer.js",
            "testing.js",
            "utils.js"
        ],
        "body" => [
            "main/0_elems.js",
            "main/1_utils.js",
            "main/2_api.js",
            "main/3_events.js",
            "main/4_resizers.js",
            "main/5_commands.js",
            "main/6_main.js"
        ]
    ];

    // Check to ensure that the provided target string exists.
    if (!array_key_exists($target, $javascriptFiles)) {
        raise(404, "Unknown target type provided.");
    }

    $compiledJavascript = "";
    foreach($javascriptFiles[$target] as $file) {
        $compiledJavascript .= file_get_contents(APP_PATH . "/components/harold_dev/js/". $file) . "\n";
    }

    die($compiledJavascript);

});
