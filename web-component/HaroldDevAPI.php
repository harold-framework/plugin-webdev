<?php

// Describe the user permissions for the API.
UserPermissionsController::describePermission("discord_ide.api.execute", "Used to execute arbitrary inside the Bot API.");
UserPermissionsController::describePermission("discord_ide.api.commands", "Used to gather and execute commands in the Bot command line.");

class HaroldDevAPI {
    static function request(string $method, string $path, ?array $data = null): array {
        $conf = ComponentController::get("harold_dev")->getConfig();
        $response = RequestController::api(
            requestURL: $conf["API_URL"] . (str_starts_with($path, "/") ? $path : "/" . $path),
            headers: [
                "key" => $conf["API_KEY"]
            ],
            method: $method,
            postfields: $data
        );

        // If the response is null, then we should generate a generic error to replace it with. 
        // This just makes error handling easier for the individual API routes.
        if (is_null($response)) {
            $response = [
                "success" => false,
                "error_message" => "Failed to establish connection to bot API."
            ];
        }

        return $response;
    }
}

MagicRoutes::createRoute("/api/discord/ide/execute", function() {
    HeaderController::set("Content-Type", "application/json");
    Presets::requirePermission("discord_ide.api.execute");
    
    // Firstly, the method should be POST as we're accepting the code to execute.
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        raise(405);
    }

    // Secondly, we should ensure that there is actually a code key provided in the
    // POST body so we actually have something to execute.
    if (!isset($_POST["code"])) {
        raise(400);
    }

    // Issue the request, and then attempt to clean it up. If the response is unsuccessful,
    // we should return immidiately instead of trying to actually parse it.
    $executionResponse = HaroldDevAPI::request("POST", "/execute", [
        "code" => $_POST["code"]
    ]);
    if (!$executionResponse["success"]) { json_die($executionResponse); }

    // If the stdout ends with a new line, we should remove it since having a random newline looks
    // very ugly in the terminal screen. If there is no stdout, the API will simply return an empty
    // string, which we should replace with null to indicate a lack of response to the Javascript handler.
    if (str_ends_with($executionResponse["stdout"], "\n")) {
        $executionResponse["stdout"] = substr($executionResponse["stdout"], 0, -1);
    }
    if (empty($executionResponse["stdout"])) {
        $executionResponse["stdout"] = null;
    }

    // Finally, return the cleaned response.
    json_die($executionResponse);
});

MagicRoutes::createRoute("/api/discord/ide/commands", function() {
    HeaderController::set("Content-Type", "application/json");
    Presets::requirePermission("discord_ide.api.commands");
    json_die(HaroldDevAPI::request("GET", "/commands"));
});

// It is important to note that this route does not return JSON, instead it returns the raw text output from
// the simulated command execution from the Bot API. For this reason, although the Bot API returns its response
// in JSON we should ensure that we only return the output key.
MagicRoutes::createRoute("/api/discord/ide/runCommand", function() {
    HeaderController::set("Content-Type", "text/plain");
    Presets::requirePermission("discord_ide.api.commands");

    // Similarly to the execute route, we should only accept POST requests.
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        raise(405);
    }

    // Secondly, we should validate that the two required POST keys are present.
    if (!array_keys_exist($_POST, ["command", "arguments"])) {
        raise(400);
    }

    // Issue the request simply. If the response is unsuccessful, we should roughly format the error and then return.
    // If it is successful, we should simply die with the output string. Similarly to the execute route, we should also
    // remove any trailing newlines.
    $commandResponse = HaroldDevAPI::request("POST", "/runCommand", [
        "command" => $_POST["command"],
        "arguments" => $_POST["arguments"]
    ]);
    if (!$commandResponse["success"]) { die("Error from API: ". $commandResponse["error_message"]); }
    if (str_ends_with($commandResponse["output"], "\n")) {
        $commandResponse["output"] = substr($commandResponse["output"], 0, -1);
    }
    die($commandResponse["output"]);
});