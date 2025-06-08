// components/AutoSpinManager.tsx
import { useEffect, useRef } from 'react'

interface AutoSpinManagerProps {
  isAutoSpinning: boolean
  autoSpinCount: number
  remainingSpins: number
  autoSpinDelay: number
  loading: boolean
  response: string
  handleSpin: (isAutomatic: boolean) => Promise<void>
  decrementSpinCount: () => void // Geri eklendi
}

export function AutoSpinManager({
  isAutoSpinning,
  autoSpinCount,
  remainingSpins,
  autoSpinDelay,
  loading,
  response,
  handleSpin,
  decrementSpinCount // Geri eklendi
}: AutoSpinManagerProps) {
  const lastResponseRef = useRef<string>('') // Önceki response'u takip et
  const previousSpinCountRef = useRef<number>(0) // Önceki spin sayısını takip et

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const runAutoSpin = async () => {
      if (remainingSpins > 0 && isAutoSpinning && !loading) {
        const currentSpin = autoSpinCount - remainingSpins + 1
        console.log(`⏳ AUTO SPIN MANAGER: Spin ${currentSpin}/${autoSpinCount} için ${autoSpinDelay}ms bekleniyor...`)
        
        timeoutId = setTimeout(async () => {
          if (isAutoSpinning && remainingSpins > 0 && !loading) {
            console.log(`▶️ AUTO SPIN MANAGER: Spin ${currentSpin}/${autoSpinCount} başlatılıyor...`)
            
            // Spin öncesi toplam spin sayısını kaydet
            // NOT: Bu değer handleSpin içinde artırılacak
            previousSpinCountRef.current = 0; // Burada gerçek toplam spin sayısına erişemiyoruz
            
            await handleSpin(true)
          }
        }, autoSpinDelay)
      }
    }

    // 🎯 AUTO SPIN CONTROL - Basitleştirildi
    const handleResponseChange = () => {
      // Response değişti mi kontrol et
      if (!response || 
          !isAutoSpinning || 
          remainingSpins <= 0 || 
          response === lastResponseRef.current) {
        return
      }
      
      console.log(`🤖 AUTO SPIN MANAGER: Yeni response geldi`)
      console.log(`🤖 remainingSpins: ${remainingSpins}`)
      
      // Response'u işaretle
      lastResponseRef.current = response
      
      // Bir sonraki spin'i tetikle
      // NOT: Sayaç azaltma işlemi ana sayfadaki handleSpin içinde yapılacak
      setTimeout(() => {
        if (remainingSpins > 0 && isAutoSpinning && !loading) {
          runAutoSpin()
        }
      }, 100) // Kısa gecikme ile devam et
    }

    // 🎯 ANA LOGIC
    if (!loading && isAutoSpinning) {
      if (remainingSpins === 0) {
        console.log('🔸 AUTO SPIN MANAGER: Tüm spinler tamamlandı')
        lastResponseRef.current = '' // Reset
      } else if (response && response !== lastResponseRef.current) {
        // Yeni response geldiğinde devam et
        handleResponseChange()
      } else if (!response && remainingSpins === autoSpinCount) {
        // İlk spin durumu
        console.log('🚀 AUTO SPIN MANAGER: İlk spin başlatılıyor...')
        runAutoSpin()
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [
    loading, 
    isAutoSpinning, 
    remainingSpins, 
    autoSpinDelay, 
    response,
    autoSpinCount,
    handleSpin
  ])

  // Reset when auto spin starts/stops
  useEffect(() => {
    if (!isAutoSpinning) {
      lastResponseRef.current = ''
    } else if (remainingSpins === autoSpinCount) {
      lastResponseRef.current = ''
      console.log(`🚀 AUTO SPIN MANAGER: ${autoSpinCount} spin başlatıldı`)
    }
  }, [isAutoSpinning, autoSpinCount, remainingSpins])

  // Bu component sadece logic yönetir, UI render etmez
  return null
}