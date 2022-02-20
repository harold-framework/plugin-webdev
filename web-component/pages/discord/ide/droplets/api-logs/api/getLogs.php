<?php

HeaderController::set("Content-Type", "application/json");
Presets::requirePermission("discord_ide.api.droplets.api-logs");
json_die(HaroldDevAPI::request("GET", "/apiLogs"));