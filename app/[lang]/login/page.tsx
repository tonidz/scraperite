import { AuthForm } from "@/components/auth/auth-form";
import { getDictionary } from "@/i18n/get-dictionary";
import type { ValidLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export default async function Page({
  params: { lang },
}: {
  params: { lang: ValidLocale };
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{dict.login.title}</h1>
        <p className="text-gray-600">{dict.login.description}</p>
      </div>
      <AuthForm dict={dict.login} />
    </div>
  );
}
