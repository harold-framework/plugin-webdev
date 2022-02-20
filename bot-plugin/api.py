from aiohttp import web
import asyncio, aiohttp, time, random, string, json, ast, traceback, discord, sys, io
from discord.ext import commands

routes = web.RouteTableDef()

@routes.get('/plugins/webdev')
async def get_root(request): return web.json_response({"success": False, "error_message": "Root access to webdev is prohibited."}, status=200, content_type='application/json')

@routes.get('/plugins/webdev/commands')
async def get_commands(request):

    all_commands = []
    for command in list(request.app["bot"].utils["managers"]["commandlineManager"].commandData.keys()):
        if command not in ["clear", "stop", "restart"]: all_commands.append(command)

    return web.json_response({"success": True, "commands": all_commands}, status=200, content_type='application/json')

@routes.post('/plugins/webdev/runCommand')
async def post_runcommand(request):

    bot = request.app["bot"]

    try:
        post = await request.post()
        command = post["command"]
        arguments = json.loads(post["arguments"])

    except Exception as err:
        return web.json_response({"success": False, "error_message": "Failed parse POST data correctly."}, status=200, content_type='application/json')

    x = command
    if arguments != []: x = command + " " + " ".join(arguments)

    output = "\n".join(
        await bot.utils["managers"]["commandlineManager"].getCommandOutput(x, deColourize=True)
    )

    return web.json_response({"success": True, "output": output}, status=200, content_type='application/json')


@routes.post('/plugins/webdev/execute')
async def post_execute(request):

    bot = request.app["bot"]

    try:
        post = await request.post()
        code = post["code"]

    except Exception as err:
        return web.json_response({"success": False, "error_message": "Failed parse POST data correctly."}, status=200, content_type='application/json')

    old_stdout = sys.stdout     # Save the old stdout for later.
    new_stdout = io.StringIO()  # Setup the new stdout to a StringIO.
    sys.stdout = new_stdout     # Swap the old stdout for the new one.

    # Execute the code.
    success, result = await bot.utils["managers"]["developmentManager"].executeCode(code)

    output = new_stdout.getvalue() # Get the output of the command.
    sys.stdout = old_stdout # Reset the output back to the old one.

    return web.json_response({"success": True, "stdout": output, "output": None if result is None else str(result)}, status=200, content_type='application/json')


# Variable inspection droplet:

@routes.post('/plugins/webdev/inspectVariable')
async def post_inspectvariable(request):

    bot = request.app["bot"]

    try:
        post = await request.post()
        variable = post["variable"]
    except Exception as err:
        return web.json_response({"success": False, "error_message": "Failed parse POST data correctly."}, status=200, content_type='application/json')
    
    def inspectVar(var):
        return {
            "type": type(var).__name__,
            "repr": repr(var),
            "value": var
        }

    bot.data["inspectVar"] = inspectVar
    
    errorExplainations = {
        "NameError": "The variable provided does not exist.",
        "KeyError": "The key provided in the variable is non-existant.",
        "SyntaxError": "The variable provided had incorrect syntax.",
        "TypeError": "Failed to interpret the type requested.",
        "AttributeError": "Variable is missing requested attribute.",
        "IndexError": "The requested index does not exist in provided variable.",
        "NameError": "Local or Global variable is not found."
    }
    
    success, inspection_results = await bot.utils["managers"]["developmentManager"].executeCode('bot.data["inspectVar"](' + variable + ')')
    if not success:

        lines = inspection_results.split("\n")
        if len(lines) >= 2:
            error_line = lines[-2]
            for error_type in errorExplainations:
                if error_line.startswith(error_type): inspection_results = errorExplainations[error_type]

        return web.json_response({"success": False, "error_message": inspection_results}, status=200, content_type='application/json')
    
    if not type(inspection_results) is dict: return web.json_response({"success": False, "error_message": "Inspection results has become invalid."}, status=200, content_type='application/json')
    
    inspection_data = bot.jsonDump(inspection_results["value"], indent=4)
    if inspection_data is None: return web.json_response({"success": False, "error_message": "Inspection results have failed to be sanitised correctly."}, status=200, content_type='application/json')

    language = "plaintext"
    jsonTypes = ["dict", "list", "tuple"]
    if inspection_results["type"] in jsonTypes: language = "json"

    return web.json_response({"success": True, "inspection": inspection_data, "language": language}, status=200, content_type='application/json')


# API Logs droplet:

@routes.get('/plugins/webdev/apiLogs')
async def get_apilogs(request):
    bot = request.app["bot"]; logs = []
    for log in bot.data["apiLogs"]:
        isValid = True
        if not int(time.time()) < log["time"] + 10: isValid = False
        if log["path"].startswith("/plugins/webdev"): isValid = False

        if isValid: logs.append(log)

    return web.json_response({"success": True, "logs": logs}, status=200, content_type='application/json')

