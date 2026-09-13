import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial dataset
const INITIAL_DATA = {
  users: [
    {
      id: 'usr_admin',
      name: 'Aditya Roy',
      email: 'admin@nexcreator.io',
      passwordHash: '$2a$10$w8T0l2m1N/hJ2aR4.O77pOb/mUfG8fWvTj7Z6.0KjN7d1B/zP8m6S', // password: admin123
      role: 'Admin',
      title: 'Head of Operations & Strategy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-10T10:00:00Z'
    },
    {
      id: 'usr_mgr_1',
      name: 'Shreya Sengupta',
      email: 'shreya@nexcreator.io',
      passwordHash: '$2a$10$w8T0l2m1N/hJ2aR4.O77pOb/mUfG8fWvTj7Z6.0KjN7d1B/zP8m6S', // password: admin123
      role: 'Campaign Manager',
      title: 'Senior Campaign Strategist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-12T11:00:00Z'
    },
    {
      id: 'usr_team_1',
      name: 'Rohan Mehra',
      email: 'rohan@nexcreator.io',
      passwordHash: '$2a$10$w8T0l2m1N/hJ2aR4.O77pOb/mUfG8fWvTj7Z6.0KjN7d1B/zP8m6S',
      role: 'Agency Member',
      title: 'Influencer Talent Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-15T09:30:00Z'
    },
    {
      id: 'usr_client_1',
      name: 'Pooja Verma',
      email: 'client@brandcorp.com',
      passwordHash: '$2a$10$w8T0l2m1N/hJ2aR4.O77pOb/mUfG8fWvTj7Z6.0KjN7d1B/zP8m6S',
      role: 'Client',
      title: 'Brand Marketing Director @ AuraTech',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-02-01T14:00:00Z'
    }
  ],
  influencers: [
    {
      id: 'inf_ig_01',
      name: 'Alya Manasa',
      handle: '@alya_manasa',
      igLink: 'https://www.instagram.com/alya_manasa/',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      phone: '+91 98401 55210',
      whatsapp: '919840155210',
      email: 'alya.manasa@management.com',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Fashion & Lifestyle',
      followerCount: 4500000,
      tier: 'Mega',
      avgViews: 1100000,
      engagementRate: 3.87,
      genderDemographics: { femalePct: 78.90, malePct: 21.10 },
      pricing: { reel: 400000, reelWithDR: 400000, story: 100000, staticPost: 150000, comboPackage: 500000 },
      previousCampaigns: ['FirstCry', 'Pampers India', 'Preethi Zodiac', 'Aachi Masala'],
      internalRating: 5.0,
      internalNotes: 'Top TV celebrity mom influencer in South India. Huge reach with young mothers and families.',
      verified: true,
      audienceDemographics: { topAge: '22-38 (85%)', topGender: 'Female 78.9%, Male 21.1%', topCities: ['Chennai', 'Coimbatore', 'Madurai', 'Bengaluru'] }
    },
    {
      id: 'inf_ig_02',
      name: 'Sridevi Ashok',
      handle: '@srideviashok_official',
      igLink: 'https://www.instagram.com/srideviashok_official/',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      phone: '+91 98402 77192',
      whatsapp: '919840277192',
      email: 'sridevi.ashok@talent.in',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Beauty & Skincare',
      followerCount: 1000000,
      tier: 'Mega',
      avgViews: 280000,
      engagementRate: 2.40,
      genderDemographics: { femalePct: 80.14, malePct: 19.86 },
      pricing: { reel: 135000, reelWithDR: 135000, story: 40000, staticPost: 60000, comboPackage: 180000 },
      previousCampaigns: ['Mamaearth', 'Johnson\'s Baby', 'Pond\'s India', 'GRT Jewellers'],
      internalRating: 4.8,
      internalNotes: 'Tamil television actor & lifestyle creator. Very high female audience affinity (80.14%).',
      verified: true,
      audienceDemographics: { topAge: '24-40 (88%)', topGender: 'Female 80.1%, Male 19.9%', topCities: ['Chennai', 'Tiruchirappalli', 'Salem', 'Coimbatore'] }
    },
    {
      id: 'inf_ig_03',
      name: 'Hema Rajkumar',
      handle: '@hemarajkumar_official',
      igLink: 'https://www.instagram.com/hemarajkumar_official/',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      phone: '+91 98403 88123',
      whatsapp: '919840388123',
      email: 'hema.rajkumar@collabs.com',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Fashion & Lifestyle',
      followerCount: 1400000,
      tier: 'Mega',
      avgViews: 200000,
      engagementRate: 1.97,
      genderDemographics: { femalePct: 77.84, malePct: 22.16 },
      pricing: { reel: 150000, reelWithDR: 150000, story: 45000, staticPost: 65000, comboPackage: 200000 },
      previousCampaigns: ['Sunfeast Mom\'s Magic', 'Ariel India', 'Gold Winner Oil', 'V Guard'],
      internalRating: 4.7,
      internalNotes: 'Pandian Stores TV star. High credibility among South Indian homemakers.',
      verified: true,
      audienceDemographics: { topAge: '22-42 (86%)', topGender: 'Female 77.8%, Male 22.2%', topCities: ['Chennai', 'Madurai', 'Coimbatore', 'Bengaluru'] }
    },
    {
      id: 'inf_ig_04',
      name: 'Swetha Renukumar',
      handle: '@one_pitch_catch',
      igLink: 'https://www.instagram.com/one_pitch_catch/',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
      phone: '+91 98404 11293',
      whatsapp: '919840411293',
      email: 'swetha@onepitchcatch.com',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Food & Cooking',
      followerCount: 143000,
      tier: 'Micro',
      avgViews: 180000,
      engagementRate: 1.89,
      genderDemographics: { femalePct: 75.67, malePct: 24.33 },
      pricing: { reel: 100000, reelWithDR: 100000, story: 30000, staticPost: 45000, comboPackage: 130000 },
      previousCampaigns: ['iD Fresh Food', 'Preethi Appliances', 'Milton India'],
      internalRating: 4.8,
      internalNotes: 'Organic home recipes and parenting vlogs. Highly engaged micro-community.',
      verified: false,
      audienceDemographics: { topAge: '20-35 (82%)', topGender: 'Female 75.7%, Male 24.3%', topCities: ['Chennai', 'Bengaluru', 'Coimbatore'] }
    },
    {
      id: 'inf_ig_05',
      name: 'Sunitha',
      handle: '@livingflavourswithsunitha',
      igLink: 'https://www.instagram.com/livingflavourswithsunitha/',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
      phone: '+91 98405 22819',
      whatsapp: '919840522819',
      email: 'sunitha@livingflavours.in',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Food & Cooking',
      followerCount: 214000,
      tier: 'Micro',
      avgViews: 150000,
      engagementRate: 1.23,
      genderDemographics: { femalePct: 76.91, malePct: 23.09 },
      pricing: { reel: 100000, reelWithDR: 100000, story: 30000, staticPost: 40000, comboPackage: 130000 },
      previousCampaigns: ['Tata Salt', 'Dabur Honey', 'Saffola Gold'],
      internalRating: 4.6,
      internalNotes: 'Authentic South Indian culinary tips and healthy family living.',
      verified: false,
      audienceDemographics: { topAge: '24-40 (85%)', topGender: 'Female 76.9%, Male 23.1%', topCities: ['Chennai', 'Madurai', 'Bengaluru'] }
    },
    {
      id: 'inf_ig_06',
      name: 'Yummy Tummy arathi',
      handle: '@yummytummyaarthi',
      igLink: 'https://www.instagram.com/yummytummyaarthi/',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      phone: '+91 98406 33948',
      whatsapp: '919840633948',
      email: 'aarthi@yummytummyaarthi.com',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Food & Cooking',
      followerCount: 592000,
      tier: 'Macro',
      avgViews: 500000,
      engagementRate: 9.41,
      genderDemographics: { femalePct: 72.14, malePct: 27.86 },
      pricing: { reel: 200000, reelWithDR: 200000, story: 60000, staticPost: 90000, comboPackage: 270000 },
      previousCampaigns: ['Cadbury Dairy Milk', 'Fortune Rice Bran', 'Philips Air Fryer', 'Amul Butter'],
      internalRating: 4.9,
      internalNotes: 'Viral food blogger & mom with extraordinary 9.41% engagement rate. Ultra high ROI.',
      verified: true,
      audienceDemographics: { topAge: '20-38 (89%)', topGender: 'Female 72.1%, Male 27.9%', topCities: ['Chennai', 'Bengaluru', 'Coimbatore', 'Kochi'] }
    },
    {
      id: 'inf_ig_07',
      name: 'Sri priya',
      handle: '@spicysamayals',
      igLink: 'https://www.instagram.com/spicysamayals/',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      phone: '+91 98407 44021',
      whatsapp: '919840744021',
      email: 'sripriya@spicysamayals.com',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Food & Cooking',
      followerCount: 934000,
      tier: 'Macro',
      avgViews: 650000,
      engagementRate: 3.08,
      genderDemographics: { femalePct: 78.36, malePct: 21.64 },
      pricing: { reel: 200000, reelWithDR: 200000, story: 55000, staticPost: 80000, comboPackage: 260000 },
      previousCampaigns: ['Sakthi Masala', 'LG Microwave', 'Freedom Refined Oil'],
      internalRating: 4.8,
      internalNotes: 'Near 1M followers with 650k average views per reel. Strong kitchenware conversion.',
      verified: true,
      audienceDemographics: { topAge: '22-45 (87%)', topGender: 'Female 78.4%, Male 21.6%', topCities: ['Chennai', 'Salem', 'Tirupur', 'Coimbatore'] }
    },
    {
      id: 'inf_ig_08',
      name: 'Anjali Prabakaran',
      handle: '@ianjaliprabhakaran',
      igLink: 'https://www.instagram.com/ianjaliprabhakaran/',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
      phone: '+91 98408 55190',
      whatsapp: '919840855190',
      email: 'anjali@prabakaran.media',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Fashion & Lifestyle',
      followerCount: 793000,
      tier: 'Macro',
      avgViews: 200000,
      engagementRate: 12.27,
      genderDemographics: { femalePct: 75.92, malePct: 24.08 },
      pricing: { reel: 85000, reelWithDR: 85000, story: 25000, staticPost: 35000, comboPackage: 115000 },
      previousCampaigns: ['Nykaa Fashion', 'Zudio Finds', 'Dot & Key', 'Plum Goodness'],
      internalRating: 5.0,
      internalNotes: 'INCREDIBLE 12.27% engagement rate at ₹85,000 reel rate. Best cost-per-engagement value.',
      verified: true,
      audienceDemographics: { topAge: '18-30 (92%)', topGender: 'Female 75.9%, Male 24.1%', topCities: ['Chennai', 'Coimbatore', 'Bengaluru', 'Tiruchirappalli'] }
    },
    {
      id: 'inf_ig_09',
      name: 'Shikha Vijay',
      handle: '@cozy_homestyling',
      igLink: 'https://www.instagram.com/cozy_homestyling/',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      phone: '+91 98409 66281',
      whatsapp: '919840966281',
      email: 'shikha@cozyhomestyling.in',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Telugu', 'English', 'Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Fashion & Lifestyle',
      followerCount: 164000,
      tier: 'Micro',
      avgViews: 180000,
      engagementRate: 1.30,
      genderDemographics: { femalePct: 79.18, malePct: 20.82 },
      pricing: { reel: 60000, reelWithDR: 60000, story: 20000, staticPost: 28000, comboPackage: 85000 },
      previousCampaigns: ['Home Centre India', 'Wakefit Home', 'Pure Home + Living'],
      internalRating: 4.7,
      internalNotes: 'Telugu & Tamil bilingual home makeover creator. Super aesthetic living space reels.',
      verified: false,
      audienceDemographics: { topAge: '22-38 (84%)', topGender: 'Female 79.2%, Male 20.8%', topCities: ['Chennai', 'Hyderabad', 'Bengaluru', 'Vijayawada'] }
    },
    {
      id: 'inf_ig_10',
      name: 'Sujitha Dhanush',
      handle: '@sujithadhanush',
      igLink: 'https://www.instagram.com/sujithadhanush/',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      phone: '+91 98410 77392',
      whatsapp: '919841077392',
      email: 'sujitha@dhanush.media',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil', 'Telugu'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Fashion & Lifestyle',
      followerCount: 1500000,
      tier: 'Mega',
      avgViews: 230000,
      engagementRate: 1.83,
      genderDemographics: { femalePct: 71.45, malePct: 28.55 },
      pricing: { reel: 145000, reelWithDR: 145000, story: 45000, staticPost: 65000, comboPackage: 195000 },
      previousCampaigns: ['Horlicks Women', 'Kalyan Jewellers', 'Kumaran Silks'],
      internalRating: 4.8,
      internalNotes: 'Popular South Indian film & serial actress. Household name across Tamil Nadu & Andhra.',
      verified: true,
      audienceDemographics: { topAge: '24-45 (88%)', topGender: 'Female 71.5%, Male 28.5%', topCities: ['Chennai', 'Hyderabad', 'Madurai', 'Visakhapatnam'] }
    },
    {
      id: 'inf_ig_11',
      name: 'Gayathri Yuvaraj',
      handle: '@gayathri_yuvaraj',
      igLink: 'https://www.instagram.com/gayathri_yuvaraj/',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      phone: '+91 98411 88401',
      whatsapp: '919841188401',
      email: 'gayathri@yuvarajtalent.com',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Beauty & Skincare',
      followerCount: 1500000,
      tier: 'Mega',
      avgViews: 500000,
      engagementRate: 0.87,
      genderDemographics: { femalePct: 76.28, malePct: 23.72 },
      pricing: { reel: 200000, reelWithDR: 200000, story: 60000, staticPost: 85000, comboPackage: 270000 },
      previousCampaigns: ['Joyalukkas', 'Palam Silks', 'Garnier India', 'Parachute Advansed'],
      internalRating: 4.7,
      internalNotes: 'Star actress in leading Tamil TV serials with 1.5M followers and 500k views/reel.',
      verified: true,
      audienceDemographics: { topAge: '20-38 (86%)', topGender: 'Female 76.3%, Male 23.7%', topCities: ['Chennai', 'Coimbatore', 'Tiruchirappalli', 'Madurai'] }
    },
    {
      id: 'inf_ig_12',
      name: 'Shamili Rajkumar',
      handle: '@shamili_rajkumar',
      igLink: 'https://www.instagram.com/shamili_rajkumar/',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
      phone: '+91 98412 99512',
      whatsapp: '919841299512',
      email: 'shamili@rajkumarmedia.in',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Fashion & Lifestyle',
      followerCount: 491000,
      tier: 'Micro',
      avgViews: 350000,
      engagementRate: 7.43,
      genderDemographics: { femalePct: 77.53, malePct: 22.47 },
      pricing: { reel: 120000, reelWithDR: 120000, story: 35000, staticPost: 50000, comboPackage: 160000 },
      previousCampaigns: ['FirstCry India', 'Baby Dove', 'Chicco India', 'Meensha Sarees'],
      internalRating: 4.9,
      internalNotes: 'Outstanding 7.43% engagement with 350k avg views on 491k follower base. High conversion.',
      verified: true,
      audienceDemographics: { topAge: '20-34 (90%)', topGender: 'Female 77.5%, Male 22.5%', topCities: ['Chennai', 'Coimbatore', 'Bengaluru'] }
    },
    {
      id: 'inf_ig_13',
      name: 'Sathish Deepa',
      handle: '@sathishkumardsatz',
      igLink: 'https://www.instagram.com/sathishkumardsatz/',
      avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200',
      phone: '+91 98413 00623',
      whatsapp: '919841300623',
      email: 'sathish.deepa@dsatz.com',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Travel & Tourism',
      followerCount: 2000000,
      tier: 'Mega',
      avgViews: 500000,
      engagementRate: 9.76,
      genderDemographics: { femalePct: 75.11, malePct: 24.89 },
      pricing: { reel: 550000, reelWithDR: 550000, story: 120000, staticPost: 200000, comboPackage: 700000 },
      previousCampaigns: ['Maruti Suzuki Arena', 'LG Electronics', 'Amazon Great Indian Festival', 'Colgate India'],
      internalRating: 5.0,
      internalNotes: 'Top Mega Couple & Family Creators in South India (2M followers, 9.76% ER). Massive viral potential.',
      verified: true,
      audienceDemographics: { topAge: '18-40 (91%)', topGender: 'Female 75.1%, Male 24.9%', topCities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Bengaluru'] }
    },
    {
      id: 'inf_ig_14',
      name: 'Abhishek',
      handle: '@abishekchandamarakshan',
      igLink: 'https://www.instagram.com/abishekchandamarakshan/',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
      phone: '+91 98414 11734',
      whatsapp: '919841411734',
      email: 'abhishek@chandamarakshan.in',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Fashion & Lifestyle',
      followerCount: 558000,
      tier: 'Macro',
      avgViews: 500000,
      engagementRate: 2.01,
      genderDemographics: { femalePct: 72.67, malePct: 27.33 },
      pricing: { reel: 200000, reelWithDR: 200000, story: 50000, staticPost: 75000, comboPackage: 260000 },
      previousCampaigns: ['Myntra', 'OnePlus India', 'Dominos Pizza', 'Zepto'],
      internalRating: 4.7,
      internalNotes: 'High-energy lifestyle & family content creator. Strong youth and family balance.',
      verified: true,
      audienceDemographics: { topAge: '18-32 (88%)', topGender: 'Female 72.7%, Male 27.3%', topCities: ['Chennai', 'Bengaluru', 'Coimbatore'] }
    },
    {
      id: 'inf_ig_15',
      name: 'Sowmya Sathyaraj',
      handle: '@sowmya_sathyaraj',
      igLink: 'https://www.instagram.com/sowmya_sathyaraj/',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      phone: '+91 98415 22845',
      whatsapp: '919841522845',
      email: 'sowmya@sathyarajcollabs.com',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Food & Cooking',
      followerCount: 587000,
      tier: 'Macro',
      avgViews: 400000,
      engagementRate: 3.58,
      genderDemographics: { femalePct: 78.02, malePct: 21.98 },
      pricing: { reel: 100000, reelWithDR: 100000, story: 30000, staticPost: 45000, comboPackage: 140000 },
      previousCampaigns: ['Nestle Nangrow', 'Pampers Premium Care', 'Cello World', 'Prestige Smart Kitchen'],
      internalRating: 4.8,
      internalNotes: 'Great ROI rate of ₹1,00,000 for 400k avg views with 78% female audience.',
      verified: true,
      audienceDemographics: { topAge: '22-38 (87%)', topGender: 'Female 78.0%, Male 22.0%', topCities: ['Chennai', 'Coimbatore', 'Madurai'] }
    },
    {
      id: 'inf_ig_16',
      name: 'Diya',
      handle: '@diya_menon_official',
      igLink: 'https://www.instagram.com/diya_menon_official/',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      phone: '+91 98416 33956',
      whatsapp: '919841633956',
      email: 'diya@menonofficial.in',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Beauty & Skincare',
      followerCount: 996000,
      tier: 'Macro',
      avgViews: 250000,
      engagementRate: 0.39,
      genderDemographics: { femalePct: 79.34, malePct: 20.66 },
      pricing: { reel: 180000, reelWithDR: 180000, story: 50000, staticPost: 75000, comboPackage: 240000 },
      previousCampaigns: ['Nyle Herbal', 'Medimix Ayurveda', 'Saravana Stores'],
      internalRating: 4.6,
      internalNotes: 'Popular TV anchor and celebrity mom. Nearly 1M followers with 79.34% female audience.',
      verified: true,
      audienceDemographics: { topAge: '22-42 (85%)', topGender: 'Female 79.3%, Male 20.7%', topCities: ['Chennai', 'Salem', 'Tiruchirappalli', 'Coimbatore'] }
    },
    {
      id: 'inf_ig_17',
      name: 'Snazzy',
      handle: '@snazzytamilachi',
      igLink: 'https://www.instagram.com/snazzytamilachi/',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
      phone: '+91 98417 44067',
      whatsapp: '919841744067',
      email: 'snazzy@tamilachi.com',
      city: 'Chennai',
      state: 'Tamil Nadu',
      languages: ['Tamil'],
      primaryGenre: 'Mom & Lifestyle',
      secondaryGenre: 'Fashion & Lifestyle',
      followerCount: 563000,
      tier: 'Macro',
      avgViews: 25000,
      engagementRate: 11.54,
      genderDemographics: { femalePct: 76.82, malePct: 23.18 },
      pricing: { reel: 75000, reelWithDR: 75000, story: 20000, staticPost: 30000, comboPackage: 100000 },
      previousCampaigns: ['Zivame', 'Nykaa Beauty', 'Vellvette Cosmetics'],
      internalRating: 4.8,
      internalNotes: 'Super high 11.54% engagement rate at ₹75,000 reel rate. High community conversation on reels.',
      verified: true,
      audienceDemographics: { topAge: '18-32 (91%)', topGender: 'Female 76.8%, Male 23.2%', topCities: ['Chennai', 'Madurai', 'Bengaluru'] }
    }
  ],
  brandBriefs: [
    {
      id: 'brf_01',
      brandName: 'AuraTech Electronics',
      campaignTitle: 'AuraPro Earbuds Gen-3 National Launch',
      objective: 'Brand Awareness & Pre-Orders',
      targetCities: ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune'],
      targetLanguages: ['English', 'Hindi', 'Kannada', 'Tamil'],
      creatorTiers: ['Micro', 'Macro'],
      genres: ['Tech & Gadgets', 'Gaming & Esports', 'Fitness & Health'],
      totalBudget: 1500000,
      deliverables: { reelsCount: 8, storiesCount: 16, youtubeIntegratedCount: 3, youtubeDedicatedCount: 1 },
      timelineStart: '2026-03-15',
      timelineEnd: '2026-04-10',
      targetAudience: 'Gen-Z and young tech enthusiasts (18-32)',
      usageRights: '30 days digital whitelisting + brand Instagram repost',
      clientBriefDoc: 'AuraPro_Earbuds_Q1_Brief.pdf',
      status: 'Proposed',
      createdAt: '2026-02-18T10:00:00Z',
      updatedAt: '2026-02-20T14:30:00Z'
    },
    {
      id: 'brf_02',
      brandName: 'Nourish Glow Skincare',
      campaignTitle: 'Summer Hydration Serum & SPF50 Campaign',
      objective: 'Product Trial & Conversions',
      targetCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Chennai'],
      targetLanguages: ['English', 'Hindi', 'Tamil'],
      creatorTiers: ['Nano', 'Micro', 'Macro', 'Mega'],
      genres: ['Mom & Lifestyle', 'Beauty & Skincare', 'Fashion & Lifestyle'],
      totalBudget: 2200000,
      deliverables: { reelsCount: 12, storiesCount: 24, youtubeIntegratedCount: 2, youtubeDedicatedCount: 0 },
      timelineStart: '2026-03-20',
      timelineEnd: '2026-04-25',
      targetAudience: 'Women aged 18-35, skincare buffs, working mothers',
      usageRights: '60 days social media ads + website testimonial usage',
      clientBriefDoc: 'NourishGlow_Hydration_2026.pdf',
      status: 'In-Execution',
      createdAt: '2026-02-10T11:20:00Z',
      updatedAt: '2026-02-25T16:00:00Z'
    }
  ],
  proposals: [
    {
      id: 'prop_01',
      briefId: 'brf_02',
      proposalCode: 'PROP-NOURISH-2026-01',
      title: 'Nourish Glow - Mom & Lifestyle Creator Media Plan',
      clientName: 'Nourish Glow Skincare',
      version: 'v1',
      status: 'Sent to Client',
      marginPercentage: 20,
      totalCreatorCost: 650000,
      totalAgencyMargin: 130000,
      finalClientPrice: 780000,
      creatorsData: [
        {
          influencerId: 'inf_ig_01',
          name: 'Alya Manasa',
          handle: '@alya_manasa',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
          tier: 'Mega',
          followers: 4500000,
          genre: 'Mom & Lifestyle',
          city: 'Chennai',
          selectedDeliverables: ['1x Instagram Reel (4K)', '2x Stories with Link'],
          creatorBuyPrice: 400000,
          marginPct: 20,
          clientQuotePrice: 480000,
          rationale: 'Massive 4.5M follower reach with 78.9% female audience.'
        },
        {
          influencerId: 'inf_ig_08',
          name: 'Anjali Prabakaran',
          handle: '@ianjaliprabhakaran',
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
          tier: 'Macro',
          followers: 793000,
          genre: 'Mom & Lifestyle',
          city: 'Chennai',
          selectedDeliverables: ['1x Reel + DR', '2x Stories'],
          creatorBuyPrice: 85000,
          marginPct: 20,
          clientQuotePrice: 102000,
          rationale: 'Exceptional 12.27% engagement rate for high D2C conversion.'
        }
      ],
      notes: 'Includes 30 days whitelisting rights for Meta ads.',
      createdBy: 'Shreya Sengupta',
      createdAt: '2026-02-21T11:00:00Z',
      updatedAt: '2026-02-22T15:20:00Z'
    }
  ],
  campaigns: [
    {
      id: 'cmp_01',
      proposalId: 'prop_01',
      briefId: 'brf_02',
      title: 'Nourish Glow - Summer Hydration Serum Campaign',
      brandName: 'Nourish Glow Skincare',
      status: 'In-Execution',
      totalBudget: 780000,
      startDate: '2026-02-20',
      endDate: '2026-03-30',
      milestones: [
        { id: 'm1', title: 'Creator Selection & Pricing Sign-off', status: 'Completed', date: '2026-02-21' },
        { id: 'm2', title: 'Product Dispatch & Tracking Confirmation', status: 'Completed', date: '2026-02-24' },
        { id: 'm3', title: 'Script & Storyboard Review', status: 'In-Progress', date: '2026-03-02' },
        { id: 'm4', title: 'Draft Video Shoot & Quality Check', status: 'Pending', date: '2026-03-08' },
        { id: 'm5', title: 'Live Posting & Collaborative Tags', status: 'Pending', date: '2026-03-15' },
        { id: 'm6', title: 'Post-Campaign Insights & ROI Invoicing', status: 'Pending', date: '2026-03-25' }
      ],
      creatorMilestones: [
        {
          influencerId: 'inf_ig_01',
          name: 'Alya Manasa',
          handle: '@alya_manasa',
          deliverable: '1x Reel + 2x Stories',
          stage: 'Script Approved',
          draftUrl: 'https://vimeo.com/sample_draft1',
          livePostUrl: '',
          views: 0,
          likes: 0,
          comments: 0,
          invoiceStatus: '50% Advance Paid',
          notes: 'Script approved by brand manager. Shooting on March 3rd.'
        },
        {
          influencerId: 'inf_ig_08',
          name: 'Anjali Prabakaran',
          handle: '@ianjaliprabhakaran',
          deliverable: '1x Reel + DR',
          stage: 'Draft Under Review',
          draftUrl: 'https://vimeo.com/sample_draft2',
          livePostUrl: '',
          views: 0,
          likes: 0,
          comments: 0,
          invoiceStatus: 'Contract Signed',
          notes: 'Derm skincare claim review in progress.'
        }
      ],
      createdAt: '2026-02-20T10:00:00Z',
      updatedAt: '2026-02-26T12:00:00Z'
    }
  ],
  auditLogs: [
    {
      id: 'log_01',
      userName: 'Aditya Roy',
      userRole: 'Admin',
      action: 'SYSTEM_INITIALIZED',
      entityType: 'System',
      entityId: 'sys_01',
      details: 'Influencer Database initialized with Excel dataset and in-house staff logins.',
      timestamp: '2026-02-01T09:00:00Z'
    }
  ]
};

class DatabaseStore {
  constructor() {
    this.dbPath = DB_FILE;
    this.init();
  }

  init() {
    if (!fs.existsSync(this.dbPath)) {
      this.write(INITIAL_DATA);
    }
  }

  read() {
    try {
      const raw = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading DB, restoring initial data:', err);
      this.write(INITIAL_DATA);
      return INITIAL_DATA;
    }
  }

  write(data) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf8');
  }

  get(collection) {
    const data = this.read();
    return data[collection] || [];
  }

  findById(collection, id) {
    const items = this.get(collection);
    return items.find(item => item.id === id);
  }

  insert(collection, item) {
    const data = this.read();
    if (!data[collection]) data[collection] = [];
    const newItem = {
      ...item,
      id: item.id || `${collection.slice(0, 3)}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data[collection].unshift(newItem);
    this.write(data);
    return newItem;
  }

  update(collection, id, updates) {
    const data = this.read();
    if (!data[collection]) return null;
    const index = data[collection].findIndex(item => item.id === id);
    if (index === -1) return null;

    data[collection][index] = {
      ...data[collection][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.write(data);
    return data[collection][index];
  }

  delete(collection, id) {
    const data = this.read();
    if (!data[collection]) return false;
    const initialLen = data[collection].length;
    data[collection] = data[collection].filter(item => item.id !== id);
    this.write(data);
    return data[collection].length < initialLen;
  }

  log(userName, userRole, action, entityType, entityId, details) {
    this.insert('auditLogs', {
      userName,
      userRole,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString()
    });
  }
}

export const db = new DatabaseStore();
