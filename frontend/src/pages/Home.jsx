import Hero from "@/components/Hero";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { useProductData } from "@/context/use-product-data";

const Home = () => {
  const { loading, newProd } = useProductData();

  return (
    <div>
      <Hero />

      <section className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">Sản Phẩm Mới Nhất</h2>

        {loading ? (
          <Loading />
        ) : newProd && newProd.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {newProd.map((item) => (
              <ProductCard key={item._id} latest="yes" product={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Chưa có sản phẩm nào.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
