import {
  MapPin,
  CheckCircle,
  Pencil,
} from "lucide-react";

const AddressCard = ({
  address,
  selected,
  onSelect,
  onEdit,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border p-5 transition-all ${
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200 bg-white hover:border-blue-300"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <MapPin
            size={22}
            className="mt-1 text-blue-600"
          />

          <div>
            <h3 className="font-semibold text-lg">
              {address.fullName}
            </h3>

            <p className="text-gray-600">
              {address.phone}
            </p>

            <p className="mt-2 text-gray-700">
              {address.addressLine1}
            </p>

            {address.addressLine2 && (
              <p className="text-gray-700">
                {address.addressLine2}
              </p>
            )}

            <p className="text-gray-700">
              {address.city}, {address.state}
            </p>

            <p className="text-gray-700">
              {address.country} - {address.pincode}
            </p>

            {address.isDefault && (
              <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Default Address
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          {selected && (
            <CheckCircle
              size={24}
              className="text-green-600"
            />
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="rounded-lg border p-2 hover:bg-gray-100"
          >
            <Pencil size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;