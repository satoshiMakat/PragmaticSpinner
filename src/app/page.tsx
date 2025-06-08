import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main>
        {/* Hero Bölümü */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
          <div className="relative container px-4 py-20">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Hoş Geldiniz
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Prg Test
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Test spin editor
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-lg px-8 py-6"
                >
                  Hemen Başla
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-lg px-8 py-6"
                >
                  Daha Fazla Bilgi
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Özellikler Bölümü */}
        <section className="py-20">
          <div className="container px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Neden Bizi Seçmelisiniz?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Güvenilir ve modern platformumuzla en iyi oyun deneyimini yaşayın.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Güvenlik */}
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔒</span>
                  </div>
                  <CardTitle className="text-white">Güvenli Platform</CardTitle>
                  <CardDescription className="text-gray-400">
                    En gelişmiş güvenlik teknolojileri ile verileriniz güvende.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Hızlı İşlem */}
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <CardTitle className="text-white">Hızlı İşlemler</CardTitle>
                  <CardDescription className="text-gray-400">
                    Anında para yatırma ve çekme işlemleri gerçekleştirin.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* 7/24 Destek */}
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">💬</span>
                  </div>
                  <CardTitle className="text-white">7/24 Destek</CardTitle>
                  <CardDescription className="text-gray-400">
                    Her zaman yanınızdayız. Canlı destek ile anında yardım alın.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Kolay Kullanım */}
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <CardTitle className="text-white">Kolay Kullanım</CardTitle>
                  <CardDescription className="text-gray-400">
                    Sade ve anlaşılır arayüz ile kolayca kullanın.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Mobil Uyumlu */}
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📱</span>
                  </div>
                  <CardTitle className="text-white">Mobil Uyumlu</CardTitle>
                  <CardDescription className="text-gray-400">
                    Her cihazdan sorunsuz bir şekilde erişim sağlayın.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Sorumlu Oyun */}
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🛡️</span>
                  </div>
                  <CardTitle className="text-white">Sorumlu Oyun</CardTitle>
                  <CardDescription className="text-gray-400">
                    Güvenli ve kontrollü oyun ortamı sağlıyoruz.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Bölümü */}
        <section className="py-20">
          <div className="container px-4">
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
              <CardContent className="p-12 text-center">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Hemen Başlayın!
                </h3>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Kayıt olun ve platformumuzun tüm özelliklerinden yararlanmaya başlayın. 
                  Güvenli ve eğlenceli oyun deneyimi sizi bekliyor.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    Ücretsiz Kayıt Ol
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                  >
                    Demo Deneyin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}