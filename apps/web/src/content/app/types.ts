// ---------------------------------------------------------------------------
// The shape of every translation used INSIDE the signed-in application
// (login, register, admin, client and driver workspaces plus the global
// offline / 404 / error screens).
//
// The public website has its own dictionary in `content/marketing`.
//
// TypeScript enforces this shape, so a missing German or English string makes
// `npm run typecheck` fail instead of showing an empty label in production.
// ---------------------------------------------------------------------------

import type {
  CargoCategory,
  DriverAvailability,
  InvoiceStatus,
  OrderStatus,
  PaymentMethod,
} from "@/types/api";

/** Labels for the backend enums, so no raw API value is ever shown. */
export interface EnumLabels {
  orderStatus: Record<OrderStatus, string>;
  invoiceStatus: Record<InvoiceStatus, string>;
  paymentMethod: Record<PaymentMethod, string>;
  cargoCategory: Record<CargoCategory, string>;
  availability: Record<DriverAvailability, string>;
}

/** Messages produced by the Zod form schemas. */
export interface ValidationMessages {
  email: string;
  password: string;
  passwordPolicy: string;
  passwordConfirmation: string;
  companyName: string;
  contactPerson: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  recipientName: string;
  weight: string;
  pickupAddress: string;
  dropoffAddress: string;
  houseNumber: string;
}

export interface AppContent {
  bookingAvailability: {
    title: string;
    description: string;
    scheduleEnabled: string;
    busy: string;
    day: string;
    start: string;
    end: string;
    days: string[];
    add: string;
    remove: string;
    save: string;
    saved: string;
    hoursHint: string;
    unavailable: string;
    busyNotice: string;
    checkFailed: string;
    bookingHours: string;
    closed: string;
  };
  common: {
    languageLabel: string;
    signOut: string;
    signedOut: string;
    tryAgain: string;
    loading: string;
    none: string;
    status: string;
    requestFailed: string;
  };
  feedback: {
    orderCreated: string;
    orderCancelled: string;
    driverCreated: string;
    driverAssigned: string;
    clientCreated: string;
    clientSaved: string;
    invoiceStatusUpdated: string;
    availabilityUpdated: string;
    jobStarted: string;
    deliveryCompleted: string;
  };

  enums: EnumLabels;
  validation: ValidationMessages;

  auth: {
    login: {
      metaTitle: string;
      eyebrow: string;
      heading: string;
      intro: string;
      highlights: { title: string; description: string }[];
      demoTitle: string;
      demoDescription: string;
      formTitle: string;
      formDescription: string;
      emailLabel: string;
      passwordLabel: string;
      submit: string;
      submitting: string;
      noAccount: string;
      createAccount: string;
      welcomeBack: (name: string) => string;
      failed: string;
      forgotPassword: string;
    };
    register: {
      metaTitle: string;
      title: string;
      description: string;
      clientTab: string;
      driverTab: string;
      fields: {
        companyName: string;
        contactPerson: string;
        email: string;
        password: string;
        phone: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        taxIdNumber: string;
        fullName: string;
        vehicleDescription: string;
      };
      submitClient: string;
      submitDriver: string;
      created: string;
      failed: string;
      alreadyRegistered: string;
      signIn: string;
      emailInUse: string;
    };
    recovery: {
      forgotTitle: string;
      forgotDescription: string;
      resetTitle: string;
      resetDescription: string;
      emailLabel: string;
      passwordLabel: string;
      confirmPasswordLabel: string;
      send: string;
      sending: string;
      reset: string;
      resetting: string;
      sent: string;
      success: string;
      signIn: string;
      requestAnother: string;
      invalidLink: string;
      failed: string;
      unavailable: string;
      rateLimited: string;
    };
  };

  shell: {
    admin: {
      title: string;
      nav: { dashboard: string; clients: string; drivers: string; invoices: string; bookingAvailability: string };
    };
    client: {
      title: string;
      nav: { dashboard: string; newOrder: string; orders: string; invoices: string };
    };
    driver: { title: string; nav: { jobs: string } };
  };

