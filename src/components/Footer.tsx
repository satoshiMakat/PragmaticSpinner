import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Shield,
    Clock,
    Mail,
} from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-blue-800/20">
            {/* Main Footer */}
            <div className="container px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Şirket Bilgileri */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                                <span className="text-white font-bold text-sm">G</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                                Test Website
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Test Amaçlı yazılım
                        </p>

                    </div>

                    {/* Hızlı Linkler */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Hızlı Linkler
                        </h3>
                        <div className="space-y-2">
                            <Link href="/" className="block text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                Ana Sayfa
                            </Link>
                            <Link href="/hakkimizda" className="block text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                Hakkımızda
                            </Link>
                            <Link href="/iletisim" className="block text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                İletişim
                            </Link>
                            <Link href="/blog" className="block text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                Blog
                            </Link>
                        </div>
                    </div>

                    {/* Destek */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Destek
                        </h3>
                        <div className="space-y-2">
                            <Link href="/yardim" className="block text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                Yardım Merkezi
                            </Link>
                            <Link href="/iletisim" className="block text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                Bize Ulaşın
                            </Link>
                            <Link href="/sorumlu-oyun" className="block text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                Sorumlu Oyun
                            </Link>
                            <Link href="/kullanim-kosullari" className="block text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                Kullanım Koşulları
                            </Link>
                            <Link href="/gizlilik" className="block text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                Gizlilik Politikası
                            </Link>
                            <Link href="/guvenlik" className="block text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                Güvenlik
                            </Link>
                        </div>

                        {/* Destek Badge */}
                        <div className="flex items-center space-x-2 pt-2">
                            <Clock className="h-4 w-4 text-green-400" />
                            <Badge variant="outline" className="border-green-400 text-green-400">
                                7/24 Destek
                            </Badge>
                        </div>
                    </div>

                    {/* Bülten */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Haberdar Olun
                        </h3>
                        <p className="text-sm text-gray-400">
                            En son güncellemeler ve haberler için e-posta listemize katılın.
                        </p>
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="E-posta adresiniz"
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                            />
                            <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            >
                                Abone Ol
                            </Button>
                        </div>

                        {/* İletişim Bilgileri */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <Mail className="h-3 w-3" />
                                <span>Test Website</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Alt Bar */}
            <div className="border-t border-slate-800">
                <div className="container px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                        <div className="text-sm text-gray-400">
                            © 2024 TestWeb. Tüm hakları saklıdır.
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-4 w-4 text-green-400" />
                                <span className="text-sm text-gray-400">SSL Güvenli</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-400">18+ Yaş Sınırı</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}