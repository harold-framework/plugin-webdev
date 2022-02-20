# Web Development

:information_source: **Please note, the `/web-component` was created for a custom and private web framework that runs on my personal websites. For this reason, it will not work for you. Rewriting the code should not be too hard, all you'd need to do is rewrite the `HaroldDevAPI::request` function to directly use cURL instead of the abstraction layer.**

:warning: **If you do rewrite the `/web-component` you MUST ensure that some form of actual authentication is implemented. Due to the nature of the IDE being able to execute arbitrary code inside of the bot, it is VERY IMPORTANT that a robust and secure authentication method is implemented. This could be as complex as a permission-based authentication system like the original, or a simple bearer token in the request.**

The webdev plugin is a powerful development environment that supports code being injected and directly executed into a live running bot instance. This means that code can be efficiently tested without the need for restarts etc, unlike most other bots.

The website is comprised of three core elements, the code editor (Pictured as the left box), the output terminal (Pictured as the right box) and the terminal (Pictured as the bottom black bar). All of these elements are easily resizable so you can create an environment that best suits you. 

![Base IDE View](https://cdn.morgverd.com/static/github/harold/6pvnAE4rZPBC3RcsQBQYwZcJN.png)



## Droplets

The IDE uses a system of droplets that provides a basic plugin like functionality. Droplets can define their own `CSS`, `Javascript` and `HTML` files which are then injected into the page. One such example of a droplet that is included in the public version is the `var-inspection` droplet.

![Variable Inspection Droplet View](https://cdn.morgverd.com/static/github/harold/vlga2kbv4mApKBM1fOBeyWkKS.png)

The droplet allows for variables to be inspected, updating in live time as the value is changed in the bot. Droplets also support being dragged and resized to promote a fully customisable environment.



## Stdout Capturing

Code that is executed is run in a semi-sandboxed environment, allowing for full access to runtime variables such as the live bot instance while also capturing all `stdout` and `stderr` streams during the execution. This means you can use basic `print()` or `bot.log` functions, with the output being shown in the terminal after execution as it would normally!
