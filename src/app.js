const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database.js");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const multer = require("multer");
const path = require("path");

// Route Imports
const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const authRoutes = require("./routes/auth.js");

// Model Imports
const User = require("./models/user.js");
const Product = require("./models/product.js");
const Cart = require("./models/cart.js");
const CartItem = require("./models/cart-item.js");
const Order = require("./models/order.js");
const OrderItem = require("./models/order-item.js");

// Middlewares
const error404 = require("./middlewares/error404.js");
const isAuth = require("./middlewares/is-auth.js");
const { fileStorage, fileFilter } = require("./middlewares/image-upload.js");

// Initialize App
const app = express();

// Parsing Request Bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(path.resolve(), "images")));
app.use(bodyParser.json());

// Initlizing session
const sqlStore = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: "my secret",
    store: sqlStore,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Get Dummy User
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(1)
    .then((user) => {
      req.session.user = user;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

// App Routes
app.use("/auth", authRoutes);
app.use("/shop", shopRoutes);
app.use("/admin", adminRoutes);
app.use("/cart", isAuth, cartRoutes);
app.use("/order", isAuth, orderRoutes);

// Called when no route is matched
app.use(error404);

// Listening to Server
app.listen(3000);

// Association (Relations)
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Order);

Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Cart);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// Logging ORM Output
sequelize
  // .sync({ force: true })
  .sync()
  .catch((err) => {
    console.log(err);
  });
