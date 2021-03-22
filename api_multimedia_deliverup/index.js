//===== SERVER INITIALISATION =====

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "15MB" }));

const PORT = process.env.PORT;

//===== POST TO SAVE IMAGES =====

// This Post save new user picture when created
app.post("/newUserPicture", (req, res) => {
  let userID = req.body.userId;
  let date = req.body.date;
  let newProfilePicture = userID + date;

  fs.writeFile(
    `./uploads/user/Avatar/${newProfilePicture}.png`,
    req.body.imgsource,
    "base64",
    (err) => {
      if (err) throw err;
    }
  );

  res.status(200);
  res.send({ profilPicture: newProfilePicture });
});

// This Post save a picture modified by user
app.post("/userPicture", (req, res) => {
  const date = new Date().getTime();
  const userID = req.body.userId;
  const newProfilePicture = userID + date;
  const profilePicture = req.body.profilPicture;
  const path = `./uploads/user/Avatar/${profilePicture}.png`;

  if (fs.existsSync(path)) {
    // delete actual user picture
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  fs.writeFile(
    `./uploads/user/Avatar/${newProfilePicture}.png`,
    req.body.imgsource,
    "base64",
    (err) => {
      if (err) throw err;
    }
  );
  res.status(200);
  res.send({ profilPicture: newProfilePicture });
});

// This Post save an ID card picture send by user
app.post("/userIdPicture", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let date = req.body.date;
  let newProfilePicture = firstName + lastName + date;

  fs.writeFile(
    `./uploads/user/ID/${newProfilePicture}.png`,
    req.body.imgsource,
    "base64",
    (err) => {
      if (err) throw err;
    }
  );
  res.status(200);
  res.send({ idCardPicture: newProfilePicture });
});

// ===== GET TO SEND PICTURES =====

// This Get send a user avatar picture on request
app.get("/picture/user/:id", (req, res) => {
  let path = `./uploads/user/Avatar/${req.params.id}.png`;
  let notFound = `./uploads/default/imageNotFound.png`;
  if (fs.existsSync(path)) {
    fs.readFile(path, function (err, data) {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  } else {
    fs.readFile(notFound, function (err, data) {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  }
});

// This Get send a user ID picture to the user profil
app.get("/picture/userID/:id", (req, res) => {
  let path = `./uploads/user/ID/${req.params.id}.png`;
  let notFound = `./uploads/default/imageNotFound.png`;
  if (fs.existsSync(path)) {
    fs.readFile(path, function (err, data) {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  } else {
    fs.readFile(notFound, function (err, data) {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  }
});

/////////////////////////////////////////// MERCHANT ///////////////////////////////////////

/////////////// PROFILE PICTURE ////////////////

// This Post create a picture send by merchant
app.post("/merchantPicture", async (req, res) => {
  const merchantId = req.body.merchantId;
  const previousAvatar = req.body.previousAvatar;
  const path = `./uploads/merchant/Avatar/${previousAvatar}.png`;
  const fileExist = await fs.existsSync(path);
  if (fileExist) {
    try {
      fs.unlinkSync(path);
    } catch (err) {
      console.error(`Unlink error at ${path} : ${err}`);
    }
  }
  const date = new Date().getTime();
  const newAvatar = merchantId + date;
  try {
    fs.writeFile(
      `./uploads/merchant/Avatar/${newAvatar}.png`,
      req.body.imgsource,
      "base64",
      (err) => {
        if (err) throw err;
      }
    );
    res.status(200);
    res.send({
      success: "Successfully uploaded",
      merchantPicture: newAvatar,
    });
  } catch (err) {
    console.error(`WriteFile error at ${path} : ${err}`);
    res.status(200);
    res.send({ error: `WriteFile error at ${path} : ${err}` });
  }
});

// This Get send merchant picture
app.get("/picture/merchant/:id", (req, res) => {
  let path = `./uploads/merchant/Avatar/${req.params.id}.png`;
  let merchantDefault = `./uploads/default/merchantDefault.png`;
  if (fs.existsSync(path)) {
    fs.readFile(path, function (err, data) {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  } else {
    fs.readFile(merchantDefault, function (err, data) {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  }
});

/////////////// ID CARD PICTURE ////////////////

// This Post create an ID card picture send by merchant
app.post("/merchantIdPicture", (req, res) => {
  fs.writeFile(
    `./uploads/merchant/ID/${req.body.userId}.png`,
    req.body.imgsource,
    "base64",
    (err) => {
      if (err) throw err;
    }
  );
  res.status(200);
});

// This Get send a merchant ID card picture
app.get("/picture/merchantID/:id", (req, res) => {
  let path = `./uploads/merchant/ID/${req.params.id}.png`;
  let notFound = `./uploads/default/imageNotFound.png`;
  if (fs.existsSync(path)) {
    fs.readFile(path, function (err, data) {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  } else {
    fs.readFile(notFound, function (err, data) {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  }
});

/////////////// PRODUCT PICTURE ////////////////

// Merchant post new product
app.post("/newMerchantProductPicture", async (req, res) => {
  const merchantId = req.body.merchantId;
  const productId = req.body.productId;
  const date = req.body.date;
  const newProductPicture = productId + date;
  const pathExist = await fs.existsSync(`./uploads/merchant/${merchantId}/`);
  // console.log(pathExist)
  if (pathExist !== true) {
    try {
      await fs.mkdirSync(`./uploads/merchant/${merchantId}/`);
      await fs.mkdirSync(`./uploads/merchant/${merchantId}/products/`);
    } catch (err) {
      console.error(`mkdirSync problem : ${err}`);
    }
  }
  try {
    fs.writeFile(
      `./uploads/merchant/${merchantId}/products/${newProductPicture}.png`,
      req.body.imgsource,
      "base64",
      (err) => {
        if (err) throw err;
      }
    );
  } catch (err) {
    console.error(`Cannot writeFile : ${err}`);
  }

  res.status(200);
  res.send({ productPicture: newProductPicture });
});

// Get merchant product
app.get("/merchant/:id/:idProduct", async (req, res) => {
  const path = `./uploads/merchant/${req.params.id}/products/${req.params.idProduct}.png`;
  const notFound = `./uploads/default/imageNotFound.png`;
  if (await fs.existsSync(path)) {
    try {
      fs.readFile(path, function (err, data) {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(data);
      });
    } catch (err) {
      console.error(`Cannot readFile at ${path} : ${err}`);
    }
  } else {
    fs.readFile(notFound, function (err, data) {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  }
});

// Delete merchant product
app.post("/deleteMerchantProduct/", async (req, res) => {
  const idProduct =
    req.body.idProduct === "" ? "imageNotFound" : req.body.idProduct;
  // console.log(idProduct)
  const path = `./uploads/merchant/${req.body.id}/products/${idProduct}.png`;
  if (await fs.existsSync(path)) {
    try {
      fs.unlinkSync(path);
      res.send({ success: `${req.body.idProduct} successfully deleted` });
    } catch (err) {
      console.error(`Unlink error for ${path} : ${err}`);
      res.send({ error: `Unlink error for ${path} : ${err}` });
    }
  } else {
    res.send({ success: `${idProduct} was already deleted` });
  }
});

app.listen(PORT, () => {
  console.log(`Image storage server has started at : http://localhost:${PORT}`);
});
