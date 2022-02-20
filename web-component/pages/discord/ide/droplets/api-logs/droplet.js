
window.apiLogsRows = [];

function addAPILog(timestamp, ip, path) {
    var table = document.getElementById("api-logs-view");
    var row = table.insertRow(1);

    row.classList.add("api-log");
    row.insertCell(0).innerHTML = timestamp;
    row.insertCell(1).innerHTML = ip;
    row.insertCell(2).innerHTML = path;
    
    window.apiLogsRows.push(row);
    table.scrollTop = table.scrollHeight;
}
function clearAPILogs() {
    for (let i = 0; i < window.apiLogsRows.length; i++) {
        window.apiLogsRows[i].remove();
    }
}

function hashLog(log) {
    return (log.path + log.ip + log.time).split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

function getAPILogs() {
    $.get("/discord/ide/droplets/api-logs/api/getLogs", function(data) {
        if (data.success) {
            for (let i = 0; i < data.logs.length; i++) {
                
                var log = data.logs[i];
                var hashOfLog = hashLog(log);

                if (!(window.api_logs.includes(hashOfLog))) {
                    // Hash doesn't exist.
                    
                    var date = new Date(log.time * 1000);
                    var hours = date.getHours();
                    var minutes = "0" + date.getMinutes();
                    var seconds = "0" + date.getSeconds();
                    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                    addAPILog(formattedTime, log.ip, log.path);
                    window.api_logs.push(hashOfLog);
                
                }
            }
        } else {
            window.terminal.error(data.error_message);
        }
    })
}

document.getElementById("api-logs").addEventListener("showDroplet", function (e) {
    window.api_logs = [];
    getAPILogs();
    window.api_logs_updator = setInterval(function () {
        getAPILogs();
    }, 3000);
}, false);

document.getElementById("api-logs").addEventListener("hideDroplet", function (e) {
    clearAPILogs();
    clearInterval(window.api_logs_updator);
}, false)

$(document).ready(function() {
    window.var_inspector_updator = null;
    window.commands["api-logs"] = function() {
        if (isDropletActive("api-logs")) { window.terminal.error("The API logs are already showing."); return; };
        showDroplet("api-logs");
    }
});
