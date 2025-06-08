// components/SpinForm.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Zap } from 'lucide-react'
import type { GameConfig } from '@/config/gameConfigs'

interface SpinFormProps {
  formData: any
  nextAction: string
  gameState: any
  loading: boolean
  autoCollect: boolean
  isAutoSpinning: boolean
  gameConfigs: GameConfig[]
  freeSpinBuyMode: boolean
  onFieldChange: (field: string, value: string) => void
  onGameSelect: (gameId: string) => void
  onAutoCollectToggle: () => void
  onFreeSpinBuyToggle: () => void
  onSubmit: () => void
  onBuyFreeSpin: () => void
}

export function SpinForm({
  formData,
  nextAction,
  gameState,
  loading,
  autoCollect,
  isAutoSpinning,
  gameConfigs,
  freeSpinBuyMode,
  onFieldChange,
  onAutoCollectToggle,
  onFreeSpinBuyToggle,
  onSubmit,
}: SpinFormProps) {
  const selectedGame = gameConfigs.find(g => g.id === formData.gameId)
  const canBuyFreeSpin = selectedGame?.freeSpinBuy?.available
  
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Spin Parametreleri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Submit Button */}
        <Button
          onClick={onSubmit}
          disabled={loading || !formData.mgckey || isAutoSpinning}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              İşleniyor...
            </>
          ) : (
            '🎰 Spin Gönder'
          )}
        </Button>

        {/* Free Spin Buy Mode */}
        {canBuyFreeSpin && (
          <div className="space-y-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <Label className="text-yellow-300 font-semibold">Free Spin Satın Al</Label>
              </div>
              <Badge variant={freeSpinBuyMode ? "default" : "secondary"} className="text-xs">
                {freeSpinBuyMode ? 'Aktif' : 'Pasif'}
              </Badge>
            </div>
            <p className="text-xs text-gray-400">
              {selectedGame?.freeSpinBuy?.description} - Bahis miktarının {selectedGame?.freeSpinBuy?.multiplier}x'i ödenecek
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={freeSpinBuyMode}
                  onCheckedChange={onFreeSpinBuyToggle}
                  className="data-[state=checked]:bg-yellow-600"
                />
                <Label className="text-gray-300 text-sm">
                  {freeSpinBuyMode ? 'Buy Mode Açık' : 'Buy Mode Kapalı'}
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">action</Label>
            <Input
              value={nextAction}
              readOnly
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">symbol</Label>
            <Input
              value={formData.symbol}
              readOnly
              className="bg-slate-700 border-slate-600 text-gray-400"
            />
          </div>

          {/* C Değeri Seçimi - Dinamik Select */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              Coin Value
              <Badge variant="outline" className="text-xs text-white">
                {selectedGame?.availableC?.length || 0} seçenek
              </Badge>
            </Label>
            {selectedGame?.availableC ? (
              <Select value={formData.c} onValueChange={(value) => onFieldChange('c', value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Coin değeri seçin" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                  {selectedGame.availableC.map((cValue) => {
                    const totalBet = parseFloat(cValue) * parseInt(selectedGame.defaultL)
                    return (
                      <SelectItem
                        key={cValue}
                        value={cValue}
                        className="text-white hover:bg-slate-700"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono">{cValue}</span>
                          <span className="text-xs text-gray-400 ml-3">
                            (Toplam: {totalBet.toFixed(2)})
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={formData.c}
                onChange={(e) => onFieldChange('c', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Coin değeri girin"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-white">Line</Label>
            <Input
              value={formData.l}
              readOnly
              onChange={(e) => onFieldChange('l', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Şans Arttır - Free Spin Kontrolü ile */}
          {selectedGame?.sansArttir ? (
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                Şans Arttır
                <Badge variant="secondary" className="text-xs bg-blue-600">
                  Mevcut
                </Badge>
                {gameState?.inFreeSpin && (
                  <Badge variant="destructive" className="text-xs">
                    Kilitli
                  </Badge>
                )}
              </Label>
              <Select 
                value={formData.bl} 
                onValueChange={(value) => onFieldChange('bl', value)}
                disabled={gameState?.inFreeSpin || loading}
              >
                <SelectTrigger className={`
                  ${gameState?.inFreeSpin || loading 
                    ? 'bg-slate-600 border-slate-500 text-gray-400 cursor-not-allowed' 
                    : 'bg-slate-700 border-slate-600 text-white'
                  }
                `}>
                  <SelectValue placeholder="Şans arttır seçin" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="0" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="text-red-400">✕</span>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Hayır (0)</span>
                        <span className="text-xs text-gray-400">Normal bahis</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="1" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Evet (1)</span>
                        <span className="text-xs text-gray-400">Şans arttır aktif</span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {gameState?.inFreeSpin && (
                <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-2">
                  <p className="text-red-300 text-xs flex items-center gap-1">
                    <span>🔒</span>
                    Free spin sırasında şans arttır değiştirilemez
                  </p>
                </div>
              )}
              
              {formData.bl === '1' && !gameState?.inFreeSpin && (
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-2">
                  <p className="text-yellow-300 text-xs flex items-center gap-1">
                    <span>⚡</span>
                    Şans arttır aktif - Ekstra bahis ile daha yüksek kazanç şansı
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                Şans Arttır
                <Badge variant="secondary" className="text-xs bg-gray-600">
                  Yok
                </Badge>
              </Label>
              <Select value="0" disabled>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="0" className="text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">–</span>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Mevcut Değil</span>
                        <span className="text-xs text-gray-500">Bu oyunda şans arttır yok</span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <div className="bg-gray-900/20 border border-gray-600/30 rounded-lg p-2">
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <span>ℹ️</span>
                  Bu oyunda şans arttır özelliği bulunmamaktadır
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-white">Repeat (sabit)</Label>
            <Input
              value={formData.repeat}
              readOnly
              onChange={(e) => onFieldChange('repeat', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">index (otomatik +1)</Label>
            <Input
              value={formData.index}
              onChange={(e) => onFieldChange('index', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">counter (otomatik +2)</Label>
            <Input
              value={formData.counter}
              onChange={(e) => onFieldChange('counter', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        {/* Free Spin Buy Parameter Display */}
        {freeSpinBuyMode && canBuyFreeSpin && (
          <div className="space-y-2">
            <Label className="text-yellow-300">
              {selectedGame?.freeSpinBuy?.parameter} (Free Spin Buy)
            </Label>
            <Input
              value={selectedGame?.freeSpinBuy?.value}
              readOnly
              className="bg-yellow-900/30 border-yellow-600 text-yellow-300"
            />
          </div>
        )}

        {/* MGC Key */}
        <div className="space-y-2">
          <Label className="text-white flex items-center gap-2">
            MGC Key
            <Badge variant="destructive" className="text-xs">Zorunlu</Badge>
          </Label>
          <Input
            value={formData.mgckey}
            onChange={(e) => onFieldChange('mgckey', e.target.value)}
            placeholder="Oyunu açıp session key'i buraya yapıştırın"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Smart Auto System */}
        <div className="space-y-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between">
            <Label className="text-white font-semibold">Smart Auto System</Label>
            <Badge variant={autoCollect ? "default" : "secondary"} className="text-xs">
              {autoCollect ? 'Aktif' : 'Pasif'}
            </Badge>
          </div>
          <p className="text-xs text-gray-400">
            Otomatik collect, free spin takibi ve sayaç yönetimi aktif
          </p>
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoCollect}
              onCheckedChange={onAutoCollectToggle}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label className="text-gray-300 text-sm">
              Auto Collect {autoCollect ? 'Açık' : 'Kapalı'}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}