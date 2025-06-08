# 🎰 PragmaticSpinner

Pragmatic oyunları için geliştirilmiş otomatik spin test aracı. Oyun içi API isteklerini yöneterek otomatik veya manuel olarak spin atma, free spin satın alma ve yanıt analizi özellikleri sunar.

## 🚀 Özellikler
- Gerçek oturum üzerinden MGC Key ile bağlantı
- Otomatik spin döngüsü (Auto Spin)
- Free spin satın alma (Buy Feature)
- Kazanç ve spin istatistiklerini analiz etme
- API yanıtı parsing ve hata kontrolü
- Kullanıcı dostu Next.js tabanlı arayüz

## 🛠️ Kurulum
1. Depoyu klonlayın:
git clone https://github.com/satoshiMakat/PragmaticSpinner.git
cd PragmaticSpinner

2. Bağımlılıkları yükleyin:
npm install

3. Uygulamayı başlatın:
npm run dev

Tarayıcıdan http://localhost:3000 adresine giderek uygulamayı kullanabilirsiniz.

## 🧩 Teknolojiler
- Next.js – React tabanlı framework
- TypeScript – Tip güvenli geliştirme
- Tailwind CSS – Modern ve sade stil
- API Middleware – Sunucu üzerinden proxy istekler

## 🔑 MGC Key Nasıl Alınır?
Bu araç gerçek bir oyun oturumu üzerinde test yapar. Bu nedenle, Pragmatic altyapısındaki oyunlardan alınan MGC Key (session key) bilgisine ihtiyaç vardır.

1. Herhangi bir demo Pragmatic oyununu açın.
2. Oyunda 1 spin atın ve bitmesini bekleyin.
3. Sağ tıklayıp tarayıcıdan Geliştirici Araçları (DevTools) panelini açın.
4. Ağ (Network) sekmesinde "gameservice" adlı POST isteğini bulun.
5. İsteğin Payload kısmında şu benzeri verileri göreceksiniz:

index: 2  
counter: 3  
repeat: 0  
mgckey: stylename@ext_bettilt~SESSION@ff7e39a3-51fa-4a74-837f-cdc5961d4633  

Kullanmanız gerekenler:
- mgckey: Olduğu gibi kopyalayıp uygulamaya yapıştırın.
- index +1 → (örnek: 2 → 3 girilmeli)
- counter +2 → (örnek: 3 → 5 girilmeli)

Bu ayarlardan sonra manuel veya otomatik spin atmaya hazırsınız.

Bu değerler sunucu tarafında geçerli olması için önemlidir. Aksi takdirde "invalid action" hatası alınır.

## ⚙️ Kullanım
1. Gerekli spin parametrelerini arayüzden girin.
2. "Spin" butonuyla manuel test yapın.
3. "Auto Spin" panelinden spin sayısını belirleyip otomatik test başlatın.
4. İstatistikler, kazançlar ve API yanıtı anlık olarak görüntülenir.
5. Free spin destekleyen oyunlarda “Buy Feature” özelliğini aktif ederek test yapılabilir.

## 📂 Örnek Klasör Yapısı
src/components/           → Arayüz bileşenleri  
src/hooks/                → React özel hook'lar  
src/pages/                → Next.js sayfaları  
public/                   → Statik dosyalar  
next.config.ts            → Next.js yapılandırması  
package.json              → Proje bağımlılıkları

## ⚡ Neden Bu Aracı Kullanmalısınız?
- 10.000+ spin’i dakikalar içinde atarak oyun davranışlarını analiz edebilirsiniz.
- Free spin senaryolarını test edebilir, hata ve edge-case durumlarını görebilirsiniz.
- Spin başına kazanç, toplam kazanç, tumble/collect gibi değerleri çıkarıp analiz edebilirsiniz.

## ⚠️ Uyarı
Unutmayın: Bu araç yalnızca teknik testler ve yazılım geliştirme süreçleri için tasarlanmıştır.  
Kumar her zaman kaybettirir. Lütfen sorumlu şekilde kullanın.

## 🛡️ Lisans
MIT Lisansı – Dilediğiniz gibi kullanabilir, geliştirebilir ve dağıtabilirsiniz.

## 📬 Katkıda Bulunmak
Pull request’ler ve issue’lar her zaman açıktır. Yeni fikir veya düzeltme varsa memnuniyetle karşılanır.
