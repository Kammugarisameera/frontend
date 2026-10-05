import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import ProductCard from "../components/productCard";

import SearchBar from "../components/SearchBar";
import ProductFilters from "../components/ProductFilters";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";


const API_URL =
  "http://localhost:5000";


const PRODUCTS_PER_PAGE = 8;


function Products() {

  // ==============================
  // PRODUCT DATA
  // ==============================

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);


  // ==============================
  // LOADING / ERROR
  // ==============================

  const [loading, setLoading] =
    useState(true);

  const [categoryLoading, setCategoryLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [categoryError, setCategoryError] =
    useState("");


  // ==============================
  // SEARCH
  // ==============================

  const [searchText, setSearchText] =
    useState("");


  // ==============================
  // FILTERS
  // ==============================

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");


  // ==============================
  // SORT
  // ==============================

  const [sortBy, setSortBy] =
    useState("");


  // ==============================
  // PAGINATION
  // ==============================

  const [currentPage, setCurrentPage] =
    useState(1);


  // ==================================================
  // FETCH PRODUCTS
  // ==================================================

  const fetchProducts = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_URL}/products`
        );


      const contentType =
        response.headers.get(
          "content-type"
        ) || "";


      const data =
        contentType.includes(
          "application/json"
        )
          ? await response.json()
          : {};


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load products"
        );

      }


      const productList =
        data.products ||
        data.data ||
        data;


      setProducts(
        Array.isArray(productList)
          ? productList
          : []
      );

    } catch (error) {

      setError(
        error.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };


  // ==================================================
  // FETCH CATEGORIES
  // ==================================================

  const fetchCategories = async () => {

    try {

      setCategoryLoading(true);
      setCategoryError("");

      const response =
        await fetch(
          `${API_URL}/category`
        );


      const contentType =
        response.headers.get(
          "content-type"
        ) || "";


      const data =
        contentType.includes(
          "application/json"
        )
          ? await response.json()
          : {};


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load categories"
        );

      }


      const categoryList =
        data.categories ||
        data.data ||
        data;


      setCategories(
        Array.isArray(categoryList)
          ? categoryList
          : []
      );

    } catch (error) {

      setCategoryError(
        error.message ||
        "Unable to load categories"
      );

    } finally {

      setCategoryLoading(false);

    }
  };


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {

    fetchProducts();
    fetchCategories();

  }, []);


  // ==================================================
  // FILTER + SEARCH + SORT
  // ==================================================

  const processedProducts =
    useMemo(() => {

      let result =
        [...products];


      // ==============================
      // SEARCH
      // ==============================

      const search =
        searchText
          .trim()
          .toLowerCase();


      if (search) {

        result =
          result.filter(
            (product) => {

              const name =
                String(
                  product.name || ""
                ).toLowerCase();


              const description =
                String(
                  product.description ||
                  ""
                ).toLowerCase();


              return (
                name.includes(search) ||
                description.includes(search)
              );

            }
          );

      }


      // ==============================
      // CATEGORY
      // ==============================

      if (selectedCategory) {

        result =
          result.filter(
            (product) => {

              const productCategory =
                product.categoryId;


              const productCategoryId =
                typeof productCategory ===
                "object"
                  ? productCategory?._id
                  : productCategory;


              return (
                String(
                  productCategoryId || ""
                ) ===
                String(
                  selectedCategory
                )
              );

            }
          );

      }


      // ==============================
      // MIN PRICE
      // ==============================

      if (minPrice !== "") {

        const minimum =
          Number(minPrice);


        result =
          result.filter(
            (product) =>
              Number(product.price) >=
              minimum
          );

      }


      // ==============================
      // MAX PRICE
      // ==============================

      if (maxPrice !== "") {

        const maximum =
          Number(maxPrice);


        result =
          result.filter(
            (product) =>
              Number(product.price) <=
              maximum
          );

      }


      // ==============================
      // SORT
      // ==============================

      switch (sortBy) {

        case "price-low":

          result.sort(
            (a, b) =>
              Number(a.price) -
              Number(b.price)
          );

          break;


        case "price-high":

          result.sort(
            (a, b) =>
              Number(b.price) -
              Number(a.price)
          );

          break;


        case "name-a-z":

          result.sort(
            (a, b) =>
              String(a.name || "")
                .localeCompare(
                  String(b.name || "")
                )
          );

          break;


        case "name-z-a":

          result.sort(
            (a, b) =>
              String(b.name || "")
                .localeCompare(
                  String(a.name || "")
                )
          );

          break;


        default:

          break;

      }


      return result;

    }, [
      products,
      searchText,
      selectedCategory,
      minPrice,
      maxPrice,
      sortBy
    ]);


  // ==================================================
  // RESET PAGE WHEN SEARCH/FILTER/SORT CHANGES
  // ==================================================

  useEffect(() => {

    setCurrentPage(1);

  }, [
    searchText,
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy
  ]);


  // ==================================================
  // PAGINATION CALCULATION
  // ==================================================

  const totalProducts =
    processedProducts.length;


  const totalPages =
    Math.ceil(
      totalProducts /
      PRODUCTS_PER_PAGE
    );


  const startIndex =
    (currentPage - 1) *
    PRODUCTS_PER_PAGE;


  const endIndex =
    startIndex +
    PRODUCTS_PER_PAGE;


  const currentProducts =
    processedProducts.slice(
      startIndex,
      endIndex
    );


  // ==================================================
  // CLEAR ALL
  // ==================================================

  const handleClearFilters = () => {

    setSearchText("");

    setSelectedCategory("");

    setMinPrice("");

    setMaxPrice("");

    setSortBy("");

    setCurrentPage(1);

  };


  // ==================================================
  // RESULT RANGE
  // ==================================================

  const firstResult =
    totalProducts === 0
      ? 0
      : startIndex + 1;


  const lastResult =
    Math.min(
      endIndex,
      totalProducts
    );


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div className="products-page">


      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="products-header">

        <div>

          <span className="section-label">
            OUR STORE
          </span>

          <h1>
            All Products
          </h1>

          <p>
            Discover products you love at
            great prices.
          </p>

        </div>


        <div className="product-count">

          {totalProducts}{" "}
          {totalProducts === 1
            ? "Product"
            : "Products"}

        </div>

      </div>


      {/* =========================================
          SEARCH
      ========================================= */}

      {!loading && !error && (

        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
        />

      )}


      {/* =========================================
          FILTERS
      ========================================= */}

      {!loading && !error && (

        <ProductFilters

          categories={categories}

          selectedCategory={
            selectedCategory
          }

          setSelectedCategory={
            setSelectedCategory
          }

          minPrice={minPrice}

          setMinPrice={setMinPrice}

          maxPrice={maxPrice}

          setMaxPrice={setMaxPrice}

          sortBy={sortBy}

          setSortBy={setSortBy}

          onClear={
            handleClearFilters
          }

        />

      )}


      {/* =========================================
          CATEGORY ERROR
      ========================================= */}

      {!loading &&
        categoryError && (

          <div className="filter-warning">

            <span>
              ⚠️
            </span>

            <p>
              Category filter is
              unavailable:
              {" "}
              {categoryError}
            </p>

          </div>

        )}


      {/* =========================================
          LOADING
      ========================================= */}

      {loading && (

        <Loading
          message="Loading products..."
        />

      )}


      {/* =========================================
          PRODUCT API ERROR
      ========================================= */}

      {!loading &&
        error && (

          <ErrorMessage
            message={error}
            onRetry={fetchProducts}
          />

        )}


      {/* =========================================
          EMPTY STATE
      ========================================= */}

      {!loading &&
        !error &&
        totalProducts === 0 && (

          <div className="empty-state">

            <div className="empty-state-icon">
              🔍
            </div>

            <h2>
              No Products Found
            </h2>

            <p>
              We couldn't find any products
              matching your search or filters.
            </p>

            <button
              type="button"
              className="empty-clear-btn"
              onClick={
                handleClearFilters
              }
            >
              Clear Search & Filters
            </button>

          </div>

        )}


      {/* =========================================
          RESULT INFORMATION
      ========================================= */}

      {!loading &&
        !error &&
        totalProducts > 0 && (

          <div className="result-info">

            <span>
              Showing{" "}
              <strong>
                {firstResult}
              </strong>
              {" - "}
              <strong>
                {lastResult}
              </strong>
              {" "}
              of{" "}
              <strong>
                {totalProducts}
              </strong>
              {" "}
              products
            </span>

          </div>

        )}


      {/* =========================================
          PRODUCTS
      ========================================= */}

      {!loading &&
        !error &&
        currentProducts.length > 0 && (

          <div className="products-grid">

            {currentProducts.map(
              (product) => (

                <ProductCard
                  key={
                    product._id ||
                    product.id
                  }
                  product={product}
                />

              )
            )}

          </div>

        )}


      {/* =========================================
          PAGINATION
      ========================================= */}

      {!loading &&
        !error &&
        totalProducts > 0 && (

          <Pagination

            currentPage={
              currentPage
            }

            totalPages={
              totalPages
            }

            onPageChange={
              setCurrentPage
            }

          />

        )}

    </div>

  );

}


export default Products;