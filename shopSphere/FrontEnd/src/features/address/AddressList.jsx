import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

import {
  fetchAddresses,
  selectAddress,
} from "./addressSlice";

import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

const AddressList = () => {
  const dispatch = useDispatch();

  const {
    addresses,
    loading,
    selectedAddress,
    error,
  } = useSelector(
    (state) => state.address
  );

  const [showForm, setShowForm] =
    useState(false);

  const [editingAddress, setEditingAddress] =
    useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleSuccess = (address) => {
    // Automatically select the newly created
    // or updated address.
    if (address) {
      dispatch(selectAddress(address));
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 text-center">
        Loading addresses...
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Add Address Button */}

      {!showForm && (
        <button
          type="button"
          onClick={handleAddAddress}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 px-5 py-4 font-semibold text-blue-700 transition hover:border-blue-500 hover:bg-blue-100"
        >
          <Plus size={20} />
          Add New Address
        </button>
      )}

      {/* Address Form */}

      {showForm && (
        <AddressForm
          address={editingAddress}
          onClose={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      {/* Error */}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Existing Addresses */}

      {addresses.length > 0 && (
        <div className="space-y-4">

          <h3 className="text-lg font-semibold">
            Saved Addresses
          </h3>

          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              selected={
                selectedAddress?._id ===
                address._id
              }
              onSelect={() =>
                dispatch(
                  selectAddress(address)
                )
              }
              onEdit={handleEditAddress}
            />
          ))}

        </div>
      )}

      {/* Empty State */}

      {addresses.length === 0 &&
        !showForm && (
          <div className="rounded-xl border bg-gray-50 p-6 text-center">
            <p className="text-gray-600">
              No addresses found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add a shipping address to continue
              with your order.
            </p>
          </div>
        )}

    </div>
  );
};

export default AddressList;