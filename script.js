const http = require("http");
const fs = require("fs");
var requests = require('requests');

let homeFile = fs.readFileSync("home.html", "utf-8");

const replace = (oldData, newData)=>{
    let temp = oldData.replace("{%city%}",newData.name);
    temp = temp.replace("{%country%}",newData.sys.country);
    temp = temp.replace("{%temp%}",newData.main.temp);
    temp = temp.replace("{%mintemp%}",newData.main.temp_min);
    temp = temp.replace("{%maxtemp%}",newData.main.temp_max);
    temp = temp.replace("{%tempStatus%}",newData.weather[0].main);
    return temp;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=indore&appid=23acdc864d23ad5129a0e4997a4f6927')
            .on('data', (chunk)=> {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                let realTimeData = arrData.map(val=>replace(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on('end', (err)=> {
                if (err) { console.log('connection closed due to errors', err)}
                res.end();
            });
    }
}).listen(3000, "127.0.0.1");