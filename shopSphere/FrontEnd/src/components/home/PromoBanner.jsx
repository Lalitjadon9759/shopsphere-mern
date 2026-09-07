import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 py-16 md:flex-row">
        <div>
          <p className="mb-3 text-sm uppercase tracking-widest text-cyan-100">
            Limited Time Offer
          </p>

          <h2 className="text-4xl font-bold leading-tight">
            Up to 50% OFF
            <br />
            On Selected Products
          </h2>

          <p className="mt-5 max-w-xl text-cyan-100">
            Discover amazing deals on electronics, fashion, books,
            shoes and much more.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:scale-105"
          >
            Shop Now
            <ArrowRight size={18} />
          </Link>
        </div>

        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
          alt="Promotion"
          className="h-72 rounded-2xl object-cover shadow-2xl"
        />
      </div>
    </section>
  );
};

export default PromoBanner;