export function calculateOrderSummary(items, shippingThreshold = 250, shippingRate = 18) {
  const subtotal = items.reduce((sum, item) => {
    const quantity = Number(item.quantity || 1);
    const price = Number(item.price || 0);
    return sum + price * quantity;
  }, 0);

  const shipping = subtotal > 0 && subtotal <= shippingThreshold ? shippingRate : 0;

  return {
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}
