"use client";

import { useMemo, useState } from "react";

import type {
  FridgeReport,
  Product,
  ReturnItem,
  StockBatch,
  Store,
  User,
} from "@/lib/types";

interface AdminReportsProps {
  stockBatches: StockBatch[];
  returns: ReturnItem[];
  fridgeReports: FridgeReport[];
  products: Product[];
  stores: Store[];
  users: User[];
}

type Tab =
  | "overview"
  | "stock"
  | "returns"
  | "fridges";

function getDaysUntilExpiry(expiryDate: string) {
  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const difference =
    expiry.getTime() - today.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
}

function formatDate(
  dateString: string,
  includeTime = true
) {
  const options: Intl.DateTimeFormatOptions =
    includeTime
      ? {
          dateStyle: "medium",
          timeStyle: "short",
        }
      : {
          dateStyle: "medium",
        };

  return new Intl.DateTimeFormat(
    "en-ZA",
    options
  ).format(new Date(dateString));
}

function getReturnReasonLabel(reason: string) {
  const labels: Record<string, string> = {
    expired: "Expired",
    damaged: "Damaged",
    melted: "Melted",
    other: "Other",
  };

  return labels[reason] || reason;
}

function getFridgeIssueLabel(issue: string) {
  const labels: Record<string, string> = {
    switched_off: "Fridge Switched Off",
    competitor_products: "Competitor Products",
    non_company_products: "Non-Company Products",
    damaged: "Damaged",
    dirty: "Dirty / Poorly Maintained",
    temperature_problem: "Temperature Problem",
    inaccessible: "Inaccessible",
    other: "Other",
  };

  return labels[issue] || issue;
}

