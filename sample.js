
let str="?name=midhun&age=24&place:kothamangalam"

// app.listen(3000)

let num=str.slice(1).split('&')

let res=num.map((x)=>{
    return x.split('=')
})

console.log(res);


res.forEach((x)=>{
     obj[x[0]]=x[1]
})


console.log(obj);

