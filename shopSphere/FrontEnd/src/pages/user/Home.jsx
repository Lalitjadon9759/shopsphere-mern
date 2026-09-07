import Hero from "../../components/home/Hero";
import FeaturedCategories from "../../components/home/FeaturedCategories";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import PromoBanner from "../../components/home/PromoBanner";
import Newsletter from "../../components/home/Newsletter";

const Home = () => {
  return (
    <div className="space-y-20">
      <Hero />

      <FeaturedCategories />

      <FeaturedProducts />

      <PromoBanner />

      <Newsletter />
    </div>
  );
};

export default Home;