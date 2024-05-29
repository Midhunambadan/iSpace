// const Address=require('../models/addressModel')
const User=require('../models/userModel')
const Address = require('../models/addressModel');


const insertAddress = async (req, res) => {
    try {
        console.log('----------------------------------------insert address controller');

        const userId = req.session.user_id
        console.log('----------------------',userId)
        const { name, mobile, houseName, street, city, state, pincode } = req.body;
        const user = await User.findById(userId)

        if(!user){
            console.log("User Not found")
            return
        }
        const address = new Address({
            user: userId, 
            name: name,
            mobile: mobile,
            houseName: houseName,
            street: street,
            city: city,
            state: state,
            pincode: pincode
        });

        // Save the address to the database
        await address.save();

        // res.redirect('/checkout')
        res.redirect('/userDashboard')

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}


const loadEditAddress=async(req,res)=>{
    try {
        const id =req.query.id

        const addressData=await Address.find({_id:id})

        console.log('--------------------jfsafdj',addressData);
        res.render('addressEdit',{address:addressData})
    } catch (error) {
        
    }
}

// try {
//     const { name, mobile, houseName, city, state, pinCode } = req.body;
//     const userId = req.session.user;
//     const updated = await Address.findByIdAndUpdate({ _id: req.query.id }, { $set: { name, mobile, houseName, city, state, pinCode } });
//     res.redirect('/loadCheckOut');
// } catch (error) {
//     console.error(error);
// }


const verifyEditAddress=async(req,res)=>{
    try {

        const { name, mobile, houseName, street, city, state, pincode } = req.body;
    const userId = req.session.user_id;
    const id =req.query.id
    const updatedAddress=await Address.findByIdAndUpdate({_id:id},{$set:{name, mobile, houseName, street, city, state, pincode}})

    res.redirect("/userDashboard")
        // res.render('addressEdit',{address:addressData})
    } catch (error) {
        
    }
}


const deleteAddress=async(req,res)=>{
    try {
        
        const id =req.params.id
        console.log('--------------------id',id);
      const updateAddress=  await Address.findByIdAndDelete(id);

      
        res.json({success : true})
     
        // res.redirect('/userDashboard')
    } catch (error) {
        
    }
}



module.exports={
    insertAddress,
    loadEditAddress,
    verifyEditAddress,
    deleteAddress

}