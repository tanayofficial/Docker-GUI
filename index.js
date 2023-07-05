const express=require("express")
const app=express()
const { exec }= require("child_process")


app.listen(999, () => {console.log("Server started..")})

app.use('/assets',express.static('assets'))

app.get("/", (req,res) => {
        res.sendFile(__dirname+"/frontend.html");
})


app.get("/run", (req,res) =>{
        const os_name=req.query.os_name;
        const image_name=req.query.image_name;
        exec("docker run -dit --name "+os_name+" "+image_name, (err, stdout, stderr) => {
                res.send("<pre>"+stdout+"</pre>")
        })
})
app.get("/list", (req,res) =>{
        exec("docker ps | tail -n +2", (err,stdout,stderr) =>{
                let a=stdout.split("\n");
                res.write("<table border='2px solid blue'>")
                res.write("<tr><th>OS Name</th><th>OS Id</th><th>OS Status</th></tr>")
                a.forEach( (details) => {
                        let info=details.trim().split(/\s+/)
        res.write("<tr>"+"<td>"+info[10]+"</td>"+"<td>"+info[0]+"</td>"+"<td>"+info[6]+"</td>"+"</tr>")
                //      res.write(details+"</br>")
                })
                res.write("</table>")
                res.send()
        })
})


app.get("/rm", (req,res) =>{
        const osid=req.query.del_os;
        exec("docker rm -f "+osid, (err,stdout,stderr)=>{
                res.send("<pre>"+stdout+"</pre>")
        })
})
app.get("/img", (req,res) =>{
        exec("docker images | tail -n +2", (err,stdout,stderr)=>{
                let a=stdout.split("\n")
                res.write("<table border='2px solid blue'>")
                res.write("<tr><th>Repository</th><th>Tag</th></tr>")
                a.forEach((details)=>{
                let info=details.trim().split(/\s+/)
                res.write("<tr><td>"+info[0]+"</td><td>"+info[1]+"</td></tr>")
                })
                res.write("</table>")
                res.send()
        })
})

app.get("/download",(req,res) =>{
        const img_name=req.query.img_name;
        exec("docker pull "+img_name, (err,stdout,stderr)=>{
                res.send("Done")
        })
})
app.get("/delete",(req,res) =>{
        const imag_name=req.query.imag_name;
        exec("docker rmi "+imag_name, (err,stdout,stderr)=>{

                res.write("<pre>"+stdout+"</pre>")
                let a=stderr.split("\n")
                let info=a[0].trim().split(/\s+/)
                res.write(info[5]+" "+info[6]+" "+info[7]+" "+info[8])
                res.send()
        })
})


app.get("/delall",(req,res)=>{
        exec("docker image prune -a -y", (err,stdout,stderr) =>{
        res.send("<pre>"+stdout+"</pre>")
        })
})

app.get("/stats",(req,res)=>{
        const cont_name=req.query.con_id;
         exec("docker top "+cont_name+" | tail -n +2",(err,stdout,stderr) =>{
                let a=stdout.split("\n")
                res.write("<table border='2px solid blue'>")
                res.write("<tr><th>USER</th><th>PID</th><th>PPID</th><th>%CPU</th></tr>")
                a.forEach((details)=>{
                let info=details.trim().split(/\s+/)
                res.write("<tr><td>"+info[0]+"</td><td>"+info[1]+"</td><td>"+info[2]+"</td><td>"+info[3]+"</td></tr>")
                })
                res.write("</table>")
                res.send()

})
})
