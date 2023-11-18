import { useState, useEffect } from "react";
import { ImSearch } from "react-icons/im";
import { Offcanvas, Button } from "react-bootstrap";
import "../css/Filters.css";

function Filters({
  filters,
  setFilters,
  handleChange,
  handleReset,
  categories = [],
}) {
  const [show, setShow] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCategories, setVisibleCategories] = useState(
    categories.slice(0, 5)
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setVisibleCategories(
        categories.filter((cat) =>
          cat.category_name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setVisibleCategories(categories.slice(0, 5));
    }
  };
  useEffect(() => {
    setVisibleCategories(categories.slice(0, 5));
  }, [categories]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <div className="menu pt-5 container">
        <div className="filter-buttons row ml-3 d-flex">
          <div className="d-flex justify-content-center">
            <div className="d-flex mt-3 ps-2">
              <span className="input-group-text" id="basic-addon1">
                <ImSearch />
              </span>
              <input
                className="form-control me-2 border-none"
                id="search-input"
                name="search"
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    search: e.target.value,
                  })
                }
                placeholder="Search"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </div>
            <div className="d-flex mt-3 ps-2">
              <label className="input-group-text" htmlFor="sort">
                <i className="fas fa-sort"></i>Sort by
              </label>
              <select
                name="sort"
                id="sort"
                className="form-select border-none"
                value={filters.sort}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sort: e.target.value,
                  })
                }
              >
                <option value="none">Recommended</option>
                <option value="asc">Ascending price</option>
                <option value="desc">Descending price</option>
              </select>
            </div>
            <div className="mt-3 text-center ps-2">
              <Button variant="primary" onClick={handleShow} className="me-2">
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Offcanvas show={show} onHide={handleClose} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <h3>Filters</h3>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form action="/books" id="filter-form" method="get">
            <fieldset id="filter-category" className="filter-category">
              <h4>Category:</h4>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {visibleCategories.map((category) => (
                <div className="filter-item" key={category.category_id}>
                  <input
                    type="checkbox"
                    id={category.category_id}
                    name="category"
                    value={category.category_id}
                    onChange={handleChange}
                    defaultChecked={
                      filters.category.indexOf(category.category_name) !== -1
                    }
                  />
                  <label>{category.category_name}</label>
                </div>
              ))}
            </fieldset>

            <fieldset id="filter-price" className="mt-2 filter-price">
              <h4>Price:</h4>
              <div className="filter-item">
                <input
                  type="radio"
                  name="price_range"
                  id="range_0_20"
                  value="0_20"
                  onChange={handleChange}
                  defaultChecked={filters.price_range === "0_20" ? true : false}
                />
                <label> 0-20 SGD</label>
              </div>
              <div className="filter-item">
                <input
                  type="radio"
                  name="price_range"
                  id="range_20_50"
                  value="20_50"
                  onChange={handleChange}
                  defaultChecked={
                    filters.price_range === "20_50" ? true : false
                  }
                />
                <label> 20-50 SGD</label>
              </div>
              <div className="filter-item">
                <input
                  type="radio"
                  name="price_range"
                  id="range_50_"
                  value="50"
                  onChange={handleChange}
                  defaultChecked={filters.price_range === "50" ? true : false}
                />
                <label> Above 50 SGD</label>
              </div>
            </fieldset>
            <fieldset id="filter-rating" className="mt-2">
              <h4>Minimum rating:</h4>
              <div className="filter-item">
                <input
                  type="number"
                  value={filters.minimum_rating}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minimum_rating: e.target.value,
                    })
                  }
                  name="minimum_rating"
                  id="minimum_rating"
                  min="0"
                  max="5"
                />
              </div>
            </fieldset>
            <fieldset id="filter-stock" className="mt-2">
              <h4>In stock:</h4>
              <input
                className="filter-item"
                type="checkbox"
                name="stock_yes"
                id="stock_yes"
                value="true"
                onChange={handleChange}
                defaultChecked={filters.stock_yes}
              />
              <label>Yes</label>
            </fieldset>
            <div className="filter-form-buttons d-flex justify-content-between">
              <input
                type="reset"
                id="reset"
                className="mt-3 reset-input"
                value="Reset filters"
                onClick={handleReset}
              />
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Filters;
