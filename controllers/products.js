// const Products = require("../models/products");

// // CRUD
// //Create - POST
// const createProduct = (req, res, next) => {
//   try {
//     const {
//       productName,
//       productBrand,
//       type,
//       price,
//       quantity,
//       images,
//     } = req.body;

//     if (
//       !productName ||
//       !productBrand ||
//       !type ||
//       !price ||
//       !quantity ||
//       !images
//     ) {
//       res.status(400).json({
//         statusCode: 400,
//         massage: "Some fields are not empty",
//       });
//     }

//     let product = new Products(req.body);

//     product.save().then((response) => {
//       res.json({
//         message: "Added product successfully!",
//       });
//     });
   
//   } catch (error) {
//     console.log(error);
//   }
// };

// //Read - GET || POST
// //Read - Get || PATCH
// //DELETE - DELETE

// module.exports = { createProduct };


const Products = require('../models/products')

// CRUD
// CREATE - POST
const createProduct = (req, res, next) => {
  try {
    const { productName, productBrand, type, price, quantity, images } =
      req.body
    if (
      !productName ||
      !productBrand ||
      !type ||
      !price ||
      !quantity ||
      !images
    ) {
      res.status(400).json({
        statusCode: 400,
        message: 'Some fields are not empty.',
      })
    }
    let product = new Products(req.body)
    product.save().then((response) => {
      res.json({
        message: 'Added product successfully!',
      })
    })
  } catch (error) {
    console.log(error)
  }
}

const addProduct = async (req, res, next) => {
  try {
    // const { name, brand, price, type, quantity } = req.body;
    // if (!name || !brand || !type || !price || !quantity) {
    //   res.status(400).json({ message: 'Some fields not null' });
    // }
    const result = await addProductSchema.validateAsync(req.body)
    // let product = new Products(req.body);
    let product = new Products(result)
    product.save().then((response) => {
      res.json({
        message: 'Added product Successfully!',
      })
    })
  } catch (error) {
    console.log('ERRORS: ', error)
    return res.status(400).json({
      errors: error.details,
    })
  }
}

// READ - GET || POST
// UPDATE - PUT || PATCH
// DELETE - DELETE

module.exports = { createProduct }