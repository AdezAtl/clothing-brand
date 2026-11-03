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
} from "@/app/actions/admin-actions";
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
      sku: "TLP-NEW-M",
      size: "M",
      color: "Emerald Green",
      colorHex: "#0D3826",
      priceOverrideNaira: "",
      stockQuantity: 5,
    },
    {
      sku: "TLP-NEW-L",
      size: "L",
      color: "Emerald Green",
      colorHex: "#0D3826",
      priceOverrideNaira: "",
      stockQuantity: 4,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Quick inline stock adjustment
  const handleStockChange = async (
    productId: string,
    variantId: string,
    delta: number
  ) => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.map((v) =>
              v.id === variantId
                ? { ...v, stockQuantity: Math.max(0, v.stockQuantity + delta) }
                : v
            ),
          };
        }
        return p;
      })
    );

    await updateStockAction(variantId, delta);
  };

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

  // Filter products by selected category
  const filteredData = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.categoryId === selectedCategory);
  }, [products, selectedCategory]);

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
              className="w-10 h-12 object-cover bg-stone-200 border border-stone-200 shrink-0"
            />
            <div>
              <p className="font-medium text-stone-900 leading-tight">
                {row.original.name}
              </p>
              <p className="text-[11px] font-mono text-stone-500 mt-0.5">
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
            <span className="text-xs text-stone-600 font-mono">
              {cat?.name || "Uncategorized"}
            </span>
          );
        },
      },
      {
        accessorKey: "basePrice",
        header: "Base Price (NGN)",
        cell: ({ row }) => (
          <span className="font-mono font-semibold text-stone-900">
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
            <div className="space-y-1.5 py-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-stone-500">
                  {row.original.variants.length} SKUs
                </span>
                <span>•</span>
                <span
                  className={`font-semibold font-mono ${
                    totalStock < 5 ? "text-amber-800" : "text-emerald-800"
                  }`}
                >
                  {totalStock} units total
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {row.original.variants.map((v) => (
                  <div
                    key={v.id}
                    className="inline-flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-2 py-0.5 text-[11px] font-mono"
                  >
                    <span
                      className="w-2 h-2 rounded-full border border-stone-300"
                      style={{ backgroundColor: v.colorHex }}
                    />
                    <span>{v.size}</span>
                    <span className="text-stone-400">:</span>
                    <span className="font-bold text-stone-900">
                      {v.stockQuantity}
                    </span>
                    <div className="flex items-center ml-1 border-l border-stone-200 pl-1">
                      <button
                        onClick={() =>
                          handleStockChange(row.original.id, v.id, -1)
                        }
                        className="px-1 text-stone-500 hover:text-stone-900"
                        title="Decrement stock by 1"
                      >
                        -
                      </button>
                      <button
                        onClick={() =>
                          handleStockChange(row.original.id, v.id, 1)
                        }
                        className="px-1 text-stone-500 hover:text-stone-900"
                        title="Increment stock by 1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        },
      },
    ],
    [categories, products]
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
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Garment & SKUs</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search garment title or SKU..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 focus:border-stone-900 focus:ring-0 text-stone-900 bg-stone-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 uppercase font-mono">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-stone-300 px-3 py-1.5 bg-stone-50 text-stone-800 focus:border-stone-900"
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

      {/* TanStack Table Container */}
      <div className="bg-white border border-stone-200 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono uppercase">
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

        {/* Pagination controls */}
        <div className="p-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border border-stone-300 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border border-stone-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* New Garment & Variant Matrix Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full p-6 md:p-8 border border-stone-300 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-stone-200 pb-4">
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
                className="p-1 text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-6">
              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
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
                    className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 bg-stone-50"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Base Price (Naira ₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={basePriceNaira}
                    onChange={(e) => setBasePriceNaira(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Description & Atelier Craft Notes *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Fabric composition, weight in GSM, hand-embroidery details, and silhouette specifications."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 focus:border-stone-900 focus:ring-0"
                />
              </div>

              {/* Front & Back Images (Cloudflare R2 Presigned Setup) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-stone-50 border border-stone-200">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Front View Image URL (R2 / CDN) *
                  </label>
                  <input
                    type="url"
                    required
                    value={frontImageUrl}
                    onChange={(e) => setFrontImageUrl(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Back View Image URL (For Customer Flip) *
                  </label>
                  <input
                    type="url"
                    required
                    value={backImageUrl}
                    onChange={(e) => setBackImageUrl(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 font-mono"
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
                    className="text-xs uppercase font-mono tracking-wider text-stone-700 hover:text-stone-950 inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Variant Row</span>
                  </button>
                </div>

                <div className="border border-stone-200 divide-y divide-stone-100 max-h-52 overflow-y-auto">
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
                          className="w-full text-xs p-1.5 border border-stone-300 font-mono"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Size (e.g. L)"
                          value={v.size}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[i].size = e.target.value;
                            setVariants(updated);
                          }}
                          className="w-full text-xs p-1.5 border border-stone-300 font-mono"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Color (e.g. Emerald)"
                          value={v.color}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[i].color = e.target.value;
                            setVariants(updated);
                          }}
                          className="w-full text-xs p-1.5 border border-stone-300"
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
                          className="w-full text-xs p-1.5 border border-stone-300 font-mono"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(i)}
                          className="text-stone-400 hover:text-red-700 p-1"
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
                  className="px-4 py-2 border border-stone-300 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-stone-950 text-stone-50 text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors flex items-center gap-2"
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

