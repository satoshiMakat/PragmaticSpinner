'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGameLogic } from '@/hooks/useGameLogic'
import { useSpinApi } from '@/hooks/useSpinApi'
import { useFormData } from '@/hooks/useFormData'
import { useAutoSpin } from '@/hooks/useAutoSpin'
import { Statistics } from '@/components/Statistics'
import { ResponseDisplay } from '@/components/ResponseDisplay'
import { InstructionsCard } from '@/components/InstructionsCard'
import { SpinForm } from '@/components/SpinForm'
import { FormDataPreview } from '@/components/FormDataPreview'
import { AutoSpinManager } from '@/components/AutoSpinManager'
import { AutoSpinControls } from '@/components/AutoSpinControls' // 🆕 Auto Spin UI

/**
 * API yanıtını analiz eder ve önemli bilgileri çıkarır
 */
function parseSpinResponse(responseText: string) {
    const params = new URLSearchParams('?' + responseText)

    const freeSpinCurrentNumber = params.get('fs')
    const freeSpinMaxNumber = params.get('fsmax')
    const freeSpinTotalNumber = params.get('fs_total')
    const freeSpinCurrentMultiplier = params.get('fsmul')

    // TW ve W değerlerini al - Sayaç kontrolü için
    const twValue = parseFloat(params.get('tw') || '0')
    const wValue = parseFloat(params.get('w') || '0')

    // 🆕 Free Spin toplam kazancı
    const fsWinTotal = parseFloat(params.get('fsres') || params.get('fswin') || '0')

    const hasFreeSpin = freeSpinCurrentNumber !== null || freeSpinCurrentMultiplier === '1'
    const hasFsTotal = freeSpinTotalNumber !== null
    const nextAction = params.get('na') // SERVER-DRIVEN: Sadece bu kullanılacak

    const hasError = responseText.includes('frozen=') ||
        responseText.includes('Internal+server+error') ||
        responseText.includes('invalid+action') ||
        responseText.includes('invalid action') ||
        responseText.includes('error') ||
        responseText.includes('Error')

    console.log(`🔍 PARSE RESPONSE:`)
    console.log(`🎰 FS Current (fs): ${freeSpinCurrentNumber}`)
    console.log(`🎰 FS Total (fs_total): ${freeSpinTotalNumber}`)
    console.log(`💰 TW: ${twValue}, W: ${wValue}`)
    console.log(`💰 FS Win Total: ${fsWinTotal}`) // 🆕
    console.log(`🎯 SERVER NEXT ACTION (na): ${nextAction}`)
    console.log(`🚨 HATA VAR MI: ${hasError}`)


    return {
        hasFreeSpin,
        hasFsTotal,
        nextAction,
        twValue,
        wValue,
        fsWinTotal,
        freeSpinData: {
            currentNumber: freeSpinCurrentNumber ? parseInt(freeSpinCurrentNumber) : null,
            maxNumber: freeSpinMaxNumber ? parseInt(freeSpinMaxNumber) : null,
            totalNumber: freeSpinTotalNumber ? parseInt(freeSpinTotalNumber) : null,
            currentMultiplier: freeSpinCurrentMultiplier ? parseFloat(freeSpinCurrentMultiplier) : null
        },
        hasError,
        rawResponse: responseText
    }
}

async function sendSpinRequest(
    action: string, symbol: string, c: string, l: string, bl: string,
    index: string, counter: string, repeat: string, mgckey: string,
    extraParams?: Record<string, string>
): Promise<string> {
    const formData = new URLSearchParams()
    formData.append('action', action)
    formData.append('symbol', symbol)
    formData.append('c', c)
    formData.append('l', l)
    formData.append('bl', bl)
    formData.append('index', index)
    formData.append('counter', counter)
    formData.append('repeat', repeat)
    formData.append('mgckey', mgckey)

    if (extraParams) {
        for (const [key, value] of Object.entries(extraParams)) {
            formData.append(key, value)
        }
    }

    const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.text()
}

