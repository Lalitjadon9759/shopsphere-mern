import { useState } from "react";
import { useDispatch } from "react-redux";

import { addAddress } from "./addressSlice";

const AddressForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    addressType: "Home",
    isDefault: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await dispatch(
        addAddress(formData)
      ).unwrap();

      if (onSuccess) {
        onSuccess(result.address);
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Add Address Error:", err);

      setError(
        typeof err === "string"
          ? err
          : "Failed to add address"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold">
          Add New Address
        </h3>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-2 hover:bg-gray-100"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full rounded-lg border px-4 py-3"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full rounded-lg border px-4 py-3"
        />

        <input
          type="text"
          name="addressLine1"
          placeholder="Address Line 1"
          value={formData.addressLine1}
          onChange={handleChange}
          required
          className="w-full rounded-lg border px-4 py-3"
        />

        <input
          type="text"
          name="addressLine2"
          placeholder="Address Line 2 (Optional)"
          value={formData.addressLine2}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-3"
        />

        <input
          type="text"
          name="landmark"
          placeholder="Landmark (Optional)"
          value={formData.landmark}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-3"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3"
          />

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3"
          />

        </div>

        <div>
          <p className="mb-2 font-medium">
            Address Type
          </p>

          <div className="flex gap-6">

            {["Home", "Work", "Other"].map(
              (type) => (
                <label
                  key={type}
                  className="flex items-center gap-2"
                >
                  <input
                    type="radio"
                    name="addressType"
                    value={type}
                    checked={
                      formData.addressType === type
                    }
                    onChange={handleChange}
                  />

                  {type}
                </label>
              )
            )}

          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
          />

          <span>
            Make this my default address
          </span>
        </label>

        <div className="flex gap-3 pt-2">

          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Address"}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-3 font-semibold hover:bg-gray-100"
            >
              Cancel
            </button>
          )}

        </div>

      </form>
    </div>
  );
};

export default AddressForm;