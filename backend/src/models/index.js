const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const User = require("./user");
const Category = require("./category");
const Product = require("./product");
const ProductImage = require("./productImage");
const Order = require("./order");
const OrderItem = require("./orderItem"); // Fixed: was ./OrderItem
const Payment = require("./payment"); // Fixed: was ./Payment
const Technician = require("./technician");
const Booking = require("./booking");
const BookingPayment = require("./bookingPayment");
const ServiceType = require("./serviceType");
const Cart = require("./cart");
const CartItem = require("./cartItem");
const Otp = require("./otp");
const Device = require("./device");
const Blog = require("./blog");
const BlogContent = require("./blogContent");
const Tag = require("./tag");
const ProductTag = require("./productTag");
const Color = require("./color");
const Storage = require("./storage");
const ProductColor = require("./productColor");
const Wishlist = require("./wishlist"); // Fixed: was ./Wishlist
const ProductReview = require("./productReview"); // Fixed: was ./ProductReview
const ProductStorage = require("./productStorage");
const ProductVariant = require("./productVariant");
const TradeInTemplate = require("./tradeInTemplate");
const TradeInPhone = require("./tradeInPhone");


Product.belongsToMany(Tag, { through: ProductTag, foreignKey: "productId", as: "tags" });
Tag.belongsToMany(Product, { through: ProductTag, foreignKey: "tagId", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Product, { foreignKey: "category_id" });

Product.hasMany(ProductImage, { foreignKey: "product_id", onDelete: "CASCADE" });
ProductImage.belongsTo(Product, { foreignKey: "product_id" });

Product.belongsToMany(Color, { through: ProductColor, foreignKey: "productId", as: "colors" });
Color.belongsToMany(Product, { through: ProductColor, foreignKey: "colorId", as: "products" });

Product.belongsToMany(Storage, { through: ProductStorage, foreignKey: "productId", as: "storages" });
Storage.belongsToMany(Product, { through: ProductStorage, foreignKey: "storageId", as: "products" });

// Product Variants relations
Product.hasMany(ProductVariant, { foreignKey: "product_id", as: "variants", onDelete: "CASCADE" });
ProductVariant.belongsTo(Product, { foreignKey: "product_id" });
ProductVariant.belongsTo(Color, { foreignKey: "color_id" });
ProductVariant.belongsTo(Storage, { foreignKey: "storage_id" });

// CartItem to ProductVariant relation
CartItem.belongsTo(ProductVariant, { foreignKey: "variant_id" });
ProductVariant.hasMany(CartItem, { foreignKey: "variant_id" });

// OrderItem to ProductVariant relation
OrderItem.belongsTo(ProductVariant, { foreignKey: "variant_id" });
ProductVariant.hasMany(OrderItem, { foreignKey: "variant_id" });


// Wishlist relations
Wishlist.belongsTo(User, { foreignKey: 'user_id' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id' });
User.hasMany(Wishlist, { foreignKey: 'user_id' });
Product.hasMany(Wishlist, { foreignKey: 'product_id' });

const models = {
  User, Category, Product, ProductImage, Order, OrderItem,
  Payment, Technician, Booking, BookingPayment, ServiceType,
  Cart, CartItem, Otp, Device, Blog, BlogContent, Tag, ProductTag, Color, Storage,
  ProductColor, ProductStorage, Wishlist, ProductReview, ProductVariant,
  TradeInTemplate, TradeInPhone
};


Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Trade-In Template relations
TradeInPhone.belongsTo(TradeInTemplate, { foreignKey: 'template_id', as: 'template' });
TradeInTemplate.hasMany(TradeInPhone, { foreignKey: 'template_id', as: 'phones' });


(async () => {
  try {
    // 🔥 TEMPORARY: Disable sync karena error "Too many keys"
    // await sequelize.sync({ alter: true });
    console.log("Database connection ready (sync disabled)");
  } catch (error) {
    console.error("Database sync error:", error);
  }
})();

module.exports = { ...models, sequelize, DataTypes };