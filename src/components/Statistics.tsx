import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface GameState {
  inFreeSpin: boolean
  freeSpinCounter: number
  totalSpinCounter: number
  pendingCollect: boolean
  spinsSinceLastFS: number
  maxSpinsWithoutFS: number
  freeSpinIntervals: number[]
  currentDryStreak: number
  bestFSStreak: { spins: number, fsCount: number }
  freeSpinWins?: { interval: number, multiplier: number }[] // Yeni alan: FS kazançları
}

interface StatisticsProps {
  gameState: GameState
  onReset: () => void
}

export function Statistics({ gameState, onReset }: StatisticsProps) {
  // Ortalama free spin aralığını hesapla
  const avgFSInterval = gameState.freeSpinIntervals.length > 0
    ? Math.round(gameState.freeSpinIntervals.reduce((a, b) => a + b, 0) / gameState.freeSpinIntervals.length)
    : 0
  
  // Free spin oranını hesapla
  const fsRate = gameState.totalSpinCounter > 0
    ? ((gameState.freeSpinCounter / gameState.totalSpinCounter) * 100).toFixed(2)
    : '0.00'
  
  return (
    <>
      {/* Header Stats */}
      <div className="flex justify-center gap-4 mt-4">
        <Badge variant="outline" className="border-blue-400 text-blue-400 px-4 py-2">
          Toplam Spin: {gameState.totalSpinCounter}
        </Badge>
        <Badge variant="outline" className="border-purple-400 text-purple-400 px-4 py-2">
          Free Spin Girişi: {gameState.freeSpinCounter}
        </Badge>
        {gameState.inFreeSpin && (
          <Badge className="bg-yellow-600 px-4 py-2">
            🎰 Free Spin Aktif
          </Badge>
        )}
        {gameState.pendingCollect && (
          <Badge className="bg-orange-600 px-4 py-2">
            ⏳ Collect Bekliyor
          </Badge>
        )}
      </div>

      {/* Detailed Stats Panel */}
      <div className="space-y-2">
        <Label className="text-white">İstatistikler</Label>
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 space-y-2">
          {/* Temel İstatistikler */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Toplam Spin:</span>
            <span className="text-white font-semibold">{gameState.totalSpinCounter}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Free Spin Girişi:</span>
            <span className="text-purple-400 font-semibold">{gameState.freeSpinCounter}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">FS Oranı:</span>
            <span className="text-green-400 font-semibold">%{fsRate}</span>
          </div>
          
          <hr className="border-slate-600 my-2" />
          
          {/* Gelişmiş İstatistikler */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-300 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Ortalama FS Aralığı:
            </span>
            <span className="text-cyan-400 font-semibold">
              {avgFSInterval > 0 ? `${avgFSInterval} spin` : '-'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-300 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              En Uzun FS'siz Seri:
            </span>
            <span className="text-red-400 font-semibold">
              {gameState.maxSpinsWithoutFS} spin
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Şu Anki Seri:</span>
            <span className={`font-semibold ${
              gameState.currentDryStreak > avgFSInterval ? 'text-orange-400' : 'text-gray-400'
            }`}>
              {gameState.currentDryStreak} spin
            </span>
          </div>
          
          {gameState.bestFSStreak.fsCount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-300 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                En İyi Seri:
              </span>
              <span className="text-emerald-400 font-semibold">
                {gameState.bestFSStreak.spins} spinde {gameState.bestFSStreak.fsCount} FS
              </span>
            </div>
          )}
          
          <hr className="border-slate-600 my-2" />
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Durum:</span>
            <span className={`font-semibold ${
              gameState.inFreeSpin ? 'text-yellow-400' : 
              gameState.pendingCollect ? 'text-orange-400' : 
              'text-green-400'
            }`}>
              {gameState.inFreeSpin ? 'Free Spin' : 
               gameState.pendingCollect ? 'Collect Bekliyor' : 
               'Normal'}
            </span>
          </div>
          
          {/* Son FS Aralıkları ve Kazançları */}
          {gameState.freeSpinIntervals.length > 0 && (
            <>
              <hr className="border-slate-600 my-2" />
              <div className="text-xs text-gray-400">
                <div className="mb-1">Son FS Aralıkları ve Kazançları:</div>
                <div className="flex flex-wrap gap-1">
                  {gameState.freeSpinIntervals.slice(-150).map((interval, index) => {
                    // freeSpinWins varsa ve eşleşen bir kazanç varsa göster
                    const winIndex = gameState.freeSpinIntervals.slice(0, index + 1).filter(i => i === interval).length - 1;
                    const winData = gameState.freeSpinWins?.[winIndex];
                    const multiplier = winData?.multiplier || 0;
                    
                    return (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className={`text-xs px-2 py-0 ${
                          interval <= 50 ? 'border-green-600 text-green-400' :
                          interval <= 100 ? 'border-yellow-600 text-yellow-400' :
                          'border-red-600 text-red-400'
                        }`}
                      >
                        <span>{interval}</span>
                        {multiplier > 0 && (
                          <span className={`ml-1 font-bold ${
                            multiplier >= 100 ? 'text-purple-400' :
                            multiplier >= 50 ? 'text-yellow-400' :
                            multiplier >= 20 ? 'text-green-400' :
                            'text-gray-400'
                          }`}>
                            ({multiplier}x)
                          </span>
                        )}
                      </Badge>
                    )
                  })}
                </div>
                
                {/* FS Kazanç İstatistikleri */}
                {gameState.freeSpinWins && gameState.freeSpinWins.length > 0 && (
                  <div className="mt-2 p-2 bg-slate-800/50 rounded border border-slate-600">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Ortalama FS Kazancı:</span>
                        <span className="text-cyan-400 font-semibold ml-1">
                          {(gameState.freeSpinWins.reduce((sum, w) => sum + w.multiplier, 0) / gameState.freeSpinWins.length).toFixed(1)}x
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">En Yüksek FS:</span>
                        <span className="text-purple-400 font-semibold ml-1">
                          {Math.max(...gameState.freeSpinWins.map(w => w.multiplier))}x
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Toplam FS Kazancı:</span>
                        <span className="text-green-400 font-semibold ml-1">
                          {gameState.freeSpinWins.reduce((sum, w) => sum + w.multiplier, 0)}x
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">50x+ FS Sayısı:</span>
                        <span className="text-yellow-400 font-semibold ml-1">
                          {gameState.freeSpinWins.filter(w => w.multiplier >= 50).length}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          className="w-full border-slate-600 text-gray-300 hover:bg-slate-700"
        >
          Sayaçları Sıfırla
        </Button>
      </div>
    </>
  )
}