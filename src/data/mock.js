export const sportsData = [
    { id: 'football', name: 'Футбол', icon: '⚽️' },
    { id: 'tennis', name: 'Теннис', icon: '🎾' },
    { id: 'volleyball', name: 'Волейбол', icon: '🏐' },
    { id: 'basketball', name: 'Баскетбол', icon: '🏀' },
    { id: 'hockey', name: 'Хоккей', icon: '🏒' },
    { id: 'cybersport', name: 'Киберспорт', icon: '🎮' },
    { id: 'f1', name: 'Формула-1', icon: '🏎️' },
];

export const tournamentsData = {
    football: [
        { id: '1', name: 'Чемпионат Мира по футболу' }, // API-Sports World Cup ID is 1
        { id: '2', name: 'Лига Чемпионов УЕФА' },       // API-Sports UCL ID is 2
        { id: '4', name: 'Чемпионат Европы' },          // API-Sports Euro ID is 4
        { id: '39', name: 'Английская Премьер-лига' }   // API-Sports Premier League ID is 39
    ],
    tennis: [
        { id: 'grand_slam', name: 'Турниры Большого Шлема' },
        { id: 'atp_1000', name: 'ATP Masters 1000' },
        { id: 'atp_500', name: 'ATP 500' },
        { id: 'atp_250', name: 'ATP 250' }
    ],
    volleyball: [
        { id: 'world_cup_vb', name: 'Чемпионат Мира по волейболу' },
        { id: 'nations_league', name: 'Лига Наций' },
        { id: 'champions_league_vb', name: 'Лига Чемпионов (Волейбол)' },
        { id: 'beach_pro_tour', name: 'Beach Pro Tour (Пляжный)' }
    ],
    basketball: [
        { id: 'nba', name: 'NBA' },
        { id: 'euroleague', name: 'Евролига' },
        { id: 'world_cup_bb', name: 'Чемпионат Мира по баскетболу' }
    ],
    hockey: [
        { id: 'nhl', name: 'NHL' },
        { id: 'khl', name: 'КХЛ' },
        { id: 'world_cup_hk', name: 'Чемпионат Мира по хоккею' }
    ],
    cybersport: [
        { id: 'ti', name: 'The International (Dota 2)' },
        { id: 'major_csgo', name: 'Major Championships (CS2)' },
        { id: 'worlds_lol', name: 'World Championship (LoL)' }
    ],
    f1: [
        { id: '1', name: 'Гран-при Формулы 1' } // Formula 1 API uses race series ID (usually 1 for main Formula 1)
    ]
};

export const notificationPreferences = [
    { id: 'start', label: 'В момент старта', description: 'Уведомление придет ровно в начале матча' },
    { id: '1h', label: 'За 1 час', description: 'Идеально, чтобы успеть подготовиться' },
    { id: '1d', label: 'За 1 день', description: 'Напомним накануне события' },
    { id: '1w', label: 'За 1 неделю', description: 'Чтобы точно ничего не планировать на этот день' }
];
