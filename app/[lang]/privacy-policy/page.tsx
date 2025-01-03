import { getDictionary } from "@/i18n/get-dictionary";
import type { ValidLocale } from "@/i18n/config";

export default async function PrivacyPolicyPage({
  params: { lang },
}: {
  params: { lang: ValidLocale };
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{dict.privacy.title}</h1>

      <div className="prose max-w-none">
        <p className="mb-6">{dict.privacy.intro}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {dict.privacy.collect.title}
        </h2>
        <ul>
          {dict.privacy.collect.items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {dict.privacy.usage.title}
        </h2>
        <ul>
          {dict.privacy.usage.items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {dict.privacy.cookies.title}
        </h2>
        <p>{dict.privacy.cookies.description}</p>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-4 bg-gray-100">
                  {dict.privacy.cookies.table.name}
                </th>
                <th className="text-left py-2 px-4 bg-gray-100">
                  {dict.privacy.cookies.table.description}
                </th>
              </tr>
            </thead>
            <tbody>
              {dict.privacy.cookies.items.map(
                (
                  cookie: { name: string; description: string },
                  index: number
                ) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 font-mono">{cookie.name}</td>
                    <td className="py-2 px-4">{cookie.description}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
