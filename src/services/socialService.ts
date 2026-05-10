
import { SocialPlatform, RegionSchedule, TeamMember, ActivityLog, Product } from '../types';

// Mock Social Media API Integration
// In a real application, this would interface with Meta Graph API and WhatsApp Business API
export const socialService = {
  connectAccount: async (platform: SocialPlatform): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simulate OAuth flow delay
      setTimeout(() => resolve(true), 1500);
    });
  },

  disconnectAccount: async (platform: SocialPlatform): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  },

  postAsset: async (platform: SocialPlatform, assetId: string, content: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      console.log(`Posting to ${platform} for asset ${assetId}`, content);
      // Simulate API network call
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
            resolve(true);
        } else {
            reject(new Error("Network error"));
        }
      }, 2000);
    });
  },

  getMockCatalog: (): Product[] => {
    return [
      { id: '1', name: 'Shea Butter Premium', price: '5000 FCFA', description: 'Pure organic shea butter from Northern Ghana.', imageUrl: 'https://images.unsplash.com/photo-1556228720-1987d95311b3?auto=format&fit=crop&q=80&w=200' },
      { id: '2', name: 'Kente Scarf', price: '15000 FCFA', description: 'Hand-woven authentic Kente ceremonial scarf.', imageUrl: 'https://images.unsplash.com/photo-1628148879817-27b5e808149e?auto=format&fit=crop&q=80&w=200' },
      { id: '3', name: 'Baobab Oil', price: '8000 FCFA', description: 'Rejuvenating baobab oil for skin and hair.', imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=200' },
      { id: '4', name: 'African Print Tote', price: '7500 FCFA', description: 'Durable tote bag with vibrant Wax print patterns.', imageUrl: 'https://images.unsplash.com/photo-1590874103328-96030165e366?auto=format&fit=crop&q=80&w=200' },
    ];
  },

  getRegionSchedule: (country: string): RegionSchedule => {
    // Basic mapping of countries to regions/timezones
    const westAfrica = ['Senegal', 'Ghana', 'Nigeria', 'Côte d\'Ivoire', 'Benin', 'Togo', 'Burkina Faso', 'Mali', 'Guinea', 'Sierra Leone', 'Liberia', 'Gambia', 'Niger', 'Cabo Verde'];
    const eastAfrica = ['Kenya', 'Tanzania', 'Uganda', 'Ethiopia', 'Rwanda', 'Burundi', 'Djibouti', 'Somalia', 'Eritrea', 'South Sudan', 'Seychelles'];
    const northAfrica = ['Morocco', 'Egypt', 'Tunisia', 'Algeria', 'Libya', 'Mauritania', 'Sudan'];
    const southernAfrica = ['South Africa', 'Namibia', 'Botswana', 'Zimbabwe', 'Zambia', 'Malawi', 'Mozambique', 'Angola', 'Lesotho', 'Eswatini', 'Madagascar', 'Mauritius'];
    const centralAfrica = ['Cameroon', 'Gabon', 'Congo', 'DR Congo', 'Chad', 'Central African Republic', 'Equatorial Guinea', 'Sao Tome and Principe'];

    if (westAfrica.includes(country)) {
      return { 
        region: 'West Africa', 
        bestTimes: ['07:30 GMT', '18:15 GMT', '20:00 GMT'], 
        bestDays: ['Tue', 'Thu', 'Sat'],
        platformSpecifics: {
            instagram: '19:00 - 21:00 GMT',
            tiktok: '12:00 & 20:00 GMT',
            linkedin: '08:00 - 10:00 GMT',
            whatsapp: '07:00 - 09:00 GMT'
        }
      };
    } else if (eastAfrica.includes(country)) {
      return { 
        region: 'East Africa', 
        bestTimes: ['08:00 EAT', '19:00 EAT', '21:00 EAT'], 
        bestDays: ['Mon', 'Wed', 'Fri'],
        platformSpecifics: {
            instagram: '18:00 - 20:00 EAT',
            tiktok: '16:00 & 21:00 EAT',
            linkedin: '09:00 - 11:00 EAT',
            whatsapp: '08:00 - 10:00 EAT'
        } 
      };
    } else if (northAfrica.includes(country)) {
      return { 
        region: 'North Africa', 
        bestTimes: ['10:00 CET', '20:30 CET'], 
        bestDays: ['Mon', 'Thu', 'Sun'],
        platformSpecifics: {
            instagram: '20:00 - 22:00 CET',
            tiktok: '14:00 & 21:00 CET',
            linkedin: '10:00 - 12:00 CET',
            whatsapp: '09:00 - 11:00 CET'
        }
      };
    } else if (southernAfrica.includes(country)) {
      return { 
        region: 'Southern Africa', 
        bestTimes: ['07:00 SAST', '17:30 SAST'], 
        bestDays: ['Tue', 'Fri', 'Sun'],
        platformSpecifics: {
            instagram: '18:00 - 20:00 SAST',
            tiktok: '17:00 & 22:00 SAST',
            linkedin: '08:00 - 10:00 SAST',
            whatsapp: '07:00 - 09:00 SAST'
        } 
      };
    } else if (centralAfrica.includes(country)) {
      return { 
        region: 'Central Africa', 
        bestTimes: ['08:00 WAT', '18:00 WAT'], 
        bestDays: ['Mon', 'Wed', 'Sat'],
        platformSpecifics: {
            instagram: '18:00 - 20:00 WAT',
            tiktok: '13:00 & 19:00 WAT',
            linkedin: '09:00 - 11:00 WAT',
            whatsapp: '08:00 - 10:00 WAT'
        }
      };
    }
    
    // Default
    return { 
        region: 'West Africa', 
        bestTimes: ['09:00 UTC', '18:00 UTC'], 
        bestDays: ['Mon', 'Wed', 'Fri'],
        platformSpecifics: {
            instagram: '18:00 UTC',
            tiktok: '20:00 UTC',
            linkedin: '09:00 UTC',
            whatsapp: '08:00 UTC'
        }
    };
  },

  // Team Mock Data
  getTeamMembers: (): TeamMember[] => [
    { id: '1', name: 'Malthus A.', email: 'malthus@afribrand.ai', role: 'Admin', avatar: 'MA' },
    { id: '2', name: 'Sarah K.', email: 'sarah@agency.com', role: 'Editor', avatar: 'SK' },
  ],

  getActivities: (): ActivityLog[] => [
    { id: '1', user: 'Malthus A.', action: 'Connected Instagram Account', timestamp: '2 mins ago', type: 'connection' },
    { id: '2', user: 'Sarah K.', action: 'Generated "Tabaski Special" Campaign', timestamp: '1 hour ago', type: 'creation' },
    { id: '3', user: 'Malthus A.', action: 'Exported Monthly Calendar', timestamp: '3 hours ago', type: 'export' },
    { id: '4', user: 'Sarah K.', action: 'Refined 5 Assets with NL Editor', timestamp: 'Yesterday', type: 'edit' },
  ],

  getAssetMetrics: async (assetId: string): Promise<{ reach: number, engagement: number, conversions: number, lastUpdated: string }> => {
    return new Promise((resolve) => {
      // Simulate API fetch delay
      setTimeout(() => {
        resolve({
          reach: Math.floor(Math.random() * 5000) + 500,
          engagement: Math.floor(Math.random() * 800) + 50,
          conversions: Math.floor(Math.random() * 50) + 5,
          lastUpdated: new Date().toISOString()
        });
      }, 1000);
    });
  }
};
