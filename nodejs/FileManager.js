const fs= require('node:fs')
const {open,readFile,appendFile,readFileSync}= require('node:fs')
const { json } = require('node:stream/consumers')

const FILE_NAME=('db.json')

const createCollection=()=>{
    readFile(FILE_NAME,'utf8',(err,data)=>{
        console.log(data)
        const dataCollection={
            music:[],
            movie:[],
            series:[]

        }
        appendFile(FILE_NAME,JSON.stringify(dataCollection),(err)=>{
            if(err) throw err
            console.log('collection created')
        })
    })
}

exports.createFile=()=>{
    open(FILE_NAME,'wx',(err,fd)=>{

        if(err){
            if(err.code==='Exist'){
                console.log("File Exist")
                return
            }
        }else{
            console.log("Creating File")
            createCollection();
        }
    })
}

exports.getMovies=async()=>{
    const data=readFileSync(FILE_NAME)
    console.log({data})
    const jsonData=JSON.parse(data)
    console.log({jsonData})
    return jsonData.Movies
}