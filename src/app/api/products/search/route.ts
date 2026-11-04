import { NextRequest, NextResponse } from "next/server";
import { getProducts, getCategories } from "@/db/store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    if (!q) {
      return NextResponse.json({ products: [], totalMatches: 0 });
    }

    const [allProducts, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    const categoryMap = new Map(categories.map((c: any) => [c.id, c.name]));

    const matches = allProducts.filter((p: any) => {
      const nameMatch = (p.name || "").toLowerCase().includes(q);
      const descMatch = (p.description || "").toLowerCase().includes(q);
      const catName = (categoryMap.get(p.categoryId) || "").toLowerCase();
      const catMatch = catName.includes(q);
      const variantMatch = (p.variants || []).some(
        (v: any) =>
          (v.color || "").toLowerCase().includes(q) ||
          (v.size || "").toLowerCase().includes(q) ||
          (v.sku || "").toLowerCase().includes(q)
      );
      return nameMatch || descMatch || catMatch || variantMatch;
    });

    const formatted = matches.slice(0, 6).map((p: any) => {
      const totalStock = (p.variants || []).reduce(
        (acc: number, v: any) => acc + (v.stockQuantity || 0),
        0
      );
      const uniqueColors = Array.from(
        new Set((p.variants || []).map((v: any) => v.color))
      ).slice(0, 4);

      const uniqueColorHexes = Array.from(
        new Set(
          (p.variants || [])
            .map((v: any) => v.colorHex)
            .filter((h: any) => typeof h === "string" && h.startsWith("#"))
        )
      ).slice(0, 4);

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        frontImageUrl: p.frontImageUrl,
        categoryName: categoryMap.get(p.categoryId) || "Tullipio Collection",
        colors: uniqueColors,
        colorHexes: uniqueColorHexes,
        inStock: totalStock > 0,
        totalStock,
      };
    });

    return NextResponse.json({
      products: formatted,
      totalMatches: matches.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to search products", products: [] },
      { status: 500 }
    );
  }
}

