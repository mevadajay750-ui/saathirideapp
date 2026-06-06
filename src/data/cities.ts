export interface City {
  id: string;
  name: string;
  state: string;
  aliases?: string[];
}

export const CITIES: City[] = [
  // Gujarat (MVP pilot focus)
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', aliases: ['amdavad', 'amd'] },
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat', aliases: ['baroda'] },
  { id: 'surat', name: 'Surat', state: 'Gujarat', aliases: ['srt'] },
  { id: 'rajkot', name: 'Rajkot', state: 'Gujarat', aliases: ['rjt'] },
  { id: 'gandhinagar', name: 'Gandhinagar', state: 'Gujarat' },
  { id: 'anand', name: 'Anand', state: 'Gujarat' },
  { id: 'nadiad', name: 'Nadiad', state: 'Gujarat' },
  { id: 'bharuch', name: 'Bharuch', state: 'Gujarat', aliases: ['broach'] },
  { id: 'navsari', name: 'Navsari', state: 'Gujarat' },
  { id: 'vapi', name: 'Vapi', state: 'Gujarat' },
  { id: 'ankleshwar', name: 'Ankleshwar', state: 'Gujarat' },
  { id: 'mehsana', name: 'Mehsana', state: 'Gujarat' },
  { id: 'palanpur', name: 'Palanpur', state: 'Gujarat' },
  { id: 'bhavnagar', name: 'Bhavnagar', state: 'Gujarat' },
  { id: 'jamnagar', name: 'Jamnagar', state: 'Gujarat' },
  { id: 'junagadh', name: 'Junagadh', state: 'Gujarat' },
  { id: 'porbandar', name: 'Porbandar', state: 'Gujarat' },
  { id: 'surendranagar', name: 'Surendranagar', state: 'Gujarat' },
  { id: 'morbi', name: 'Morbi', state: 'Gujarat' },

  // Maharashtra
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', aliases: ['bombay'] },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', aliases: ['poona'] },
  { id: 'nashik', name: 'Nashik', state: 'Maharashtra', aliases: ['nasik'] },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra' },
  { id: 'aurangabad', name: 'Aurangabad', state: 'Maharashtra' },
  { id: 'kolhapur', name: 'Kolhapur', state: 'Maharashtra' },

  // Rajasthan
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
  { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan' },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan' },
  { id: 'ajmer', name: 'Ajmer', state: 'Rajasthan' },
  { id: 'kota', name: 'Kota', state: 'Rajasthan' },
  { id: 'bikaner', name: 'Bikaner', state: 'Rajasthan' },
  { id: 'mount_abu', name: 'Mount Abu', state: 'Rajasthan' },

  // Delhi NCR
  { id: 'delhi', name: 'Delhi', state: 'Delhi', aliases: ['new delhi', 'nd'] },
  { id: 'gurgaon', name: 'Gurgaon', state: 'Haryana', aliases: ['gurugram'] },
  { id: 'noida', name: 'Noida', state: 'Uttar Pradesh' },
  { id: 'faridabad', name: 'Faridabad', state: 'Haryana' },

  // Karnataka
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', aliases: ['bengaluru', 'blr'] },
  { id: 'mysore', name: 'Mysore', state: 'Karnataka', aliases: ['mysuru'] },
  { id: 'hubli', name: 'Hubli', state: 'Karnataka' },
  { id: 'mangalore', name: 'Mangalore', state: 'Karnataka' },

  // Telangana / AP
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', aliases: ['hyd'] },
  { id: 'vijayawada', name: 'Vijayawada', state: 'Andhra Pradesh' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', aliases: ['vizag'] },

  // Tamil Nadu
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', aliases: ['madras'] },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu' },

  // UP
  { id: 'agra', name: 'Agra', state: 'Uttar Pradesh' },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh' },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', aliases: ['banaras'] },
  { id: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh' },
];

/**
 * Search cities by query string — matches name, state, and aliases.
 * Returns top 8 results.
 */
export function searchCities(query: string, exclude?: string): City[] {
  if (!query || query.trim().length < 1) return [];

  const q = query.toLowerCase().trim();

  return CITIES.filter((city) => {
    if (exclude && city.id === exclude) return false;
    const nameMatch = city.name.toLowerCase().includes(q);
    const stateMatch = city.state.toLowerCase().includes(q);
    const aliasMatch = city.aliases?.some((a) => a.toLowerCase().includes(q));
    return nameMatch || stateMatch || aliasMatch;
  })
    .sort((a, b) => {
      const aExact = a.name.toLowerCase().startsWith(q) ? 0 : 1;
      const bExact = b.name.toLowerCase().startsWith(q) ? 0 : 1;
      return aExact - bExact;
    })
    .slice(0, 8);
}
