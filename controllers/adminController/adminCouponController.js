const Coupon = require("../../models/couponModel");

const loadCoupon = async (req, res) => {
  try {
    const couponData = await Coupon.find();
    res.render("couponPage", { coupons: couponData });
  } catch (error) {}
};

const addCoupon = async (req, res) => {
  try {
    const { code, discountpercentage, minimumAmount, validUntil } = req.body;
    console.log("body :", req.body);
    const coupon = new Coupon({
      code: code,
      discountpercentage: discountpercentage,
      minimumAmount: minimumAmount,
      validUntil: validUntil,
    });
    console.log("coupon  :", coupon);

    const couponData = await coupon.save();
    console.log("COupon data :", couponData);

    res.redirect("/admin/load-coupon");
  } catch (error) {}
};

const deleteCoupon = async (req, res) => {
  try {
    const id = req.query.id;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (coupon) {
      return res.status(200).json({ success: true, message: "Coupon Deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An internal error occurred" });
  }
};

// unwanted code coupon block
const couponBlock = async (req, res) => {
  try {
    const id = req.query.id;

    await Coupon.findByIdAndUpdate(id, { is_active: false });
    res.redirect("/admin/load-coupon");
  } catch (error) {}
};

const editCoupon = async (req, res) => {
  try {
    const id = req.query.id;
    const coupon = await Coupon.findById(id);

    if (coupon) {
      req.session.editCouponId = id;

      res.render("editCoupon", { coupon });
    } else {
      res.status(404).send("Coupon not found");
    }
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { code, discountpercentage, minimumAmount, validUntil } = req.body;

    const couponId = req.session.editCouponId;

    const coupon = await Coupon.findByIdAndUpdate(couponId, {
      code: code,
      discountpercentage: discountpercentage,
      minimumAmount: minimumAmount,
      validUntil: validUntil,
    });

    res
      .status(200)
      .json({ success: true, message: "Coupon update successfully!" });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  loadCoupon,
  addCoupon,
  deleteCoupon,
  couponBlock,
  editCoupon,
  updateCoupon,
};
