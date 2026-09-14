class HomeController {
  index(req, res) {
    const products = [
      {
        _id: "1",
        name: "The Dark Knight",
        director: "Christopher Nolan",
        price: 499000,
        image:
          "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80",
      },
      {
        _id: "2",
        name: "Inception",
        director: "Christopher Nolan",
        price: 529000,
        image:
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80",
      },
      {
        _id: "3",
        name: "Interstellar",
        director: "Christopher Nolan",
        price: 599000,
        image:
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&q=80",
      },
      {
        _id: "4",
        name: "Dune",
        director: "Denis Villeneuve",
        price: 569000,
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80",
      },
      {
        _id: "5",
        name: "Blade Runner 2049",
        director: "Denis Villeneuve",
        price: 459000,
        image:
          "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=500&q=80",
      },
      {
        _id: "6",
        name: "The Matrix",
        director: "Lana Wachowski",
        price: 439000,
        image:
          "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80",
      },
    ];

    res.render("home", { products, layout: "main" });
  }
}

module.exports = new HomeController();
