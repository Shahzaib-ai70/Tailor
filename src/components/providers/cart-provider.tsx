"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

type AddToCartPayload = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (slug: string, size: string, color: string) => void;
  updateQuantity: (
    slug: string,
    size: string,
    color: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "atelier-noir-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as CartItem[];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );

    return {
      items,
      itemCount,
      subtotal,
      addItem(payload) {
        const quantity = payload.quantity ?? 1;

        setItems((currentItems) => {
          const existingIndex = currentItems.findIndex(
            (item) =>
              item.slug === payload.slug &&
              item.size === payload.size &&
              item.color === payload.color,
          );

          if (existingIndex === -1) {
            return [...currentItems, { ...payload, quantity }];
          }

          return currentItems.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        });
      },
      removeItem(slug, size, color) {
        setItems((currentItems) =>
          currentItems.filter(
            (item) =>
              !(
                item.slug === slug &&
                item.size === size &&
                item.color === color
              ),
          ),
        );
      },
      updateQuantity(slug, size, color, quantity) {
        setItems((currentItems) =>
          currentItems
            .map((item) =>
              item.slug === slug && item.size === size && item.color === color
                ? { ...item, quantity }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}

