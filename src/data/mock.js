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
        { id: 'world_cup_fb', name: 'Чемпионат Мира по футболу' },
        { id: 'champions_league', name: 'Лига Чемпионов УЕФА' },
        { id: 'euro', name: 'Чемпионат Европы' },
        { id: 'epl', name: 'Английская Премьер-лига' }
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
        { id: 'f1_gran_prix', name: 'Гран-при Формулы 1' },
        { id: 'f1_sprint', name: 'Спринтерские гонки (F1 Sprint)' }
    ]
};

export const notificationPreferences = [
    { id: 'start', label: 'В момент старта', description: 'Уведомление придет ровно в начале матча' },
    { id: '1h', label: 'За 1 час', description: 'Идеально, чтобы успеть подготовиться' },
    { id: '1d', label: 'За 1 день', description: 'Напомним накануне события' },
    { id: '1w', label: 'За 1 неделю', description: 'Чтобы точно ничего не планировать на этот день' }
];
