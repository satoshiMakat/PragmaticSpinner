// components/FormDataPreview.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormData } from '../hooks/useGameLogic'

interface FormDataPreviewProps {
  nextAction: string
  formData: FormData
}

export const FormDataPreview = ({ nextAction, formData }: FormDataPreviewProps) => {
  const previewData = `action=${nextAction}&symbol=${formData.symbol}&c=${formData.c}&l=${formData.l}&bl=${formData.bl}&index=${formData.index}&counter=${formData.counter}&repeat=${formData.repeat}&mgckey=${encodeURIComponent(formData.mgckey)}`

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Gönderilecek Form Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-900 p-4 rounded-lg">
          <div className="text-green-400 text-sm font-mono break-all">
            {previewData}
          </div>
          {nextAction === 'doCollect' && (
            <div className="mt-2 text-orange-400 text-xs">
              ⚠️ Bir sonraki istek doCollect olarak gönderilecek
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}