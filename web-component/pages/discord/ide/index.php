<?php

// Everything is handled in the root component files. All we actually need to do here is validate that the request is
// authenticated and that they have permission actually use the ide system. Authentication is automatically checked in
// the preset::requirePermission function so we can just use that.
Presets::requirePermission("discord_ide.use");

?>
<!DOCTYPE html>
<html>
	<head>
		<title>Harold Developer Editor</title>
		<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
		<link rel="stylesheet" href="/discord/ide/style.css?<?php echo time();?>">
		<link rel="icon" href="/discord/ide/favicon.ico">

		<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
		<script src="https://unpkg.com/jquery.terminal/js/jquery.terminal.min.js"></script>
		<script src="/assets/monaco/min/vs/loader.js"></script>

		<link rel="stylesheet" href="https://unpkg.com/jquery.terminal/css/jquery.terminal.min.css">
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
		<script src="/discord/ide/autoload/head"></script>

	</head>
	<body>
		<noscript>
			<meta http-equiv="refresh" content="0; url=https://enable-javascript.com/" />
		</noscript>
		<div id="workspace">
			<div id="editor" style="width: 50vw; height: 80vh;"></div>
			<div id="vertical_resizer" style="width: 0.5vw; height: 100vh;"></div>
			<div id="shell" style="width: 50vw; height: 80vh;"></div>
			<div id="terminalspace" style="width: 100vw;">
				<div id="horizontal_resizer" style="width: 100vw; height: 1vh;"></div>
				<div id="terminal" style="width: 100vw; height: 19vh; flex: 100%; order: 4;"></div>
			</div>
		</div>
		<div id="mobilespace" style="display: none;">
			<div id="goose">
				<img src="https://blog.nwf.org/wp-content/blogs.dir/11/files/2019/10/Untitled-Goose-Photo-Philippe-Henry.jpg" />
			</div>
			<div id="info">
				<p>Devices of this size are not currently supported with the Harold Developer Editor. Here's a picture of a goose for your troubles.</p>
				<br>
				<p>(If you are using a PC, Try zooming out a bit)</p>
			</div>
		</div>
		<div id="loading" style="display: none;">
			<img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" />
		</div>
		<div id="droplets"></div>
		<script src="/discord/ide/autoload/body"></script>
		<script src="/discord/ide/autoload/droplets"></script>
	</body>
</html>