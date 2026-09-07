import ProductGrid from "./ProductGrid";

const RelatedProducts = ({ products }) => {
  if (!products?.length) return null;

  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold">
        Related Products
      </h2>

      <ProductGrid products={products} />
    </section>
  );
};

export default RelatedProducts;