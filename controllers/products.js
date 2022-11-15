const Products = require("../models/products");
const ProductValidation = require("../helpers/validation");

// CRUD
// CREATE - POST
const createProduct = async (req, res, next) => {
  try {
    const validBodyReq = await ProductValidation.checkAddProduct.validateAsync(
      req.body
    );
    //let product = new Products(req.body)
    let product = new Products(validBodyReq);
    product.save().then((response) => {
      res.json({
        massage: "Added product successfully",
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      statusCode: 400,
      message: "Bad request.",
      errorMessage: error.details[0].message,
    });
  }
};

//get all products

const getAllProducts = async (req, res, next) => {
  try {
    const {
      pageSize = 12,
      pageNumber = 1,
      totalProducts = "",
      productName = "",
      productBrand = "",
      orderByColumn,
      orderByDirection = "desc",
    } = req.query;
    const filter = {
      $and: [
        {
          productName: {
            $regex: productName,
            $options: "$i",
          },
        },
        {
          productBrand: {
            $regex: productBrand,
            $options: "$i",
          },
        },
      ],
    };
    const filterProduct = await Products.find(filter)
      .sort(`${orderByDirection === "asc" ? "_" : ""}${orderByColumn}`)
      .limit(pageSize * 1)
      .skip((pageNumber - 1) * pageSize);

    const allProducts = await Products.find(filter);

    let totalPage = 0;
    if (allProducts.length % pageSize === 0) {
      totalPage = allProducts.length / pageSize;
    } else {
      totalPage = parseInt(allProducts.length / pageSize) + 1;
    }

    if (Products.length > 0) {
      res.status(200).json({
        totalPage: totalPage,
        totalProducts: allProducts.length,
        products:
          orderByDirection && orderByColumn
            ? filterProduct
            : filterProduct.reverse(),
      });
    } else {
      res.status(200).json({
        message: "no results",
        products: [],
      });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      message: "Bad request",
    });
  }
};
//get by id
const getProductById = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Products.findById(productId);
    if (product) {
      res.status(200).json({
        statusCode: 200,
        product,
      });
    } else {
      res.json({
        statusCode: 204,
        massage: "This  product Id have not in the database",
        products: {},
      });
    }
  } catch (error) {
    console.log("erorr", erorr);
    res.status(400).json({
      message: "Bad request",
    });
  }
};

//delete product by id
const deleteProductById = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Products.findByIdAndRemove(productId);
    if (product) {
      res.status(200).json({
        statusCode: 200,
        massage: "Delete product successfully",
      });
    } else {
      res.json({
        statusCode: 204,
        massage: "This  product Id have not in the database",
      });
    }
  } catch (error) {
    console.log("erorr", erorr);
    res.status(400).json({
      message: "Bad request",
    });
  }
};

const editProduct = async (req, res, next) => {
  const ProductId = await Products.findById(req.params.productId);
  if (!ProductId)
    return res.status(400).json({
      statusCode: 400,
      message: "This product Id have not in the database",
      products: {},
    });
  if (req.body.constructor === Object && Object.keys(req.body).length === 0)
    return res.status(403).json({
      statusCode: 403,
      message: "body equal empty",
    });
  try {
    Products.findByIdAndUpdate(ProductId, req.body).then((data) => {
      if (data) {
        return res.status(200).json({
          statusCode: 200,
          message: "Update successfully",
        });
      } else {
        return res.status(204).json({
          statusCode: 204,
          message: "error",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      statusCode: 400,
      message: "Bad request",
    });
  }
};
const addProduct = async (req, res, next) => {
  try {
    // const { name, brand, price, type, quantity } = req.body;
    // if (!name || !brand || !type || !price || !quantity) {
    //   res.status(400).json({ message: 'Some fields not null' });
    // }
    const result = await addProductSchema.validateAsync(req.body);
    // let product = new Products(req.body);
    let product = new Products(result);
    product.save().then((response) => {
      res.json({
        message: "Added product Successfully!",
      });
    });
  } catch (error) {
    console.log("ERRORS: ", error);
    return res.status(400).json({
      errors: error.details,
    });
  }
};

// READ - GET || POST
// UPDATE - PUT || PATCH
// DELETE - DELETE

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  editProduct,
};
