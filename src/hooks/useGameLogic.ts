// hooks/useGameLogic.ts
import { useState } from 'react'

export interface GameState {
  inFreeSpin: boolean
  freeSpinCounter: number
  totalSpinCounter: number
  pendingCollect: boolean
  // Yeni istatistikler
  spinsSinceLastFS: number // Son free spin'den bu yana geçen spin sayısı
  maxSpinsWithoutFS: number // Free spin girmeden yapılan en fazla spin
  freeSpinIntervals: number[] // Her free spin arasındaki spin sayıları
  currentDryStreak: number // Şu anki free spin'siz seri
  bestFSStreak: { spins: number, fsCount: number } // En iyi free spin serisi
  freeSpinWins: { interval: number, multiplier: number }[] // 🆕 FS kazançları
  currentFSStartInterval: number // 🆕 FS başladığındaki interval
  currentFSTotalWin: number // 🆕 FS sırasındaki toplam kazanç
}

// 🆕 Interface ismini değiştirdik çakışma olmasın diye
export interface GameFormData {
  symbol: string
  c: string
  l: string
  bl: string
  index: string
  counter: string
  repeat: string
  mgckey: string
}

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    inFreeSpin: false,
    freeSpinCounter: 0,
    totalSpinCounter: 0,
    pendingCollect: false,
    // Yeni istatistikler
    spinsSinceLastFS: 0,
    maxSpinsWithoutFS: 0,
    freeSpinIntervals: [],
    currentDryStreak: 0,
    bestFSStreak: { spins: 0, fsCount: 0 },
    freeSpinWins: [], // 🆕
    currentFSStartInterval: 0, // 🆕
    currentFSTotalWin: 0 // 🆕
  })

  const [nextAction, setNextAction] = useState('doSpin')
  
  // 🆕 TW takip sistemi için state
  const [previousSpinResult, setPreviousSpinResult] = useState<{ tw: number; action: string } | null>(null)

  const resetStats = () => {
    setGameState({
      inFreeSpin: false,
      freeSpinCounter: 0,
      totalSpinCounter: 0,
      pendingCollect: false,
      spinsSinceLastFS: 0,
      maxSpinsWithoutFS: 0,
      freeSpinIntervals: [],
      currentDryStreak: 0,
      bestFSStreak: { spins: 0, fsCount: 0 },
      freeSpinWins: [], // 🆕
      currentFSStartInterval: 0, // 🆕
      currentFSTotalWin: 0 // 🆕
    })
    setNextAction('doSpin')
    setPreviousSpinResult(null) // 🆕 TW takip sıfırla
  }

  /**
   * NextActions mapping - Server'dan gelen na değerlerini action'lara çevirir
   */
  const getActionFromNextAction = (na: string | null): string => {
    const NextActions = {
      "s": "doSpin",           // Spin
      "c": "doCollect",        // Collect
      "g": "doGamble",         // Gamble
      "b": "doBonus",          // Bonus
      "cb": "doCollectBonus",  // CollectBonus
      "fso": "doFSOption",     // FSOption
      "m": "doMystery",        // MysteryScatter
      "fsb": "doFSBonus",      // FSBonus
      "gc": "doGambleCollect", // GambleCollect
      "cj": "doJackpotCollect",// JackpotCollect
      "pj": "doPlayJackpot"    // PlayJackpot
    }
    
    return NextActions[na as keyof typeof NextActions] || "doSpin"
  }

  /**
   * Gerçek spin mi yoksa collect/tumble mi kontrol eder
   */
  const isRealSpin = (parsedResponse: any, currentAction: string) => {
    const isCollectAction = ['doCollect', 'doCollectBonus', 'doGambleCollect', 'doJackpotCollect'].includes(currentAction)
    const isFreeSpinMode = parsedResponse.freeSpinData.currentMultiplier === 1
    const hadPreviousTw = previousSpinResult?.tw && previousSpinResult.tw > 0
    const currentTwPositive = parsedResponse.twValue > 0 // 🆕 MEVCUT spin'in TW değeri
    
    console.log(`🧠 GERÇEKSPİN KONTROLÜ (Hook içinde):`)
    console.log(`🧠 Current Action: ${currentAction}`)
    console.log(`🧠 isCollectAction: ${isCollectAction}`)
    console.log(`🧠 isFreeSpinMode: ${isFreeSpinMode}`)
    console.log(`🧠 hadPreviousTw: ${hadPreviousTw} (önceki tw: ${previousSpinResult?.tw})`)
    console.log(`🧠 currentTwPositive: ${currentTwPositive} (mevcut tw: ${parsedResponse.twValue})`)
    console.log(`🧠 hasFreeSpin: ${parsedResponse.hasFreeSpin}`)
    console.log(`🧠 inFreeSpin: ${gameState.inFreeSpin}`)
    
    // Gerçek spin kriterleri:
    // ✅ Collect action değil
    // ✅ Free spin modunda değil
    // ✅ Free spin durumunda değil
    // ✅ Önceki spinde TW > 0 yoktu (tumble sonu değil)
    // ✅ MEVCUT spinde TW > 0 yok (tumble win değil)
    const isReal = !isCollectAction && 
                  !isFreeSpinMode && 
                  !parsedResponse.hasFreeSpin && 
                  !gameState.inFreeSpin && 
                  !hadPreviousTw &&
                  !currentTwPositive // 🆕 MEVCUT TW kontrolü
    
    console.log(`🧠 SONUÇ: ${isReal ? 'GERÇEKSPİN ✅' : 'GERÇEKSPİN DEĞİL ❌'}`)
    return isReal
  }

  /**
   * Server'dan gelen response'a göre oyun durumunu günceller
   * @param parsedResponse - Parse edilmiş API yanıtı (nextAction dahil)
   * @param autoCollect - UI autoCollect toggle durumu
   * @param formData - Form verileri (c ve l değerleri için)
   */
  const updateGameState = (parsedResponse: any, autoCollect: boolean, formData?: any) => {
    let newState = { ...gameState }

    console.log(`🔥 SERVER-DRIVEN ACTION ANALİZİ`)
    console.log(`📋 Server Next Action (na): ${parsedResponse.nextAction}`)
    console.log(`🎮 AutoCollect: ${autoCollect}`)
    console.log(`💰 TW: ${parsedResponse.twValue}, W: ${parsedResponse.wValue}`)

    // Free spin durumu güncellemesi
    if (parsedResponse.hasFreeSpin) {
      // Free spin başladı veya devam ediyor
      if (!gameState.inFreeSpin) {
        // YENİ free spin girişi
        newState.freeSpinCounter += 1
        
        // İstatistikleri güncelle
        if (newState.spinsSinceLastFS > 0) {
          newState.freeSpinIntervals.push(newState.spinsSinceLastFS)
          // 🆕 FS başladığındaki interval'i kaydet
          newState.currentFSStartInterval = newState.spinsSinceLastFS
        }
        
        // En uzun free spin'siz seriyi kontrol et
        if (newState.currentDryStreak > newState.maxSpinsWithoutFS) {
          newState.maxSpinsWithoutFS = newState.currentDryStreak
        }
        
        // Sıfırla
        newState.spinsSinceLastFS = 0
        newState.currentDryStreak = 0
        newState.currentFSTotalWin = 0 // 🆕 FS kazancını sıfırla
        
        console.log(`🎯 Free spin girişi #${newState.freeSpinCounter}`)
        console.log(`🎰 Free Spin Data:`, parsedResponse.freeSpinData)
      }
      
      // 🆕 FS sırasında TW değerini sürekli güncelle
      if (parsedResponse.twValue > 0) {
        newState.currentFSTotalWin = parsedResponse.twValue
        console.log(`💰 FS içinde TW güncellendi: ${parsedResponse.twValue}`)
      }
      
      newState.inFreeSpin = true

    } else if (gameState.inFreeSpin && parsedResponse.hasFsTotal) {
      // Free spin bitti - kazancı kaydet
      if (formData && formData.c && formData.l && newState.currentFSTotalWin > 0) {
        const betAmount = parseFloat(formData.c) * parseInt(formData.l)
        const multiplier = Math.round(newState.currentFSTotalWin / betAmount)
        
        newState.freeSpinWins = [
          ...newState.freeSpinWins,
          {
            interval: newState.currentFSStartInterval,
            multiplier: multiplier
          }
        ]
        
        console.log(`💰 FS Tamamlandı - Toplam Kazanç: ${newState.currentFSTotalWin}`)
        console.log(`💰 FS Kazancı: ${multiplier}x (${newState.currentFSTotalWin} / ${betAmount})`)
        console.log(`💰 FS Interval: ${newState.currentFSStartInterval} spinde geldi`)
      }
      
      newState.inFreeSpin = false
      newState.currentFSTotalWin = 0 // Sıfırla
      console.log(`✅ Free spin tamamlandı`)
      console.log(`🎰 Final Free Spin Data:`, parsedResponse.freeSpinData)
    }

    // 🆕 Free Spin kazancını kaydet - ARTIK GEREKMİYOR, YUKARDA YAPILIYOR
    // if (gameState.inFreeSpin && parsedResponse.nextAction === 'c' && parsedResponse.fsWinTotal > 0) {
    //   Silindi - Yukarıda FS bittiğinde kaydediliyor
    // }

    // 🎯 SERVER-DRIVEN: Server'ın gönderdiği na değerini action'a çevir
    const serverAction = getActionFromNextAction(parsedResponse.nextAction)
    
    // AutoCollect kontrolü sadece collect actionları için
    if ((parsedResponse.nextAction === 'c' || 
         parsedResponse.nextAction === 'cb' || 
         parsedResponse.nextAction === 'gc' || 
         parsedResponse.nextAction === 'cj') && !autoCollect) {
      // Collect action ama autoCollect kapalı - spin yap
      setNextAction('doSpin')
      console.log(`❌ SERVER COLLECT ÖNERİYOR (na=${parsedResponse.nextAction}) AMA autoCollect KAPALI - SPIN`)
    } else {
      // Server'ın önerdiği action'ı kullan
      setNextAction(serverAction)
      console.log(`✅ SERVER ACTION: ${serverAction} (na=${parsedResponse.nextAction})`)
    }

    // 🧠 AKILLI SAYAÇ SİSTEMİ - Hook içinde gerçek spin kontrolü
    const isRealSpinResult = isRealSpin(parsedResponse, nextAction)
    
    console.log(`📊 SAYAÇ KONTROLÜ:`)
    console.log(`📊 Current Action: ${nextAction}`)
    console.log(`📊 isRealSpin: ${isRealSpinResult}`)
    
    // Gerçek spin ise sayaçları artır
    if (isRealSpinResult) {
      newState.totalSpinCounter += 1
      newState.spinsSinceLastFS += 1
      newState.currentDryStreak += 1
      
      // En iyi free spin serisini kontrol et (son 100 spin içinde kaç FS var)
      const last100Spins = Math.min(100, newState.totalSpinCounter)
      const recentFSCount = newState.freeSpinIntervals
        .slice(-5) // Son 5 interval
        .reduce((sum, interval) => sum + (interval <= 100 ? 1 : 0), 0)
      
      if (recentFSCount > newState.bestFSStreak.fsCount) {
        newState.bestFSStreak = {
          spins: last100Spins,
          fsCount: recentFSCount
        }
      }
      
      console.log(`✅ GERÇEK SPİN - Sayaçlar artırıldı (Toplam: ${newState.totalSpinCounter})`)
    } else {
      console.log(`❌ SAYAÇ ARTMADI - Collect/Tumble/FreeSpin tespit edildi`)
    }

    // 🆕 Bu spin'in sonucunu kaydet (bir sonraki spin için TW kontrolü)
    setPreviousSpinResult({
      tw: parsedResponse.twValue,
      action: nextAction
    })

    setGameState(newState)
  }

  /**
   * Auto spin için gerçek spin kontrolü yapar
   * @param parsedResponse - Parse edilmiş response
   * @param currentAction - Mevcut action
   * @returns Gerçek spin mi?
   */
  const isRealSpinForAutoSpin = (parsedResponse: any, currentAction: string): boolean => {
    return isRealSpin(parsedResponse, currentAction)
  }

  return {
    gameState,
    nextAction,
    resetStats,
    updateGameState,
    setNextAction,
    setGameState,
    isRealSpinForAutoSpin, // 🆕 Auto spin için export
    previousSpinResult // 🆕 TW takip için export
  }
}