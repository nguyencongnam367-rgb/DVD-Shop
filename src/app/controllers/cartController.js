class CartController {
  index(req, res) {
    const cartItems = [
      {
        _id: "1",
        title: "Dune: Part Two",
        type: "DVD • Bản đầy đủ",
        price: 220000,
        quantity: 1,
        color: "linear-gradient(135deg, #dbeafe, #bfdbfe)"
      },
      {
        _id: "2",
        title: "Spider-Man: Across the Spider-Verse",
        type: "DVD • Phim hoạt hình",
        price: 240000,
        quantity: 1,
        color: "linear-gradient(135deg, #fef1d8, #ffd39d)"
      }
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 30000;
    const discount = 50000;
    const total = subtotal + shipping - discount;

    res.render("partials/Cart/cart", {
      cartItems,
      subtotal,
      shipping,
      discount,
      total,
    });
  }

  add(req, res) {
    res.redirect("/cart");
  }
}

module.exports = new CartController();
