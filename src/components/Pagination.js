import React from "react";

function Pagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">

      <button
        type="button"
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        ← Previous
      </button>


      <div className="pagination-info">

        <span>
          Page
        </span>

        <strong>
          {currentPage}
        </strong>

        <span>
          of
        </span>

        <strong>
          {totalPages}
        </strong>

      </div>


      <button
        type="button"
        className="pagination-btn"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        Next →
      </button>

    </div>
  );
}

export default Pagination;