export default function SpinTestPage() {
    const {
        gameState,
        nextAction,
        resetStats,
        setNextAction,
        setGameState,
        updateGameState: updateGameStateHook,
        isRealSpinForAutoSpin // 🆕 Auto spin için hook'tan alıyoruz
    } = useGameLogic()

    const { response, loading, setResponse, setLoading } = useSpinApi()
    const {
        formData,
        updateField,
        selectGame,
        incrementCounters,
        gameConfigs,
        isFreeSpinBuyEnabled,
        setIsFreeSpinBuyEnabled
    } = useFormData()

    const {
        isAutoSpinning,
        autoSpinCount,
        setAutoSpinCount,
        remainingSpins,
        autoSpinDelay,
        setAutoSpinDelay,
        startAutoSpin,
        stopAutoSpin,
        decrementSpinCount
    } = useAutoSpin()

    const [autoCollect, setAutoCollect] = useState(true)
    const [responseHistory, setResponseHistory] = useState<string[]>([])

    // 🔧 useCallback ile infinite loop'u önle
    const handleGameSelect = useCallback((gameId: string) => {
        selectGame(gameId)
    }, [selectGame])

    const handleSpin = useCallback(async (isAutomatic = false, extraParams: Record<string, string> = {}) => {
        if (!formData.mgckey.trim()) {
            if (!isAutomatic) {
                alert('MGC Key boş olamaz! Önce oyunu açıp session key\'i alın.')
            }
            return
        }

        setLoading(true)

        if (isFreeSpinBuyEnabled) {
            extraParams['pur'] = '0'
            setIsFreeSpinBuyEnabled(false)
        }

        try {
            const responseText = await sendSpinRequest(
                nextAction, formData.symbol, formData.c, formData.l, formData.bl,
                formData.index, formData.counter, formData.repeat, formData.mgckey,
                extraParams
            )

            setResponse(responseText)

            setResponseHistory(prev => {
                const newHistory = [responseText, ...prev].slice(0, 3)
                return newHistory
            })

            incrementCounters()

            const parsedResponse = parseSpinResponse(responseText)

            if (parsedResponse.hasError) {
                console.log('🚨 API HATASI TESPİT EDİLDİ!')
                console.log('🚨 Hatalı response:', responseText)

                if (isAutoSpinning) {
                    stopAutoSpin()
                    console.log('🛑 Auto spin hata nedeniyle durduruldu!')
                }

                const errorMsg = `🚨 OYUN HATASI TESPİT EDİLDİ!\n\nHata içeren response:\n${responseText}\n\nAuto spin durduruldu. Oyunu yeniden başlatmanız gerekebilir.`
                setResponse(errorMsg)
                return
            }

            updateGameStateHook(parsedResponse, autoCollect, formData)

            if (isAutomatic && isAutoSpinning) {
                const currentAction = parsedResponse.nextAction || 'spin'
                if (isRealSpinForAutoSpin(parsedResponse, currentAction)) {
                    console.log('✅ Gerçek spin tespit edildi, auto spin sayacı azaltılıyor')
                    decrementSpinCount()
                } else {
                    console.log('⏭️ Collect/tumble tespit edildi, auto spin sayacı azaltılmıyor')
                }
            }

        } catch (error: any) {
            const errorMsg = `HATA: ${error?.message || 'Bilinmeyen hata'}\n\nAPI isteği başarısız oldu. Oyunun açık olduğundan ve MGC key'in doğru olduğundan emin olun.`
            setResponse(errorMsg)

            if (isAutomatic) {
                stopAutoSpin()
                console.log('❌ Auto spin hata nedeniyle durduruldu!')
            }
        } finally {
            setLoading(false)
        }
    }, [
        formData.mgckey,
        isFreeSpinBuyEnabled,
        setIsFreeSpinBuyEnabled,
        nextAction,
        formData.symbol,
        formData.c,
        formData.l,
        formData.bl,
        formData.index,
        formData.counter,
        formData.repeat,
        setResponse,
        setResponseHistory,
        incrementCounters,
        isAutoSpinning,
        stopAutoSpin,
        updateGameStateHook,
        autoCollect,
        setLoading
    ])

    const handleBuyFreeSpin = useCallback(() => {
        console.log("🟡 Free Spin satın al isteği gönderiliyor...")
        const selectedGame = gameConfigs.find(game => game.id === formData.gameId)
        const buyParam = selectedGame?.freeSpinBuy

        if (buyParam?.available) {
            const extraParams: Record<string, string> = {
                [buyParam.parameter]: buyParam.value
            }
            handleSpin(false, extraParams)
        } else {
            alert("Bu oyunda free spin satın alma özelliği yok.")
        }
    }, [gameConfigs, formData.gameId, handleSpin])

    const handleStartAutoSpin = useCallback(() => {
        if (autoSpinCount > 0 && !isAutoSpinning && !loading) {
            console.log(`🚀 Ana sayfa: Auto spin başlatılıyor: ${autoSpinCount} spin`)
            startAutoSpin(autoSpinCount)

            // İlk spin'i hemen başlat
            console.log(`▶️ Ana sayfa: İlk spin başlatılıyor...`)
            handleSpin(true)
        }
    }, [autoSpinCount, isAutoSpinning, loading, startAutoSpin, handleSpin])

    const handleStopAutoSpin = useCallback(() => {
        stopAutoSpin()
        console.log('⏹️ Auto spin durduruldu!')
    }, [stopAutoSpin])

    const copyResponse = useCallback(() => {
        navigator.clipboard.writeText(response)
    }, [response])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* 🆕 Auto Spin Manager - Logic yönetimi için */}
            <AutoSpinManager
                isAutoSpinning={isAutoSpinning}
                autoSpinCount={autoSpinCount}
                remainingSpins={remainingSpins}
                autoSpinDelay={autoSpinDelay}
                loading={loading}
                response={response}
                handleSpin={handleSpin}
                decrementSpinCount={decrementSpinCount}

            />

            <Header />

            <main className="container px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-white">API Test Aracı</h1>
                        <p className="text-gray-400">Oyunu açıp session key alın, sonra API testi yapın</p>
                        <Statistics gameState={gameState} onReset={resetStats} />
                    </div>

                    <InstructionsCard
                        selectedGameSymbol={formData.symbol}
                        gameConfigs={gameConfigs}
                        onGameSelect={handleGameSelect}
                        formData={formData}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* SOL PANEL - Spin Parametreleri */}
                        <SpinForm
                            formData={formData}
                            nextAction={nextAction}
                            gameState={gameState}
                            loading={loading}
                            autoCollect={autoCollect}
                            isAutoSpinning={isAutoSpinning}
                            gameConfigs={gameConfigs}
                            onFieldChange={updateField}
                            onGameSelect={handleGameSelect}
                            onAutoCollectToggle={() => setAutoCollect(!autoCollect)}
                            onSubmit={() => handleSpin(false)}
                            freeSpinBuyMode={isFreeSpinBuyEnabled}
                            onFreeSpinBuyToggle={() => setIsFreeSpinBuyEnabled(prev => !prev)}
                            onBuyFreeSpin={handleBuyFreeSpin}
                        />

                        {/* ORTA PANEL - Auto Spin Kontrolleri */}
                        <AutoSpinControls
                            isAutoSpinning={isAutoSpinning}
                            autoSpinCount={autoSpinCount}
                            remainingSpins={remainingSpins}
                            autoSpinDelay={autoSpinDelay}
                            loading={loading}
                            mgckey={formData.mgckey}
                            onAutoSpinCountChange={setAutoSpinCount}
                            onAutoSpinDelayChange={setAutoSpinDelay}
                            onStartAutoSpin={handleStartAutoSpin}
                            onStopAutoSpin={handleStopAutoSpin}
                        />

                        {/* SAĞ PANEL - API Yanıtı */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">API Yanıtı</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponseDisplay
                                    response={response}
                                    gameState={gameState}
                                    autoCollect={autoCollect}
                                    responseHistory={responseHistory}
                                    onCopy={copyResponse}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <FormDataPreview nextAction={nextAction} formData={formData} />
                </div>
            </main>

            <Footer />
        </div>
    )
}