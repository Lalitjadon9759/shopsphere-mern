import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 lg:px-12">
        {/* Left */}
        <div>
          <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
            🔥 Big Sale is Live
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
            Discover Your Next
            <span className="block text-yellow-300">
              Favorite Product
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-blue-100">
            Shop thousands of premium products with fast delivery,
            secure payments, exclusive offers, and a seamless shopping
            experience.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:scale-105"
            >
              Shop Now
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/categories"
              className="rounded-xl border border-white/50 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              Browse Categories
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-center">
          <div className="flex h-80 w-80 items-center justify-center rounded-full bg-white/10 backdrop-blur">
            <ShoppingBag size={180} className="text-yellow-300" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;