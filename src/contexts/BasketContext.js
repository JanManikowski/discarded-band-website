import React, { createContext, useState } from 'react';

export const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
  const [basketItems, setBasketItems] = useState([]);

  const addToBasket = (product, selectedVariant) => {
    setBasketItems((prevItems) => {
        const itemExists = prevItems.find(
            (item) => item.id === product.id && item.variant.id === selectedVariant.id
          );
      if (itemExists) {
        return prevItems.map((item) =>
            item.id === product.id && item.variant.id === selectedVariant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, variant: selectedVariant, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, variantId, newQuantity) => {
    setBasketItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.variant.id === variantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return basketItems.reduce(
      (total, item) =>
        total + parseFloat(item.variant.price.amount) * item.quantity,
      0
    );
  };

  const basketCount = basketItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <BasketContext.Provider value={{ basketItems, addToBasket, updateQuantity, basketCount, calculateTotal }}>
      {children}
    </BasketContext.Provider>
  );
};
