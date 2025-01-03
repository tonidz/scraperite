"use client";

interface Product {
  id: string;
  image: string;
}

interface ProductSeriesProps {
  title: string;
  products: Product[];
}

export function ProductSeries({ title, products }: ProductSeriesProps) {
  const isSRS100 = title.includes("SRS100");

  return (
    <div className="bg-white mb-12">
      <h3 className="text-xl font-semibold mb-4 px-6 pt-6">{title}</h3>
      <div className={`grid md:grid-cols-4 `}>
        {products.map((product) => (
          <div key={product.id} className="p-2">
            <img
              src={product.image}
              alt={product.id}
              className="w-full h-auto mb-3 rounded-lg"
            />
            <p className="text-gray-600">{product.id}</p>
          </div>
        ))}
      </div>
      <img
        src={`/${title.replace(" Series", "")}.jpg`}
        alt={title}
        className="ml-4 rounded-lg"
      />
      <div className="p-6">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b text-center">
              <th className="py-2 text-left">Packing</th>
              <th className="py-2">PACK</th>
              <th className="py-2">BOX</th>
              <th className="py-2">CASE</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 text-left">PACK</td>
              <td className="py-2">1</td>
              <td className="py-2">{isSRS100 ? "25" : "12"}</td>
              <td className="py-2">{isSRS100 ? "50" : "48"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 text-left">BOX</td>
              <td className="py-2"></td>
              <td className="py-2">1</td>
              <td className="py-2">4</td>
            </tr>
            <tr>
              <td className="py-2 text-left">CASE</td>
              <td className="py-2"></td>
              <td className="py-2"></td>
              <td className="py-2">1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
