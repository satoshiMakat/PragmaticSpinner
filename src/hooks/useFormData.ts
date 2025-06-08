// hooks/useFormData.ts - C değerleri yönetimi ile güncellenmiş
import { useState } from 'react'
import { gameConfigs, getGameConfig } from '@/config/gameConfigs'

export interface FormData {
  gameId: string
  symbol: string
  c: string
  l: string
  bl: string
  index: string
  counter: string
  repeat: string
  mgckey: string
  currency: string // Para birimi alanı
}

export const useFormData = () => {
  const defaultGame = gameConfigs[0]

  const [formData, setFormData] = useState<FormData>({
    gameId: defaultGame.id,
    symbol: defaultGame.symbol,
    c: defaultGame.defaultC,
    l: defaultGame.defaultL,
    bl: defaultGame.defaultBl,
    index: '2',
    counter: '3',
    repeat: '0',
    mgckey: '',
    currency: 'TRY' // Varsayılan para birimi
  })

  // Free Spin Satın Alma toggle'ı için state
  const [isFreeSpinBuyEnabled, setIsFreeSpinBuyEnabled] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectGame = (gameId: string) => {
    const gameConfig = getGameConfig(gameId)
    if (gameConfig) {
      setFormData(prev => ({
        ...prev,
        gameId: gameConfig.id,
        symbol: gameConfig.symbol,
        c: gameConfig.defaultC, // Oyun değişince default C değerini ayarla
        l: gameConfig.defaultL,
        bl: gameConfig.sansArttir ? '0' : '0' // 🆕 Şans arttır değerini sıfırla
      }))
      // Oyun değişince freeSpin toggle sıfırlansın
      setIsFreeSpinBuyEnabled(false)
      
      // Console'da oyun bilgilerini göster
      console.log(`🎮 ${gameConfig.name} seçildi`)
      console.log(`💰 Mevcut C değerleri: ${gameConfig.availableC?.join(', ')}`)
      console.log(`🎯 Varsayılan C: ${gameConfig.defaultC}`)
    }
  }

  const incrementCounters = () => {
    setFormData(prev => ({
      ...prev,
      index: (parseInt(prev.index) + 1).toString(),
      counter: (parseInt(prev.counter) + 2).toString()
    }))
  }

  // 🆕 Seçili oyunun C değerlerini getir
  const getSelectedGameCValues = () => {
    const selectedGame = gameConfigs.find(g => g.id === formData.gameId)
    return selectedGame?.availableC || []
  }

  // 🆕 Mevcut C değerinin geçerli olup olmadığını kontrol et
  const isCurrentCValueValid = () => {
    const availableValues = getSelectedGameCValues()
    return availableValues.includes(formData.c)
  }

  // 🆕 Toplam bahis miktarını hesapla
  const calculateCurrentTotalBet = () => {
    const coinValue = parseFloat(formData.c) || 0
    const lines = parseInt(formData.l) || 1
    return coinValue * lines
  }

  return {
    formData,
    updateField,
    selectGame,
    incrementCounters,
    gameConfigs,
    isFreeSpinBuyEnabled,
    setIsFreeSpinBuyEnabled,
    // 🆕 Yeni utility fonksiyonlar
    getSelectedGameCValues,
    isCurrentCValueValid,
    calculateCurrentTotalBet
  }
}