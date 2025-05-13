import { createContext, useContext, useState, ReactNode } from "react";

interface Producto {
  productName: string;
  price: string;
  quantity: string;
  supermarket: string;
  category: string;
  index?: number;
}

// Crear un contexto con un tipo definido
const ProductoContext = createContext<{
  productos: Producto[];
  agregarProducto: (producto: Producto) => void;
} | undefined>(undefined);

export const ProductoProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Producto[]>([]);

  const agregarProducto = (producto: Producto) => {
    setProductos(prev => [...prev, producto]);
  };

  return (
    <ProductoContext.Provider value={{ productos, agregarProducto }}>
      {children}
    </ProductoContext.Provider>
  );
};

export const useProductos = () => {
  const context = useContext(ProductoContext);
  if (!context) throw new Error("useProductos debe usarse dentro de un ProductoProvider");
  return context;
};