function getReturnStatusClass(status: string) {
  switch (status) {
    case "submitted":
      return "bg-orange-50 text-orange-700";

    case "approved":
      return "bg-blue-50 text-blue-700";

    case "collected":
      return "bg-green-50 text-green-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getFridgeStatusClass(status: string) {
  switch (status) {
    case "open":
      return "bg-red-50 text-red-700";

    case "under_review":
      return "bg-orange-50 text-orange-700";

    case "resolved":
      return "bg-green-50 text-green-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export default function AdminReports({
  stockBatches,
  returns,
  fridgeReports,
  products,
  stores,
  users,
}: AdminReportsProps) {
  const [activeTab, setActiveTab] =
    useState<Tab>("overview");

  /*
   * Create lookup maps so we can quickly convert:
   *
   * productId -> Product Name
   * storeId   -> Store Name
   * userId    -> User Name
   */
  const productMap = useMemo(() => {
    return new Map(
      products.map((product) => [
        product.id,
        product,
      ])
    );
  }, [products]);

  const storeMap = useMemo(() => {
    return new Map(
      stores.map((store) => [
        store.id,
        store,
      ])
    );
  }, [stores]);

  const userMap = useMemo(() => {
    return new Map(
      users.map((user) => [
        user.id,
        user,
      ])
    );
  }, [users]);

  /*
   * Expiry risk means:
   *
   * Expired stock OR
   * Stock expiring within 10 days
   */
  const expiryRiskStock = useMemo(() => {
    return stockBatches
      .filter((batch) => {
        const days = getDaysUntilExpiry(
          batch.expiryDate
        );

        return days <= 10;
      })
      .sort(
        (a, b) =>
          getDaysUntilExpiry(a.expiryDate) -
          getDaysUntilExpiry(b.expiryDate)
      );
  }, [stockBatches]);

  const expiredStock = useMemo(() => {
    return stockBatches.filter(
      (batch) =>
        getDaysUntilExpiry(
          batch.expiryDate
        ) < 0
    );
  }, [stockBatches]);

  const openReturns = useMemo(() => {
    return returns.filter(
      (item) => item.status !== "collected"
    );
  }, [returns]);

  const openFridgeReports = useMemo(() => {
    return fridgeReports.filter(
      (report) =>
        report.status !== "resolved"
    );
  }, [fridgeReports]);

  function getProductName(productId: string) {
    return (
      productMap.get(productId)?.name ||
      "Unknown Product"
    );
  }

  function getStoreName(storeId: string) {
    return (
      storeMap.get(storeId)?.name ||
      "Unknown Store"
    );
  }

  function getUserName(userId: string) {
    return (
      userMap.get(userId)?.name ||
      "Unknown User"
    );
  }

  const recentActivity = useMemo(() => {
    const activity = [
      ...stockBatches.map((batch) => ({
        id: batch.id,
        type: "stock",
        date: batch.capturedAt,
        title: "Stock Check Captured",
        description: `${getProductName(
          batch.productId
        )} · ${getStoreName(batch.storeId)}`,
      })),

      ...returns.map((item) => ({
        id: item.id,
        type: "return",
        date: item.reportedAt,
        title: `Return: ${getReturnReasonLabel(
          item.reason
        )}`,
        description: `${getProductName(
          item.productId
        )} · ${getStoreName(item.storeId)}`,
      })),

      ...fridgeReports.map((report) => ({
        id: report.id,
        type: "fridge",
        date: report.reportedAt,
        title: `Fridge: ${getFridgeIssueLabel(
          report.issueType
        )}`,
        description: getStoreName(
          report.storeId
        ),
      })),
    ];

    return activity
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
      .slice(0, 8);
  }, [
    stockBatches,
    returns,
    fridgeReports,
    products,
    stores,
  ]);

  return (
    <div>
      {/* ============================
          SUMMARY CARDS
      ============================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Stock Batches
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stockBatches.length}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Stock records captured
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-red-600">
            Expiry Risk
          </p>

          <p className="mt-2 text-3xl font-bold text-red-700">
            {expiryRiskStock.length}
          </p>

          <p className="mt-1 text-sm text-red-500">
            {expiredStock.length} expired
          </p>
        </div>

        <div className="rounded-xl bg-orange-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-orange-600">
            Open Returns
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-700">
            {openReturns.length}
          </p>

          <p className="mt-1 text-sm text-orange-500">
            Awaiting collection
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">
            Fridge Issues
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {openFridgeReports.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Open or under review
          </p>
        </div>
      </div>

      {/* ============================
          TABS
      ============================ */}

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-slate-200">
        <button
          type="button"
          onClick={() =>
            setActiveTab("overview")
          }
          className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("stock")
          }
          className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${
            activeTab === "stock"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Stock
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("returns")
          }
          className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${
            activeTab === "returns"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Returns
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("fridges")
          }
          className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${
            activeTab === "fridges"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Fridge Reports
        </button>
      </div>

      {/* ============================
          OVERVIEW TAB
      ============================ */}

      {activeTab === "overview" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Expiry Risk */}

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Expiry Risk
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Products needing attention
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("stock")
                }
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                View Stock
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {expiryRiskStock
                .slice(0, 5)
                .map((batch) => {
                  const days =
                    getDaysUntilExpiry(
                      batch.expiryDate
                    );

                  return (
                    <div
                      key={batch.id}
                      className="rounded-lg bg-red-50 p-4"
                    >
                      <p className="font-semibold text-slate-900">
                        {getProductName(
                          batch.productId
                        )}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {getStoreName(
                          batch.storeId
                        )}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Quantity: {batch.quantity}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-red-600">
                        {days < 0
                          ? `Expired ${Math.abs(
                              days
                            )} day(s) ago`
                          : days === 0
                          ? "Expires today"
                          : `Expires in ${days} day(s)`}
                      </p>
                    </div>
                  );
                })}

              {expiryRiskStock.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">
                  No stock is currently at expiry risk.
                </p>
              )}
            </div>
          </section>

          {/* Recent Activity */}

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest activity across all stores
            </p>

            <div className="mt-5 space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="border-b border-slate-100 pb-4 last:border-0"
                >
                  <p className="font-semibold text-slate-900">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {activity.description}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(activity.date)}
                  </p>
                </div>
              ))}

              {recentActivity.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">
                  No activity has been recorded yet.
                </p>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ============================
          STOCK TAB
      ============================ */}

      {activeTab === "stock" && (
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Stock Batches
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              All stock captured by field sales representatives.
            </p>
          </div>

          <div className="space-y-3">
            {stockBatches
              .slice()
              .sort(
                (a, b) =>
                  new Date(
                    b.capturedAt
                  ).getTime() -
                  new Date(
                    a.capturedAt
                  ).getTime()
              )
              .map((batch) => {
                const days =
                  getDaysUntilExpiry(
                    batch.expiryDate
                  );

                const isRisk = days <= 10;

                return (
                  <article
                    key={batch.id}
                    className={`rounded-lg border p-4 ${
                      isRisk
                        ? "border-red-200 bg-red-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {getProductName(
                            batch.productId
                          )}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Store:{" "}
                          {getStoreName(
                            batch.storeId
                          )}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {batch.quantity}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Captured by:{" "}
                          {getUserName(
                            batch.capturedBy
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Captured:{" "}
                          {formatDate(
                            batch.capturedAt
                          )}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-sm text-slate-500">
                          Expiry Date
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {formatDate(
                            batch.expiryDate,
                            false
                          )}
                        </p>

                        <p
                          className={`mt-2 text-sm font-semibold ${
                            days <= 10
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {days < 0
                            ? `Expired ${Math.abs(
                                days
                              )} day(s) ago`
                            : days === 0
                            ? "Expires today"
                            : `Expires in ${days} day(s)`}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}

            {stockBatches.length === 0 && (
              <p className="py-12 text-center text-slate-500">
                No stock checks have been submitted yet.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ============================
          RETURNS TAB
      ============================ */}

      {activeTab === "returns" && (
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Returns
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              All product returns submitted by sales representatives.
            </p>
          </div>

          <div className="space-y-3">
            {returns
              .slice()
              .sort(
                (a, b) =>
                  new Date(
                    b.reportedAt
                  ).getTime() -
                  new Date(
                    a.reportedAt
                  ).getTime()
              )
              .map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {getProductName(
                          item.productId
                        )}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Store:{" "}
                        {getStoreName(
                          item.storeId
                        )}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Reason:{" "}
                        {getReturnReasonLabel(
                          item.reason
                        )}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Submitted by:{" "}
                        {getUserName(
                          item.reportedBy
                        )}
                      </p>

                      {item.notes && (
                        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                          {item.notes}
                        </div>
                      )}
                    </div>

                    <div className="sm:text-right">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getReturnStatusClass(
                          item.status
                        )}`}
                      >
                        {formatStatus(item.status)}
                      </span>

                      <p className="mt-3 text-xs text-slate-400">
                        {formatDate(
                          item.reportedAt
                        )}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

            {returns.length === 0 && (
              <p className="py-12 text-center text-slate-500">
                No returns have been submitted yet.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ============================
          FRIDGE REPORTS TAB
      ============================ */}

      {activeTab === "fridges" && (
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Fridge Reports
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Fridge abuse, damage and maintenance issues.
            </p>
          </div>

          <div className="space-y-3">
            {fridgeReports
              .slice()
              .sort(
                (a, b) =>
                  new Date(
                    b.reportedAt
                  ).getTime() -
                  new Date(
                    a.reportedAt
                  ).getTime()
              )
              .map((report) => (
                <article
                  key={report.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {getFridgeIssueLabel(
                          report.issueType
                        )}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Store:{" "}
                        {getStoreName(
                          report.storeId
                        )}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Reported by:{" "}
                        {getUserName(
                          report.reportedBy
                        )}
                      </p>

                      {report.description && (
                        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                          {report.description}
                        </div>
                      )}
                    </div>

                    <div className="sm:text-right">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getFridgeStatusClass(
                          report.status
                        )}`}
                      >
                        {formatStatus(
                          report.status
                        )}
                      </span>

                      <p className="mt-3 text-xs text-slate-400">
                        {formatDate(
                          report.reportedAt
                        )}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

            {fridgeReports.length === 0 && (
              <p className="py-12 text-center text-slate-500">
                No fridge reports have been submitted yet.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}