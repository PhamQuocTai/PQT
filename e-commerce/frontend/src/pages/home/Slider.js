import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { GET_ALL } from "../../api/apiService";
// Import slider images
import slide1 from "../../assets/images/banners/slide1.jpg";
import slide2 from "../../assets/images/banners/slide2.jpg";
import slide3 from "../../assets/images/banners/slide3.jpg";

// Import item images

import item3 from "../../assets/images/items/iphone.png";
import item1 from "../../assets/images/items/iphone1.jpg";
import item2 from "../../assets/images/items/iphone2.jpg";

const Slider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const defaultProducts = [
    { img: item1, categoryName: "Men clothing",categoryId:1 },
    { img: item2, categoryName: "Winter clothing",categoryId:1 },
    { img: item3, categoryName: "Home inventory",categoryId:1 },
  ];
  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 3,
      sortBy: "categoryId",
      sortOrder: "asc",
    };

    GET_ALL("public/categories", params)
      .then((response) => {
        setCategories(response.content);
        console.log(response)
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm đề xuất:", error);
        // Nếu API lỗi, dùng dữ liệu mẫu
        setCategories(defaultProducts);
        setLoading(false);
      });
  }, []);

  return (
    <section className="section-main padding-y">
      <main className="card">
        <div className="card-body">
          <div className="row">
            <aside className="col-lg col-md-3 flex-lg-grow-0">
              <nav className="nav-home-aside">
                <h6 className="title-category">
                  MY MARKETS{" "}
                  <i className="d-md-none icon fa fa-chevron-down"></i>
                </h6>
                <ul className="menu-category">
                  <li>
                    <a href="#">Fashion and clothes</a>
                  </li>
                  <li>
                    <a href="#">Automobile and motors</a>
                  </li>
                  <li>
                    <a href="#">Gardening and agriculture</a>
                  </li>
                  <li>
                    <a href="#">Electronics and tech</a>
                  </li>
                  <li>
                    <a href="#">Packaging and printing</a>
                  </li>
                  <li>
                    <a href="#">Home and kitchen</a>
                  </li>
                  <li>
                    <a href="#">Digital goods</a>
                  </li>
                  <li className="has-submenu">
                    <a href="#">More items</a>
                    <ul className="submenu">
                      <li>
                        <a href="#">Submenu name</a>
                      </li>
                      <li>
                        <a href="#">Great submenu</a>
                      </li>
                      <li>
                        <a href="#">Another menu</a>
                      </li>
                      <li>
                        <a href="#">Some others</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </aside>{" "}
            {/* col.// */}
            <div className="col-md-9 col-xl-7 col-lg-7">
              {/* ================== COMPONENT SLIDER  BOOTSTRAP  ================== */}
              <div
                id="carousel1_indicator"
                className="slider-home-banner carousel slide carousel-fade"
                data-bs-ride="carousel"
              >
                <ol className="carousel-indicators">
                  <li
                    data-bs-target="#carousel1_indicator"
                    data-bs-slide-to="0"
                    className="active"
                  ></li>
                  <li
                    data-bs-target="#carousel1_indicator"
                    data-bs-slide-to="1"
                  ></li>
                  <li
                    data-bs-target="#carousel1_indicator"
                    data-bs-slide-to="2"
                  ></li>
                </ol>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src={slide1}
                      className="d-block w-100"
                      alt="First slide"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src={slide2}
                      className="d-block w-100"
                      alt="Second slide"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src={slide3}
                      className="d-block w-100"
                      alt="Third slide"
                    />
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carousel1_indicator"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carousel1_indicator"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>

              {/* ==================  COMPONENT SLIDER BOOTSTRAP end.// ==================  .// */}
              </div>{" "}
            {/* col.// */}
            <div className="col-md d-none d-lg-block flex-grow-1">
              <aside className="special-home-right">
                <h6 className="bg-blue text-center text-white mb-0 p-2">
                  Popular category
                </h6>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  categories.map((category, index) => (
                    <div className="card-banner border-bottom" key={index}>
                      <div className="py-3" style={{ width: "80%" }}>
                        <h6 className="card-title">{category.categoryName}</h6>
                        <a href={`ListingGrid?categoryId=${category.categoryId}`} className="btn btn-secondary btn-sm">
                          Source now
                        </a>
                      </div>
                      <img
                        src={defaultProducts[index % defaultProducts.length].img} 
                        height="80"
                        className="img-bg"
                        alt={category.categoryName}
                      />
                    </div>
                  ))
                )}
              </aside>
            </div>{" "}
            {/* col.// */}
          </div>{" "}
          {/* row.// */}
        </div>{" "}
        {/* card-body.// */}
      </main>{" "}
      {/* card.// */}
    </section>
  );
};

export default Slider;
