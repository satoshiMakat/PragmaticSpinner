// app/api/game/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Request body'yi al
    const body = await request.text()
    
    // Hedef API'ye istek gönder
    const response = await fetch('https://demogamesfree.eotofjxixi.net/gs2c/ge/v3/gameService', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: body
    })

    const responseText = await response.text()
    
    // CORS header'larını ekle
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
    
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Proxy request failed' }, 
      { status: 500 }
    )
  }
}

// OPTIONS request için CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}