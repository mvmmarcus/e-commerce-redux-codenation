import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

import "./product.css";
import { FiArrowLeft, FiX } from "react-icons/fi";

import { Link } from "react-router-dom";
import ImgModal from "../../components/ImgModal";
import SearchProduct from "../../components/SearchProduct";
import CartModal from "../../components/CartModal";
import { useSelector, useDispatch } from "react-redux";
import { cartProductsSelectors } from "../../selectors/cartProducts";
import { addItemToCart } from "../../actions/cartProducts";
import { productsSelectors } from "../../selectors/products";
import { fetchProducts, onSelectSize } from "../../actions/products";
import imageNull from "../../assets/indisponivel.jpg";
import { modalsSelectors } from "../../selectors/modals";
import { modalsActions } from "../../actions/modals";

export default function Product(props) {
  const [showAddCartAlert, setShowAddCartAlert] = useState(false);
  const [showNoSizeSelectedAlert, setShowNoSizeSelectedAlert] = useState(false);

  let [id, setId] = useState(Number);

  const cartProducts = useSelector(cartProductsSelectors.getCartProducts);
  const products = useSelector(productsSelectors.getProducts);
  let selectedSize = useSelector(productsSelectors.getSelectedSize);
  const cartCounter = useSelector(cartProductsSelectors.getCartCounter);
  const showCart = useSelector(modalsSelectors.getCartModalState);
  const showSearch = useSelector(modalsSelectors.getSearchModalState);
  const showImg = useSelector(modalsSelectors.getImgModalState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(onSelectSize(""));
    setId(parseInt(props.match.params.id));
  }, [dispatch, props.match.params.id]);

  const handleAddProductToCart = (product, size) => {
    if (size === "") {
      return setShowNoSizeSelectedAlert(true);
    }
    dispatch(addItemToCart(product, size));
    setShowAddCartAlert(true);
  };

  const handleSelectSize = (size) => {
    setShowAddCartAlert(false);
    setShowNoSizeSelectedAlert(false);
    dispatch(onSelectSize(size));
    let sizes = document.querySelectorAll(".btn-sizes");
    for (let value of sizes) {
      if (value.classList.contains("btn-sizes--selected"))
        value.classList.remove("btn-sizes--selected");
      if (value.innerHTML === size) value.classList.add("btn-sizes--selected");
    }
  };
  return (
    <>
      <div className="container">
        <Header cartProductsCounter={cartCounter} />
        {showCart && (
          <CartModal cartProducts={cartProducts} showCart={showCart} />
        )}
        {showSearch && (
          <SearchProduct products={products} showSearch={showSearch} />
        )}

        {showImg && (
          <>
            {products.map((item) => {
              if (item.id === id) {
                return (
                  <ImgModal key={item.id} img={item.image} showImg={showImg} />
                );
              }
              return null;
            })}
          </>
        )}
        {products.map((item) => {
          if (item.id === id) {
            return (
              <div key={item.id} className="product">
                <figure
                  onClick={() => dispatch(modalsActions.handleShowImg())}
                  className="product__poster"
                >
                  {!item.image ? (
                    <img className="product__img" src={imageNull} alt="Null" />
                  ) : (
                    <img
                      className="product__img product__img--null"
                      id="myImage"
                      src={item.image}
                      alt="Product"
                    />
                  )}
                </figure>
                <section className="product__description">
                  <strong className="product__name">{item.name}</strong>
                  <span className="product__price">{item.actual_price}</span>
                  <span className="product__price product__price--parcel">
                    Em até {item.installments}
                  </span>
                  <div className="product__size">
                    {item.sizes.map((size) => {
                      return (
                        size.available && (
                          <button
                            key={size.sku}
                            onClick={() => handleSelectSize(size.size)}
                            className="btn-sizes btn-sizes--normal"
                          >
                            {size.size}
                          </button>
                        )
                      );
                    })}
                  </div>
                  {showAddCartAlert && (
                    <div className="alert alert--sucess">
                      <FiX
                        className="icon icon--close-alert"
                        onClick={() => setShowAddCartAlert(false)}
                      />
                      Produto adicionado !
                    </div>
                  )}
                  {showNoSizeSelectedAlert && (
                    <div className="alert alert--danger">
                      <FiX
                        className="icon icon--close-alert"
                        onClick={() => setShowNoSizeSelectedAlert(false)}
                      />
                      Selecione um tamanho !
                    </div>
                  )}
                  <button
                    className="btn btn--bag"
                    onClick={() => handleAddProductToCart(item, selectedSize)}
                  >
                    Adicionar ao carrinho
                  </button>
                  <Link className="link link--back" to="/">
                    <FiArrowLeft className="icon icon--back" />
                    Voltar para home
                  </Link>
                </section>
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
}

/**
 * 
 * import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

import "./product.css";
import { FiArrowLeft } from "react-icons/fi";

import { Link } from "react-router-dom";
import ImgModal from "../../components/ImgModal";
import SearchProduct from "../../components/SearchProduct";
import CartModal from "../../components/CartModal";
import { useSelector, useDispatch } from "react-redux";
import { cartProductsSelectors } from "../../selectors/cartProducts";
import { actions } from "../../actions/cartProducts";
import { productsSelectors } from "../../selectors/products";
import { fetchProducts, onSelectSize } from "../../actions/products";
import imageNull from "../../assets/indisponivel.jpg";

export default function Product(props) {
  const [showImg, setShowImg] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  let [id, setId] = useState(Number);

  const showIMGModal = () => setShowImg(true);
  const hideimgModal = () => setShowImg(false);

  const showCartModal = () => setShowCart(true);
  const hideCartModal = () => setShowCart(false);

  const showSearchModal = () => setShowSearch(true);
  const hideSearchModal = () => setShowSearch(false);

  const cartProducts = useSelector(cartProductsSelectors.getCartProducts);
  const products = useSelector(productsSelectors.getProducts);
  let selectedSize = useSelector(productsSelectors.getSelectedSize);
  const cartCounter = useSelector(cartProductsSelectors.getCartCounter);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    setId(parseInt(props.match.params.id));
  }, [dispatch, props.match.params.id]);

  const handleAddProductToCart = (product, size) => {
    if (size === "") {
      return alert("Selecione um tamanho válido !");
    }
    dispatch(actions.addItemToCart(product, size));
  };

  const handleSelectSize = (size) => {
    dispatch(onSelectSize(size));
    let sizes = document.querySelectorAll(".btn-sizes");
    for (let value of sizes) {
      if (value.classList.contains("btn-sizes--selected"))
        value.classList.remove("btn-sizes--selected");
      if (value.innerHTML === size) value.classList.add("btn-sizes--selected");
    }
  };
  return (
    <>
      <div className="container">
        <Header
          cartProductsCounter={cartCounter}
          handleBagIcon={showCartModal}
          handleSearchIcon={showSearchModal}
        />
        {showCart && (
          <CartModal
            cartProducts={cartProducts}
            handleShow={showCartModal}
            handleClose={hideCartModal}
          />
        )}
        {showSearch && (
          <SearchProduct
            handleShow={showSearchModal}
            handleClose={hideSearchModal}
          />
        )}

        {showImg && (
          <>
            {products.map((item) => {
              if (item.id === id) {
                return (
                  <ImgModal
                    key={item.id}
                    img={item.image}
                    handleShow={showImg}
                    handleClose={hideimgModal}
                  />
                );
              }
              return null;
            })}
          </>
        )}
        {products.map((item) => {
          if (item.id === id) {
            return (
              <div key={item.id} className="product">
                <figure className="product__poster">
                  {!item.image ? (
                    <img className="product__img" src={imageNull} alt="Null" />
                  ) : (
                    <img
                      className="product__img product__img--null"
                      onClick={showIMGModal}
                      id="myImage"
                      src={item.image}
                      alt="Product"
                    />
                  )}
                </figure>
                <section className="product__description">
                  <strong className="product__name">{item.name}</strong>
                  <span className="product__price">{item.actual_price}</span>
                  <span className="product__price product__price--parcel">
                    Em até {item.installments}
                  </span>
                  <div className="product__size">
                    {item.sizes.map((size) => {
                      return (
                        size.available && (
                          <button
                            key={size.sku}
                            onClick={() => handleSelectSize(size.size)}
                            className="btn-sizes btn-sizes--normal"
                          >
                            {size.size}
                          </button>
                        )
                      );
                    })}
                  </div>
                  <button
                    className="btn btn--bag"
                    onClick={() => handleAddProductToCart(item, selectedSize)}
                  >
                    Adicionar ao carrinho
                  </button>
                  <Link className="link link--back" to="/">
                    <FiArrowLeft className="icon icon--back" />
                    Voltar para home
                  </Link>
                </section>
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
}

 */
