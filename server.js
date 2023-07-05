const express = require("express")

const { exec } = require("child_process")

const app = express()


app.get("/runform" , (req, res) => {

        res.sendFile( __dirname + "/mern3.html")
})


app.get("/run",(req, res) => {
        const cname = req.query.cname;
        const cimage = req.query.cimage;

    //      res.send(cimage);
        //

        exec('docker run -dit --name ' + cname  + " " +cimage, (err, stdout, stderr) => {
            console.log(stdout)
            res.send("<pre>" + stdout + "</pre> <a href = '/ps'>click here to see all</a>");
    })

})

app.get("/ps" , (req,res)=>{

    exec("docker ps | tail -n +2" , (err, stdout, stderr)=> {

            let a =  stdout.split("\n");
            res.write("<table border = '5'  align = 'center'  width = '80%'>");
            res.write("<tr><th>Container ID</th><th>Image Name</th><th>Command</th><th>Cotainer Name</th></tr>");
                a.forEach( (cdetails) => {
                        cinfo = cdetails.trim().split(/\s+/)
                        console.log(cinfo[1] + " " + cinfo[2] + " " + cinfo[3])
                        res.write("<tr>" + "<td>" + cinfo[1] + "</td>" + "<td>" +  cinfo[2] + "</td> " + "<td>");
                } )

                res.write("</table>")
                        res.send()
        //      res.send("<pre>" + stdout + "</pre>");
        })
})

app.listen(3000, () => { console.log("container app tool started ...")})
