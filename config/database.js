if(process.env.NODE_ENV ==='Production'){
    module.exports ={
        mongoURL:''
    }
}else{
    module.exports ={
        mongoURL:'mongodb://localhost/nodejs1-dev'
    }
}