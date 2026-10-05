import React, {
  useEffect,
  useState
} from "react";

function ProductForm({
  product,
  onSave,
  saving,
  categories = []
}) {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: "",
    status: "active"
  });


  const [error, setError] =
    useState("");


  // =========================
  // LOAD PRODUCT FOR EDIT
  // =========================

  useEffect(() => {

    if (product) {

      setFormData({
        name: product.name || "",

        description:
          product.description || "",

        price:
          product.price ?? "",

        stock:
          product.stock ?? "",

        categoryId:
          typeof product.categoryId ===
          "object"
            ? product.categoryId?._id || ""
            : product.categoryId || "",

        image:
          product.image || "",

        status:
          product.status || "active"
      });

    } else {

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        image: "",
        status: "active"
      });

    }

    setError("");

  }, [product]);


  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (event) => {

    event.preventDefault();

    setError("");


    // NAME

    if (!formData.name.trim()) {

      setError(
        "Product name is required."
      );

      return;
    }


    // DESCRIPTION

    if (!formData.description.trim()) {

      setError(
        "Product description is required."
      );

      return;
    }


    // PRICE

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {

      setError(
        "Please enter a valid price."
      );

      return;
    }


    // CATEGORY

    if (!formData.categoryId) {

      setError(
        "Please select a category."
      );

      return;
    }


    // STOCK

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {

      setError(
        "Please enter a valid stock."
      );

      return;
    }


    // DATA TO BACKEND

    const productData = {

      name:
        formData.name.trim(),

      description:
        formData.description.trim(),

      price:
        Number(formData.price),

      stock:
        Number(formData.stock),

      categoryId:
        formData.categoryId,

      image:
        formData.image.trim(),

      status:
        formData.status
    };


    onSave(productData);
  };


  return (

    <form
      className="product-form"
      onSubmit={handleSubmit}
    >

      {/* ================= ERROR ================= */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* ================= NAME ================= */}

      <div className="form-group">

        <label>
          Product Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
        />

      </div>


      {/* ================= DESCRIPTION ================= */}

      <div className="form-group">

        <label>
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows="4"
        />

      </div>


      {/* ================= PRICE ================= */}

      <div className="form-group">

        <label>
          Price
        </label>

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          min="0"
        />

      </div>


      {/* ================= CATEGORY ================= */}

      <div className="form-group">

        <label>
          Category
        </label>

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
        >

          <option value="">
            Select Category
          </option>


          {categories.length === 0 ? (

            <option
              value=""
              disabled
            >
              No categories available
            </option>

          ) : (

            categories
              .filter(
                (category) =>
                  category.status !==
                  "inactive"
              )
              .map((category) => (

                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>

              ))

          )}

        </select>

        {categories.length === 0 && (

          <small
            style={{
              display: "block",
              marginTop: "6px",
              color: "#c00"
            }}
          >
            No categories found. Create a
            category first.
          </small>

        )}

      </div>


      {/* ================= STOCK ================= */}

      <div className="form-group">

        <label>
          Stock
        </label>

        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Enter stock"
          min="0"
        />

      </div>


      {/* ================= IMAGE ================= */}

      <div className="form-group">

        <label>
          Image URL
        </label>

        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Enter image URL"
        />

      </div>


      {/* ================= STATUS ================= */}

      <div className="form-group">

        <label>
          Status
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

        </select>

      </div>


      {/* ================= BUTTON ================= */}

      <button
        type="submit"
        className="save-product-btn"
        disabled={saving}
      >

        {saving
          ? "Saving..."
          : product
            ? "Update Product"
            : "Create Product"}

      </button>

    </form>
  );
}

export default ProductForm;