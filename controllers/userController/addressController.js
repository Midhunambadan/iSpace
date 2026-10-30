const User = require("../../models/userModel");
const Address = require("../../models/addressModel");

const insertAddress = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const { name, mobile, houseName, street, city, state, pincode } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return;
    }
    const address = new Address({
      user: userId,
      name: name,
      mobile: mobile,
      houseName: houseName,
      street: street,
      city: city,
      state: state,
      pincode: pincode,
    });

    await address.save();

    res.redirect("/userDashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const loadEditAddress = async (req, res) => {
  try {
    const id = req.query.id;

    const addressData = await Address.find({ _id: id });

    res.render("addressEdit", { address: addressData });
  } catch (error) {}
};

const verifyEditAddress = async (req, res) => {
  try {
    const { name, mobile, houseName, street, city, state, pincode } = req.body;
    const userId = req.session.user_id;
    const id = req.query.id;
    const updatedAddress = await Address.findByIdAndUpdate(
      { _id: id },
      { $set: { name, mobile, houseName, street, city, state, pincode } }
    );

    res.redirect("/userDashboard");
  } catch (error) {}
};

const deleteAddress = async (req, res) => {
  try {
    const id = req.params.id;
    const updateAddress = await Address.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (error) {}
};

module.exports = {
  insertAddress,
  loadEditAddress,
  verifyEditAddress,
  deleteAddress,
};
