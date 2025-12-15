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
    <div className="min-h-screen bg-gradient-to-b from-[#FFE566] to-[#FFD700] pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-black">
            {dict.login.title}
          </h1>
          <p className="text-gray-700">{dict.login.description}</p>
        </div>
        <AuthForm dict={dict.login} />
      </div>
    </div>
  );
}
