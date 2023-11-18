import React from "react";
import { Link } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";

function Breadcrumbs({ customLabel }) {
  const breadcrumbs = useBreadcrumbs();
  const lastBreadcrumbs = breadcrumbs.slice(-1);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // If customLabel is provided, use it. Otherwise, fall back to the URL-based breadcrumb.
  let formattedBreadcrumb = customLabel
    ? customLabel
    : capitalizeFirstLetter(
        lastBreadcrumbs[0].key.split("/").pop().replaceAll("%20", " ")
      );

  const firstBreadcrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1);

  return (
    <div className="container p-4">
      {firstBreadcrumbs.map(({ breadcrumb }) => (
        <span key={breadcrumb.key}>
          <Link to={breadcrumb.key}>{breadcrumb}</Link> /{" "}
        </span>
      ))}
      <span>{formattedBreadcrumb}</span>
    </div>
  );
}

export default Breadcrumbs;
