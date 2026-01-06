const { CartItem, Cart, Product, Order, OrderItem } = require("../models");
const { v4: uuidv4 } = require("uuid");

const Payment = require("../models/payment"); // Fixed: was ../models/Payment



// Checkout keranjang
// exports.checkout = async (req, res) => {
//   const t = await Cart.sequelize.transaction();
//   try {
//     const user_id = req.user.id;
//     const user_email = req.user.email;
//     const { cart_item_ids, payment_method } = req.body;

//     if (!cart_item_ids || cart_item_ids.length === 0) {
//       return res.status(400).json({ message: "Tidak ada item yang dipilih" });
//     }

//     // Cari cart user
//     const cart = await Cart.findOne({ where: { user_id } });
//     if (!cart) {
//       return res.status(404).json({ message: "Keranjang tidak ditemukan" });
//     }

//     // Ambil cart item
//     const cartItems = await CartItem.findAll({
//       where: { id: cart_item_ids, cart_id: cart.id },
//       include: [Product],
//       transaction: t,
//       lock: t.LOCK.UPDATE,
//     });

//     if (cartItems.length === 0) {
//       return res.status(404).json({ message: "Item tidak ditemukan di keranjang" });
//     }

//     let totalPrice = 0;
//     for (const item of cartItems) {
//       const product = await Product.findByPk(item.Product.id, {
//         transaction: t,
//         lock: t.LOCK.UPDATE, // lock stok produk
//       });

//       if (!product) throw new Error("Produk tidak ditemukan");
//       if (item.quantity > product.stock) {
//         throw new Error(`Stok produk ${product.name} tidak cukup`);
//       }

//       totalPrice += item.quantity * product.price;
//     }

//     // Buat order
//     const order = await Order.create(
//       {
//         user_id,
//         status: "pending", // status awal
//         total_price: totalPrice,
//         payment_method,
//       },
//       { transaction: t }
//     );

//     // Buat order item + update stok
//     for (const item of cartItems) {
//       await OrderItem.create(
//         {
//           order_id: order.id,
//           product_id: item.Product.id,
//           quantity: item.quantity,
//           price: item.Product.price,
//         },
//         { transaction: t }
//       );

//       // Kurangi stok
//       item.Product.stock -= item.quantity;
//       await item.Product.save({ transaction: t });
//     }

//     // Buat invoice Xendit
//     const invoice = await Invoice.createInvoice({
//       data: {
//         externalId: `ORDER-${order.id}-${uuidv4()}`,
//         amount: totalPrice,
//         payerEmail: user_email || "customer@email.com",
//         description: `Pembayaran Order #${order.id}`,
//         // successRedirectUrl: "https://yourdomain.com/payment/success",
//         // failureRedirectUrl: "https://yourdomain.com/payment/failed",
//       },
//     });

//     // Simpan ke tabel Payment untuk dipakai webhook
//     await Payment.create(
//       {
//         order_id: order.id,
//         transaction_id: invoice.id,
//         amount: totalPrice,
//         status: "pending",
//         // method: payment_method,
//       },
//       { transaction: t }
//     );

//     // Simpan invoice id ke order
//     order.payment_invoice_id = invoice.id;
//     await order.save({ transaction: t });

//     // Hapus item dari keranjang (setelah semua sukses)
//     for (const item of cartItems) {
//       await item.destroy({ transaction: t });
//     }

//     await t.commit();

//     res.json({
//       message: "Checkout berhasil",
//       order,
//       invoice_url: invoice.invoiceUrl,
//       raw_invoice: invoice,
//     });
//   } catch (error) {
//     await t.rollback();
//     console.error("❌ Gagal checkout:", error);
//     res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
//   }
// };

