"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ReturnReason } from "@/lib/types";

interface ReturnFormProps {
  storeId: string;
  products: Product[];
}

const returnReasons: {
  value: ReturnReason;
  label: string;
}[] = [
  {
    value: "expired",
    label: "Expired Stock",
  },
  {
    value: "damaged",
    label: "Damaged Stock",
  },
  {
    value: "melted",
    label: "Melted Ice Cream",
  },
  {
    value: "other",
    label: "Other",
  },
];

export default function ReturnForm({
  storeId,
  products,
}: ReturnFormProps) {
  const router = useRouter();

  const [productLine, setProductLine] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] =
    useState<ReturnReason | "">("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const productLines = [
    ...new Set(
      products.map((product) => product.productLine)
    ),
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.productLine === productLine
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/returns/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeId,
            productId,
            quantity,
            reason,
            notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to submit return"
        );
        return;
      }

      setSuccess(
        "Return submitted successfully. Management has been notified."
      );

      setProductLine("");
      setProductId("");
      setQuantity("");
      setReason("");
      setNotes("");

      router.refresh();
    } catch {
      setError(
        "Could not connect to the server"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-6 shadow-sm"
    >
      <div className="space-y-5">

        {/* Product Line */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Product Line
          </label>

          <select
            value={productLine}
            onChange={(event) => {
              setProductLine(event.target.value);
              setProductId("");
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3"
            required
          >
            <option value="">
              Select product line
            </option>

            {productLines.map((line) => (
              <option key={line} value={line}>
                {line}
              </option>
            ))}
          </select>
        </div>

        {/* Product */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Product
          </label>

          <select
            value={productId}
            onChange={(event) =>
              setProductId(event.target.value)
            }
            disabled={!productLine}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 disabled:bg-slate-100"
            required
          >
            <option value="">
              {productLine
                ? "Select product"
                : "Select a product line first"}
            </option>

            {filteredProducts.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.flavour} — {product.size}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Quantity to Return
          </label>

          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(event.target.value)
            }
            placeholder="Enter quantity"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3"
            required
          />
        </div>

        {/* Return Reason */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Return Reason
          </label>

          <select
            value={reason}
            onChange={(event) =>
              setReason(
                event.target.value as ReturnReason
              )
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3"
            required
          >
            <option value="">
              Select a reason
            </option>

            {returnReasons.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={4}
            placeholder="Add any additional information..."
            className="mt-1 w-full resize-none rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          {loading
            ? "Submitting Return..."
            : "Submit Return"}
        </button>
      </div>
    </form>
  );
}