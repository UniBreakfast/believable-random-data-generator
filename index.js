require("./stuffing.js");
require("./rnd.js");
require("./partials.js");
require("./utilitary.js");
require("./stuff.js");
require("./transformations.js");



const { createServer } = require("http");
const port = process.env.PORT || 3000;


const server = createServer((req, res) => {
    const { url } = req;
    const [route, query] = url.split("?");
    const params = Object.fromEntries(query ? query.split("&").map(p => p.split("=")) : []);
    
    if (route === "/unstable") {
        const people = JSON.stringify(persons(+params.count || 10));
        res.end(people);
    } 
})
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})
