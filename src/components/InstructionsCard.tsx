// components/InstructionsCard.tsx - Modern ve Optimize Edilmiş
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, ExternalLink, Zap, Play, Key, TestTube } from 'lucide-react'
import type { GameConfig } from '@/config/gameConfigs'

interface InstructionsCardProps {
  selectedGameSymbol?: string
  gameConfigs: GameConfig[]
  onGameSelect: (gameId: string) => void
  formData: any
}

export const InstructionsCard = ({ 
  selectedGameSymbol, 
  gameConfigs, 
  onGameSelect,
  formData 
}: InstructionsCardProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('TRY')
  
  const selectedGame = gameConfigs.find(g => g.id === formData.gameId)
  
  const BASE_GAME_URL = 'https://demogamesfree.eotofjxixi.net/gs2c/openGame.do'
  
  const getGameUrl = (symbol: string) => {
    const params = new URLSearchParams({
      gameSymbol: symbol,
      lang: 'tr',
      cur: selectedCurrency,
      lobbyUrl: 'undefined',
      stylename: 'ext_bettilt',
      jurisdiction: '99',
      minimode: 'null',
      treq: 'sWAciDTFSu1LvL4zczsKdt4MMNDwtm6zzo2yDzMeaeDKoFJiuaHjRyMTOIkfTUM2',
      isGameUrlApiCalled: 'true'
    })
    
    return `${BASE_GAME_URL}?${params.toString()}`
  }

  const openGame = () => {
    if (!selectedGame) {
      alert('Lütfen önce bir oyun seçin!')
      return
    }
    
    const gameUrl = getGameUrl(selectedGame.symbol)
    console.log('Oyun URL\'si:', gameUrl)
    console.log('Seçili para birimi:', selectedCurrency)
    console.log('Seçili oyun:', selectedGame.name)
    window.open(gameUrl, '_blank', 'width=1200,height=800')
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-indigo-900/30 border-blue-500/40 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <AlertCircle className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl text-white font-semibold">Oyun Ayarları & Kullanım Rehberi</CardTitle>
            <p className="text-blue-200/70 text-sm mt-1">Oyunu seçin, ayarları yapın ve test edin</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Oyun ve Para Birimi Seçimi - Modern Grid */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-white">Oyun Yapılandırması</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Oyun Seçimi */}
            <div className="w-full space-y-4">
              <Label className="text-white font-medium flex items-center gap-2 text-base">
                <Play className="h-4 w-4 text-blue-400" />
                Oyun Seçimi
              </Label>
              <Select value={formData.gameId} onValueChange={onGameSelect}>
                <SelectTrigger className="w-full h-14 bg-slate-700/80 border-slate-500/50 text-white hover:bg-slate-600/80 transition-all duration-200 text-base">
                  <SelectValue placeholder="Oyun seçiniz..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 backdrop-blur-sm">
                  {gameConfigs.map((game) => (
                    <SelectItem
                      key={game.id}
                      value={game.id}
                      className="text-white hover:bg-slate-700 focus:bg-slate-700 py-4"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-white text-base">{game.name}</span>
                          {game.description && (
                            <span className="text-sm text-gray-400 mt-1">{game.description}</span>
                          )}
                        </div>
                        {game.freeSpinBuy?.available && (
                          <Zap className="h-4 w-4 text-yellow-400 ml-3 flex-shrink-0" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedGame && (
                <div className="w-full bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-300">Symbol:</span>
                    <code className="bg-slate-600/50 px-3 py-1.5 rounded text-blue-300 text-sm font-mono">
                      {selectedGame.symbol}
                    </code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-300">Lines:</span>
                    <span className="text-gray-300 text-sm">{selectedGame.lines.join(', ')}</span>
                  </div>
                  {selectedGame.freeSpinBuy?.available && (
                    <div className="flex items-center gap-2 text-yellow-400 pt-2 border-t border-slate-600/30">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm font-medium">{selectedGame.freeSpinBuy.description}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Para Birimi Seçici */}
            <div className="w-full space-y-4">
              <Label className="text-white font-medium flex items-center gap-2 text-base">
                <div className="w-4 h-4 border-2 border-green-400 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                </div>
                Para Birimi
              </Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-full h-14 bg-slate-700/80 border-slate-500/50 text-white hover:bg-slate-600/80 transition-all duration-200 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 backdrop-blur-sm">
                  <SelectItem value="TRY" className="text-white hover:bg-slate-700 py-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xl">🇹🇷</span>
                      <div className="flex flex-col items-start">
                        <div className="font-medium text-base">TRY</div>
                        <div className="text-sm text-gray-400">Türk Lirası</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="USD" className="text-white hover:bg-slate-700 py-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xl">🇺🇸</span>
                      <div className="flex flex-col items-start">
                        <div className="font-medium text-base">USD</div>
                        <div className="text-sm text-gray-400">Amerikan Doları</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="EUR" className="text-white hover:bg-slate-700 py-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xl">🇪🇺</span>
                      <div className="flex flex-col items-start">
                        <div className="font-medium text-base">EUR</div>
                        <div className="text-sm text-gray-400">Euro</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Kullanım Adımları - Modern Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Adım 1 */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm rounded-xl p-5 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Play className="h-4 w-4 text-blue-400" />
              </div>
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Oyunu Başlat</h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {selectedGame 
                ? `${selectedGame.name} oyununu yeni sekmede açın`
                : 'Yukarıdan oyun seçtikten sonra buradan başlatın'
              }
            </p>
            <Button 
              onClick={openGame}
              disabled={!selectedGame}
              className="w-full h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {selectedGame ? 'Oyunu Aç' : 'Oyun Seçin'}
            </Button>
          </div>
          
          {/* Adım 2 */}
          <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 backdrop-blur-sm rounded-xl p-5 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                <Key className="h-4 w-4 text-orange-400" />
              </div>
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Session Key</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="font-medium text-orange-300">F12</span> → 
              <span className="font-medium text-orange-300"> Network</span> → 
              Spin at → 
              <span className="font-medium text-orange-300">gameService</span> → 
              <span className="font-medium text-orange-300">mgckey</span> kopyala
            </p>
          </div>
          
          {/* Adım 3 */}
          <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 backdrop-blur-sm rounded-xl p-5 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <TestTube className="h-4 w-4 text-green-400" />
              </div>
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Test Başlat</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              MGC Key'i aşağıdaki forma yapıştırın ve 
              <span className="font-medium text-green-300"> "Spin Gönder"</span> butonuna tıklayın
            </p>
          </div>
        </div>
        
        {/* Seçim Özeti */}
        {selectedGame && (
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/40">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-300 font-medium">Oyun:</span>
                  <code className="bg-green-900/40 text-green-200 px-2 py-1 rounded text-xs font-mono">
                    {selectedGame.name} ({selectedGame.symbol})
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-300 font-medium">Para Birimi:</span>
                  <code className="bg-green-900/40 text-green-200 px-2 py-1 rounded text-xs font-mono">
                    {selectedCurrency}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}