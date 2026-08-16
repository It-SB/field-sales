"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { Product } from "@/lib/types";

interface StockCheckFormProps {
  storeId: string;
  products: Product[];
}

export default function StockCheckForm({
  storeId,
  products,
}: StockCheckFormProps) {
  const router = useRouter();

  const [productLine, setProductLine] =
    useState("");

  const [productId, setProductId] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [expiryDate, setExpiryDate] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

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
        "/api/stock/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeId,
            productId,
            quantity,
            expiryDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to save stock"
        );
        return;
      }

      if (data.expiringSoon) {
        setSuccess(
          `Stock saved. 🚨 This product expires in ${data.daysUntilExpiry} days, so an alert was sent to all sales reps.`
        );
      } else {
        setSuccess(
          "Stock batch saved successfully."
        );
      }

      setProductLine("");
      setProductId("");
      setQuantity("");
      setExpiryDate("");

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
              <option
                key={line}
                value={line}
              >
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 disabled:bg-slate-100"
            disabled={!productLine}
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
            Quantity
          </label>

          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Expiry Date
          </label>

          <input
            type="date"
            value={expiryDate}
            onChange={(event) =>
              setExpiryDate(event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3"
            required
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
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving Stock..."
            : "Save Stock Check"}
        </button>
      </div>
    </form>
  );
}