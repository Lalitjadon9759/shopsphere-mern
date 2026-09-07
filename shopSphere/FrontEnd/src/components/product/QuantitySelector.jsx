const QuantitySelector = ({ quantity, setQuantity }) => {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() =>
          quantity > 1 && setQuantity(quantity - 1)
        }
        className="rounded-lg border px-4 py-2"
      >
        -
      </button>

      <span className="text-lg font-semibold">
        {quantity}
      </span>

      <button
        onClick={() => setQuantity(quantity + 1)}
        className="rounded-lg border px-4 py-2"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;