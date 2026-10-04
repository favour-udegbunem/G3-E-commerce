import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { getAdminOrders, updateAdminOrder } from "./adminApi";
import { formatDateTime } from "../utils/date";

const money = (v) =>
  `₦${Number(v || 0).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      setOrders((await getAdminOrders()).orders || []);
    } catch (e) {
      setError(e.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, field, value) => {
    try {
      setError("");

      await updateAdminOrder(id, {
        [field]: value,
      });

      await load();
    } catch (e) {
      setError(e.message || "Could not update order.");
    }
  };

  return (
    <div className="p-5 sm:p-7 lg:p-10">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-g3-pink">
        Sales
      </p>

      <h1 className="mt-2 text-3xl font-black">Orders</h1>

      <p className="mt-2 text-sm text-black/45">
        Review payments, see exactly when orders arrived and move orders
        through fulfilment.
      </p>

      {error && (
        <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="mt-7 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center font-bold text-black/40">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-sm text-black/40">
            No orders yet.
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {orders.map((o) => {
              const isPaystack =
                String(o.paymentMethod || "").toLowerCase() === "paystack";

              const isBankTransfer =
                String(o.paymentMethod || "").toLowerCase() ===
                "bank_transfer";

              return (
                <div key={o.id} className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <p className="font-black">{o.orderNumber}</p>

                      <p className="mt-1 text-xs text-black/45">
                        {o.customerFirstName} {o.customerLastName} ·{" "}
                        {o.customerEmail}
                      </p>

                      <p className="mt-2 text-sm font-black">
                        {money(o.total)}

                        <span className="ml-2 text-xs font-bold text-black/40">
                          {o.paymentMethod || "—"}
                        </span>
                      </p>

                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#f8f6fb] px-3 py-1.5 text-[10px] font-bold text-black/45">
                        <CalendarClock size={13} />

                        Received {formatDateTime(o.createdAt)}
                      </div>

                      {o.updatedAt &&
                        o.updatedAt !== o.createdAt && (
                          <p className="mt-1 text-[10px] font-bold text-black/30">
                            Last updated {formatDateTime(o.updatedAt)}
                          </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Order fulfilment status remains editable */}
                      <select
                        value={o.status}
                        onChange={(e) =>
                          update(o.id, "status", e.target.value)
                        }
                        className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold"
                      >
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="shipped">shipped</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>

                      {/* Paystack payment status is controlled automatically */}
                      {isPaystack ? (
                        <div className="flex items-center gap-2">
                          <div className="rounded-xl border border-black/10 bg-black/[0.02] px-3 py-2 text-xs font-bold">
                            {o.paymentStatus}
                          </div>

                          <span className="text-[10px] font-bold text-black/35">
                            Automatic
                          </span>
                        </div>
                      ) : isBankTransfer ? (
                        /* Bank transfer payment status can be changed by admin */
                        <select
                          value={o.paymentStatus}
                          onChange={(e) =>
                            update(
                              o.id,
                              "paymentStatus",
                              e.target.value
                            )
                          }
                          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold"
                        >
                          <option value="pending">pending</option>
                          <option value="paid">paid</option>
                          <option value="failed">failed</option>
                          <option value="refunded">refunded</option>
                        </select>
                      ) : (
                        /* Unknown/legacy payment methods are locked */
                        <div className="flex items-center gap-2">
                          <div className="rounded-xl border border-black/10 bg-black/[0.02] px-3 py-2 text-xs font-bold">
                            {o.paymentStatus}
                          </div>

                          <span className="text-[10px] font-bold text-black/35">
                            Locked
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;