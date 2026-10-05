import React, { useEffect, useState } from "react";
import ProductForm from "../components/ProductFrom";

const API_URL = "http://localhost:5000";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/products`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load products"
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

    } catch (err) {
      console.error(
        "PRODUCT FETCH ERROR:",
        err
      );

      setError(
        err.message ||
        "Unable to load products"
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${API_URL}/category`
      );

      const data = await response.json();

      console.log(
        "CATEGORIES RESPONSE:",
        data
      );

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

    } catch (err) {
      console.error(
        "CATEGORY FETCH ERROR:",
        err
      );

      setCategories([]);

    }
  };


  // ==========================================
  // LOAD PRODUCTS + CATEGORIES
  // ==========================================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);


  // ==========================================
  // REFRESH PAGE
  // ==========================================

  const handleRefresh = () => {
    window.location.reload();
  };


  // ==========================================
  // SAVE PRODUCT
  // ==========================================

  const handleSave = async (productData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let response;

      // EDIT PRODUCT
      if (editingProduct) {

        response = await fetch(
          `${API_URL}/products/${editingProduct._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(
              productData
            ),
          }
        );

      }

      // CREATE PRODUCT
      else {

        response = await fetch(
          `${API_URL}/products`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(
              productData
            ),
          }
        );

      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to save product"
        );
      }

      setSuccess(
        editingProduct
          ? "Product updated successfully."
          : "Product added successfully."
      );

      // Clear edit mode
      setEditingProduct(null);

      // Reload products
      await fetchProducts();

    } catch (err) {

      console.error(
        "SAVE PRODUCT ERROR:",
        err
      );

      setError(
        err.message ||
        "Something went wrong"
      );

    } finally {

      setSaving(false);

    }
  };


  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const handleEdit = (product) => {

    setEditingProduct(product);

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      setError("");
      setSuccess("");

      const response =
        await fetch(
          `${API_URL}/products/${id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to delete product"
        );
      }

      setSuccess(
        "Product deleted successfully."
      );

      await fetchProducts();

    } catch (err) {

      console.error(
        "DELETE PRODUCT ERROR:",
        err
      );

      setError(
        err.message ||
        "Unable to delete product"
      );

    }
  };


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {

    setEditingProduct(null);

    setError("");
    setSuccess("");

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="admin-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="admin-header">

        <div>

          <span className="section-label">
            ADMIN PANEL
          </span>

          <h1>
            Product Management
          </h1>

          <p>
            Add, edit and manage your store
            products.
          </p>

        </div>


        {/* REFRESH BUTTON */}

        <button
          type="button"
          className="refresh-btn"
          onClick={handleRefresh}
        >
          ↻ Refresh
        </button>

      </div>


      {/* =====================================
          SUCCESS MESSAGE
      ====================================== */}

      {success && (

        <div className="success-message">

          {success}

        </div>

      )}


      {/* =====================================
          ERROR MESSAGE
      ====================================== */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* =====================================
          PRODUCT FORM
      ====================================== */}

      <div className="product-form-card">

        <div className="admin-form-heading">

          <div>

            <span className="section-label">

              {editingProduct
                ? "EDIT PRODUCT"
                : "ADD PRODUCT"}

            </span>


            <h2>

              {editingProduct
                ? "Update Product"
                : "Create New Product"}

            </h2>

          </div>


          {editingProduct && (

            <button
              type="button"
              className="cancel-edit-btn"
              onClick={
                handleCancelEdit
              }
            >
              Cancel Edit
            </button>

          )}

        </div>


        <ProductForm

          product={
            editingProduct
          }

          onSave={
            handleSave
          }

          saving={
            saving
          }

          categories={
            categories
          }

        />

      </div>


      {/* =====================================
          PRODUCT LIST
      ====================================== */}

      <div className="admin-list-card">

        <div className="admin-list-header">

          <div>

            <span className="section-label">
              STORE PRODUCTS
            </span>

            <h2>
              All Products
            </h2>

          </div>


          <span className="admin-product-count">

            {products.length} Products

          </span>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="page-state">

            <div className="spinner"></div>

            <p>
              Loading products...
            </p>

          </div>

        )


        /* NO PRODUCTS */

        : products.length === 0 ? (

          <div className="empty-cart">

            <h3>
              No Products Found
            </h3>

            <p>
              Add your first product using
              the form above.
            </p>

          </div>

        )


        /* PRODUCTS */

        : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    Image
                  </th>

                  <th>
                    Product
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {products.map(
                  (product) => {

                    const productId =
                      product._id ||
                      product.id;


                    // CATEGORY NAME

                    const categoryName =
                      typeof product.categoryId ===
                      "object"

                        ? product
                            .categoryId
                            ?.name

                        : categories.find(
                            (category) =>
                              category._id ===
                              product.categoryId
                          )?.name || "-";


                    return (

                      <tr
                        key={
                          productId
                        }
                      >

                        {/* IMAGE */}

                        <td>

                          <img
                            src={
                              product.image ||
                              "https://via.placeholder.com/60"
                            }
                            alt={
                              product.name
                            }
                            className="admin-product-image"
                          />

                        </td>


                        {/* PRODUCT */}

                        <td>

                          <strong>
                            {product.name}
                          </strong>

                          <small>

                            {product.description
                              ? product.description.substring(
                                  0,
                                  50
                                )
                              : ""}

                          </small>

                        </td>


                        {/* PRICE */}

                        <td>

                          ₹
                          {Number(
                            product.price ||
                            0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>


                        {/* STOCK */}

                        <td>

                          {product.stock}

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              product.status ===
                              "active"

                                ? "status-active"

                                : "status-inactive"
                            }
                          >

                            {product.status}

                          </span>

                        </td>


                        {/* CATEGORY */}

                        <td>

                          {categoryName}

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="admin-actions">

                            {/* EDIT */}

                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(
                                  product
                                )
                              }
                            >
                              Edit
                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(
                                  productId
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );
}

export default AdminProducts;