export interface KenyaCounty {
  code: string;
  name: string;
  capital: string;
  region: string;
  subCounties: string[];
}

export const KENYA_47_COUNTIES: KenyaCounty[] = [
  {
    code: '001',
    name: 'Mombasa',
    capital: 'Mombasa City',
    region: 'Coast',
    subCounties: ['Changamwe', 'Jomvu', 'Kisauni', 'Nyali', 'Likoni', 'Mvita'],
  },
  {
    code: '002',
    name: 'Kwale',
    capital: 'Kwale Town',
    region: 'Coast',
    subCounties: ['Matuga', 'Msambweni', 'Kinango', 'Lunga Lunga', 'Samburu'],
  },
  {
    code: '003',
    name: 'Kilifi',
    capital: 'Kilifi Town',
    region: 'Coast',
    subCounties: ['Kilifi North', 'Kilifi South', 'Kaloleni', 'Rabai', 'Ganze', 'Malindi', 'Magarini'],
  },
  {
    code: '004',
    name: 'Tana River',
    capital: 'Hola',
    region: 'Coast',
    subCounties: ['Garsen', 'Galole', 'Bura'],
  },
  {
    code: '005',
    name: 'Lamu',
    capital: 'Lamu Town',
    region: 'Coast',
    subCounties: ['Lamu East', 'Lamu West'],
  },
  {
    code: '006',
    name: 'Taita Taveta',
    capital: 'Mwatate',
    region: 'Coast',
    subCounties: ['Taveta', 'Wundanyi', 'Mwatate', 'Voi'],
  },
  {
    code: '007',
    name: 'Garissa',
    capital: 'Garissa Town',
    region: 'North Eastern',
    subCounties: ['Garissa Township', 'Balambala', 'Lagdera', 'Dadaab', 'Fafi', 'Ijara'],
  },
  {
    code: '008',
    name: 'Wajir',
    capital: 'Wajir Town',
    region: 'North Eastern',
    subCounties: ['Wajir North', 'Wajir East', 'Tarbaj', 'Wajir West', 'Eldas', 'Wajir South'],
  },
  {
    code: '009',
    name: 'Mandera',
    capital: 'Mandera Town',
    region: 'North Eastern',
    subCounties: ['Mandera West', 'Banissa', 'Mandera North', 'Mandera South', 'Mandera East', 'Lafey'],
  },
  {
    code: '010',
    name: 'Marsabit',
    capital: 'Marsabit Town',
    region: 'Eastern',
    subCounties: ['Moyale', 'North Horr', 'Saku', 'Laisamis'],
  },
  {
    code: '011',
    name: 'Isiolo',
    capital: 'Isiolo Town',
    region: 'Eastern',
    subCounties: ['Isiolo North', 'Isiolo South'],
  },
  {
    code: '012',
    name: 'Meru',
    capital: 'Meru Town',
    region: 'Eastern',
    subCounties: ['Igembe South', 'Igembe Central', 'Igembe North', 'Tigania West', 'Tigania East', 'North Imenti', 'Buuri', 'Central Imenti', 'South Imenti'],
  },
  {
    code: '013',
    name: 'Tharaka-Nithi',
    capital: 'Kathwana',
    region: 'Eastern',
    subCounties: ['Maara', 'Chuka/Igambang\'ombe', 'Tharaka'],
  },
  {
    code: '014',
    name: 'Embu',
    capital: 'Embu Town',
    region: 'Eastern',
    subCounties: ['Manyatta', 'Runyenjes', 'Mbeere South', 'Mbeere North'],
  },
  {
    code: '015',
    name: 'Kitui',
    capital: 'Kitui Town',
    region: 'Eastern',
    subCounties: ['Mwingi North', 'Mwingi West', 'Mwingi Central', 'Kitui West', 'Kitui Rural', 'Kitui Central', 'Kitui East', 'Kitui South'],
  },
  {
    code: '016',
    name: 'Machakos',
    capital: 'Machakos Town',
    region: 'Eastern',
    subCounties: ['Masinga', 'Yatta', 'Kangundo', 'Matungulu', 'Kathiani', 'Mavoko', 'Machakos Town', 'Mwala'],
  },
  {
    code: '017',
    name: 'Makueni',
    capital: 'Wote',
    region: 'Eastern',
    subCounties: ['Mbooni', 'Kilome', 'Kaiti', 'Makueni', 'Kibwezi West', 'Kibwezi East'],
  },
  {
    code: '018',
    name: 'Nyandarua',
    capital: 'Ol Kalou',
    region: 'Central',
    subCounties: ['Kinangop', 'Kipipiri', 'Ol Kalou', 'Ol Jorok', 'Ndaragwa'],
  },
  {
    code: '019',
    name: 'Nyeri',
    capital: 'Nyeri Town',
    region: 'Central',
    subCounties: ['Tetu', 'Kieni', 'Mathira', 'Othaya', 'Mukurweini', 'Nyeri Town'],
  },
  {
    code: '020',
    name: 'Kirinyaga',
    capital: 'Kerugoya/Kutus',
    region: 'Central',
    subCounties: ['Mwea', 'Gichugu', 'Ndia', 'Kirinyaga Central'],
  },
  {
    code: '021',
    name: 'Murang\'a',
    capital: 'Murang\'a Town',
    region: 'Central',
    subCounties: ['Kangema', 'Mathioya', 'Kiharu', 'Kigumo', 'Maragua', 'Kandara', 'Gatanga'],
  },
  {
    code: '022',
    name: 'Kiambu',
    capital: 'Kiambu Town',
    region: 'Central',
    subCounties: ['Gatundu South', 'Gatundu North', 'Juja', 'Thika Town', 'Ruiru', 'Githunguri', 'Kiambu', 'Kiambaa', 'Kabete', 'Kikuyu', 'Limuru', 'Lari'],
  },
  {
    code: '023',
    name: 'Turkana',
    capital: 'Lodwar',
    region: 'Rift Valley',
    subCounties: ['Turkana North', 'Turkana West', 'Turkana Central', 'Loima', 'Turkana South', 'Turkana East'],
  },
  {
    code: '024',
    name: 'West Pokot',
    capital: 'Kapenguria',
    region: 'Rift Valley',
    subCounties: ['Kapenguria', 'Sigor', 'Kacheliba', 'Pokot South'],
  },
  {
    code: '025',
    name: 'Samburu',
    capital: 'Maralal',
    region: 'Rift Valley',
    subCounties: ['Samburu West', 'Samburu North', 'Samburu East'],
  },
  {
    code: '026',
    name: 'Trans Nzoia',
    capital: 'Kitale',
    region: 'Rift Valley',
    subCounties: ['Kwanza', 'Endebess', 'Saboti', 'Kiminini', 'Cherangany'],
  },
  {
    code: '027',
    name: 'Uasin Gishu',
    capital: 'Eldoret City',
    region: 'Rift Valley',
    subCounties: ['Soy', 'Turbo', 'Moiben', 'Ainabkoi', 'Kapseret', 'Kesses'],
  },
  {
    code: '028',
    name: 'Elgeyo Marakwet',
    capital: 'Iten',
    region: 'Rift Valley',
    subCounties: ['Marakwet East', 'Marakwet West', 'Keiyo North', 'Keiyo South'],
  },
  {
    code: '029',
    name: 'Nandi',
    capital: 'Kapsabet',
    region: 'Rift Valley',
    subCounties: ['Tinderet', 'Aldai', 'Nandi Hills', 'Chesumei', 'Emgwen', 'Mosop'],
  },
  {
    code: '030',
    name: 'Baringo',
    capital: 'Kabarnet',
    region: 'Rift Valley',
    subCounties: ['Tiaty', 'Baringo North', 'Baringo Central', 'Baringo South', 'Mogotio', 'Eldama Ravine'],
  },
  {
    code: '031',
    name: 'Laikipia',
    capital: 'Rumuruti',
    region: 'Rift Valley',
    subCounties: ['Laikipia West', 'Laikipia East', 'Laikipia North'],
  },
  {
    code: '032',
    name: 'Nakuru',
    capital: 'Nakuru City',
    region: 'Rift Valley',
    subCounties: ['Molo', 'Njoro', 'Naivasha', 'Gilgil', 'Kuresoi South', 'Kuresoi North', 'Subukia', 'Rongai', 'Bahati', 'Nakuru Town West', 'Nakuru Town East'],
  },
  {
    code: '033',
    name: 'Narok',
    capital: 'Narok Town',
    region: 'Rift Valley',
    subCounties: ['Kilgoris', 'Emurua Dikirr', 'Narok North', 'Narok East', 'Narok South', 'Narok West'],
  },
  {
    code: '034',
    name: 'Kajiado',
    capital: 'Kajiado Town',
    region: 'Rift Valley',
    subCounties: ['Kajiado North', 'Kajiado Central', 'Kajiado East', 'Kajiado West', 'Kajiado South'],
  },
  {
    code: '035',
    name: 'Kericho',
    capital: 'Kericho Town',
    region: 'Rift Valley',
    subCounties: ['Kipkelion East', 'Kipkelion West', 'Ainamoi', 'Bureti', 'Belgut', 'Sigowet/Soin'],
  },
  {
    code: '036',
    name: 'Bomet',
    capital: 'Bomet Town',
    region: 'Rift Valley',
    subCounties: ['Sotik', 'Chepalungu', 'Bomet East', 'Bomet Central', 'Konoin'],
  },
  {
    code: '037',
    name: 'Kakamega',
    capital: 'Kakamega Town',
    region: 'Western',
    subCounties: ['Lugari', 'Likuyani', 'Malava', 'Lurambi', 'Navakholo', 'Mumias West', 'Mumias East', 'Matungu', 'Butere', 'Khwisero', 'Shinyalu', 'Ikolomani'],
  },
  {
    code: '038',
    name: 'Vihiga',
    capital: 'Vihiga Town',
    region: 'Western',
    subCounties: ['Vihiga', 'Sabatia', 'Hamisi', 'Luanda', 'Emuhaya'],
  },
  {
    code: '039',
    name: 'Bungoma',
    capital: 'Bungoma Town',
    region: 'Western',
    subCounties: ['Mount Elgon', 'Sirisia', 'Kabuchai', 'Bumula', 'Kanduyi', 'Webuye West', 'Webuye East', 'Kimilili', 'Tongaren'],
  },
  {
    code: '040',
    name: 'Busia',
    capital: 'Busia Town',
    region: 'Western',
    subCounties: ['Teso North', 'Teso South', 'Nambale', 'Matayos', 'Butula', 'Funyula', 'Budalangi'],
  },
  {
    code: '041',
    name: 'Siaya',
    capital: 'Siaya Town',
    region: 'Nyanza',
    subCounties: ['Ugenya', 'Ugunja', 'Alego Usonga', 'Gem', 'Bondo', 'Rarieda'],
  },
  {
    code: '042',
    name: 'Kisumu',
    capital: 'Kisumu City',
    region: 'Nyanza',
    subCounties: ['Kisumu East', 'Kisumu West', 'Kisumu Central', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach'],
  },
  {
    code: '043',
    name: 'Homa Bay',
    capital: 'Homa Bay Town',
    region: 'Nyanza',
    subCounties: ['Kasipul', 'Kabondo Kasipul', 'Karachuonyo', 'Rangwe', 'Homa Bay Town', 'Ndhiwa', 'Suba North', 'Suba South'],
  },
  {
    code: '044',
    name: 'Migori',
    capital: 'Migori Town',
    region: 'Nyanza',
    subCounties: ['Rongo', 'Awendo', 'Suna East', 'Suna West', 'Uriri', 'Nyatike', 'Kuria West', 'Kuria East'],
  },
  {
    code: '045',
    name: 'Kisii',
    capital: 'Kisii Town',
    region: 'Nyanza',
    subCounties: ['Bonchari', 'South Mugirango', 'Bomachoge Borabu', 'Bobasi', 'Bomachoge Chache', 'Nyaribari Masaba', 'Nyaribari Chache', 'Kitutu Chache North', 'Kitutu Chache South'],
  },
  {
    code: '046',
    name: 'Nyamira',
    capital: 'Nyamira Town',
    region: 'Nyanza',
    subCounties: ['Kitutu Masaba', 'West Mugirango', 'North Mugirango', 'Borabu'],
  },
  {
    code: '047',
    name: 'Nairobi',
    capital: 'Nairobi City',
    region: 'Nairobi',
    subCounties: ['Westlands', 'Dagoretti North', 'Dagoretti South', 'Lang\'ata', 'Kibra', 'Roysambu', 'Kasarani', 'Ruaraka', 'Embakasi South', 'Embakasi North', 'Embakasi Central', 'Embakasi East', 'Embakasi West', 'Makadara', 'Kamukunji', 'Starehe', 'Mathare'],
  },
];

export function getCountyByCode(code: string): KenyaCounty | undefined {
  return KENYA_47_COUNTIES.find((c) => c.code === code);
}

export function getCountyByName(name: string): KenyaCounty | undefined {
  const norm = name.trim().toLowerCase();
  return KENYA_47_COUNTIES.find((c) => c.name.toLowerCase() === norm);
}

/**
 * Direct neighbouring boundaries for all 47 Counties of Kenya.
 * Used for regional civic coordination and prioritized citizen discovery.
 */
export const KENYA_NEIGHBOURING_COUNTIES: Record<string, string[]> = {
  Mombasa: ['Kwale', 'Kilifi'],
  Kwale: ['Mombasa', 'Kilifi', 'Taita Taveta'],
  Kilifi: ['Mombasa', 'Kwale', 'Tana River', 'Taita Taveta'],
  'Tana River': ['Kilifi', 'Lamu', 'Garissa', 'Kitui'],
  Lamu: ['Tana River', 'Garissa'],
  'Taita Taveta': ['Kwale', 'Kilifi', 'Makueni', 'Kajiado'],
  Garissa: ['Lamu', 'Tana River', 'Kitui', 'Isiolo', 'Wajir'],
  Wajir: ['Garissa', 'Isiolo', 'Marsabit', 'Mandera'],
  Mandera: ['Wajir'],
  Marsabit: ['Wajir', 'Isiolo', 'Samburu', 'Turkana'],
  Isiolo: ['Garissa', 'Wajir', 'Marsabit', 'Samburu', 'Laikipia', 'Meru', 'Tharaka Nithi', 'Kitui'],
  Meru: ['Isiolo', 'Tharaka Nithi', 'Laikipia', 'Nyeri'],
  'Tharaka Nithi': ['Meru', 'Isiolo', 'Kitui', 'Embu'],
  Embu: ['Tharaka Nithi', 'Kitui', 'Machakos', "Murang'a", 'Kirinyaga'],
  Kitui: ['Tana River', 'Garissa', 'Isiolo', 'Tharaka Nithi', 'Embu', 'Machakos', 'Makueni', 'Taita Taveta'],
  Machakos: ['Nairobi', 'Kiambu', "Murang'a", 'Embu', 'Kitui', 'Makueni', 'Kajiado'],
  Makueni: ['Machakos', 'Kitui', 'Taita Taveta', 'Kajiado'],
  Nyandarua: ['Laikipia', 'Nyeri', "Murang'a", 'Kiambu', 'Nakuru'],
  Nyeri: ['Laikipia', 'Meru', 'Kirinyaga', "Murang'a", 'Nyandarua'],
  Kirinyaga: ['Nyeri', 'Embu', "Murang'a"],
  "Murang'a": ['Nyeri', 'Kirinyaga', 'Embu', 'Machakos', 'Kiambu', 'Nyandarua'],
  Kiambu: ['Nairobi', 'Machakos', "Murang'a", 'Nyandarua', 'Nakuru', 'Kajiado'],
  Turkana: ['Marsabit', 'Samburu', 'Baringo', 'West Pokot'],
  'West Pokot': ['Turkana', 'Baringo', 'Elgeyo Marakwet', 'Trans Nzoia'],
  Samburu: ['Marsabit', 'Isiolo', 'Laikipia', 'Baringo', 'Turkana'],
  'Trans Nzoia': ['West Pokot', 'Elgeyo Marakwet', 'Uasin Gishu', 'Kakamega', 'Bungoma'],
  'Uasin Gishu': ['Trans Nzoia', 'Elgeyo Marakwet', 'Baringo', 'Kericho', 'Nandi', 'Kakamega'],
  'Elgeyo Marakwet': ['West Pokot', 'Baringo', 'Uasin Gishu', 'Trans Nzoia'],
  Nandi: ['Uasin Gishu', 'Kakamega', 'Vihiga', 'Kisumu', 'Kericho'],
  Baringo: ['Turkana', 'Samburu', 'Laikipia', 'Nakuru', 'Kericho', 'Uasin Gishu', 'Elgeyo Marakwet', 'West Pokot'],
  Laikipia: ['Samburu', 'Isiolo', 'Meru', 'Nyeri', 'Nyandarua', 'Nakuru', 'Baringo'],
  Nakuru: ['Baringo', 'Laikipia', 'Nyandarua', 'Kiambu', 'Kajiado', 'Narok', 'Bomet', 'Kericho'],
  Narok: ['Nakuru', 'Kajiado', 'Bomet', 'Nyamira', 'Kisii', 'Migori'],
  Kajiado: ['Nairobi', 'Kiambu', 'Machakos', 'Makueni', 'Taita Taveta', 'Narok', 'Nakuru'],
  Kericho: ['Uasin Gishu', 'Baringo', 'Nakuru', 'Bomet', 'Nyamira', 'Kisumu', 'Nandi'],
  Bomet: ['Kericho', 'Nakuru', 'Narok', 'Nyamira'],
  Kakamega: ['Trans Nzoia', 'Uasin Gishu', 'Nandi', 'Vihiga', 'Siaya', 'Bungoma'],
  Vihiga: ['Kakamega', 'Nandi', 'Kisumu', 'Siaya'],
  Bungoma: ['Trans Nzoia', 'Kakamega', 'Busia'],
  Busia: ['Bungoma', 'Kakamega', 'Siaya'],
  Siaya: ['Busia', 'Kakamega', 'Vihiga', 'Kisumu', 'Homa Bay'],
  Kisumu: ['Siaya', 'Vihiga', 'Nandi', 'Kericho', 'Homa Bay'],
  'Homa Bay': ['Kisumu', 'Siaya', 'Kericho', 'Kisii', 'Nyamira', 'Migori'],
  Migori: ['Homa Bay', 'Kisii', 'Narok'],
  Kisii: ['Nyamira', 'Homa Bay', 'Migori', 'Narok'],
  Nyamira: ['Kericho', 'Bomet', 'Kisii', 'Homa Bay'],
  Nairobi: ['Kiambu', 'Machakos', 'Kajiado'],
};

export function getNeighbouringCounties(countyName?: string | null): string[] {
  if (!countyName) return [];
  const norm = countyName.trim().toLowerCase();
  const key = Object.keys(KENYA_NEIGHBOURING_COUNTIES).find(
    (k) => k.toLowerCase() === norm
  );
  return key ? KENYA_NEIGHBOURING_COUNTIES[key] : [];
}

export function getProximityTier(
  userCounty?: string | null,
  targetCounty?: string | null
): 'home' | 'neighbour' | 'other' {
  if (!userCounty || !targetCounty) return 'other';
  const u = userCounty.trim().toLowerCase();
  const t = targetCounty.trim().toLowerCase();
  if (u === t) return 'home';
  const neighbours = getNeighbouringCounties(userCounty).map((n) => n.toLowerCase());
  if (neighbours.includes(t)) return 'neighbour';
  return 'other';
}
