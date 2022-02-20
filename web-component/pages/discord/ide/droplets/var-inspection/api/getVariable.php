<?php

HeaderController::set("Content-Type", "application/json");
Presets::requirePermission("discord_ide.api.droplets.var-inspection");

// Ensure that the request method is POST and that the required variable
// post key is provided for the actual processing.
if ($_SERVER["REQUEST_METHOD"] !== "POST") { raise(405); }
if (!isset($_POST["variable"])) { raise(400); }

json_die(HaroldDevAPI::request("POST", "/inspectVariable", [
    "variable" => $_POST["variable"]
]));