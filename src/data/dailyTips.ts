export interface DailyTip {
  id: number;
  textBn: string;
  textEn: string;
  category: string;
  actionText: string;
}

export const DAILY_HEALTH_TIPS: DailyTip[] = [
  {
    id: 1,
    textBn: 'প্রতিদিন সকালে ঘুম থেকে উঠে খালি পেটে ১-২ গ্লাস কুসুম গরম পানি পান করুন। এটি বিপাক প্রক্রিয়া সক্রিয় করে এবং পরিপাকতন্ত্র পরিষ্কার রাখে।',
    textEn: 'Drink 1-2 glasses of warm water every morning on an empty stomach to boost metabolism and clean your digestive tract.',
    category: 'হাইড্রেশন',
    actionText: 'পানি পান করুন',
  },
  {
    id: 2,
    textBn: 'দৈনিক অন্তত ৩০ মিনিট মাঝারি গতিতে হাঁটুন। এটি হার্ট ভালো রাখে, রক্তে শর্করার মাত্রা নিয়ন্ত্রণ করে এবং মানসিক চাপ কমায়।',
    textEn: 'Walk briskly for at least 30 minutes daily. It keeps your heart healthy, controls blood sugar, and relieves stress.',
    category: 'ব্যায়াম',
    actionText: 'হাঁটাহাঁটি শুরু করুন',
  },
  {
    id: 3,
    textBn: 'প্রতি রাতে ৭ থেকে ৮ ঘণ্টা নিরবচ্ছিন্ন ঘুম নিশ্চিত করুন। গভীর ঘুম শরীরের ক্ষতিগ্রস্ত কোষ মেরামত করে ও রোগ প্রতিরোধ ক্ষমতা বাড়ায়।',
    textEn: 'Get 7-8 hours of quality uninterrupted sleep every night. Sleep repairs cells and strengthens your immune system.',
    category: 'ঘুম ও বিশ্রাম',
    actionText: 'ঘুমের রুটিন ঠিক রাখুন',
  },
  {
    id: 4,
    textBn: 'অতিরিক্ত লবণ ও চিনিযুক্ত প্রক্রিয়াজাত খাবার এড়িয়ে চলুন। খাবারে কাঁচা লবণ না খাওয়া উচ্চ রক্তচাপ নিয়ন্ত্রণে জাদুকরী ভূমিকা রাখে।',
    textEn: 'Avoid excess salt and sugary processed foods. Cutting raw salt helps manage blood pressure significantly.',
    category: 'পুষ্টি',
    actionText: 'লবণ গ্রহণ কমান',
  },
  {
    id: 5,
    textBn: 'কম্পিউটার বা ফোনের স্ক্রিনের দিকে একটানা তাকিয়ে থাকার সময় ২০-২০-২০ নিয়ম অনুসরণ করুন: প্রতি ২০ মিনিট পর ২০ ফুট দূরে ২০ সেকেন্ড তাকিয়ে থাকুন।',
    textEn: 'Follow the 20-20-20 rule when looking at screens: every 20 minutes, look at an object 20 feet away for 20 seconds.',
    category: 'চোখের যত্ন',
    actionText: 'চোখকে বিশ্রাম দিন',
  },
  {
    id: 6,
    textBn: 'মৌসুমি তাজা ফলমূল ও শাকসবজি প্রতিদিনের খাদ্যতালিকায় রাখুন। এতে থাকা ভিটামিন সি ও অ্যান্টিঅক্সিডেন্ট রোগবালাই দূরে রাখে।',
    textEn: 'Include fresh seasonal fruits and green vegetables in your daily diet for essential Vitamin C and antioxidants.',
    category: 'পুষ্টি',
    actionText: 'শাকসবজি খান',
  },
];
