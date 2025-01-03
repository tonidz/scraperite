import { getDictionary } from "@/i18n/get-dictionary";
import type { ValidLocale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import Image from "next/image";

interface BladeGuidePageProps {
  params: {
    lang: ValidLocale;
  };
}

const chemicalResistanceData = [
  {
    chemical: "ACETIC ACID 10%",
    orange: true,
    blue: false,
    yellow: true,
    black: false,
  },
  {
    chemical: "ACETONE",
    orange: true,
    blue: false,
    yellow: false,
    black: true,
  },
  {
    chemical: "ALCOHOL: ISOPROPYL",
    orange: true,
    blue: true,
    yellow: false,
    black: false,
  },
  {
    chemical: "AMMONIA",
    orange: false,
    blue: false,
    yellow: true,
    black: true,
  },
  {
    chemical: "BENZENE",
    orange: true,
    blue: false,
    yellow: false,
    black: true,
  },
  {
    chemical: "BLEACH 15%",
    orange: false,
    blue: true,
    yellow: true,
    black: false,
  },
  {
    chemical: "CITRIC ACID",
    orange: true,
    blue: true,
    yellow: true,
    black: true,
  },
  {
    chemical: "DISH SOAP",
    orange: true,
    blue: true,
    yellow: true,
    black: true,
  },
  {
    chemical: "FORMALDEHYDE 40%",
    orange: true,
    blue: false,
    yellow: true,
    black: false,
  },
  {
    chemical: "FORMIC ACID 3%",
    orange: false,
    blue: false,
    yellow: true,
    black: true,
  },
  {
    chemical: "HYDROFLUORIC ACID 4%",
    orange: false,
    blue: true,
    yellow: false,
    black: false,
  },
  { chemical: "LYE", orange: true, blue: false, yellow: false, black: true },
  {
    chemical: "METHYL ETHYL KETONE (MEK)",
    orange: true,
    blue: false,
    yellow: false,
    black: true,
  },
  {
    chemical: "NITRIC ACID 0.1%",
    orange: false,
    blue: true,
    yellow: true,
    black: false,
  },
  {
    chemical: "SULFURIC ACID 5%",
    orange: false,
    blue: true,
    yellow: false,
    black: false,
  },
  {
    chemical: "TURPENTINE",
    orange: true,
    blue: false,
    yellow: false,
    black: true,
  },
  { chemical: "VINEGAR", orange: true, blue: true, yellow: true, black: true },
  { chemical: "XYLENE", orange: true, blue: false, yellow: false, black: true },
];

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function BladeGuidePage({
  params: { lang },
}: BladeGuidePageProps) {
  const dict = await getDictionary(lang);

  const edgePropertiesData = [
    {
      property: lang === "sv" ? "KANTHÅRDHET" : "EDGE HARDNESS",
      orange: "MJUK",
      blue: "MED",
      yellow: "HÅRD",
      black: "MED",
    },
    {
      property: lang === "sv" ? "BÖJLIGHET" : "FLEXIBILITY",
      orange: "MJUK",
      blue: "MJUK",
      yellow: "STYV",
      black: "MED",
    },
    {
      property: lang === "sv" ? "SLIPADE EGENSKAPER" : "ABRASIVE PROPERTIES",
      orange: "LÅG",
      blue: "MED",
      yellow: "HÖG",
      black: "MED",
    },
  ];

  const surfaceReactionData = [
    {
      surface: lang === "sv" ? "DELIKAT ELLER MJUK" : "DELICATE OR SOFT",
      orange: true,
      blue: false,
      yellow: false,
      black: false,
    },
    {
      surface: lang === "sv" ? "OJÄMN ELLER VÅGIG" : "UNEVEN OR WAVY",
      orange: false,
      blue: true,
      yellow: false,
      black: false,
    },
    {
      surface: lang === "sv" ? "HÅRD PLATT" : "HARD FLAT",
      orange: false,
      blue: false,
      yellow: true,
      black: false,
    },
    {
      surface:
        lang === "sv" ? "OJÄMN ELLER GROV YTA" : "UNEVEN OR ROUGH SURFACE",
      orange: false,
      blue: false,
      yellow: false,
      black: true,
    },
  ];

  const temperatureData = [
    {
      range: lang === "sv" ? "MINIMUM (°C/°F)" : "MINIMUM (°C/°F)",
      orange: "-50/-58",
      blue: "-40/-40",
      yellow: "-40/-40",
      black: "-40/-40",
    },
    {
      range: lang === "sv" ? "MAXIMUM (°C/°F)" : "MAXIMUM (°C/°F)",
      orange: "65/149",
      blue: "118/246",
      yellow: "49/120",
      black: "80/176",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{dict.bladeGuide.title}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Tables - 1/3 width */}
        <div className="lg:w-1/3 space-y-8">
          {/* Chemical Resistance Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {dict.bladeGuide.chemicalResistance.title}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">
                      {dict.bladeGuide.chemicalResistance.chemical}
                    </th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-orange-500 mx-auto rounded-sm"></div>
                    </th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-blue-500 mx-auto rounded-sm"></div>
                    </th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-yellow-400 mx-auto rounded-sm"></div>
                    </th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-black mx-auto rounded-sm"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chemicalResistanceData.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-300"}
                    >
                      <td className="border p-2 text-xs">{item.chemical}</td>
                      <td className="border p-2 text-center">
                        {item.orange && (
                          <div className="w-3 h-3 bg-orange-500 mx-auto"></div>
                        )}
                      </td>
                      <td className="border p-2 text-center">
                        {item.blue && (
                          <div className="w-3 h-3 bg-blue-500 mx-auto"></div>
                        )}
                      </td>
                      <td className="border p-2 text-center">
                        {item.yellow && (
                          <div className="w-3 h-3 bg-yellow-400 mx-auto"></div>
                        )}
                      </td>
                      <td className="border p-2 text-center">
                        {item.black && (
                          <div className="w-3 h-3 bg-black mx-auto"></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edge Properties Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {lang === "sv" ? "KANTEGENSKAPER" : "EDGE PROPERTIES"}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left"></th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-orange-500 mx-auto rounded-sm"></div>
                    </th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-blue-500 mx-auto rounded-sm"></div>
                    </th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-yellow-400 mx-auto rounded-sm"></div>
                    </th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-black mx-auto rounded-sm"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {edgePropertiesData.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-300"}
                    >
                      <td className="border p-2 text-xs font-medium">
                        {item.property}
                      </td>
                      <td className="border p-2 text-center text-xs">
                        {item.orange}
                      </td>
                      <td className="border p-2 text-center text-xs">
                        {item.blue}
                      </td>
                      <td className="border p-2 text-center text-xs">
                        {item.yellow}
                      </td>
                      <td className="border p-2 text-center text-xs">
                        {item.black}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Surface Reaction Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {lang === "sv" ? "YTBEAKTANDEN" : "SURFACE REACTION"}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {surfaceReactionData.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-300"}
                    >
                      <td className="border p-2 text-xs">{item.surface}</td>
                      <td className="border p-2 w-10 text-center">
                        {item.orange && (
                          <div className="w-3 h-3 bg-orange-500 mx-auto"></div>
                        )}
                      </td>
                      <td className="border p-2 w-10 text-center">
                        {item.blue && (
                          <div className="w-3 h-3 bg-blue-500 mx-auto"></div>
                        )}
                      </td>
                      <td className="border p-2 w-10 text-center">
                        {item.yellow && (
                          <div className="w-3 h-3 bg-yellow-400 mx-auto"></div>
                        )}
                      </td>
                      <td className="border p-2 w-10 text-center">
                        {item.black && (
                          <div className="w-3 h-3 bg-black mx-auto"></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Temperature Level Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {lang === "sv" ? "TEMPERATUR NIVÅ" : "TEMPERATURE LEVEL"}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left"></th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-orange-500 mx-auto rounded-sm"></div>
                    </th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-blue-500 mx-auto rounded-sm"></div>
                    </th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-yellow-400 mx-auto rounded-sm"></div>
                    </th>
                    <th className="border p-2 w-10 text-center">
                      <div className="w-4 h-4 bg-black mx-auto rounded-sm"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {temperatureData.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-300"}
                    >
                      <td className="border p-2 text-xs">{item.range}</td>
                      <td className="border p-2 text-center text-xs">
                        {item.orange}
                      </td>
                      <td className="border p-2 text-center text-xs">
                        {item.blue}
                      </td>
                      <td className="border p-2 text-center text-xs">
                        {item.yellow}
                      </td>
                      <td className="border p-2 text-center text-xs">
                        {item.black}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Property Images */}
          <div className="space-y-4 mt-8">
            <Image
              src="/hogst.png"
              alt="Hogst property"
              width={300}
              height={100}
              className="w-full"
            />
            <Image
              src="/durability.png"
              alt="Durability property"
              width={300}
              height={100}
              className="w-full"
            />
            <Image
              src="/flexibility.png"
              alt="Flexibility property"
              width={300}
              height={100}
              className="w-full"
            />
            <Image
              src="/hardness.png"
              alt="Hardness property"
              width={300}
              height={100}
              className="w-full"
            />
          </div>
        </div>

        {/* Content Section - 2/3 width */}
        <div className="bg-white p-8 lg:w-2/3">
          {/* Original Content */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              {dict.bladeGuide.formula.title}
            </h2>
            <p className="text-gray-700 mb-6">
              {dict.bladeGuide.formula.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {dict.bladeGuide.bacteria.title}
              </h3>
              <p className="text-gray-700">
                {dict.bladeGuide.bacteria.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {dict.bladeGuide.general.title}
              </h3>
              <ul className="list-disc pl-5 text-gray-700">
                {dict.bladeGuide.general.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recycling Information */}
          <div className="mb-12 flex items-start gap-4">
            <Image
              src="/recycle.jpg"
              alt="Recycling code 7"
              width={40}
              height={40}
            />
            <Image
              src="/recycle_PA.jpg"
              alt="Recycling PA"
              width={40}
              height={40}
            />

            <p className="text-gray-700">
              {lang === "sv"
                ? "Återvinningskoder 7 och PA - ta tillbaka dessa för kommersiell återvinning. De kommer att malas ner, smältas och omformas till något annat. Programmet är tillgängligt genom vårt officiella återförsäljarnätverk, returnera den använda produkten till säljaren så sköter vi resten."
                : "Recycling codes 7 and PA - take these back for commercial recycling. They will be ground down, melted and reformed into something else. The program is available through our official reseller network, return the used product to the seller and we'll handle the rest."}
            </p>
          </div>

          {/* Types and Specification */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              {lang === "sv"
                ? "Typer och specifikation"
                : "Types and Specification"}
            </h2>
            <h3 className="text-xl font-semibold mb-4">
              {lang === "sv" ? "Standard Rektangel" : "Standard Rectangle"}
            </h3>

            {/* Blade Specification Diagram */}
            <div className="mb-8">
              <Image
                src="/SRS_specs.jpg"
                alt="Blade specification diagram"
                width={400}
                height={200}
                className="mb-4"
              />
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-8">
              {lang === "sv"
                ? "Den här ursprungliga patenterade dubbelsidiga designen av Scraperite-plastbladen är bäst för åtkomst i hörn och rak linje-skrapning. Det är arbetshästen i serien, plastbladsserien som hjälpte till att bygga upp varumärket och förblir ett viktigt verktyg i många tillämpningar."
                : "This original patented double-sided design of Scraperite plastic blades is best for corner access and straight line scraping. It's the workhorse of the series, the plastic blade series that helped build the brand and remains an important tool in many applications."}
            </p>

            {/* Example Usage Images */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Image
                  src="/b2ap3.webp"
                  alt="Example usage 1"
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <div>
                <Image
                  src="/letter_removal.webp"
                  alt="Example usage 2"
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <div>
                <Image
                  src="/PB_Blades.webp"
                  alt="Example usage 3"
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>
            {/* Blade Specification Diagram */}
            <div className="my-8">
              <Image
                src="/curved_gray.png"
                alt="Blade specification diagram"
                width={400}
                height={200}
                className="mb-4"
              />
            </div>
            {/* Blade Colors */}
            <div className="flex gap-4 mb-8">
              <Image
                src="/SRSGPO2.png"
                alt="Orange blade"
                width={60}
                height={30}
              />
              <Image
                src="/SRCMBL_1_-300x182.jpg"
                alt="Blue blade"
                width={60}
                height={30}
              />
              <Image
                src="/SRCBIN_1_-300x173.jpg"
                alt="Black blade"
                width={60}
                height={30}
              />
            </div>

            {/* Curvey Blade Description */}
            <div className="mt-8 text-gray-700">
              <p className="mb-4">
                {lang === "sv"
                  ? "CURVEY är DEN ultimata plastskrapan för säkerhet. Den böjda plastbladet ökar flera säkerhetsfaktorer genom att i princip eliminera skarpa hörn. Detta är den idealiska säkerhetsskrapan för alla tillämpningar och skulle förmodligen vara köparens första val, om inte skarpa hörn krävs för jobbet. Detta blad passar endast innehavare i serien 'Tradesman'."
                  : "CURVEY is THE ultimate plastic scraper for safety. The curved plastic blade increases several safety factors by virtually eliminating sharp corners. This is the ideal safety scraper for all applications and would probably be the buyer's first choice if sharp corners are not required for the job. This blade only fits holders in the 'Tradesman' series."}
              </p>
            </div>
            {/* Example Usage Images */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Image
                  src="/pair_20300.jpg"
                  alt="Example usage 1"
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <div>
                <Image
                  src="/Pan_cleaning_home_page.jpg"
                  alt="Example usage 2"
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              {/* Curvey Blade Description */}
              <div className=" text-gray-700">
                <p className="mb-4">
                  {lang === "sv"
                    ? "10 cm breda plast bladet"
                    : "10 cm wide plastic blade"}
                </p>
              </div>
            </div>
            {/* Example Usage Images */}
            <div className="grid grid-cols-1">
              <div>
                <Image
                  src="/breda-bladet.png"
                  alt="Example usage 1"
                  width={600}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8 mt-3">
              <Image
                src="/bred-orange.png"
                alt="Orange blade"
                width={200}
                height={50}
              />
              <Image
                src="/bred-bla.png"
                alt="Blue blade"
                width={200}
                height={50}
              />
              <Image
                src="/bred-svart.png"
                alt="Black blade"
                width={200}
                height={50}
              />
            </div>
          </div>
          {/* Curvey Blade Description */}
          <div className=" text-gray-700">
            <p className="mb-4">
              {lang === "sv"
                ? "Med en räckvidd på 10 centimeter (4 tum) erbjuder detta blad nästan 3 gånger så stor täckningsyta per drag jämfört med våra andra blad. Det är också nästan dubbelt så tjockt som det standard ursprungliga bladet för att uppnå ett snabbare arbetsflöde med säker och effektiv prestanda. Tjockleken gör bladet tåligare, kapabelt att stå emot upprepad användning och täcka stora ytor innan det behöver bytas ut."
                : "With a reach of 10 centimeters (4 inches), this blade offers almost three times the coverage area per drag compared to our other blades. It is also almost twice as thick as the standard original blade to achieve a faster workflow with safe and efficient performance. The thickness makes the blade more durable, capable of withstanding repeated use and covering large areas before it needs to be replaced."}
            </p>
          </div>

          {/* Blade Material Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              {lang === "sv"
                ? "Bladens plast material"
                : "Blade Plastic Material"}
            </h2>

            {/* GPO Orange Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-orange-500 mb-4">
                {lang === "sv"
                  ? "Allmänt syfte orange - GPO"
                  : "General Purpose Orange - GPO"}
              </h3>
              {/* Orange Blade Images */}
              <div className="flex gap-4 mb-6">
                <Image
                  src="/tre-orange.png"
                  alt="Orange blade view 1"
                  width={150}
                  height={50}
                />
              </div>
              <p className="text-gray-700">
                {lang === "sv"
                  ? "Den orangea allmänna säkerhetsskrapbladet är ett förlåtande material som är tillräckligt mjukt för att användas på de flesta mjuka ytor som andra plaster, tack vare dess naturliga smörjegenskaper och böjlighet. Det har också bra motståndskraft mot hushålls- och industriella kemikalier, vilket gör det till ett utmärkt allroundblad för allmän användning i hemmet eller på arbetsplatsen. Idealisk för användning på trämöbler och golv, LCD-skärmar, glaskeramikhällar och stenbänkskivor, samt många andra mjuka ytor som finns runt oss i vardagslivet. Denna motståndskraft mot kemikalier gör det idealiskt för att ta bort dekaler med kemikalier som aceton som används för att snabbt bryta ner akryklister. Detta material är godkänt av Alcoa och Boeing för användning på flygplanslegieringar."
                  : "The orange general safety scraper blade is a forgiving material that is soft enough to be used on most soft surfaces like other plastics, thanks to its natural lubricating properties and flexibility. It also has good resistance to household and industrial chemicals, making it an excellent all-round blade for general use at home or in the workplace. Ideal for use on wooden furniture and floors, LCD screens, glass ceramic hobs and stone countertops, as well as many other soft surfaces found around us in everyday life. This chemical resistance makes it ideal for removing decals with chemicals like acetone used to quickly break down acrylic adhesives. This material is approved by Alcoa and Boeing for use on aircraft alloys."}
              </p>
            </div>
            {/* GPO Orange Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-orange-500 mb-4">
                {lang === "sv"
                  ? "Medium blå - MBL/PCB"
                  : "Medium Blue - MBL/PCB"}
              </h3>
              {/* Orange Blade Images */}
              <div className="flex gap-4 mb-6">
                <Image
                  src="/tre-bla.png"
                  alt="Blue blade view 1"
                  width={150}
                  height={50}
                />
              </div>
              <p className="text-gray-700">
                {lang === "sv"
                  ? "Dessa blad är tåliga. Polykarbonatbaserade föreningen är liknande materialen som används för att tillverka skottsäkra avdelare som ses i banker och vaktkurer. Dessa säkerhetsskrapblad ger en balans mellan böjlighet och styrka, anpassar sig till kurvor och ojämna ytor med något bättre motstånd mot kantslitage än det Orangea bladet. Bra på keramik och sten samt laminat och vinyl. Blå blad är tillräckligt tåliga för användning i båtunderhåll ovan och under vattenlinjen, inklusive hantering av tufft havstulpan-skrapning utan att skada anti-fouling-färgen. Detta är PCB polykarbonatblå Scraperite-blad som är något omkonstruerade för bättre prestanda."
                  : "These blades are durable. The polycarbonate-based material is similar to the materials used to make secure dividers seen in banks and security guards. These safety scrapers provide a balance between flexibility and strength, adapting to curves and uneven surfaces with slightly better resistance to edge chipping than the Orange blade. Good on ceramic and stone as well as laminate and vinyl. The blue blades are sufficiently durable for use in boat maintenance above and below the waterline, including handling of tough seahorse scraping without damaging the anti-fouling paint. This is PCB polycarbonate blue Scraperite blades that are slightly redesigned for better performance."}
              </p>
            </div>

            {/* Yellow Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-orange-500 mb-4">
                {lang === "sv" ? "Hård gul - HYL/ACY" : "Hard Yellow - HYL/ACY"}
              </h3>

              {/* Orange Blade Images */}
              <div className="flex gap-4 mb-6">
                <Image
                  src="/1-gul.png"
                  alt="Yellow blade view 1"
                  width={70}
                  height={50}
                />
              </div>

              <p className="text-gray-700">
                {lang === "sv"
                  ? "Detta blad är tillverkat av ett hårt och mer sprött material och är det mest styva. Dess låga flexibilitet håller det platt när man tar bort envisa substanser från hårda plana ytor som glas eller kakel men är mer benäget att gå sönder under vertikalt tryck. Denna egenskap ökar också kantens hållbarhet under liknande omständigheter jämfört med andra blad. Lösningsmedel måste noggrant väljas för att säkerställa att bladets material inte bryts ner."
                  : "This blade is made of a harder and more brittle material and is the most rigid. Its low flexibility keeps it flat when removing hard, flat surfaces like glass or tile but is more prone to breaking under vertical pressure. This property also increases the blade's durability under similar circumstances compared to other blades. Solvents must be carefully chosen to ensure that the blade's material does not break down."}
              </p>
            </div>

            {/* Black Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-orange-500 mb-4">
                {lang === "sv"
                  ? "Svart industri - BIN"
                  : "Industrial Black - BIN"}
              </h3>

              {/* Orange Blade Images */}
              <div className="flex gap-4 mb-6">
                <Image
                  src="/3-svart.png"
                  alt="Black blade view 1"
                  width={150}
                  height={50}
                />
              </div>

              <p className="text-gray-700">
                {lang === "sv"
                  ? "Detta blad är tillverkat av ett hårt och mer sprött material och är det mest styva. Dess låga flexibilitet håller det platt när man tar bort envisa substanser från hårda plana ytor som glas eller kakel men är mer benäget att gå sönder under vertikalt tryck. Denna egenskap ökar också kantens hållbarhet under liknande omständigheter jämfört med andra blad. Lösningsmedel måste noggrant väljas för att säkerställa att bladets material inte bryts ner."
                  : "This blade is made of a harder and more brittle material and is the most rigid. Its low flexibility keeps it flat when removing hard, flat surfaces like glass or tile but is more prone to breaking under vertical pressure. This property also increases the blade's durability under similar circumstances compared to other blades. Solvents must be carefully chosen to ensure that the blade's material does not break down."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
