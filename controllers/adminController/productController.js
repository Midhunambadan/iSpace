const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const sharp = require("sharp");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// ==================================================================================================================

const loadaddProduct = async (req, res) => {
  try {
    const cateData = await Category.find();
    res.render("addProduct", { category: cateData });
  } catch (error) {}
};

// ---------------------------------------------------------------------------------------------------------------------------------
const loadProduct = async (req, res) => {
  try {
    let limit = 10;

    let page = 1;
    if (req.query.page) {
      page = req.query.page;
    }

    const productData = await Product.find()
      .sort({ listedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.find()
      .sort({ listedDate: -1 })
      .countDocuments();

    res.render("productPage", {
      products: productData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================
const insertProduct = async (req, res) => {
  try {
    const productImg = req.productImg || [];

    const product_name = req.body.pname;
    const discription = req.body.pdescription;
    const MRP = req.body.mrp;
    const category = req.body.category;
    const discount = req.body.discount;
    const stock = req.body.stock;

    const imageUrls = [];
    for (const file of req.files) {
      const filename = `${uuidv4()}.jpg`;

      await sharp(file.path)
        .resize({ width: 1000, height: 1000 })
        .toFile(`public/productImage/${filename}`);

      const imageUrl = `public/productImage/${filename}`;
      imageUrls.push(filename);

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
        } else {
        }
      });
    }

    const productData = new Product({
      product_name: product_name,
      discription: discription,
      MRP: MRP,
      productImages: imageUrls,
      categoryId: category,
      discount: discount,
      stock: stock,
    });

    const products = await productData.save();

    res.render("addProduct", { proData: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add product" });
  }
};

// ==================================================================================================================

const loadeditProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const proData = await Product.findById({ _id: id }).populate("categoryId");
    const cateData = await Category.find();

    req.session.editProductId = req.query.id;

    if (proData) {
      res.render("editProduct", { products: proData, category: cateData });
    } else {
      res.send("inavalid");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

const updateProduct = async (req, res) => {
  try {
    const productId = req.session.editProductId;

    const { pname, pdescription, mrp, category, discount, stock } = req.body;

    const imageUrls = [];
    for (const file of req.files) {
      const filename = `${uuidv4()}.jpg`;

      await sharp(file.path)
        .resize({ width: 1000, height: 1000 })
        .toFile(`public/productImage/${filename}`);

      const imageUrl = `public/productImage/${filename}`;
      imageUrls.push(filename);

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
        } else {
        }
      });
    }
    const findProduct = await Product.findById(productId);
    findProduct.product_name = pname;
    findProduct.discription = pdescription;
    findProduct.MRP = mrp;
    findProduct.categoryId = category;
    findProduct.discount = discount;
    findProduct.stock = stock;

    if (req.files && req.files.length) {
      findProduct.productImages = imageUrls;
    }

    await findProduct.save();

    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

const deleteProduct = async (req, res) => {
  try {
    const id = req.query.id;
    await Product.deleteOne({ _id: id });

    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

const blockProduct = async (req, res) => {
  try {
    const proId = req.query.id;
    const updateProduct = await Product.findByIdAndUpdate(proId, {
      isActive: false,
    });
    res.redirect("/admin/products");
  } catch (error) {}
};

const UnBlockProduct = async (req, res) => {
  try {
    const proId = req.query.id;

    const updateCategory = await Product.findByIdAndUpdate(proId, {
      isActive: true,
    });
    res.redirect("/admin/products");
  } catch (error) {}
};

module.exports = {
  loadProduct,
  loadaddProduct,
  insertProduct,
  loadeditProduct,
  updateProduct,
  deleteProduct,
  blockProduct,
  UnBlockProduct,
};