exports.checkout = async (req, res) => {
  const t = await Cart.sequelize.transaction();
  try {
    const user_id = req.user.id;
    const user_email = req.user.email;
    const { cart_item_ids, payment_method, shipping_cost, shipping_detail } = req.body;

    if (!cart_item_ids || cart_item_ids.length === 0) {
      return res.status(400).json({ message: "Tidak ada item yang dipilih" });
    }

    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) return res.status(404).json({ message: "Keranjang tidak ditemukan" });

    const cartItems = await CartItem.findAll({
      where: { id: cart_item_ids, cart_id: cart.id },
      include: [Product],
      transaction: t,
      lock: true, // lock row
    });

    if (cartItems.length === 0) return res.status(404).json({ message: "Item tidak ditemukan di keranjang" });

    let totalPrice = 0;
    for (const item of cartItems) {
      if (item.quantity > item.Product.stock) {
        throw new Error(`Stok produk ${item.Product.name} tidak cukup`);
      }
      totalPrice += item.quantity * item.Product.price;
    }

    // Ongkir dari frontend atau default 0 (manual)
    let shippingCost = 0;
    let shippingDetail = null;
    if (shipping_cost && shipping_detail) {
      shippingCost = Number(shipping_cost);
      shippingDetail = shipping_detail;
    }


    // Buat order
    const order = await Order.create({
      user_id,
      status: "pending",
      total_price: totalPrice + shippingCost,
      payment_method,
      shipping_cost: shippingCost,
    }, { transaction: t });

    // Buat order item + update stok
    for (const item of cartItems) {
      await OrderItem.create(
        {
          order_id: order.id,
          product_id: item.Product.id,
          quantity: item.quantity,
          price: item.Product.price,
        },
        { transaction: t }
      );

      // Kurangi stok
      item.Product.stock -= item.quantity;
      await item.Product.save({ transaction: t });
    }

    // Hapus item dari keranjang
    await CartItem.destroy({
      where: { id: cart_item_ids, cart_id: cart.id },
      transaction: t,
    });

    await t.commit();

    // --- XENDIT CODE REMOVED FOR WHATSAPP MANUAL FLOW ---

    // Simpan ke tabel Payment (Manual)
    await Payment.create({
      order_id: order.id,
      transaction_id: `MANUAL-${uuidv4()}`,
      amount: totalPrice + shippingCost,
      status: "pending",
      method: payment_method || "whatsapp",
    });

    // --- Fonnte Notification Removed ---
    // User will manually chat admin from frontend

    res.json({
      message: "Checkout berhasil",
      order,
      invoice_url: null,
      shipping_cost: shippingCost,
      shipping_detail: shippingDetail,
    });
  } catch (error) {
    await t.rollback();
    console.error("❌ Gagal checkout:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};


// Ambil keranjang user beserta itemnya
exports.getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Cari cart user
    let cart = await Cart.findOne({
      where: { user_id },
      include: {
        model: CartItem,
        include: [
          {
            model: Product,
            include: ['ProductImages'] // ✅ Include gambar produk
          }
        ],
      },
    });

    // Kalau belum ada cart, buat baru
    if (!cart) {
      cart = await Cart.create({ user_id });
    }

    res.json({ cart });
  } catch (error) {
    console.error("❌ Gagal mengambil keranjang:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.addItem = async (req, res) => {
  const t = await Cart.sequelize.transaction();
  try {
    const user_id = req.user.id;
    const { product_id, quantity, color_id, storage_id } = req.body;

    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Product dan quantity harus diisi" });
    }

    // PERBAIKAN: Hapus validasi ketat untuk color_id dan storage_id
    // Karena tidak semua produk punya varian warna/storage
    // Frontend sudah mengirim null jika tidak ada varian

    let cart = await Cart.findOne({ where: { user_id }, transaction: t });
    if (!cart) cart = await Cart.create({ user_id }, { transaction: t });

    const product = await Product.findByPk(product_id, { transaction: t });
    if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });

    // Temukan atau buat CartItem berdasarkan kombinasi unik (produk + warna + storage)
    const [cartItem, created] = await CartItem.findOrCreate({
      where: {
        cart_id: cart.id,
        product_id,
        color_id: color_id || null,
        storage_id: storage_id || null
      },
      defaults: { quantity, price: product.price },
      transaction: t,
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save({ transaction: t });
    }

    await t.commit();
    res.status(201).json({
      message: created ? "Item baru ditambahkan" : "Item diperbarui",
      cartItem
    });

  } catch (error) {
    await t.rollback();
    console.error("❌ Gagal menambahkan item:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};




// Update quantity item
exports.updateItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity harus >= 1" });
    }

    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) return res.status(404).json({ message: "Keranjang tidak ditemukan" });

    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, cart_id: cart.id },
    });

    if (!cartItem) return res.status(404).json({ message: "Item tidak ditemukan di keranjang" });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({ message: "Item berhasil diperbarui", cartItem });
  } catch (error) {
    console.error("❌ Gagal update item:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Hapus item dari keranjang
exports.removeItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { cartItemId } = req.params;

    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) return res.status(404).json({ message: "Keranjang tidak ditemukan" });

    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, cart_id: cart.id },
    });

    if (!cartItem) return res.status(404).json({ message: "Item tidak ditemukan di keranjang" });

    await cartItem.destroy();
    res.json({ message: "Item berhasil dihapus" });
  } catch (error) {
    console.error("❌ Gagal hapus item:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
