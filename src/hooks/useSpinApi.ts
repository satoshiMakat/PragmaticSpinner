// hooks/useSpinApi.ts
import { useState } from 'react'
import { FormData } from '@/hooks/useFormData' // 🆕 Doğru FormData import'u

const API_ENDPOINT = '/api/game'

export const useSpinApi = () => {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const parseSpinResponse = (responseText: string) => {
    return {
      hasFreeSpin: responseText.includes('fsmul=1'),
      hasFsTotal: responseText.includes('fs_total='),
      hasTmbRes: responseText.includes('tmb_res='),
      rawResponse: responseText
    }
  }

  const sendSpinRequest = async (
    action: string, formData: FormData
  ): Promise<string> => {
    const form = new URLSearchParams()
    form.append('action', action)
    form.append('symbol', formData.symbol)
    form.append('c', formData.c)
    form.append('l', formData.l)
    form.append('bl', formData.bl)
    form.append('index', formData.index)
    form.append('counter', formData.counter)
    form.append('repeat', formData.repeat)
    form.append('mgckey', formData.mgckey)

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString()
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.text()
  }

  const executeSpin = async (action: string, formData: FormData) => {
    if (!formData.mgckey.trim()) {
      throw new Error('MGC Key boş olamaz! Önce oyunu açıp session key\'i alın.')
    }

    setLoading(true)
    
    try {
      const responseText = await sendSpinRequest(action, formData)
      setResponse(responseText)
      return parseSpinResponse(responseText)
    } catch (error: any) {
      const errorMessage = `HATA: ${error?.message || 'Bilinmeyen hata'}\n\nAPI isteği başarısız oldu. Oyunun açık olduğundan ve MGC key'in doğru olduğundan emin olun.`
      setResponse(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    response,
    loading,
    executeSpin,
    setResponse,
    setLoading
  }
}