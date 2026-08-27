"use client";

import type { PriceCurrency } from "@/lib/price";

const options: { value: PriceCurrency; label: string }[] = [
  { value: "USD", label: "USD" },
  { value: "ARS", label: "$ ARS" },
];

export default function CurrencyToggle({
  value,
  onChange,
  size = "md",
}: {
  value: PriceCurrency;
  onChange: (currency: PriceCurrency) => void;
  size?: "sm" | "md";
}) {
  const compact = size === "sm";
  return (
    <div
      className="inline-flex shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-0.5"
      role="group"
      aria-label="Moneda del precio"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-lg font-semibold transition-colors ${
              compact ? "h-7 px-2.5 text-[11px]" : "h-9 px-3.5 text-xs"
            } ${
              active
                ? "bg-ink text-white shadow-sm"
                : "text-gray-500 hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
