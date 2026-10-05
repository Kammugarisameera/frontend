import React, { useState } from "react";

function SearchBar({
  searchText = "",
  setSearchText,
  products = [],
}) {
  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const searchValue = String(searchText || "");

  const search =
    searchValue.trim().toLowerCase();

  // LIVE SEARCH SUGGESTIONS
  const suggestions =
    search.length > 0
      ? products
          .filter((product) => {
            const name = String(
              product?.name || ""
            ).toLowerCase();

            const description = String(
              product?.description || ""
            ).toLowerCase();

            return (
              name.includes(search) ||
              description.includes(search)
            );
          })
          .slice(0, 6)
      : [];

  // WHEN USER TYPES
  const handleChange = (event) => {
    setSearchText(event.target.value);
    setShowSuggestions(true);
  };

  // WHEN USER CLICKS SUGGESTION
  const handleSuggestionClick = (name) => {
    setSearchText(name);
    setShowSuggestions(false);
  };

  // CLEAR SEARCH
  const handleClear = () => {
    setSearchText("");
    setShowSuggestions(false);
  };

  return (
    <div className="search-bar-wrapper">

      {/* SEARCH BOX */}

      <div className="search-input-box">

        <span className="search-icon">
          🔍
        </span>

        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          onFocus={() => {
            if (searchValue.trim()) {
              setShowSuggestions(true);
            }
          }}
          placeholder="Search products, brands and more..."
          aria-label="Search products"
        />

        {searchValue && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
          >
            ×
          </button>
        )}

      </div>

      {/* LIVE SUGGESTIONS */}

      {showSuggestions &&
        search &&
        suggestions.length > 0 && (

          <div className="search-suggestions">

            {suggestions.map((product) => (

              <button
                type="button"
                className="search-suggestion-item"
                key={
                  product?._id ||
                  product?.id
                }
                onClick={() =>
                  handleSuggestionClick(
                    product.name
                  )
                }
              >

                <span className="suggestion-icon">
                  🔍
                </span>

                <span className="suggestion-text">
                  {product.name}
                </span>

              </button>

            ))}

          </div>
        )}

      {/* NO SUGGESTIONS */}

      {showSuggestions &&
        search &&
        suggestions.length === 0 && (

          <div className="search-no-suggestions">

            No matching products

          </div>
        )}

    </div>
  );
}

export default SearchBar;