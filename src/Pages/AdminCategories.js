import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function AdminCategory() {

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD CATEGORIES
    // ==========================================

    const loadCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/category`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to load categories"
                );
            }

            const list =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data.categories)
                        ? data.categories
                        : Array.isArray(data.data)
                            ? data.data
                            : [];

            setCategories(list);

        } catch (error) {

            setError(
                error.message ||
                "Unable to load categories"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadCategories();
    }, []);


    // ==========================================
    // CREATE / UPDATE
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {

            setError(
                "Category name is required."
            );

            return;
        }

        try {

            setSaving(true);

            const url = editingId
                ? `${API_URL}/category/${editingId}`
                : `${API_URL}/category/create`;

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name.trim(),
                        description:
                            description.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Operation failed"
                );
            }


            if (editingId) {

                setSuccess(
                    "Category updated successfully!"
                );

            } else {

                setSuccess(
                    "Category created successfully!"
                );
            }


            setName("");
            setDescription("");
            setEditingId(null);

            await loadCategories();

        } catch (error) {

            setError(
                error.message ||
                "Unable to save category"
            );

        } finally {

            setSaving(false);

        }
    };


    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (category) => {

        const id =
            category._id ||
            category.id;

        setEditingId(id);

        setName(
            category.name || ""
        );

        setDescription(
            category.description || ""
        );

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancelEdit = () => {

        setEditingId(null);

        setName("");
        setDescription("");

        setError("");
        setSuccess("");
    };


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (id, categoryName) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${categoryName}"?`
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            const response = await fetch(
                `${API_URL}/category/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to delete category"
                );
            }

            setSuccess(
                "Category deleted successfully!"
            );

            await loadCategories();

        } catch (error) {

            setError(
                error.message ||
                "Unable to delete category"
            );
        }
    };


    return (
        <div className="admin-page">

            {/* HEADER */}

            <div className="admin-header">

                <div>

                    <span className="section-label">
                        ADMIN PANEL
                    </span>

                    <h1>
                        Category Management
                    </h1>

                    <p>
                        Create, edit and manage
                        your store categories.
                    </p>

                </div>

            </div>


            {/* SUCCESS */}

            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}


            {/* ERROR */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            <div className="category-layout">


                {/* FORM */}

                <div className="product-form-card">

                    <h2>
                        {editingId
                            ? "Edit Category"
                            : "Create Category"}
                    </h2>


                    <form
                        onSubmit={handleSubmit}
                    >

                        <label>
                            Category Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="Enter category name"
                        />


                        <label>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Enter category description"
                            rows="4"
                        />


                        <button
                            type="submit"
                            className="save-product-btn"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Category"
                                    : "Create Category"}

                        </button>


                        {editingId && (

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

                    </form>

                </div>


                {/* CATEGORY LIST */}

                <div className="admin-list-card">

                    <div className="admin-list-header">

                        <h2>
                            Categories
                        </h2>

                        <button
                            className="refresh-btn"
                            onClick={
                                loadCategories
                            }
                        >
                            Refresh
                        </button>

                    </div>


                    {loading ? (

                        <div className="page-state">
                            Loading categories...
                        </div>

                    ) : categories.length === 0 ? (

                        <div className="empty-cart">

                            <h2>
                                No Categories
                            </h2>

                            <p>
                                Create a category first.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {categories.map(
                                        (category) => {

                                            const id =
                                                category._id ||
                                                category.id;

                                            return (

                                                <tr
                                                    key={id}
                                                >

                                                    <td>
                                                        {category.name}
                                                    </td>


                                                    <td>
                                                        {category.description ||
                                                            "-"}
                                                    </td>


                                                    <td>

                                                        <div className="category-actions">

                                                            <button
                                                                type="button"
                                                                className="edit-category-btn"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        category
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="delete-category-btn"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        id,
                                                                        category.name
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

        </div>
    );
}

export default AdminCategory;