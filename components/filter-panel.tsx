"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CarType, FilterState } from "@/types";

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
  sameArr(a.brands, b.brands) && sameArr(a.models, b.models) &&
  sameArr(a.transmissions, b.transmissions) && sameArr(a.colors, b.colors) &&
  sameArr(a.fuelTypes, b.fuelTypes) && sameRange(a.priceRange, b.priceRange) &&
  sameRange(a.yearRange, b.yearRange) && sameRange(a.mileageRange, b.mileageRange);

const fmtNum = (n: number) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const fmtKM = (n: number) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " km";

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
      <button type="button" onClick={() => setOpen(v => !v)}
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

export default function FilterPanel({ isOpen, onClose, filters, onFiltersChange, cars }: FilterPanelProps) {
  const { maxPrice, minYear, maxYear, maxMileage, brands, transmissions, colors, fuels, years, allModels } = useMemo(() => {
    const brands = Array.from(new Set(cars.map(c => c.brand))).sort();
    const transmissions = Array.from(new Set(cars.map(c => c.transmission))).sort();
    const colors = Array.from(new Set(cars.map(c => c.color))).sort();
    const fuels = Array.from(new Set(cars.map(c => c.fuelType))).sort();
    const years = Array.from(new Set(cars.map(c => c.year))).sort((a, b) => b - a);
    const allModels = Array.from(new Set(cars.map(c => c.model))).sort();
    return {
      maxPrice: Math.max(...cars.map(c => c.price), 0),
      minYear: Math.min(...cars.map(c => c.year), 1900),
      maxYear: Math.max(...cars.map(c => c.year), 2025),
      maxMileage: Math.max(...cars.map(c => c.mileage), 0),
      brands, transmissions, colors, fuels, years, allModels,
    };
  }, [cars]);

  const [selBrand, setSelBrand] = useState<string | null>(null);
  const [selModel, setSelModel] = useState<string | null>(null);
  const [selFuel, setSelFuel] = useState<string | null>(null);
  const [selTrans, setSelTrans] = useState<string | null>(null);
  const [selYear, setSelYear] = useState<number | null>(null);
  const [selColor, setSelColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [mileageRange, setMileageRange] = useState<[number, number]>([0, maxMileage]);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [minKmInput, setMinKmInput] = useState("");
  const [maxKmInput, setMaxKmInput] = useState("");

  // ✅ Solo propaga cambios si el usuario tocó algo
  const userInteracted = useRef(false);

  // Sincronizar estado local al abrir el panel
  useEffect(() => {
    if (!isOpen) return;
    userInteracted.current = false;
    setSelBrand(filters.brands[0] ?? null);
    setSelModel(filters.models[0] ?? null);
    setSelFuel(filters.fuelTypes[0] ?? null);
    setSelTrans(filters.transmissions[0] ?? null);
    setSelColor(filters.colors[0] ?? null);
    setSelYear(
      filters.yearRange[0] === minYear && filters.yearRange[1] === maxYear
        ? null
        : filters.yearRange[0]
    );
    setPriceRange(filters.priceRange);
    setMileageRange(filters.mileageRange);
  }, [isOpen]);

  const priceRanges = useMemo(() => [
    { label: "Hasta 10k", min: 0, max: 10000 },
    { label: "10k – 20k", min: 10000, max: 20000 },
    { label: "20k – 30k", min: 20000, max: 30000 },
    { label: "30k – 40k", min: 30000, max: 40000 },
    { label: "+ 40k", min: 40000, max: maxPrice },
  ], [maxPrice]);

  const mileageRanges = useMemo(() => [
    { label: "– 50k km", min: 0, max: 50000 },
    { label: "50 – 100k", min: 50000, max: 100000 },
    { label: "100 – 150k", min: 100000, max: 150000 },
    { label: "150 – 200k", min: 150000, max: 200000 },
    { label: "+ 200k km", min: 200000, max: maxMileage },
  ], [maxMileage]);

  const counts = useMemo(() => {
    const c = { brands: {} as Record<string, number>, models: {} as Record<string, number>, fuels: {} as Record<string, number>, trans: {} as Record<string, number>, years: {} as Record<number, number>, colors: {} as Record<string, number> };
    for (const car of cars) {
      c.brands[car.brand] = (c.brands[car.brand] || 0) + 1;
      c.models[car.model] = (c.models[car.model] || 0) + 1;
      c.fuels[car.fuelType] = (c.fuels[car.fuelType] || 0) + 1;
      c.trans[car.transmission] = (c.trans[car.transmission] || 0) + 1;
      c.years[car.year] = (c.years[car.year] || 0) + 1;
      c.colors[car.color] = (c.colors[car.color] || 0) + 1;
    }
    return c;
  }, [cars]);

  const models = useMemo(() =>
    selBrand ? Array.from(new Set(cars.filter(c => c.brand === selBrand).map(c => c.model))).sort() : allModels,
    [cars, allModels, selBrand]);

  const activeCount = [selBrand, selModel, selFuel, selTrans, selColor].filter(Boolean).length +
    (selYear ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== maxPrice ? 1 : 0) +
    (mileageRange[0] !== 0 || mileageRange[1] !== maxMileage ? 1 : 0);

  // ✅ Solo propaga si el usuario interactuó
  useEffect(() => {
    if (!isOpen || !userInteracted.current) return;
    const next: FilterState = {
      brands: selBrand ? [selBrand] : [],
      models: selModel ? [selModel] : [],
      fuelTypes: selFuel ? [selFuel] : [],
      transmissions: selTrans ? [selTrans] : [],
      colors: selColor ? [selColor] : [],
      yearRange: selYear ? [selYear, selYear] : [minYear, maxYear],
      priceRange,
      mileageRange,
    };
    if (!sameFilters(next, filters)) onFiltersChange(next);
  }, [selBrand, selModel, selFuel, selTrans, selYear, selColor, priceRange, mileageRange]);

  // Wrappers que marcan interacción del usuario
  const setBrand   = (v: string | null)      => { userInteracted.current = true; setSelBrand(v); };
  const setModel   = (v: string | null)      => { userInteracted.current = true; setSelModel(v); };
  const setFuel    = (v: string | null)      => { userInteracted.current = true; setSelFuel(v); };
  const setTrans   = (v: string | null)      => { userInteracted.current = true; setSelTrans(v); };
  const setYear    = (v: number | null)      => { userInteracted.current = true; setSelYear(v); };
  const setColor   = (v: string | null)      => { userInteracted.current = true; setSelColor(v); };
  const setPrice   = (v: [number, number])   => { userInteracted.current = true; setPriceRange(v); };
  const setMileage = (v: [number, number])   => { userInteracted.current = true; setMileageRange(v); };

  const clearAll = () => {
    userInteracted.current = true;
    setSelBrand(null); setSelModel(null); setSelFuel(null); setSelTrans(null); setSelYear(null); setSelColor(null);
    setMinPriceInput(""); setMaxPriceInput(""); setPriceRange([0, maxPrice]);
    setMinKmInput(""); setMaxKmInput(""); setMileageRange([0, maxMileage]);
    const cleared: FilterState = { brands: [], models: [], transmissions: [], priceRange: [0, maxPrice], yearRange: [minYear, maxYear], mileageRange: [0, maxMileage], colors: [], fuelTypes: [] };
    onFiltersChange(cleared); onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent className="w-full sm:w-[400px] flex flex-col p-0 gap-0 bg-white [&>button]:hidden" side="right">
        <SheetTitle className="sr-only">Filtros</SheetTitle>

        {/* Header */}
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

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-5 py-2">

          <Section title="Marca" badge={selBrand ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5">
              <Pill label="Todas" count={cars.length} selected={!selBrand} onClick={() => { setBrand(null); setModel(null); }} />
              {brands.map(b => (
                <Pill key={b} label={b} count={counts.brands[b] || 0} selected={selBrand === b}
                  onClick={() => { setBrand(selBrand === b ? null : b); setModel(null); }} />
              ))}
            </div>
          </Section>

          <Section title="Modelo" badge={selModel ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5">
              <Pill label="Todos" count={cars.length} selected={!selModel} onClick={() => setModel(null)} />
              {models.map(m => (
                <Pill key={m} label={m} count={counts.models[m] || 0} selected={selModel === m}
                  onClick={() => setModel(selModel === m ? null : m)} />
              ))}
            </div>
          </Section>

          <Section title="Año" badge={selYear ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5">
              <Pill label="Todos" count={cars.length} selected={!selYear} onClick={() => setYear(null)} />
              {years.map(y => (
                <Pill key={y} label={String(y)} count={counts.years[y] || 0} selected={selYear === y}
                  onClick={() => setYear(selYear === y ? null : y)} />
              ))}
            </div>
          </Section>

          <Section title="Combustible" badge={selFuel ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5">
              <Pill label="Todos" count={cars.length} selected={!selFuel} onClick={() => setFuel(null)} />
              {fuels.map(f => (
                <Pill key={f} label={f} count={counts.fuels[f] || 0} selected={selFuel === f}
                  onClick={() => setFuel(selFuel === f ? null : f)} />
              ))}
            </div>
          </Section>

          <Section title="Transmisión" badge={selTrans ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5">
              <Pill label="Todas" count={cars.length} selected={!selTrans} onClick={() => setTrans(null)} />
              {transmissions.map(t => (
                <Pill key={t} label={t} count={counts.trans[t] || 0} selected={selTrans === t}
                  onClick={() => setTrans(selTrans === t ? null : t)} />
              ))}
            </div>
          </Section>

          <Section title="Color" badge={selColor ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5">
              <Pill label="Todos" count={cars.length} selected={!selColor} onClick={() => setColor(null)} />
              {colors.map(c => (
                <Pill key={c} label={c} count={counts.colors[c] || 0} selected={selColor === c}
                  onClick={() => setColor(selColor === c ? null : c)} />
              ))}
            </div>
          </Section>

          <Section title="Precio" badge={priceRange[0] !== 0 || priceRange[1] !== maxPrice ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {priceRanges.map(r => (
                <Pill key={r.label} label={r.label} count={cars.filter(c => c.price >= r.min && c.price <= r.max).length}
                  selected={priceRange[0] === r.min && priceRange[1] === r.max}
                  onClick={() => { setPrice([r.min, r.max]); setMinPriceInput(String(r.min)); setMaxPriceInput(String(r.max)); }} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="Mín" value={minPriceInput} onChange={e => setMinPriceInput(e.target.value)} className="h-8 text-xs rounded-lg" />
              <span className="text-gray-300 text-sm shrink-0">–</span>
              <Input type="number" placeholder="Máx" value={maxPriceInput} onChange={e => setMaxPriceInput(e.target.value)} className="h-8 text-xs rounded-lg" />
              <button type="button" onClick={() => setPrice([Math.max(0, Number(minPriceInput || 0)), Math.min(maxPrice, Number(maxPriceInput || maxPrice))])}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
              </button>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 mt-2">
              <span>{fmtNum(priceRange[0])}</span><span>{fmtNum(priceRange[1])}</span>
            </div>
          </Section>

          <Section title="Kilometraje" badge={mileageRange[0] !== 0 || mileageRange[1] !== maxMileage ? 1 : 0}>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {mileageRanges.map(r => (
                <Pill key={r.label} label={r.label} count={cars.filter(c => c.mileage >= r.min && c.mileage <= r.max).length}
                  selected={mileageRange[0] === r.min && mileageRange[1] === r.max}
                  onClick={() => { setMileage([r.min, r.max]); setMinKmInput(String(r.min)); setMaxKmInput(String(r.max)); }} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="Mín" value={minKmInput} onChange={e => setMinKmInput(e.target.value)} className="h-8 text-xs rounded-lg" />
              <span className="text-gray-300 text-sm shrink-0">–</span>
              <Input type="number" placeholder="Máx" value={maxKmInput} onChange={e => setMaxKmInput(e.target.value)} className="h-8 text-xs rounded-lg" />
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

        {/* Footer */}
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