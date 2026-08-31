"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CarType, FilterState } from "@/types";
import { formatAmount, priceScale, ARS_AMOUNT_THRESHOLD, type PriceCurrency } from "@/lib/price";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  cars: CarType[];
}

const sameArr = (a: string[], b: string[]) =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);
const sameRange = (a: [number, number], b: [number, number]) => a[0] === b[0] && a[1] === b[1];
const sameFilters = (a: FilterState, b: FilterState) =>
  a.currency === b.currency &&
  sameArr(a.brands, b.brands) && sameArr(a.models, b.models) &&
  sameArr(a.transmissions, b.transmissions) && sameArr(a.colors, b.colors) &&
  sameArr(a.fuelTypes, b.fuelTypes) && sameRange(a.priceRange, b.priceRange) &&
  sameRange(a.yearRange, b.yearRange) && sameRange(a.mileageRange, b.mileageRange);

const fmtKM = (n: number) => formatAmount(n) + " km";
const nonempty = (v: string | undefined | null) => Boolean(v && v.trim());
const scaleOf = (car: CarType) => priceScale(car.price, car.currency);

function Pill({ label, count, selected, onClick }: { label: string; count: number; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        selected
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
      }`}>
      {label}
      <span className={`text-[10px] ${selected ? "text-white/50" : "text-gray-300"}`}>{count}</span>
    </button>
  );
}

function Section({ title, children, badge }: { title: string; children: React.ReactNode; badge?: number }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 group">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          {badge ? <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">{badge}</span> : null}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-300 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function usdBuckets(max: number) {
  const top = Math.max(max, 40000);
  return [
    { label: "Hasta USD 10 mil", min: 0, max: 10000 },
    { label: "USD 10 – 20 mil", min: 10000, max: 20000 },
    { label: "USD 20 – 30 mil", min: 20000, max: 30000 },
    { label: "USD 30 – 40 mil", min: 30000, max: 40000 },
    { label: "Más de USD 40 mil", min: 40000, max: top },
  ];
}

function arsBuckets(max: number) {
  const top = Math.max(max, 30_000_000);
  return [
    { label: "Hasta $ 10 millones", min: 0, max: 10_000_000 },
    { label: "$ 10 – 20 millones", min: 10_000_000, max: 20_000_000 },
    { label: "$ 20 – 30 millones", min: 20_000_000, max: 30_000_000 },
    { label: "Más de $ 30 millones", min: 30_000_000, max: top },
  ];
}

export default function FilterPanel({ isOpen, onClose, filters, onFiltersChange, cars }: FilterPanelProps) {
  const stats = useMemo(() => {
    const brands = Array.from(new Set(cars.map((c) => c.brand).filter(nonempty))).sort();
    const transmissions = Array.from(new Set(cars.map((c) => c.transmission).filter(nonempty))).sort();
    const colors = Array.from(new Set(cars.map((c) => c.color).filter(nonempty))).sort();
    const fuels = Array.from(new Set(cars.map((c) => c.fuelType).filter(nonempty))).sort();
    const years = Array.from(new Set(cars.map((c) => c.year))).sort((a, b) => b - a);
    const allModels = Array.from(new Set(cars.map((c) => c.model).filter(nonempty))).sort();
    const usdCars = cars.filter((c) => scaleOf(c) === "USD");
    const arsCars = cars.filter((c) => scaleOf(c) === "ARS");
    return {
      maxPrice: Math.max(...cars.map((c) => c.price), 0),
      maxUsd: Math.max(...usdCars.map((c) => c.price), 0),
      maxArs: Math.max(...arsCars.map((c) => c.price), 0),
      minYear: Math.min(...cars.map((c) => c.year), 1900),
      maxYear: Math.max(...cars.map((c) => c.year), 2025),
      maxMileage: Math.max(...cars.map((c) => c.mileage), 0),
      usdCount: usdCars.length,
      arsCount: arsCars.length,
      brands, transmissions, colors, fuels, years, allModels,
    };
  }, [cars]);

  const { maxPrice, maxUsd, maxArs, minYear, maxYear, maxMileage, usdCount, arsCount, brands, transmissions, colors, fuels, years, allModels } = stats;
  const showCurrency = usdCount > 0 && arsCount > 0;

  const [selBrand, setSelBrand] = useState<string | null>(null);
  const [selModel, setSelModel] = useState<string | null>(null);
  const [selFuel, setSelFuel] = useState<string | null>(null);
  const [selTrans, setSelTrans] = useState<string | null>(null);
  const [selYear, setSelYear] = useState<number | null>(null);
  const [selColor, setSelColor] = useState<string | null>(null);
  const [selCurrency, setSelCurrency] = useState<PriceCurrency | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [mileageRange, setMileageRange] = useState<[number, number]>([0, maxMileage]);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [minKmInput, setMinKmInput] = useState("");
  const [maxKmInput, setMaxKmInput] = useState("");

  const userInteracted = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    userInteracted.current = false;
    setSelBrand(filters.brands[0] ?? null);
    setSelModel(filters.models[0] ?? null);
    setSelFuel(filters.fuelTypes[0] ?? null);
    setSelTrans(filters.transmissions[0] ?? null);
    setSelColor(filters.colors[0] ?? null);
    setSelCurrency(filters.currency);
    setSelYear(
      filters.yearRange[0] === minYear && filters.yearRange[1] === maxYear
        ? null
        : filters.yearRange[0]
    );
    setPriceRange(filters.priceRange);
    setMileageRange(filters.mileageRange);
    setMinPriceInput(filters.priceRange[0] ? String(filters.priceRange[0]) : "");
    setMaxPriceInput("");
    setMinKmInput(filters.mileageRange[0] ? String(filters.mileageRange[0]) : "");
    setMaxKmInput("");
  }, [isOpen]);

  const counts = useMemo(() => {
    const c = {
      brands: {} as Record<string, number>,
      models: {} as Record<string, number>,
      fuels: {} as Record<string, number>,
      trans: {} as Record<string, number>,
      years: {} as Record<number, number>,
      colors: {} as Record<string, number>,
    };
    const pool = selBrand ? cars.filter((car) => car.brand === selBrand) : cars;
    for (const car of cars) {
      if (car.brand) c.brands[car.brand] = (c.brands[car.brand] || 0) + 1;
      if (car.fuelType) c.fuels[car.fuelType] = (c.fuels[car.fuelType] || 0) + 1;
      if (car.transmission) c.trans[car.transmission] = (c.trans[car.transmission] || 0) + 1;
      c.years[car.year] = (c.years[car.year] || 0) + 1;
      if (car.color) c.colors[car.color] = (c.colors[car.color] || 0) + 1;
    }
    for (const car of pool) {
      if (car.model) c.models[car.model] = (c.models[car.model] || 0) + 1;
    }
    return c;
  }, [cars, selBrand]);

  const models = useMemo(
    () => (selBrand ? Array.from(new Set(cars.filter((c) => c.brand === selBrand).map((c) => c.model).filter(nonempty))).sort() : allModels),
    [cars, allModels, selBrand]
  );

  const modelPoolCount = selBrand ? cars.filter((c) => c.brand === selBrand).length : cars.length;

  const priceCap = selCurrency === "USD" ? maxUsd : selCurrency === "ARS" ? maxArs : maxPrice;
  const priceActive = priceRange[0] !== 0 || priceRange[1] < priceCap;
  const mileageActive = mileageRange[0] !== 0 || mileageRange[1] !== maxMileage;

  const activeCount =
    [selBrand, selModel, selFuel, selTrans, selColor, selCurrency].filter(Boolean).length +
    (selYear ? 1 : 0) +
    (priceActive ? 1 : 0) +
    (mileageActive ? 1 : 0);

  useEffect(() => {
    if (!isOpen || !userInteracted.current) return;
    const next: FilterState = {
      brands: selBrand ? [selBrand] : [],
      models: selModel ? [selModel] : [],
      fuelTypes: selFuel ? [selFuel] : [],
      transmissions: selTrans ? [selTrans] : [],
      colors: selColor ? [selColor] : [],
      currency: selCurrency,
      yearRange: selYear ? [selYear, selYear] : [minYear, maxYear],
      priceRange,
      mileageRange,
    };
    if (!sameFilters(next, filters)) onFiltersChange(next);
  }, [selBrand, selModel, selFuel, selTrans, selYear, selColor, selCurrency, priceRange, mileageRange]);

  const setBrand = (v: string | null) => { userInteracted.current = true; setSelBrand(v); };
  const setModel = (v: string | null) => { userInteracted.current = true; setSelModel(v); };
  const setFuel = (v: string | null) => { userInteracted.current = true; setSelFuel(v); };
  const setTrans = (v: string | null) => { userInteracted.current = true; setSelTrans(v); };
  const setYear = (v: number | null) => { userInteracted.current = true; setSelYear(v); };
  const setColor = (v: string | null) => { userInteracted.current = true; setSelColor(v); };
  const setMileage = (v: [number, number]) => { userInteracted.current = true; setMileageRange(v); };

  const applyCurrency = (v: PriceCurrency | null) => {
    userInteracted.current = true;
    setSelCurrency(v);
    const cap = v === "USD" ? maxUsd : v === "ARS" ? maxArs : maxPrice;
    setPriceRange([0, cap]);
    setMinPriceInput("");
    setMaxPriceInput("");
  };

  const applyPrice = (currency: PriceCurrency, range: [number, number]) => {
    userInteracted.current = true;
    setSelCurrency(currency);
    setPriceRange(range);
    setMinPriceInput(range[0] ? String(range[0]) : "");
    setMaxPriceInput(String(range[1]));
  };

  const applyCustomPrice = () => {
    const cap = priceCap || maxPrice;
    const min = Math.max(0, Number(minPriceInput || 0));
    const max = Math.min(cap, Number(maxPriceInput || cap));
    const currency = selCurrency ?? (min >= ARS_AMOUNT_THRESHOLD || max >= ARS_AMOUNT_THRESHOLD ? "ARS" : usdCount ? "USD" : "ARS");
    applyPrice(currency, [min, max]);
  };

  const clearAll = () => {
    userInteracted.current = true;
    setSelBrand(null); setSelModel(null); setSelFuel(null); setSelTrans(null); setSelYear(null); setSelColor(null);
    setSelCurrency(null);
    setMinPriceInput(""); setMaxPriceInput(""); setPriceRange([0, maxPrice]);
    setMinKmInput(""); setMaxKmInput(""); setMileageRange([0, maxMileage]);
    onFiltersChange({
      brands: [], models: [], transmissions: [], colors: [], fuelTypes: [],
      currency: null, priceRange: [0, maxPrice], yearRange: [minYear, maxYear], mileageRange: [0, maxMileage],
    });
    onClose();
  };

  const visibleUsdBuckets = usdCount > 0 && (!selCurrency || selCurrency === "USD") ? usdBuckets(maxUsd) : [];
  const visibleArsBuckets = arsCount > 0 && (!selCurrency || selCurrency === "ARS") ? arsBuckets(maxArs) : [];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:w-[400px] flex flex-col p-0 gap-0 bg-white [&>button]:hidden" side="right">
        <SheetTitle className="sr-only">Filtros</SheetTitle>

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 10h10M11 16h2" />
            </svg>
            <span className="text-sm font-bold text-gray-900">Filtrar</span>
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">{activeCount}</span>
            )}
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">

          {showCurrency && (
            <Section title="Moneda" badge={selCurrency ? 1 : 0}>
              <div className="flex flex-wrap gap-1.5">
                <Pill label="Todas" count={cars.length} selected={!selCurrency} onClick={() => applyCurrency(null)} />
                <Pill label="USD" count={usdCount} selected={selCurrency === "USD"} onClick={() => applyCurrency(selCurrency === "USD" ? null : "USD")} />
                <Pill label="$ ARS" count={arsCount} selected={selCurrency === "ARS"} onClick={() => applyCurrency(selCurrency === "ARS" ? null : "ARS")} />
              </div>
            </Section>
          )}

          <Section title="Marca" badge={selBrand ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5">
              <Pill label="Todas" count={cars.length} selected={!selBrand} onClick={() => { setBrand(null); setModel(null); }} />
              {brands.map((b) => (
                <Pill key={b} label={b} count={counts.brands[b] || 0} selected={selBrand === b}
                  onClick={() => { setBrand(selBrand === b ? null : b); setModel(null); }} />
              ))}
            </div>
          </Section>

          <Section title="Modelo" badge={selModel ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5">
              <Pill label="Todos" count={modelPoolCount} selected={!selModel} onClick={() => setModel(null)} />
              {models.map((m) => (
                <Pill key={m} label={m} count={counts.models[m] || 0} selected={selModel === m}
                  onClick={() => setModel(selModel === m ? null : m)} />
              ))}
            </div>
          </Section>

          <Section title="Año" badge={selYear ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5">
              <Pill label="Todos" count={cars.length} selected={!selYear} onClick={() => setYear(null)} />
              {years.map((y) => (
                <Pill key={y} label={String(y)} count={counts.years[y] || 0} selected={selYear === y}
                  onClick={() => setYear(selYear === y ? null : y)} />
              ))}
            </div>
          </Section>

          {fuels.length > 0 && (
            <Section title="Combustible" badge={selFuel ? 1 : 0}>
              <div className="flex flex-wrap gap-1.5">
                <Pill label="Todos" count={cars.length} selected={!selFuel} onClick={() => setFuel(null)} />
                {fuels.map((f) => (
                  <Pill key={f} label={f} count={counts.fuels[f] || 0} selected={selFuel === f}
                    onClick={() => setFuel(selFuel === f ? null : f)} />
                ))}
              </div>
            </Section>
          )}

          {transmissions.length > 0 && (
            <Section title="Transmisión" badge={selTrans ? 1 : 0}>
              <div className="flex flex-wrap gap-1.5">
                <Pill label="Todas" count={cars.length} selected={!selTrans} onClick={() => setTrans(null)} />
                {transmissions.map((t) => (
                  <Pill key={t} label={t} count={counts.trans[t] || 0} selected={selTrans === t}
                    onClick={() => setTrans(selTrans === t ? null : t)} />
                ))}
              </div>
            </Section>
          )}

          {colors.length > 0 && (
            <Section title="Color" badge={selColor ? 1 : 0}>
              <div className="flex flex-wrap gap-1.5">
                <Pill label="Todos" count={cars.length} selected={!selColor} onClick={() => setColor(null)} />
                {colors.map((c) => (
                  <Pill key={c} label={c} count={counts.colors[c] || 0} selected={selColor === c}
                    onClick={() => setColor(selColor === c ? null : c)} />
                ))}
              </div>
            </Section>
          )}

          <Section title="Precio" badge={priceActive ? 1 : 0}>
            {visibleUsdBuckets.length > 0 && (
              <div className="mb-3">
                {showCurrency && <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Dólares</p>}
                <div className="flex flex-wrap gap-1.5">
                  {visibleUsdBuckets.map((r) => (
                    <Pill key={r.label} label={r.label}
                      count={cars.filter((c) => scaleOf(c) === "USD" && c.price >= r.min && c.price <= r.max).length}
                      selected={selCurrency === "USD" && priceRange[0] === r.min && priceRange[1] === r.max}
                      onClick={() => applyPrice("USD", [r.min, r.max])} />
                  ))}
                </div>
              </div>
            )}
            {visibleArsBuckets.length > 0 && (
              <div className="mb-3">
                {showCurrency && <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Pesos</p>}
                <div className="flex flex-wrap gap-1.5">
                  {visibleArsBuckets.map((r) => (
                    <Pill key={r.label} label={r.label}
                      count={cars.filter((c) => scaleOf(c) === "ARS" && c.price >= r.min && c.price <= r.max).length}
                      selected={selCurrency === "ARS" && priceRange[0] === r.min && priceRange[1] === r.max}
                      onClick={() => applyPrice("ARS", [r.min, r.max])} />
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="Mín" value={minPriceInput} onChange={(e) => setMinPriceInput(e.target.value)} className="h-8 text-xs rounded-lg" />
              <span className="text-gray-300 text-sm shrink-0">–</span>
              <Input type="number" placeholder="Máx" value={maxPriceInput} onChange={(e) => setMaxPriceInput(e.target.value)} className="h-8 text-xs rounded-lg" />
              <button type="button" onClick={applyCustomPrice}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
              </button>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 mt-2">
              <span>{formatAmount(priceRange[0])}</span><span>{formatAmount(priceRange[1])}</span>
            </div>
          </Section>

          <Section title="Kilometraje" badge={mileageActive ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                { label: "– 50 mil km", min: 0, max: 50000 },
                { label: "50 – 100 mil", min: 50000, max: 100000 },
                { label: "100 – 150 mil", min: 100000, max: 150000 },
                { label: "150 – 200 mil", min: 150000, max: 200000 },
                { label: "+ 200 mil km", min: 200000, max: maxMileage },
              ].map((r) => (
                <Pill key={r.label} label={r.label} count={cars.filter((c) => c.mileage >= r.min && c.mileage <= r.max).length}
                  selected={mileageRange[0] === r.min && mileageRange[1] === r.max}
                  onClick={() => { setMileage([r.min, r.max]); setMinKmInput(String(r.min)); setMaxKmInput(String(r.max)); }} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="Mín" value={minKmInput} onChange={(e) => setMinKmInput(e.target.value)} className="h-8 text-xs rounded-lg" />
              <span className="text-gray-300 text-sm shrink-0">–</span>
              <Input type="number" placeholder="Máx" value={maxKmInput} onChange={(e) => setMaxKmInput(e.target.value)} className="h-8 text-xs rounded-lg" />
              <button type="button" onClick={() => setMileage([Math.max(0, Number(minKmInput || 0)), Math.min(maxMileage, Number(maxKmInput || maxMileage))])}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
              </button>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 mt-2">
              <span>{fmtKM(mileageRange[0])}</span><span>{fmtKM(mileageRange[1])}</span>
            </div>
          </Section>

          <div className="h-4" />
        </div>

        <div className="border-t border-gray-100 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex gap-2.5 bg-white">
          <Button variant="outline" onClick={clearAll}
            className="flex-1 rounded-xl h-11 text-sm font-medium border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400">
            {activeCount > 0 ? `Limpiar (${activeCount})` : "Limpiar"}
          </Button>
          <Button onClick={onClose}
            className="flex-1 rounded-xl h-11 bg-gray-900 hover:bg-black text-white text-sm font-semibold">
            Ver resultados
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
