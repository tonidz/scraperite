import { getDictionary } from "@/i18n/get-dictionary";
import type { ValidLocale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Dictionary } from "@/i18n/config";
import { ProductSeries } from "@/components/products/product-series";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SRTD6_PRODUCTS = [
  { id: "SRTD6GPO", image: "/SRTD6GPO_front_45.jpg" },
  { id: "SRTD6MBL", image: "/SRTD6MBL_front_45.jpg" },
  { id: "SRTD6HYL", image: "/SRTD6HYL_front_45.jpg" },
];

const SRTD25_PRODUCTS = [{ id: "SRTD25GPO", image: "/srtd25gpo_front_45.jpg" }];

const SRTD33_PRODUCTS = [
  { id: "SRTD33GPO", image: "/SRTD33GPO-_45.jpg" },
  { id: "SRTD33MBL", image: "/SRTD33MBL-45.jpg" },
];

const SRT33_PRODUCTS = [
  { id: "SRT33GPO", image: "/SRT33GPO.jpg" },
  { id: "SRT33MBL", image: "/SRT33MBL.jpg" },
];

const SRTW6_PRODUCTS = [{ id: "SRTW6GPO", image: "/SRTW6GPO_45_white.jpg" }];

const SRS30_PRODUCTS = [
  { id: "SRS30GPO", image: "/SRS30GPO_-_white.jpg" },
  { id: "SRS30MBL", image: "/SRS30MBL_-_white.jpg" },
  { id: "SRS30HYL", image: "/SRS30HYL-_white.jpg" },
  { id: "SRS30BIN", image: "/SRS30BIN_-_white.jpg" },
];

const SRC30_PRODUCTS = [
  { id: "SRC30GPO", image: "/SRC30GPO_-_white.jpg" },
  { id: "SRC30MBL", image: "/SRC30MBL_-_white.jpg" },
];

const SRS100_PRODUCTS = [
  { id: "SRS100GPO", image: "/SRS100GPO.jpg" },
  { id: "SRS100MBL", image: "/SRS100MBL.jpg" },
  { id: "SRS100HYL", image: "/SRS100HYL.jpg" },
  { id: "SRS100BIN", image: "/SRS100BIN.jpg" },
];

export default async function ResellerWelcomePage({
  params: { lang },
}: {
  params: { lang: ValidLocale };
}) {
  const dict = (await getDictionary(lang)) as Dictionary;
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("No authenticated user found");
      redirect(`/${lang}/login`);
    }

    const { data: profile, error: profileError } = await supabase
      .from("reseller_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile error or not found:", profileError);
      redirect(`/${lang}/login`);
    }

    return (
      <div className="container mx-auto py-12 px-4">
        <div className="mb-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome, {profile.company_name}!
          </h2>
          <p className="text-gray-600">
            Your reseller account is {profile.status}.{" "}
            {profile.status === "pending" &&
              "Our team will review your application shortly."}
          </p>
        </div>

        <h1 className="text-4xl font-bold mb-8">{dict.packaging.title}</h1>
        <p className="text-lg text-gray-600 mb-12">
          {dict.packaging.description}
        </p>

        {/* Packaging Formula */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {dict.packaging.packingFormula.title}
          </h2>
          <div className="grid bg-white md:grid-cols-2 items-start">
            <div className="rounded-lg  p-6">
              <p className="text-gray-600 mb-4">
                {dict.packaging.packingFormula.description}
              </p>
              <p className="text-gray-600">
                {dict.packaging.packingFormula.exception}
              </p>
            </div>
            <div className="p-6">
              <img
                src="/packing.jpg"
                alt="Scraperite Packing Formula"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Packaging Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {dict.packaging.features.title}
          </h2>
          <div className="bg-white rounded-lg shadow p-6">
            <ul className="space-y-3">
              {dict.packaging.features.list.map(
                (feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-3">•</span>
                    {feature}
                  </li>
                )
              )}
            </ul>
          </div>
        </section>

        {/* Product Packing Tables */}
        <section>
          <ProductSeries title="SRTD6 Series" products={SRTD6_PRODUCTS} />
          <ProductSeries title="SRTD25 Series" products={SRTD25_PRODUCTS} />
          <ProductSeries title="SRTD33 Series" products={SRTD33_PRODUCTS} />
          <ProductSeries title="SRT33 Series" products={SRT33_PRODUCTS} />
          <ProductSeries title="SRTW6 Series" products={SRTW6_PRODUCTS} />
          <ProductSeries title="SRS30 Series" products={SRS30_PRODUCTS} />
          <ProductSeries title="SRC30 Series" products={SRC30_PRODUCTS} />
          <ProductSeries title="SRS100 Series" products={SRS100_PRODUCTS} />
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error in ResellerWelcomePage:", error);
    redirect(`/${lang}/login`);
  }
}
