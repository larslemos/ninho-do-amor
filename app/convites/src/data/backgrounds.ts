export interface BackgroundOption {
  id: string;
  name: string;
  category: 'floral' | 'hearts' | 'cultural' | 'abstract' | 'nature';
  url: string;
  thumbnail: string;
  description: string;
}

export const backgroundOptions: BackgroundOption[] = [
  // Floral Patterns
  {
    id: 'floral-1',
    name: 'Rosa Romântica',
    category: 'floral',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=150&fit=crop',
    description: 'Padrão floral delicado com rosas românticas'
  },
  {
    id: 'floral-2',
    name: 'Lavanda Suave',
    category: 'floral',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=150&fit=crop',
    description: 'Lavandas em tons suaves e elegantes'
  },
  {
    id: 'floral-3',
    name: 'Girassóis Dourados',
    category: 'floral',
    url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=200&h=150&fit=crop',
    description: 'Girassóis vibrantes em campo dourado'
  },
  
  // Hearts
  {
    id: 'hearts-1',
    name: 'Corações Elegantes',
    category: 'hearts',
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxnIGZpbGw9IiNGRkM0Q0QiIGZpbGwtb3BhY2l0eT0iMC4xIj4KPHBhdGggZD0iTTQwMCAxMDBjLTU1LjIgMC0xMDAgNDQuOC0xMDAgMTAwczQ0LjggMTAwIDEwMCAxMDBzMTAwLTQ0LjggMTAwLTEwMFM0NTUuMiAxMDAgNDAwIDEwMHoiLz4KPHBhdGggZD0iTTMwMCAyMDBjLTI3LjYgMC01MCAyMi40LTUwIDUwczIyLjQgNTAgNTAgNTBzNTAtMjIuNCA1MC01MFMzMjcuNiAyMDAgMzAwIDIwMHoiLz4KPHBhdGggZD0iTTUwMCAyMDBjLTI3LjYgMC01MCAyMi40LTUwIDUwczIyLjQgNTAgNTAgNTBzNTAtMjIuNCA1MC01MFM1MjcuNiAyMDAgNTAwIDIwMHoiLz4KPC9nPgo8L3N2Zz4K',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRkZGRkZGIi8+CjxnIGZpbGw9IiNGRkM0Q0QiIGZpbGwtb3BhY2l0eT0iMC4xIj4KPHBhdGggZD0iTTEwMCAyNWMtMTMuOCAwLTI1IDExLjItMjUgMjVzMTEuMiAyNSAyNSAyNXMyNS0xMS4yIDI1LTI1UzExMy44IDI1IDEwMCAyNXoiLz4KPHBhdGggZD0iTTc1IDUwYy02LjkgMC0xMi41IDUuNi0xMi41IDEyLjVzNS42IDEyLjUgMTIuNSAxMi41czEyLjUtNS42IDEyLjUtMTIuNVM4MS45IDUwIDc1IDUweiIvPgo8cGF0aCBkPSJNMTI1IDUwYy02LjkgMC0xMi41IDUuNi0xMi41IDEyLjVzNS42IDEyLjUgMTIuNSAxMi41czEyLjUtNS42IDEyLjUtMTIuNVMxMzEuOSA1MCAxMjUgNTB6Ii8+CjwvZz4KPC9zdmc+Cg==',
    description: 'Padrão elegante de corações em tons suaves'
  },
  {
    id: 'hearts-2',
    name: 'Corações Românticos',
    category: 'hearts',
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxnIGZpbGw9IiNGRjY5QjMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+CjxwYXRoIGQ9Ik0yMDAgMTUwYy0yNy42IDAtNTAgMjIuNC01MCA1MHM0NC44IDEwMCAxMDAgMTAwczEwMC00NC44IDEwMC0xMDBzLTIyLjQtNTAtNTAtNTB6Ii8+CjxwYXRoIGQ9Ik02MDAgMTUwYy0yNy42IDAtNTAgMjIuNC01MCA1MHM0NC44IDEwMCAxMDAgMTAwczEwMC00NC44IDEwMC0xMDBzLTIyLjQtNTAtNTAtNTB6Ii8+CjxwYXRoIGQ9Ik00MDAgMzAwYy01NS4yIDAtMTAwIDQ0LjgtMTAwIDEwMHM0NC44IDEwMCAxMDAgMTAwczEwMC00NC44IDEwMC0xMDBzLTQ0LjgtMTAwLTEwMC0xMDB6Ii8+CjwvZz4KPC9zdmc+Cg==',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRkZGRkZGIi8+CjxnIGZpbGw9IiNGRjY5QjMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+CjxwYXRoIGQ9Ik01MCAzNy41Yy02LjkgMC0xMi41IDUuNi0xMi41IDEyLjVzMTEuMiAyNSAyNSAyNXMyNS0xMS4yIDI1LTI1cy01LjYtMTIuNS0xMi41LTEyLjV6Ii8+CjxwYXRoIGQ9Ik0xNTAgMzcuNWMtNi45IDAtMTIuNSA1LjYtMTIuNSAxMi41czExLjIgMjUgMjUgMjVzMjUtMTEuMiAyNS0yNXMtNS42LTEyLjUtMTIuNS0xMi41eiIvPgo8cGF0aCBkPSJNMTAwIDc1Yy0xMy44IDAtMjUgMTEuMi0yNSAyNXMxMS4yIDI1IDI1IDI1czI1LTExLjIgMjUtMjVzLTExLjItMjUtMjUtMjV6Ii8+CjwvZz4KPC9zdmc+Cg==',
    description: 'Corações românticos em padrão delicado'
  },
  
  // Cultural/Mozambican
  {
    id: 'cultural-1',
    name: 'Praia de Moçambique',
    category: 'cultural',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=150&fit=crop',
    description: 'Praia paradisíaca com areia branca e mar azul'
  },
  {
    id: 'cultural-2',
    name: 'Padrão Africano',
    category: 'cultural',
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxnIGZpbGw9IiNGRkM0Q0QiIGZpbGwtb3BhY2l0eT0iMC4xIj4KPHBhdGggZD0iTTAgMGg4MDB2NjAwSDB6Ii8+CjxnIGZpbGw9IiNGRkM0Q0QiIGZpbGwtb3BhY2l0eT0iMC4wNSI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz4KPHBhdGggZD0iTTgwIDBoNDB2NDBIMHoiLz4KPHBhdGggZD0iTTE2MCAwaHY0MEgxNjB6Ii8+CjxwYXRoIGQ9Ik0yNDAgaDB2NDBIMjQweiIvPgo8cGF0aCBkPSJNMzIwIGgwdjQwSDMyMHoiLz4KPHBhdGggZD0iTTQwMCBoMHY0MEg0MDB6Ii8+CjxwYXRoIGQ9Ik00ODAgaDB2NDBINDgweiIvPgo8cGF0aCBkPSJNNTYwIGgwdjQwSDU2MHoiLz4KPHBhdGggZD0iTTY0MCBoMHY0MEg2NDB6Ii8+CjxwYXRoIGQ9Ik03MjAgaDB2NDBINzIweiIvPgo8cGF0aCBkPSJNNzYwIGgwdjQwSDc2MHoiLz4KPC9nPgo8ZyBmaWxsPSIjRkZDNERDQiIGZpbGwtb3BhY2l0eT0iMC4wNSI+CjxwYXRoIGQ9Ik00MCA0MGg0MHY0MEg0eiIvPgo8cGF0aCBkPSJNMTIwIDQwaDQwdjQwSDEyMHoiLz4KPHBhdGggZD0iTTIwMCA0MGg0MHY0MEgyMDB6Ii8+CjxwYXRoIGQ9Ik0yODAgNDBoNDB2NDBIMjgweiIvPgo8cGF0aCBkPSJNMzYwIDQwaDQwdjQwSDM2MHoiLz4KPHBhdGggZD0iTTQ0MCA0MGg0MHY0MEg0NDB6Ii8+CjxwYXRoIGQ9Ik01MjAgNDBoNDB2NDBINTIweiIvPgo8cGF0aCBkPSJNNjAwIDQwaDQwdjQwSDYwMHoiLz4KPHBhdGggZD0iTTY4MCA0MGg0MHY0MEg2ODB6Ii8+CjxwYXRoIGQ9Ik03NjAgNDBoNDB2NDBINzYweiIvPgo8L2c+CjwvZz4KPC9zdmc+Cg==',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRkZGRkZGIi8+CjxnIGZpbGw9IiNGRkM0Q0QiIGZpbGwtb3BhY2l0eT0iMC4xIj4KPHBhdGggZD0iTTAgMGgyMDB2MTUwSDB6Ii8+CjxnIGZpbGw9IiNGRkM0Q0QiIGZpbGwtb3BhY2l0eT0iMC4wNSI+CjxwYXRoIGQ9Ik0wIDBoMTB2MTBIMHoiLz4KPHBhdGggZD0iTTIwIDBoMTB2MTBIMjB6Ii8+CjxwYXRoIGQ9Ik00MCAwaDF0MTBIMDQweiIvPgo8cGF0aCBkPSJNNjAgMGgxdjEwSDYweiIvPgo8cGF0aCBkPSJNOTMCAwaDF0MTBIOTh6Ii8+CjxwYXRoIGQ9Ik0xMjAgMGgxdjEwSDEyMHoiLz4KPHBhdGggZD0iTTE0MCAwaDF0MTBIMTQweiIvPgo8cGF0aCBkPSJNMTYwIDBoMHR4MTBIMTYweiIvPgo8cGF0aCBkPSJNMTgwIDBoMHR4MTBIMTgweiIvPgo8L2c+CjxnIGZpbGw9IiNGRkM0Q0QiIGZpbGwtb3BhY2l0eT0iMC4wNSI+CjxwYXRoIGQ9Ik0xMCAxMGgxMHYxMEgxMHoiLz4KPHBhdGggZD0iTTMwIDEwaDEwdjEwSDMweiIvPgo8cGF0aCBkPSJNNTAgMTBoMTB2MTBINTB6Ii8+CjxwYXRoIGQ9Ik03MCAxMGgxMHYxMEg3MHoiLz4KPHBhdGggZD0iTTkwIDEwaDEwdjEwSDkweiIvPgo8cGF0aCBkPSJNMTEwIDEwaDEwdjEwSDExMHoiLz4KPHBhdGggZD0iTTEzMCAxMGgxMHYxMEgxMzB6Ii8+CjxwYXRoIGQ9Ik0xNTAgMTBoMTB2MTBIMTUweiIvPgo8cGF0aCBkPSJNMTcwIDEwaDEwdjEwSDE3MHoiLz4KPHBhdGggZD0iTTE5MCAxMGgxMHYxMEgxOTB6Ii8+CjwvZz4KPC9nPgo8L3N2Zz4K',
    description: 'Padrão tradicional africano em tons suaves'
  },
  
  // Abstract
  {
    id: 'abstract-1',
    name: 'Gradiente Romântico',
    category: 'abstract',
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGRkZGO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkM0Q0Q7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZ3JhZCkiLz4KPC9zdmc+Cg==',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGRkZGO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkM0Q0Q7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9InVybCgjZ3JhZCkiLz4KPC9zdmc+Cg==',
    description: 'Gradiente suave do branco ao rosa'
  },
  {
    id: 'abstract-2',
    name: 'Ondas Elegantes',
    category: 'abstract',
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxnIGZpbGw9IiNGRkM0Q0QiIGZpbGwtb3BhY2l0eT0iMC4wNSI+CjxwYXRoIGQ9Ik0wIDQwMGMwLTIyMC45IDE3OS4xLTQwMCA0MDAtNDAwczQwMCAxNzkuMSA0MDAgNDAwSDB6Ii8+CjxwYXRoIGQ9Ik0wIDMwMGMwLTE2NS43IDEzNC4zLTMwMCAzMDAtMzAwczMwMCAxMzQuMyAzMDAgMzAwSDB6Ii8+CjxwYXRoIGQ9Ik0wIDIwMGMwLTExMC40IDg5LjYtMjAwIDIwMC0yMDBzMjAwIDg5LjYgMjAwIDIwMEgweiIvPgo8L2c+Cjwvc3ZnPgo=',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRkZGRkZGIi8+CjxnIGZpbGw9IiNGRkM0Q0QiIGZpbGwtb3BhY2l0eT0iMC4wNSI+CjxwYXRoIGQ9Ik0wIDEwMGMwLTU1LjIgNDQuOC0xMDAgMTAwLTEwMHMxMDAgNDQuOCAxMDAgMTAwSDB6Ii8+CjxwYXRoIGQ9Ik0wIDc1YzAtNDEuMyAzMy43LTc1IDc1LTc1czc1IDMzLjcgNzUgNzVIMHoiLz4KPHBhdGggZD0iTTAgNTBjMC0yNy42IDIyLjQtNTAgNTAtNTBzNTAgMjIuNCA1MCA1MEgweiIvPgo8L2c+Cjwvc3ZnPgo=',
    description: 'Ondas elegantes em padrão circular'
  },
  
  // Nature
  {
    id: 'nature-1',
    name: 'Jardim Botânico',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop',
    description: 'Jardim exuberante com vegetação tropical'
  },
  {
    id: 'nature-2',
    name: 'Pôr do Sol',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
    description: 'Pôr do sol romântico sobre o oceano'
  }
];

export const getBackgroundsByCategory = (category?: string): BackgroundOption[] => {
  if (!category) return backgroundOptions;
  return backgroundOptions.filter(bg => bg.category === category);
};

export const getBackgroundById = (id: string): BackgroundOption | undefined => {
  return backgroundOptions.find(bg => bg.id === id);
};
