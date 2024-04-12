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

        res.redirect('/userDashboard')

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}


const editAddress=async(req,res)=>{
    try {
        res.render('addressEdit')
    } catch (error) {
        
    }
}




module.exports={
    insertAddress,
    editAddress

}