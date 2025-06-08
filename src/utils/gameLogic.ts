// utils/gameLogic.ts - Server-Driven Sistem
import { SpinResponse, GameState } from '@/types/game'

/**
 * Server'dan gelen API yanıtını parse eder (orijinal protokol)
 * @param responseText - Ham API yanıt metni
 * @returns Parse edilmiş response objesi
 */
export function parseSpinResponse(responseText: string): SpinResponse {
  // URL parametrelerini parse et
  const params = new URLSearchParams('?' + responseText)
  
  // Orijinal protokol parametreleri
  const freeSpinCurrentNumber = params.get('fs') // freeSpinCurrentNumber
  const freeSpinTotalNumber = params.get('fs_total') // freeSpinTotalNumber
  const freeSpinCurrentMultiplier = params.get('fsmul') // freeSpinCurrentMultiplier
  const nextAction = params.get('na') // Server'ın önerdiği next action

  // Free spin durumlarını belirle
  const hasFreeSpin = freeSpinCurrentNumber !== null || freeSpinCurrentMultiplier === '1'
  const hasFsTotal = freeSpinTotalNumber !== null
  const hasTmbRes = responseText.includes('tmb_res=')
  
  return {
    hasFreeSpin: hasFreeSpin,
    hasFsTotal: hasFsTotal,
    hasTmbRes: hasTmbRes,
    nextAction: nextAction, // 🆕 Server'ın önerdiği action
    freeSpinData: {         // 🆕 Detaylı free spin bilgileri
      currentNumber: freeSpinCurrentNumber ? parseInt(freeSpinCurrentNumber) : null,
      totalNumber: freeSpinTotalNumber ? parseInt(freeSpinTotalNumber) : null,
      currentMultiplier: freeSpinCurrentMultiplier ? parseFloat(freeSpinCurrentMultiplier) : null
    },
    rawResponse: responseText
  }
}

/**
 * 🗑️ DEPRECATED - Server artık next action'ı belirliyor
 * Hook içindeki updateGameState fonksiyonu kullanılmalı
 */
export function calculateNextAction(): never {
  throw new Error('calculateNextAction deprecated! Server-driven sistem kullanın (na parametresi)')
}

/**
 * Spin sayacının artırılıp artırılmayacağını kontrol eder
 * @param response - Parse edilmiş response
 * @param gameState - Mevcut oyun durumu
 * @returns Sayaç artırılmalı mı?
 */
export function shouldIncrementSpinCounter(
  response: SpinResponse,
  gameState: GameState
): boolean {
  // Sadece free spin dışında ve free spin başlamıyorsa sayacı artır
  return !gameState.inFreeSpin && !response.hasFreeSpin
}

/**
 * Oyun API'sine istek gönderir
 * @param action - Yapılacak işlem (doSpin/doCollect - server'dan gelir)
 * @param symbol - Oyun sembolü
 * @param c - Coin değeri
 * @param l - Line sayısı
 * @param bl - Bonus level
 * @param index - İstek sıra numarası
 * @param counter - İstek sayacı
 * @param repeat - Tekrar parametresi
 * @param mgckey - Session anahtarı
 * @param proxyUrl - Proxy URL'si
 * @param targetUrl - Hedef URL
 * @returns API yanıt metni
 */
export async function sendSpinRequest(
  action: string, // Server'dan gelen na=s → doSpin, na=c → doCollect
  symbol: string,
  c: string,
  l: string,
  bl: string,
  index: string,
  counter: string,
  repeat: string,
  mgckey: string,
  proxyUrl: string,
  targetUrl: string
): Promise<string> {
  const formData = new URLSearchParams()
  formData.append('action', action) // Server-driven action
  formData.append('symbol', symbol)
  formData.append('c', c)
  formData.append('l', l)
  formData.append('bl', bl)
  formData.append('index', index)
  formData.append('counter', counter)
  formData.append('repeat', repeat)
  formData.append('mgckey', mgckey)

  const response = await fetch(proxyUrl + targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: formData
  })

  return await response.text()
}

/**
 * Server action'ını client action'ına çevirir
 * @param serverAction - Server'dan gelen na parametresi
 * @returns Client action string
 */
export function mapServerActionToClientAction(serverAction: string | null): string {
  switch (serverAction) {
    case 's': return 'doSpin'     // na=s → doSpin
    case 'c': return 'doCollect'  // na=c → doCollect
    case 'g': return 'doSpin'     // na=g → doSpin (gamble desteklenmiyor)
    case 'b': return 'doSpin'     // na=b → doSpin (bonus desteklenmiyor)
    default:  return 'doSpin'     // Bilinmeyen action → doSpin
  }
}

/**
 * Hata kontrolü yapar
 * @param responseText - Ham API yanıt metni
 * @returns Hata var mı?
 */
export function hasResponseError(responseText: string): boolean {
  return responseText.includes('frozen=') || 
         responseText.includes('Internal+server+error') || 
         responseText.includes('invalid+action') ||
         responseText.includes('invalid action') ||
         responseText.includes('error') ||
         responseText.includes('Error')
}