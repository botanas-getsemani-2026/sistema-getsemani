export const formatCurrency = (amount) => {
  return `$${(amount / 100).toFixed(2)}`;
};
