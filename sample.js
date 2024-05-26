
// let str="?name=midhun&age=24&place:kothamangalam"

// // app.listen(3000)

// let num=str.slice(1).split('&')

// let res=num.map((x)=>{
//     return x.split('=')
// })

// console.log(res);


// res.forEach((x)=>{
//      obj[x[0]]=x[1]
// })


// console.log(obj);



// let nums1=[1,2,1,2,3,4,5,6]
// let nums2=[4,5,6,5,4,4]
// let nums3=[5,4,3,3,22]

let nums1 = [1,1,3,2]
 let nums2 = [2,3]
  let nums3 = [3]

  let arr1 = nums1.filter(x => nums2.includes(x)); // Elements from nums1 that are in nums2
  let arr2 = nums1.filter(x => nums3.includes(x)); // Elements from nums1 that are in nums3
  let arr3 = nums2.filter(x => nums3.includes(x)); // Elements from nums2 that are in nums3
  let res = new Set([...arr1, ...arr2, ...arr3]);
  

    console.log('result:-',res);