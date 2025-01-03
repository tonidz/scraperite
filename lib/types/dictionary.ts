export interface Dictionary {
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
    comparison: {
      title: string;
      description: string;
      blades: Array<{
        name: string;
        hardness: number;
        flexibility: number;
        durability: number;
        color: string;
      }>;
    };
    features: {
      title: string;
      description: string;
      list: Array<{
        title: string;
        description: string;
      }>;
    };
    surfaces: {
      title: string;
      description: string;
      blades: Array<{
        name: string;
        color: string;
        surfaces: string[];
      }>;
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
  };
}
