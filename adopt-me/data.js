const DEFAULT_SETTINGS = {
  tiktokUsername: 'olvrrleb',
  shopName: "olvr's marketplace",
  adminPassword: 'admin123',
  adminPasswordHashed: false,
  currency: '$'
};

async function hashPassword(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const DEFAULT_PETS = [
  { id: 1,  name: 'Shadow Dragon',       image: '', rarity: 'legendary',   variant: 'FR',     price: 45,  quantity: 1, visible: true },
  { id: 2,  name: 'Frost Dragon',        image: '', rarity: 'legendary',   variant: 'FR',     price: 35,  quantity: 2, visible: true },
  { id: 3,  name: 'Bat Dragon',          image: '', rarity: 'legendary',   variant: 'NFR',    price: 30,  quantity: 1, visible: true },
  { id: 4,  name: 'Evil Unicorn',        image: '', rarity: 'legendary',   variant: 'FR',     price: 12,  quantity: 3, visible: true },
  { id: 5,  name: 'Neon Shadow Dragon',  image: '', rarity: 'legendary',   variant: 'NFR',    price: 165, quantity: 1, visible: true },
  { id: 6,  name: 'Crow',               image: '', rarity: 'ultra-rare',  variant: 'NFR',    price: 8,   quantity: 2, visible: true },
  { id: 7,  name: 'Owl',                image: '', rarity: 'legendary',   variant: 'NFR',    price: 18,  quantity: 1, visible: true },
  { id: 8,  name: 'Dragon',             image: '', rarity: 'legendary',   variant: 'NFR',    price: 22,  quantity: 1, visible: true },
  { id: 9,  name: 'Unicorn',            image: '', rarity: 'legendary',   variant: 'FR',     price: 8,   quantity: 4, visible: true },
  { id: 10, name: 'Dodo',              image: '', rarity: 'legendary',   variant: 'FR',     price: 20,  quantity: 2, visible: true },
];

function getSettings() {
  try {
    const s = localStorage.getItem('adoptme_settings');
    return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

function saveSettings(s) {
  localStorage.setItem('adoptme_settings', JSON.stringify(s));
}

function getPets() {
  try {
    const s = localStorage.getItem('adoptme_pets');
    if (!s) { localStorage.setItem('adoptme_pets', JSON.stringify(DEFAULT_PETS)); return [...DEFAULT_PETS]; }
    return JSON.parse(s);
  } catch { return [...DEFAULT_PETS]; }
}

function savePets(pets) {
  localStorage.setItem('adoptme_pets', JSON.stringify(pets));
}

function addPet(pet) {
  const pets = getPets();
  const n = { ...pet, id: Date.now(), visible: true, image: pet.image || '' };
  pets.push(n);
  savePets(pets);
  return n;
}

function updatePet(id, updates) {
  const pets = getPets();
  const i = pets.findIndex(p => p.id === id);
  if (i !== -1) { pets[i] = { ...pets[i], ...updates }; savePets(pets); return pets[i]; }
  return null;
}

function deletePet(id) { savePets(getPets().filter(p => p.id !== id)); }
