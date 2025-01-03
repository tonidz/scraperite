import { BladeSection } from "./blade-section";

interface BladeGuideProps {
  dict: {
    guide: {
      title: string;
      description: string;
      catalogNote: string;
    };
    blades: {
      gpo: {
        title: string;
        description: string;
      };
      acrylic: {
        title: string;
        description: string;
      };
      polycarbonate: {
        title: string;
        description: string;
      };
      industrial: {
        title: string;
        description: string;
      };
    };
  };
}

export function BladeGuide({ dict }: BladeGuideProps) {
  const blades = [
    {
      id: "gpo",
      color: "orange",
      videoId: "https://youtu.be/zz_xaZyg88Q?si=KCMDFcMMStqyTeTn",
      ...dict.blades.gpo,
    },
    {
      id: "acrylic",
      color: "yellow",
      videoId: "https://youtu.be/z20wMuRPEA8",
      ...dict.blades.acrylic,
    },
    {
      id: "polycarbonate",
      color: "blue",
      videoId: "https://youtu.be/eGWNsOLsVaQ",
      ...dict.blades.polycarbonate,
    },
    {
      id: "industrial",
      color: "black",
      videoId: "https://youtu.be/5kXDp3MJ3d0?si=zFDggWY6WjTjFAkB",
      ...dict.blades.industrial,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-4">{dict.guide.title}</h2>
        <p className="text-lg mb-4">{dict.guide.description}</p>
        <p className="text-sm text-gray-500">{dict.guide.catalogNote}</p>
      </div>

      {blades.map((blade) => (
        <BladeSection
          key={blade.id}
          title={blade.title}
          description={blade.description}
          color={blade.color}
          videoId={blade.videoId}
        />
      ))}
    </div>
  );
}
