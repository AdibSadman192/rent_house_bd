// Bengali translations
export default {
  common: {
    search: 'অনুসন্ধান',
    filter: 'ফিল্টার',
    sort: 'সাজানো',
    login: 'লগইন',
    register: 'নিবন্ধন',
    logout: 'লগআউট',
    profile: 'প্রোফাইল',
    settings: 'সেটিংস',
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    edit: 'সম্পাদনা',
    delete: 'মুছে ফেলুন',
    confirm: 'নিশ্চিত করুন',
    loading: 'লোড হচ্ছে...',
    success: 'সফল',
    error: 'ত্রুটি',
    required: 'প্রয়োজনীয়'
  },
  auth: {
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    resetPassword: 'পাসওয়ার্ড রিসেট',
    newPassword: 'নতুন পাসওয়ার্ড',
    loginTitle: 'আপনার অ্যাকাউন্টে লগইন করুন',
    registerTitle: 'নতুন অ্যাকাউন্ট তৈরি করুন'
  },
  property: {
    title: 'শিরোনাম',
    description: 'বিবরণ',
    price: 'মূল্য',
    type: {
      label: 'ধরন',
      apartment: 'অ্যাপার্টমেন্ট',
      house: 'বাড়ি',
      flat: 'ফ্ল্যাট',
      duplex: 'ডুপ্লেক্স',
      penthouse: 'পেন্টহাউস',
      male_mess: 'ছেলেদের মেস',
      female_mess: 'মেয়েদের মেস',
      family_mess: 'পারিবারিক মেস',
      male_hostel: 'ছেলেদের হোস্টেল',
      female_hostel: 'মেয়েদের হোস্টেল',
      family_hostel: 'পারিবারিক হোস্টেল',
      bachelor_male: 'ব্যাচেলর (পুরুষ)',
      bachelor_female: 'ব্যাচেলর (মহিলা)',
      office: 'অফিস',
      shop: 'দোকান',
      warehouse: 'গুদাম',
      industrial: 'শিল্প'
    },
    status: {
      label: 'অবস্থা',
      available: 'উপলব্ধ',
      rented: 'ভাড়া হয়েছে',
      sold: 'বিক্রি হয়েছে',
      pending: 'অপেক্ষমান'
    },
    amenities: {
      label: 'সুবিধাসমূহ',
      lift: 'লিফট',
      generator: 'জেনারেটর',
      security: 'নিরাপত্তা',
      parking: 'পার্কিং',
      gas: 'গ্যাস',
      water: 'পানি',
      electricity: 'বিদ্যুৎ',
      internet: 'ইন্টারনেট'
    },
    location: {
      label: 'অবস্থান',
      division: 'বিভাগ',
      district: 'জেলা',
      upazila: 'উপজেলা',
      area: 'এলাকা',
      address: 'ঠিকানা'
    }
  },
  payment: {
    amount: 'পরিমাণ',
    gateway: {
      label: 'পেমেন্ট মাধ্যম',
      bkash: 'বিকাশ',
      nagad: 'নগদ',
      rocket: 'রকেট'
    },
    status: {
      label: 'অবস্থা',
      pending: 'অপেক্ষমান',
      completed: 'সম্পন্ন',
      failed: 'ব্যর্থ'
    },
    history: 'পেমেন্ট ইতিহাস',
    details: 'পেমেন্ট বিবরণ',
    transactionId: 'লেনদেন আইডি'
  },
  verification: {
    nid: {
      label: 'জাতীয় পরিচয়পত্র',
      number: 'এনআইডি নম্বর',
      front: 'সামনের ছবি',
      back: 'পিছনের ছবি'
    },
    status: {
      label: 'যাচাই অবস্থা',
      pending: 'অপেক্ষমান',
      verified: 'যাচাই করা হয়েছে',
      rejected: 'প্রত্যাখ্যান করা হয়েছে'
    },
    documents: {
      label: 'নথিপত্র',
      upload: 'আপলোড করুন',
      view: 'দেখুন'
    }
  },
  agreement: {
    create: 'চুক্তি তৈরি করুন',
    sign: 'স্বাক্ষর করুন',
    terms: 'শর্তাবলী',
    startDate: 'শুরুর তারিখ',
    endDate: 'শেষ তারিখ',
    rent: 'ভাড়া',
    advance: 'অগ্রিম',
    security: 'জামানত',
    witness: {
      label: 'সাক্ষী',
      add: 'সাক্ষী যোগ করুন',
      name: 'নাম',
      nid: 'এনআইডি',
      address: 'ঠিকানা'
    }
  },
  errors: {
    required: 'এই তথ্যটি প্রয়োজনীয়',
    invalid: 'অবৈধ তথ্য',
    minLength: 'ন্যূনতম {min} অক্ষর প্রয়োজন',
    maxLength: 'সর্বোচ্চ {max} অক্ষর অনুমোদিত',
    passwordMatch: 'পাসওয়ার্ড মিলছে না',
    emailFormat: 'অবৈধ ইমেইল ফরম্যাট',
    phoneFormat: 'অবৈধ ফোন নম্বর',
    nidFormat: 'অবৈধ এনআইডি নম্বর',
    fileSize: 'ফাইল সাইজ {size}MB এর বেশি হতে পারবে না',
    fileType: 'অনুমোদিত ফাইল টাইপ: {types}',
    serverError: 'সার্ভার ত্রুটি, পরে আবার চেষ্টা করুন'
  }
};
