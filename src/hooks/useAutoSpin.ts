// hooks/useAutoSpin.ts - Auto spin yönetimi
import { useState, useCallback } from 'react'

export const useAutoSpin = () => {
  const [isAutoSpinning, setIsAutoSpinning] = useState(false)
  const [autoSpinCount, setAutoSpinCount] = useState(10)
  const [remainingSpins, setRemainingSpins] = useState(0)
  const [autoSpinDelay, setAutoSpinDelay] = useState(100) // ms

  const startAutoSpin = useCallback((totalSpins: number) => {
    setIsAutoSpinning(true)
    setRemainingSpins(totalSpins)
    console.log(`🚀 Auto spin başlatıldı: ${totalSpins} spin planlandı`)
  }, [])

  const stopAutoSpin = useCallback(() => {
    setIsAutoSpinning(false)
    setRemainingSpins(0)
    console.log('⏹️ Auto spin durduruldu')
  }, [])

  const decrementSpinCount = useCallback(() => {
    setRemainingSpins(prev => {
      const newCount = Math.max(0, prev - 1)
      console.log(`✅ Spin tamamlandı. Kalan: ${newCount}`)
      
      if (newCount === 0) {
        console.log('🎯 Tüm spinler tamamlandı!')
        setIsAutoSpinning(false)
      }
      
      return newCount
    })
  }, [])

  return {
    isAutoSpinning,
    autoSpinCount,
    setAutoSpinCount,
    remainingSpins,
    autoSpinDelay,
    setAutoSpinDelay,
    startAutoSpin,
    stopAutoSpin,
    decrementSpinCount
  }
}