  admin: {
    dashboard: {
      title: string;
      description: string;
      kpis: {
        pendingOrders: string;
        activeOrders: string;
        deliveredToday: string;
        onlineDrivers: string;
        busyDrivers: string;
        totalClients: string;
        revenueNet: string;
        outstanding: string;
      };
      activeOrdersTitle: string;
      assignDriver: string;
      assignDriverFor: (orderId: number) => string;
    };
    newOrder: {
      title: string;
      description: string;
      selectClient: string;
    };
    clients: {
      title: string;
      description: string;
      createTitle: string;
      listTitle: string;
      activeOrders: (count: number) => string;
      editTitle: string;
      detailDescription: (created: string, totalOrders: number) => string;
    };
    drivers: {
      title: string;
      description: string;
      noPhone: string;
      noVehicle: string;
      workload: (active: number, completed: number) => string;
      revenue: string;
      createTitle: string;
      create: string;
      fields: {
        fullName: string;
        email: string;
        password: string;
        phone: string;
        vehicleDescription: string;
      };
    };
    invoices: {
      title: string;
      description: string;
      listTitle: string;
      due: (date: string) => string;
      statusFor: (invoiceNumber: string) => string;
    };
    clientForm: {
      fields: {
        companyName: string;
        contactPerson: string;
        email: string;
        phone: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        taxIdNumber: string;
        defaultBaseFee: string;
        defaultRatePerKilometer: string;
        specialDeliveryInstructions: string;
      };
      save: string;
      create: string;
    };
  };

  client: {
    dashboard: {
      title: string;
      description: string;
      bookDelivery: string;
      recentOrders: string;
      openInvoices: string;
      outstanding: string;
      emptyTitle: string;
      emptyDescription: string;
      latestOrders: string;
      columns: { order: string; status: string; route: string; created: string };
    };
    orders: {
      title: string;
      description: string;
      listTitle: string;
      emptyTitle: string;
      emptyDescription: string;
      detailTitle: (id: number) => string;
      cancel: string;
      deliveryTitle: string;
      driver: string;
      notAssigned: string;
      price: string;
      created: string;
      instructions: string;
      podTitle: string;
      recipient: string;
      delivered: string;
      signatureAlt: string;
      noPod: string;
    };
    invoices: {
      title: string;
      description: string;
      listTitle: string;
      emptyTitle: string;
      emptyDescription: string;
      due: (date: string) => string;
    };
    invoiceDetail: {
      heading: string;
      print: string;
      issuer: string;
      customer: string;
      issuedAt: string;
      dueDate: string;
      paymentMethod: string;
      taxId: string;
      columns: { position: string; net: string; vat: string; gross: string };
      lineItem: (orderId: number, route: string) => string;
      netTotal: string;
      vatTotal: (percent: number) => string;
      grandTotal: string;
      paymentNotes: string;
      bankTransfer: (days: number, bank: string, iban: string, bic: string) => string;
      paypal: (handle: string) => string;
      fallbackBank: string;
      fallbackIban: string;
    };
    newOrder: {
      title: string;
      description: string;
      cardTitle: string;
      cardDescription: string;
      fields: {
        cargoCategory: string;
        weightKg: string;
        pickupAddress: string;
        pickupStreet: string;
        pickupHouseNumber: string;
        pickupPostalCode: string;
        pickupCity: string;
        pickupState: string;
        pickupContactName: string;
        pickupPhone: string;
        dropoffAddress: string;
        dropoffStreet: string;
        dropoffHouseNumber: string;
        dropoffPostalCode: string;
        dropoffCity: string;
        dropoffState: string;
        dropoffContactName: string;
        dropoffPhone: string;
        specialInstructions: string;
        externalReference: string;
        paymentMethod: string;
      };
      getQuote: string;
      quoteRequired: string;
      confirm: string;
      quoteTitle: string;
      quoteDescription: string;
      quoteEmptyTitle: string;
      quoteEmptyDescription: string;
      addressOnlyQuote: string;
      pickupSection: string;
      dropoffSection: string;
      mapTitle: string;
      mapPending: string;
      resolvedPickup: string;
      resolvedDropoff: string;
      minimumChargeApplied: string;
      routedBy: (source: string) => string;
      quote: {
        distance: string;
        eta: string;
        net: string;
        vat: string;
        gross: string;
        baseFee: string;
        ratePerKm: string;
        distanceCost: string;
      };
    };
  };

  driver: {
    home: {
      title: string;
      description: string;
      availabilityTitle: string;
      busyNote: string;
      goOnline: string;
      goOffline: string;
      emptyTitle: string;
      emptyDescription: string;
      orderLabel: (id: number) => string;
      created: (date: string) => string;
      openRun: string;
    };
    job: {
      title: (id: number) => string;
      openMaps: string;
      addressesTitle: string;
      pickup: string;
      dropoff: string;
      instructions: string;
      startTransit: string;
      podTitle: string;
      recipientName: string;
      captureGps: string;
      gpsCaptured: (lat: string, lng: string) => string;
      submitPod: string;
      noGeolocation: string;
      permissionDenied: string;
      signatureRequired: string;
      gpsRequired: string;
      signaturePadLabel: string;
      clearSignature: string;
    };
  };

  offline: {
    metaTitle: string;
    metaDescription: string;
    badge: string;
    title: string;
    description: string;
    backHome: string;
  };

  notFound: {
    badge: string;
    title: string;
    description: string;
    backHome: string;
  };

  error: {
    title: string;
    description: string;
    retry: string;
  };
}
