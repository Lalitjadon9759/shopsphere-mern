import { useEffect, useState } from "react";
import { Trash2, Ban, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/users",
        {
          params: {
            page: 1,
            limit: 50,
          },
        }
      );

      setUsers(data.users || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (user) => {
    try {
      if (user.isBlocked) {
        await api.patch(
          `/users/${user._id}/unblock`
        );
      } else {
        await api.patch(
          `/users/${user._id}/block`
        );
      }

      toast.success(
        user.isBlocked
          ? "User unblocked"
          : "User blocked"
      );

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  const deleteUser = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);

      toast.success("User deleted");

      setUsers((prev) =>
        prev.filter(
          (user) => user._id !== id
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <p className="mt-1 text-gray-500">
          Manage ShopSphere users
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        {users.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          <table className="w-full min-w-[850px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  User
                </th>

                <th className="px-6 py-4 text-left">
                  Phone
                </th>

                <th className="px-6 py-4 text-left">
                  Role
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium">
                      {user.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {user.phone || "-"}
                  </td>

                  <td className="px-6 py-4 capitalize">
                    {user.role}
                  </td>

                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                        Blocked
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {user.role !== "admin" && (
                        <button
                          onClick={() =>
                            toggleBlock(user)
                          }
                          className="rounded-lg bg-yellow-100 p-2 text-yellow-700 hover:bg-yellow-200"
                          title={
                            user.isBlocked
                              ? "Unblock"
                              : "Block"
                          }
                        >
                          {user.isBlocked ? (
                            <CheckCircle
                              size={18}
                            />
                          ) : (
                            <Ban size={18} />
                          )}
                        </button>
                      )}

                      {user.role !== "admin" && (
                        <button
                          onClick={() =>
                            deleteUser(
                              user._id
                            )
                          }
                          className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;