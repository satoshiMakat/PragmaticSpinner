// components/ResponseDisplay.tsx
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Copy, AlertCircle, History } from 'lucide-react'
import { GameState } from '@/types/game'

interface ResponseDisplayProps {
  response: string
  gameState: GameState
  autoCollect: boolean
  responseHistory?: string[] // 🆕 Response geçmişi
  onCopy: () => void
}

export function ResponseDisplay({ 
  response, 
  gameState, 
  autoCollect, 
  responseHistory = [], // 🆕 Varsayılan boş array
  onCopy 
}: ResponseDisplayProps) {
  if (!response) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="mx-auto h-12 w-12 mb-4 opacity-30">🎮</div>
        <p>API isteği henüz gönderilmedi</p>
        <p className="text-sm">Yukarıdaki adımları takip edin</p>
      </div>
    )
  }

  const hasFreeSpin = response.includes('fsmul=1')
  const hasFsTotal = response.includes('fs_total=')
  const hasTmbRes = response.includes('tmb_res=')

  // 🆕 Hata kontrolü
  const hasError = response.includes('frozen=') || 
                  response.includes('Internal+server+error') || 
                  response.includes('invalid+action') ||
                  response.includes('invalid action') ||
                  response.includes('error') ||
                  response.includes('Error')

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant={hasError ? "destructive" : "outline"} 
                 className={hasError ? "border-red-400 text-red-400" : "border-green-400 text-green-400"}>
            {hasError ? '🚨 HATA' : 'Response Alındı'} - {new Date().toLocaleTimeString()}
          </Badge>
          {responseHistory.length > 1 && (
            <Badge variant="secondary" className="text-xs">
              <History className="h-3 w-3 mr-1" />
              {responseHistory.length} kayıt
            </Badge>
          )}
        </div>
        <Button
          onClick={onCopy}
          variant="outline"
          size="sm"
          className="border-slate-600 text-gray-300 hover:bg-slate-700"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label className="text-white text-sm">Ham Response:</Label>
        <Textarea
          value={response}
          readOnly
          className={`font-mono text-sm min-h-[200px] ${
            hasError 
              ? 'bg-red-950 border-red-600 text-red-400' 
              : 'bg-slate-900 border-slate-600 text-green-400'
          }`}
        />
      </div>

      {/* 🆕 Response Geçmişi - Ham response'dan sonra, parse'dan önce */}
      {responseHistory.length > 1 && (
        <div className="space-y-2">
          <Label className="text-white text-sm flex items-center gap-2">
            <History className="h-4 w-4" />
            Son Response Geçmişi:
          </Label>
          <div className="bg-slate-900/70 border border-slate-600 rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
            {responseHistory.slice(1).map((historyResponse, index) => {
              const historyHasError = historyResponse.includes('frozen=') || 
                                    historyResponse.includes('error') || 
                                    historyResponse.includes('Error')
              
              return (
                <div key={index} className="border border-slate-700 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {index + 1} önceki response:
                    </span>
                    {historyHasError && (
                      <Badge variant="destructive" className="text-xs">
                        ⚠️ HATA
                      </Badge>
                    )}
                  </div>
                  <div className={`text-xs font-mono p-2 rounded max-h-20 overflow-hidden ${
                    historyHasError 
                      ? 'bg-red-950/50 text-red-300' 
                      : 'bg-slate-800/50 text-gray-400'
                  }`}>
                    <pre className="whitespace-pre-wrap break-all">
                      {historyResponse.length > 700 
                        ? historyResponse.substring(0, 700) + '...' 
                        : historyResponse
                      }
                    </pre>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Parse response if it contains & */}
      {response.includes('&') && !hasError && (
        <div className="space-y-2">
          <Label className="text-white text-sm">Parse Edilmiş Değerler:</Label>
          <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 space-y-1 max-h-[300px] overflow-y-auto">
            {response.split('&').map((param, index) => {
              const [key, value] = param.split('=')
              const decodedValue = decodeURIComponent(value || '')
              
              return (
                <div key={index} className="flex text-sm">
                  <span className={`w-20 font-mono shrink-0 ${
                    key === 'tmb_res' ? 'text-orange-400' : 
                    key === 'fsmul' ? 'text-yellow-400' :
                    key === 'fs_total' ? 'text-green-400' :
                    key === 'tw' ? 'text-purple-400' :
                    key === 'w' ? 'text-cyan-400' :
                    'text-blue-400'
                  }`}>
                    {key}:
                  </span>
                  <span className={`break-all ${
                    key === 'tmb_res' ? 'text-orange-300 font-semibold' : 
                    key === 'fsmul' ? 'text-yellow-300 font-semibold' :
                    key === 'fs_total' ? 'text-green-300 font-semibold' :
                    key === 'tw' ? 'text-purple-300 font-semibold' :
                    key === 'w' ? 'text-cyan-300 font-semibold' :
                    'text-white'
                  }`}>
                    {decodedValue}
                  </span>
                </div>
              )
            })}
          </div>
          
          {/* Status Alerts */}
          {hasFreeSpin && autoCollect && (
            <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-yellow-400">
                <span className="text-xl">🎰</span>
                <span className="font-semibold">Free Spin Başladı</span>
              </div>
              <p className="text-yellow-200 text-sm mt-1">
                Free spin moduna girdi. Collect işlemi free spin bitene kadar bekletildi.
              </p>
            </div>
          )}

          {hasFsTotal && autoCollect && (
            <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-400">
                <span className="text-xl">✅</span>
                <span className="font-semibold">Free Spin Bitti</span>
              </div>
              <p className="text-green-200 text-sm mt-1">
                Free spin tamamlandı. {gameState.pendingCollect ? 'Bekleyen collect işlemi yapılacak.' : 'Normal spin moduna dönüldü.'}
              </p>
            </div>
          )}

          {hasTmbRes && autoCollect && !gameState.inFreeSpin && (
            <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-orange-400">
                <AlertCircle className="h-4 w-4" />
                <span className="font-semibold">Collect Hazır</span>
              </div>
              <p className="text-orange-200 text-sm mt-1">
                Tumble tespit edildi. Bir sonraki istek otomatik olarak doCollect yapılacak.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 🆕 Hata durumu için özel uyarı */}
      {hasError && (
        <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold text-lg">Oyun Hatası Tespit Edildi!</span>
          </div>
          <p className="text-red-200 text-sm mb-3">
            API yanıtında hata tespit edildi. Auto spin otomatik olarak durduruldu.
          </p>
          <div className="bg-red-950/50 rounded p-3">
            <p className="text-red-300 text-xs font-mono">
              Muhtemel sorunlar: Server hatası, geçersiz işlem, oyun donması
            </p>
            <p className="text-red-300 text-xs mt-1">
              Çözüm: Oyunu yeniden başlatın ve yeni MGC key alın
            </p>
          </div>
        </div>
      )}
    </div>
  )
}