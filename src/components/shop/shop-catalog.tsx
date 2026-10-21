"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/lib/site-data";

type ShopCatalogProps = {
  products: Product[];
};

export function ShopCatalog({ products }: ShopCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");

  const collections = useMemo(
    () => ["All", ...new Set(products.map((product) => product.collection))],
    [products],
  );

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category))],
    [products],
  );

  const colors = useMemo(
    () => ["All", ...new Set(products.flatMap((product) => product.colors))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        `${product.name} ${product.summary} ${product.collection} ${product.category}`
          .toLowerCase()
          .includes(query);

      const matchesCollection =
        selectedCollection === "All" ||
        product.collection === selectedCollection;
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesColor =
        selectedColor === "All" || product.colors.includes(selectedColor);

      return matchesSearch && matchesCollection && matchesCategory && matchesColor;
    });
  }, [products, search, selectedCollection, selectedCategory, selectedColor]);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 border border-[rgba(46,16,101,0.1)] px-5 py-5 sm:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-[rgba(46,16,101,0.45)]">
            Search
          </span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Black classic, textured, cream, wedding..."
            className="field"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-[rgba(46,16,101,0.45)]">
            Collection
          </span>
          <select
            value={selectedCollection}
            onChange={(event) => setSelectedCollection(event.target.value)}
            className="field"
          >
            {collections.map((collection) => (
              <option key={collection}>{collection}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-[rgba(46,16,101,0.45)]">
            Category
          </span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="field"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-[rgba(46,16,101,0.45)]">
            Color
          </span>
          <select
            value={selectedColor}
            onChange={(event) => setSelectedColor(event.target.value)}
            className="field"
          >
            {colors.map((color) => (
              <option key={color}>{color}</option>
            ))}
          </select>
        </label>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-gold)]">
          {filteredProducts.length} pieces available
        </p>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setSelectedCollection("All");
            setSelectedCategory("All");
            setSelectedColor("All");
          }}
          className="text-left text-sm uppercase tracking-[0.18em] text-[rgba(46,16,101,0.62)] transition hover:text-[var(--color-ivory)]"
        >
          Reset Filters
        </button>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="border border-[rgba(46,16,101,0.1)] px-6 py-10 text-sm leading-7 text-[rgba(46,16,101,0.68)]">
          No pieces match the current filters. Refine your search or reset the
          selection to view the full ready-to-wear offering.
        </div>
      )}
    </div>
  );
}

