import { BASE_URL } from "../Constants";
// cartUtils.js
export const fetchCartItemsNumber = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/cart/getCartItemCount/${userId}`);
    const uniqueBooksCount = await response.json();
    return uniqueBooksCount;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return 0; // Default to 0 if there's an error fetching
  }
};
