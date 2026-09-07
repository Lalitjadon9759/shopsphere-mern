import { Facebook, Github, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <h2 className="text-2xl font-bold">ShopSphere</h2>

          <p className="mt-4 text-slate-400">
            A modern MERN e-commerce platform with secure
            authentication, fast shopping, and a premium user experience.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Shop</h3>

          <ul className="space-y-2 text-slate-400">
            <li>Products</li>
            <li>Categories</li>
            <li>Offers</li>
            <li>New Arrivals</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Support</h3>

          <ul className="space-y-2 text-slate-400">
            <li>Contact</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Follow Us
          </h3>

          <div className="flex gap-4">
            <Facebook className="cursor-pointer hover:text-blue-400" />
            <Instagram className="cursor-pointer hover:text-pink-500" />
            <Github className="cursor-pointer hover:text-gray-300" />
            <Linkedin className="cursor-pointer hover:text-blue-500" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-slate-500">
        © {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;