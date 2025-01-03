export const defaultLocale = 'sv'
export const locales = ['en', 'sv'] as const
export type ValidLocale = (typeof locales)[number]

export const localeNames: Record<ValidLocale, string> = {
  en: 'English',
  sv: 'Svenska',
}

export type Dictionary = {
  nav: {
    collections: string;
    brands: string;
    new: string;
    sales: string;
    demo: string;
  };
  hero: {
    title: string;
    description: string;
    button: string;
    stats: {
      monthlyTraffic: string;
      happyCustomers: string;
    };
  };
  products: {
    title: string;
    shopNow: string;
    relatedTitle: string;
    securePayment: string;
    paymentMethods: string;
    securityNote: string;
    share: string;
    copied: string;
  };
  cart: {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    remove: string;
    quantity: string;
  };
  guide: {
    title: string;
    safetyTitle: string;
    safetyText: string;
    applications: {
      title: string;
      items: string[];
    };
    tips: {
      title: string;
      items: string[];
    };
  };
  plasticGuide: {
    title: string;
    intro: string;
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
  bladeGuide: {
    title: string;
    chemicalResistance: {
      title: string;
      chemical: string;
    };
    formula: {
      title: string;
      description: string;
    };
    bacteria: {
      title: string;
      description: string;
    };
    general: {
      title: string;
      features: string[];
    };
    edgeProperties: {
      title: string;
      hardness: string;
      flexibility: string;
      abrasive: string;
      values: {
        soft: string;
        medium: string;
        hard: string;
        stiff: string;
        low: string;
        high: string;
      };
    };
    surfaceReaction: {
      title: string;
      surfaces: string[];
    };
    temperature: {
      title: string;
      minimum: string;
      maximum: string;
    };
  };
  packaging: {
    title: string;
    description: string;
    formats: {
      title: string;
      retail: {
        title: string;
        description: string;
      };
      bulk: {
        title: string;
        description: string;
      };
    };
    options: {
      title: string;
      list: string[];
    };
    features: {
      title: string;
      list: string[];
    };
    packingFormula: {
      title: string;
      description: string;
      exception: string;
    };
  };
  testimonials: {
    title: string;
    subtitle: string;
    testimonials: Array<{
      text: string;
      author: string;
    }>;
  };
  footer: {
    resellers: string;
    privacy: string;
  };
  login: {
    title: string;
    description: string;
  };
  privacy: {
    title: string;
    intro: string;
    collect: {
      title: string;
      items: string[];
    };
    usage: {
      title: string;
      items: string[];
    };
    cookies: {
      title: string;
      description: string;
      table: {
        name: string;
        description: string;
      };
      items: Array<{
        name: string;
        description: string;
      }>;
    };
  };
};