export const mozambiqueProvinces = [
  {
    nome: "Maputo Cidade",
    cidades: ["Maputo"]
  },
  {
    nome: "Maputo Província",
    cidades: ["Matola", "Boane", "Namaacha", "Moamba", "Manhiça", "Marracuene"]
  },
  {
    nome: "Gaza",
    cidades: ["Xai-Xai", "Chókwè", "Chibuto", "Bilene", "Manjacaze", "Guijá", "Mabalane", "Massingir", "Chicualacuala", "Chigubo", "Massangena"]
  },
  {
    nome: "Inhambane",
    cidades: ["Inhambane", "Maxixe", "Vilanculos", "Massinga", "Homoíne", "Jangamo", "Inharrime", "Zavala", "Govuro", "Mabote", "Funhalouro", "Panda"]
  },
  {
    nome: "Sofala",
    cidades: ["Beira", "Dondo", "Gorongosa", "Nhamatanda", "Búzi", "Chibabava", "Machanga", "Muanza", "Chemba", "Maringué", "Caia", "Cheringoma", "Marromeu"]
  },
  {
    nome: "Manica",
    cidades: ["Chimoio", "Catandica", "Gondola", "Manica", "Báruè", "Macossa", "Tambara", "Guro", "Machaze", "Mossurize", "Sussundenga"]
  },
  {
    nome: "Tete",
    cidades: ["Tete", "Moatize", "Cahora-Bassa", "Angónia", "Tsangano", "Macanga", "Changara", "Chiuta", "Marávia", "Zumbo", "Mutarara", "Magoe", "Dôa", "Chifunde", "Marara"]
  },
  {
    nome: "Zambézia",
    cidades: ["Quelimane", "Mocuba", "Gurué", "Milange", "Alto Molócuè", "Ile", "Namarrói", "Gilé", "Pebane", "Maganja da Costa", "Inhassunge", "Nicoadala", "Lugela", "Mopeia", "Chinde", "Morrumbala", "Luabo"]
  },
  {
    nome: "Nampula",
    cidades: ["Nampula", "Nacala", "Ilha de Moçambique", "Angoche", "Malema", "Ribáuè", "Lalaua", "Meconta", "Eráti", "Murrupula", "Nampula-Rapale", "Mecubúri", "Muecate", "Ribaué", "Mongincual", "Mossuril", "Memba", "Nacarôa", "Larde", "Mogincual", "Moma"]
  },
  {
    nome: "Cabo Delgado",
    cidades: ["Pemba", "Montepuez", "Chiúre", "Ancuabe", "Balama", "Namuno", "Metuge", "Meluco", "Macomia", "Mocímboa da Praia", "Mueda", "Muidumbe", "Nangade", "Palma", "Quissanga", "Ibo"]
  },
  {
    nome: "Niassa",
    cidades: ["Lichinga", "Cuamba", "Mandimba", "Sanga", "Lago", "Chimbonila", "Maúa", "Mavago", "Muembe", "N'gauma", "Mecanhelas", "Metarica", "Majune", "Nipepe"]
  }
];

export const getAllCities = () => {
  return mozambiqueProvinces.flatMap(province => 
    province.cidades.map(cidade => ({ 
      cidade, 
      provincia: province.nome 
    }))
  );
};