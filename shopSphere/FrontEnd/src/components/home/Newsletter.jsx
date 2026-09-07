import { Mail } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="rounded-3xl bg-slate-900 px-8 py-16 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <Mail
          size={48}
          className="mx-auto mb-5 text-blue-400"
        />

        <h2 className="text-4xl font-bold">
          Subscribe to our Newsletter
        </h2>

        <p className="mt-4 text-slate-300">
          Get exclusive offers, latest products,
          discounts and shopping tips.
        </p>

        <form className="mt-8 flex flex-col gap-4 md:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 outline-none focus:border-blue-500"
          />

          <button
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold transition hover:bg-blue-700"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;