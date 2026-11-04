"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { SeedProduct, SeedCategory } from "@/db/seed-data";
import { formatPriceNGN } from "@/lib/utils";
import {
  createNewProductAction,
  updateStockAction,
} from "@/actions";
import {
  Plus,
  Search,
  Upload,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ProductManagementClientProps {
  initialProducts: SeedProduct[];
  categories: SeedCategory[];
}

export function ProductManagementClient({
  initialProducts,
  categories,
}: ProductManagementClientProps) {
  const [products, setProducts] = useState<SeedProduct[]>(initialProducts);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Product Modal Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [description, setDescription] = useState("");
  const [basePriceNaira, setBasePriceNaira] = useState("85000");
  const [frontImageUrl, setFrontImageUrl] = useState(
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000"
  );
  const [backImageUrl, setBackImageUrl] = useState(
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000"
  );

  // Dynamic Variant Matrix
  const [variants, setVariants] = useState<
    Array<{
      sku: string;
      size: string;
      color: string;
      colorHex: string;
      priceOverrideNaira: string;
      stockQuantity: number;
    }>
  >([
    {
      sku: "TLP-AGB-01-M",
      size: "M",
      color: "Emerald Green",
      colorHex: "#0d5c3a",
      priceOverrideNaira: "",
      stockQuantity: 4,
    },
    {
      sku: "TLP-AGB-01-L",
      size: "L",
      color: "Emerald Green",
      colorHex: "#0d5c3a",
      priceOverrideNaira: "",
      stockQuantity: 8,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Stock edit states
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockInputValue, setStockInputValue] = useState<number>(0);
  const [stockUpdating, setStockUpdating] = useState(false);

  const handleUpdateStock = async (variantId: string) => {
    setStockUpdating(true);
    try {
      const res = await updateStockAction(variantId, stockInputValue);
      if (res.success) {
        setProducts((prev) =>
          prev.map((prod) => ({
            ...prod,
            variants: prod.variants.map((v) =>
              v.id === variantId ? { ...v, stockQuantity: stockInputValue } : v
            ),
          }))
        );
        setEditingStockId(null);
      }
    } finally {
      setStockUpdating(false);
    }
  };

  const filteredData = useMemo(() => {
    let result = products;
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }
    return result;
  }, [products, selectedCategory]);

  const handleAddVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      {
        sku: `TLP-${name ? name.slice(0, 3).toUpperCase() : "GAR"}-${
          prev.length + 1
        }`,
        size: "XL",
        color: "Onyx Black",
        colorHex: "#111111",
        priceOverrideNaira: "",
        stockQuantity: 5,
      },
    ]);
  };

  const handleRemoveVariantRow = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      const basePriceKobo = Math.round(parseFloat(basePriceNaira) * 100);

      const formattedVariants = variants.map((v) => ({
        sku: v.sku,
        size: v.size,
        color: v.color,
        colorHex: v.colorHex,
        priceOverride: v.priceOverrideNaira
          ? Math.round(parseFloat(v.priceOverrideNaira) * 100)
          : null,
        stockQuantity: Number(v.stockQuantity),
      }));

      const res = await createNewProductAction({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        categoryId,
        description,
        basePrice: basePriceKobo,
        frontImageUrl,
        backImageUrl,
        variants: formattedVariants,
      });

      if (!res.success) {
        throw new Error(res.error);
      }

      if (res.product) {
        setProducts((prev) => [res.product as SeedProduct, ...prev]);
      }
      setIsModalOpen(false);
      // Reset form
      setName("");
      setDescription("");
    } catch (err: any) {
      setFormError(err.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  // TanStack Table Column Definitions
  const columns = useMemo<ColumnDef<SeedProduct>[]>(
    () => [
      {
        accessorKey: "frontImageUrl",
        header: "Garment",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.frontImageUrl}
              alt={row.original.name}
              className="w-11 h-14 object-cover bg-stone-200 rounded-xl border border-stone-200 shrink-0"
            />
            <div>
              <p className="font-semibold text-stone-900 leading-tight">
                {row.original.name}
              </p>
              <p className="text-[11px] font-mono text-stone-400 mt-0.5">
                /{row.original.slug}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "categoryId",
        header: "Category",
        cell: ({ row }) => {
          const cat = categories.find((c) => c.id === row.original.categoryId);
          return (
            <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-mono">
              {cat?.name || "Uncategorized"}
            </span>
          );
        },
      },
      {
        accessorKey: "basePrice",
        header: "Base Price (NGN)",
        cell: ({ row }) => (
          <span className="font-mono font-bold text-stone-950">
            {formatPriceNGN(row.original.basePrice)}
          </span>
        ),
      },
      {
        id: "variants",
        header: "Variant Matrix & Stock Levels",
        cell: ({ row }) => {
          const totalStock = row.original.variants.reduce(
            (sum, v) => sum + v.stockQuantity,
            0
          );
          return (
            <div className="space-y-2 py-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-stone-500">
                  {row.original.variants.length} SKUs
                </span>
                <span>•</span>
                <span
                  className={`font-semibold font-mono px-2 py-0.5 rounded-full text-[10px] ${
                    totalStock < 5 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {totalStock} units total
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {row.original.variants.map((v) => (
                  <div
                    key={v.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-[11px]"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                      style={{ backgroundColor: v.colorHex }}
                      title={v.color}
                    />
                    <span className="font-mono font-semibold">{v.size}</span>
                    <span className="text-stone-400">•</span>
                    {editingStockId === v.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          className="w-12 px-1 py-0.5 text-[11px] border border-stone-400 rounded-md font-mono"
                          value={stockInputValue}
                          onChange={(e) =>
                            setStockInputValue(parseInt(e.target.value, 10) || 0)
                          }
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateStock(v.id)}
                          disabled={stockUpdating}
                          className="text-emerald-700 hover:text-emerald-900 p-0.5"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingStockId(null)}
                          className="text-stone-400 hover:text-stone-700 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingStockId(v.id);
                          setStockInputValue(v.stockQuantity);
                        }}
                        className={`font-mono hover:underline cursor-pointer ${
                          v.stockQuantity < 3
                            ? "text-amber-700 font-bold"
                            : "text-stone-700"
                        }`}
                        title="Click to edit stock count"
                      >
                        {v.stockQuantity} in stock
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        },
      },
    ],
    [categories, products, editingStockId, stockInputValue, stockUpdating]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
            Catalog & Inventory
          </span>
          <h1 className="text-2xl font-serif text-stone-950 mt-1">
            Products & Multi-Attribute Matrix
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-all shadow-sm active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Garment & SKUs</span>
        </button>
      </div>

      {/* Curvy Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search garment title or SKU..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 bg-stone-50/60 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 uppercase font-mono">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-stone-300 rounded-full px-4 py-2 bg-stone-50 text-stone-800 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TanStack Table Container with Curvy Frame */}
      <div className="bg-white rounded-[28px] border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-mono uppercase text-[11px]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-3 px-4 font-semibold">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-stone-100">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-stone-500">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/70 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4 align-top">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 bg-stone-50/40">
          <span className="font-mono text-[11px]">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-1.5 rounded-full border border-stone-300 disabled:opacity-40 hover:bg-white text-xs font-medium transition-all"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-1.5 rounded-full border border-stone-300 disabled:opacity-40 hover:bg-white text-xs font-medium transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* New Garment & Variant Matrix Modal with Curvy Edges */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full p-6 md:p-8 rounded-[32px] border border-stone-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-stone-100 pb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Register New Garment & Multi-Attribute SKUs
                </h2>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Direct entry into Drizzle ORM PostgreSQL catalog
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-6">
              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Indigo Jacquard Agbada"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-stone-50"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Base Price (Naira ₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={basePriceNaira}
                    onChange={(e) => setBasePriceNaira(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 font-mono bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 font-mono bg-stone-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Description & Atelier Craft Notes *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Fabric composition, weight in GSM, hand-embroidery details, and silhouette specifications."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-stone-50/50"
                />
              </div>

              {/* Primary & Secondary Garment Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Primary Image URL (R2 / CDN) *
                  </label>
                  <input
                    type="url"
                    required
                    value={frontImageUrl}
                    onChange={(e) => setFrontImageUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Secondary Image URL (Gallery) *
                  </label>
                  <input
                    type="url"
                    required
                    value={backImageUrl}
                    onChange={(e) => setBackImageUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 font-mono bg-white"
                  />
                </div>
              </div>

              {/* Dynamic Variant Matrix Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                    Multi-Attribute Variant Matrix (Size + Color SKUs)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="text-xs uppercase font-mono tracking-wider text-stone-700 hover:text-stone-950 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-stone-300 hover:bg-stone-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Variant Row</span>
                  </button>
                </div>

                <div className="rounded-2xl border border-stone-200 divide-y divide-stone-100 max-h-52 overflow-y-auto">
                  {variants.map((v, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white grid grid-cols-6 gap-2 items-center text-xs"
                    >
                      <div className="col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="SKU Code"
                          value={v.sku}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[i].sku = e.target.value;
                            setVariants(updated);
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-stone-300 font-mono"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Size"
                          value={v.size}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[i].size = e.target.value;
                            setVariants(updated);
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-stone-300 font-mono"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Color"
                          value={v.color}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[i].color = e.target.value;
                            setVariants(updated);
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-stone-300"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="Stock"
                          value={v.stockQuantity}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[i].stockQuantity = parseInt(e.target.value, 10) || 0;
                            setVariants(updated);
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-stone-300 font-mono"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(i)}
                          className="text-stone-400 hover:text-red-700 p-1.5 rounded-full hover:bg-stone-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-stone-300 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 rounded-full bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <span>Register Garment</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
