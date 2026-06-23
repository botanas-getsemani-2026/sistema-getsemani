export const formatCurrency = (amount) => {
  return `$${(amount / 100).toFixed(2)}`;
};


export const formatPrice = price => {
  return Math.round(price * 100);
}