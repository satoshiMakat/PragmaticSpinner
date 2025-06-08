// components/AutoSpinControls.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface AutoSpinControlsProps {
  isAutoSpinning: boolean
  autoSpinCount: number
  remainingSpins: number
  autoSpinDelay: number
  loading: boolean
  mgckey: string
  onAutoSpinCountChange: (value: number) => void
  onAutoSpinDelayChange: (value: number) => void
  onStartAutoSpin: () => void
  onStopAutoSpin: () => void
}

export function AutoSpinControls({
  isAutoSpinning,
  autoSpinCount,
  remainingSpins,
  autoSpinDelay,
  loading,
  mgckey,
  onAutoSpinCountChange,
  onAutoSpinDelayChange,
  onStartAutoSpin,
  onStopAutoSpin
}: AutoSpinControlsProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          Auto Spin Kontrolleri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Auto Spin Settings */}
        <div className="space-y-3 p-3 bg-purple-900/20 rounded-lg border border-purple-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <Label className="text-purple-300 font-semibold">Auto Spin Ayarları</Label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-gray-300 text-xs">Spin Sayısı</Label>
              <Input
                type="number"
                value={autoSpinCount}
                onChange={(e) => onAutoSpinCountChange(parseInt(e.target.value) || 0)}
                min="1"
                max="1000"
                disabled={isAutoSpinning}
                className="bg-slate-700 border-slate-600 text-white h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-gray-300 text-xs">Gecikme (ms)</Label>
              <Input
                type="number"
                value={autoSpinDelay}
                onChange={(e) => onAutoSpinDelayChange(parseInt(e.target.value) || 1000)}
                min="100"
                max="5000"
                step="100"
                disabled={isAutoSpinning}
                className="bg-slate-700 border-slate-600 text-white h-9"
              />
            </div>
          </div>

          {/* Auto Spin Progress Info */}
          {isAutoSpinning && (
            <div className="bg-purple-900/30 border border-purple-600/40 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-300">İlerleme:</span>
                <span className="text-white font-semibold">
                  {autoSpinCount - remainingSpins + 1} / {autoSpinCount}
                </span>
              </div>
              <div className="mt-2 bg-purple-900/50 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((autoSpinCount - remainingSpins) / autoSpinCount) * 100}%` 
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-purple-300 mt-1">
                <span>Kalan: {remainingSpins}</span>
                <span>%{Math.round(((autoSpinCount - remainingSpins) / autoSpinCount) * 100)}</span>
              </div>
            </div>
          )}

          {/* Auto Spin Buttons */}
          {!isAutoSpinning ? (
            <Button
              onClick={onStartAutoSpin}
              disabled={loading || !mgckey.trim() || autoSpinCount < 1}
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              🚀 Auto Spin Başlat ({autoSpinCount} spin)
            </Button>
          ) : (
            <Button
              onClick={onStopAutoSpin}
              variant="destructive"
              className="w-full transition-colors"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ⏹️ Auto Spin Durdur ({remainingSpins} kaldı)
            </Button>
          )}

          {/* Auto Spin Info */}
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Gecikme:</span>
              <span className="text-purple-300">{autoSpinDelay}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tahmini süre:</span>
              <span className="text-purple-300">
                {Math.round((autoSpinCount * autoSpinDelay) / 1000)}s
              </span>
            </div>
            {autoSpinCount > 0 && (
              <div className="flex items-center justify-between">
                <span>Toplam spin:</span>
                <span className="text-purple-300">{autoSpinCount} adet</span>
              </div>
            )}
          </div>

          {/* Warnings */}
          {autoSpinDelay < 500 && (
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-2">
              <p className="text-yellow-300 text-xs flex items-center gap-1">
                <span>⚠️</span>
                Çok hızlı gecikme server'ı zorlayabilir
              </p>
            </div>
          )}

          {autoSpinCount > 500 && (
            <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-2">
              <p className="text-orange-300 text-xs flex items-center gap-1">
                <span>🔥</span>
                Yüksek spin sayısı - dikkatli olun
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}