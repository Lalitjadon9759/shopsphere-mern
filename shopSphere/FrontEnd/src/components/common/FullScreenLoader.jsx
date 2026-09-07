const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>

        <p className="mt-5 text-lg font-semibold">
          Loading ShopSphere...
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;