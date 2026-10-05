import React from "react";

function ProductFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onClear
}) {
  return (
    <div className="product-filters">

      <div className="filter-header">

        <div>
          <span className="filter-label">
            FILTER & SORT
          </span>

          <h3>
            Find Your Products
          </h3>
        </div>

        <button
          type="button"
          className="clear-filters-btn"
          onClick={onClear}
        >
          Clear All
        </button>

      </div>


      <div className="filter-controls">

        {/* CATEGORY */}

        <div className="filter-group">

          <label>
            Category
          </label>

          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(
                event.target.value
              )
            }
          >

            <option value="">
              All Categories
            </option>

            {categories.map((category) => {

              const categoryId =
                category._id ||
                category.id;

              return (
                <option
                  key={categoryId}
                  value={categoryId}
                >
                  {category.name}
                </option>
              );
            })}

          </select>

        </div>


        {/* MIN PRICE */}

        <div className="filter-group">

          <label>
            Min Price
          </label>

          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) =>
              setMinPrice(
                event.target.value
              )
            }
            placeholder="₹ Min"
          />

        </div>


        {/* MAX PRICE */}

        <div className="filter-group">

          <label>
            Max Price
          </label>

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(
                event.target.value
              )
            }
            placeholder="₹ Max"
          />

        </div>


        {/* SORT */}

        <div className="filter-group">

          <label>
            Sort By
          </label>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value
              )
            }
          >

            <option value="">
              Default
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="name-a-z">
              Name: A - Z
            </option>

            <option value="name-z-a">
              Name: Z - A
            </option>

          </select>

        </div>

      </div>

    </div>
  );
}

export default ProductFilters;