// config/gameConfigs.ts

export interface GameConfig {
    id: string
    name: string
    symbol: string
    defaultC: string
    defaultL: string
    defaultBl: string
    minBet: number
    maxBet: number
    lines: number[]
    sansArttir: boolean
    description?: string
    availableC: string[]  // Mevcut coin değerleri listesi
    possibleRandomSymbolMultipliers?: {
        enabled: boolean
        symbol: number
        multipliers: number[]
    }
    freeSpinBuy?: {
        available: boolean
        parameter: string
        value: string
        multiplier: number
        description: string
    }
    max_win?: string
    rtp?: string
    rtp_purchase?: string
    max_win_ihtimali?: string
}

export const gameConfigs: GameConfig[] = [
    {
        id: 'gates_of_olympus',
        name: 'Gates of Olympus',
        symbol: 'vs20olympgate',
        defaultC: '0.50',
        defaultL: '20',
        defaultBl: '0',
        minBet: 0.2,
        maxBet: 100,
        lines: [20],
        sansArttir: true,
        max_win: "5000",
        rtp: "94.50",
        rtp_purchase: "94.50",
        max_win_ihtimali: "697350",
        description: 'Zeus oyunu',
        availableC: [
            '0.05', '0.10', '0.15', '0.20', '0.25',
            '0.50', '1.00', '1.50', '2.00', '2.50',
            '3.75', '5.00', '10.00', '15.00', '20.00', '25.00'
        ],
        possibleRandomSymbolMultipliers: {
            enabled: true,
            symbol: 12,
            multipliers: [
                2, 3, 4, 5, 6,
                8, 10, 12, 15, 20,
                25, 50, 100, 250, 500
            ]
        },
        freeSpinBuy: {
            available: true,
            parameter: 'pur',
            value: '0',
            multiplier: 100,
            description: 'Free spin Aktif (100x bahis)'
        }
    },
    {
        id: 'gates_of_olympus_1000',
        name: 'Gates of Olympus 1000x',
        symbol: 'vs20olympx',
        defaultC: '0.50',
        defaultL: '20',
        defaultBl: '0',
        minBet: 0.2,
        maxBet: 100,
        lines: [20],
        sansArttir: true,
        max_win: "15000",
        rtp: "94.00",
        rtp_purchase: "94.03",
        max_win_ihtimali: "2744739",
        description: 'Zeus oyunu 1000x',
        availableC: [
            '0.05', '0.10', '0.15', '0.20', '0.25',
            '0.50', '1.00', '1.50', '2.00', '2.50',
            '3.75', '5.00', '10.00', '15.00', '20.00', '25.00'
        ],
        possibleRandomSymbolMultipliers: {
            enabled: true,
            symbol: 12,
            multipliers: [
                2, 3, 4, 5, 6,
                8, 10, 12, 15, 20,
                25, 50, 100, 250, 500, 1000
            ]
        },
        freeSpinBuy: {
            available: true,
            parameter: 'pur',
            value: '0',
            multiplier: 100,
            description: 'Free spin Aktif (100x bahis)'
        }
    },
    {
        id: 'big_bass_bonanza_dice',
        name: 'Big Bass Dice',
        symbol: 'vs10bbdice',
        defaultC: '0.50',
        defaultL: '10',
        defaultBl: '0',
        minBet: 0.2,
        maxBet: 100,
        lines: [10],
        sansArttir: false,
        description: 'Balıkçı Hasanın Dicesi',
        availableC: [
            '0.05', '0.10', '0.15', '0.20', '0.25',
            '0.50', '1.00', '1.50', '2.00', '2.50',
            '3.75', '5.00', '10.00', '15.00', '20.00',
            '25.00', '30.00', '35.00', '40.00', '50.00',
            '75.00', '100.00', '125.00'
        ],
        possibleRandomSymbolMultipliers: {
            enabled: false,
            symbol: 12,
            multipliers: [
                2, 3, 4, 5, 6,
                8, 10, 12, 15, 20,
                25, 50, 100, 250, 500
            ]
        },
        freeSpinBuy: {
            available: false,
            parameter: 'pur',
            value: '0',
            multiplier: 100,
            description: 'Free spin satın al (100x bahis)'
        }
    },
    {
        id: 'bigger_bass_bonanza',
        name: 'Bigger Bass Bonanza',
        symbol: 'vs12bbb',
        defaultC: '1.00',
        defaultL: '12',
        defaultBl: '0',
        minBet: 0.1,
        maxBet: 200,
        lines: [12],
        sansArttir: false,
        description: 'Balıkçı Hasan',
        max_win: "4000",
        rtp: "96.71",
        max_win_ihtimali: "981884",
        availableC: [
            '0.10', '0.20', '0.30', '0.40', '0.50',
            '1.00', '2.00', '3.00', '4.00', '5.00',
            '7.50', '10.00', '20.00', '30.00', '40.00',
            '50.00', '60.00', '70.00', '80.00', '90.00',
            '100.00', '110.00', '120.00', '130.00', '150.00',
            '200.00'
        ],

        possibleRandomSymbolMultipliers: {
            enabled: false,
            symbol: 12,
            multipliers: [
                0
            ]
        },
        freeSpinBuy: {
            available: false,
            parameter: 'pur',
            value: '0',
            multiplier: 100,
            description: 'Free spin satın al (100x bahis)'
        }
    },
    {
        id: 'sweet_bonanza',
        name: 'Sweet Bonanza',
        symbol: 'vs20fruitsw',
        defaultC: '0.50',
        defaultL: '20',
        defaultBl: '0',
        minBet: 0.2,
        maxBet: 100,
        lines: [20],
        sansArttir: false,
        description: 'Şeker ve meyve oyunu',
        availableC: [
            '0.05', '0.10', '0.15', '0.20', '0.25',
            '0.50', '1.00', '1.50', '2.00', '2.50',
            '3.75', '5.00', '10.00', '15.00', '20.00', '25.00'
        ],
        possibleRandomSymbolMultipliers: {
            enabled: true,
            symbol: 12,
            multipliers: [
                2, 3, 4, 5, 6,
                8, 10, 12, 15, 20,
                25, 50, 100
            ]
        },
        freeSpinBuy: {
            available: true,
            parameter: 'pur',
            value: '0',
            multiplier: 100,
            description: 'Free spin satın al (100x bahis)'
        }
    }
]

/**
 * Oyun ID'sine göre oyun konfigürasyonunu getirir
 * @param gameId - Aranacak oyun ID'si
 * @returns GameConfig objesi veya undefined
 */
export const getGameConfig = (gameId: string): GameConfig | undefined => {
    return gameConfigs.find(config => config.id === gameId)
}

/**
 * Oyun sembolüne göre oyun konfigürasyonunu getirir
 * @param symbol - Aranacak oyun sembolü
 * @returns GameConfig objesi veya undefined
 */
export const getGameConfigBySymbol = (symbol: string): GameConfig | undefined => {
    return gameConfigs.find(config => config.symbol === symbol)
}

/**
 * Tüm oyun isimlerini array olarak döner
 * @returns Oyun isimleri array'i
 */
export const getAllGameNames = (): string[] => {
    return gameConfigs.map(config => config.name)
}

/**
 * Tüm oyun ID'lerini array olarak döner
 * @returns Oyun ID'leri array'i
 */
export const getAllGameIds = (): string[] => {
    return gameConfigs.map(config => config.id)
}