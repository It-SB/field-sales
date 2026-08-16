"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  FridgeIssueType,
} from "@/lib/types";

interface FridgeReportFormProps {
  storeId: string;
}

const fridgeIssues: {
  value: FridgeIssueType;
  label: string;
}[] = [
  {
    value: "switched_off",
    label: "Fridge Switched Off",
  },
  {
    value: "competitor_products",
    label: "Competitor Products Inside",
  },
  {
    value: "non_company_products",
    label: "Non-Company Products Inside",
  },
  {
    value: "damaged",
    label: "Fridge Damaged",
  },
  {
    value: "dirty",
    label: "Dirty / Poorly Maintained",
  },
  {
    value: "temperature_problem",
    label: "Temperature Problem",
  },
  {
    value: "inaccessible",
    label: "Fridge Inaccessible",
  },
  {
    value: "other",
    label: "Other",
  },
];

export default function FridgeReportForm({
  storeId,
}: FridgeReportFormProps) {
  const router = useRouter();

  const [issueType, setIssueType] =
    useState<FridgeIssueType | "">("");

  const [description, setDescription] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/fridge-reports/create",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            storeId,
            issueType,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to submit fridge report"
        );
        return;
      }

      setSuccess(
        "Fridge issue reported successfully. Management has been notified."
      );

      setIssueType("");
      setDescription("");

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

        {/* Issue Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Issue Type
          </label>

          <select
            value={issueType}
            onChange={(event) =>
              setIssueType(
                event.target
                  .value as FridgeIssueType
              )
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3"
            required
          >
            <option value="">
              Select the fridge issue
            </option>

            {fridgeIssues.map((issue) => (
              <option
                key={issue.value}
                value={issue.value}
              >
                {issue.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={5}
            placeholder="Describe what you found. For example: fridge was switched off when I arrived..."
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
          className="w-full rounded-lg bg-slate-800 px-4 py-3 font-semibold text-white transition hover:bg-slate-900 disabled:opacity-50"
        >
          {loading
            ? "Submitting Report..."
            : "Submit Fridge Report"}
        </button>
      </div>
    </form>
  );
}