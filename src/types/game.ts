// types/game.ts - Server-Driven Types

export interface GameState {
  inFreeSpin: boolean
  freeSpinCounter: number
  totalSpinCounter: number
  pendingCollect: boolean
  // İstatistikler
  spinsSinceLastFS: number
  maxSpinsWithoutFS: number
  freeSpinIntervals: number[]
  currentDryStreak: number
  bestFSStreak: { spins: number, fsCount: number }
}

export interface SpinResponse {
  hasFreeSpin: boolean        // Free spin aktif mi?
  hasFsTotal: boolean         // Free spin bitti mi?
  hasTmbRes: boolean          // Tumble res var mı?
  nextAction?: string | null  // 🆕 Server'ın önerdiği action (na parametresi)
  freeSpinData?: {           // 🆕 Detaylı free spin bilgileri
    currentNumber: number | null    // fs
    totalNumber: number | null      // fs_total
    currentMultiplier: number | null // fsmul
  }
  hasError?: boolean         // 🆕 Response'ta hata var mı?
  rawResponse: string        // Ham response metni
}

export interface FormData {
  symbol: string
  c: string
  l: string
  bl: string
  index: string
  counter: string
  repeat: string
  mgckey: string
}

// 🆕 Server Action Mapping
export type ServerAction = 's' | 'c' | 'g' | 'b' | null
export type ClientAction = 'doSpin' | 'doCollect'

// 🆕 Game Protocol Dictionary (Pragmatic Play)
export const GameProtocol = {
  // Actions
  Actions: {
    doSpin: 'doSpin',
    doCollect: 'doCollect',
    doBonus: 'doBonus',
    doGamble: 'doGamble'
  },
  // Next Actions (server response)
  NextActions: {
    spin: 's',      // na=s
    collect: 'c',   // na=c  
    gamble: 'g',    // na=g
    bonus: 'b'      // na=b
  },
  // Response Parameters
  Parameters: {
    freeSpinCurrent: 'fs',          // freeSpinCurrentNumber
    freeSpinTotal: 'fs_total',      // freeSpinTotalNumber
    freeSpinMultiplier: 'fsmul',    // freeSpinCurrentMultiplier
    nextAction: 'na',               // nextAction
    spinCycleWin: 'tw',            // totalWin
    winAmountShort: 'w',           // winAmount
    tumblingRes: 'tmb_res',        // tumblingResult
    balance: 'balance',            // playerBalance
    time: 'stime',                 // serverTime
    index: 'index',                // requestIndex
    counter: 'counter'             // requestCounter
  }
} as const