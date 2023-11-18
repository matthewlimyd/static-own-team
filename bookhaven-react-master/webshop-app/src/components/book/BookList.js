import Book from "./Book";
import Filters from "../Filters";

function BookList({
  handleChange,
  handleReset,
  filterValues,
  filters,
  books,
  setFilters,
  getBooks,
  isAdmin,
  cartItemsNumber,
  setCartItemsNumber,
  categories,
}) {
  return (
    <>
      <Filters
        filterValues={filterValues}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        handleChange={handleChange}
        handleReset={handleReset}
      />
      <div className="container mt-3 mb-3">
        <div className="row" id="book-row">
          {books.map((book) => (
            <Book
              key={book.book_id}
              book_id={book.book_id}
              name={book.name}
              author={book.author}
              img_paths={book.img_paths}
              price={book.price}
              old_price={book.old_price}
              rating={book.rating}
              quantity={book.quantity}
              getBooks={getBooks}
              isAdmin={isAdmin}
              cartItemsNumber={cartItemsNumber}
              setCartItemsNumber={setCartItemsNumber}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default BookList;
