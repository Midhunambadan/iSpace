
const User=require('../models/userModel')


const isLogin = async (req,res,next) => {
  try {
    if (req.session.user_id) {} 
     else {
      res.redirect('/login')
     
    }
    next()
  } catch (error) {
    console.log(error.message);
  }
}

const isLogout = async (req,res,next) => {
  try {
    if (req.session.user_id) {
      res.redirect("/home");
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};

const userBlockLogout=async(req,res,next)=>{

try {
  // console.log('..........................hiiihhi....---------------------')
  const userId=req.session.user_id
  // console.log('userid-------------------------',userId);

  const user=await User.findById(userId)
  console.log('blockedUder--------------------',user);
  if(user.isActive=='false'){
 console.log('destyoyyyyyyyyyyyyyyyyyyyyy====================');
    req.session.destroy()
  }else{
    next()
  }

} catch (error) {
  console.log('error')
  
}
  
}



module.exports = {
  isLogin,
  isLogout,
  userBlockLogout
};
