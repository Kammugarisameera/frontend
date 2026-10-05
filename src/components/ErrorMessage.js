import React from "react";

function ErrorMessage({
  message,
  onRetry
}) {
  return (
    <div className="page-error">

      <div className="error-icon">
        ⚠️
      </div>

      <h3>
        Unable to load products
      </h3>

      <p>
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          className="retry-btn"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}

    </div>
  );
}

export default ErrorMessage;