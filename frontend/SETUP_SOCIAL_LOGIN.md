# Social Login Kurulum Kılavuzu

Bu proje **Google** ve **Facebook** ile gerçek giriş yapma özelliğini destekler. Şu anda uygulama "Demo Modu"ndadır çünkü gerekli API anahtarları eksiktir.

Gerçek giriş özelliklerini aktif etmek için aşağıdaki adımları takip ederek API anahtarlarınızı alın ve projenize ekleyin.

---

## 1. Google ile Giriş Yap (Google Login)

### Adım 1: Google Cloud Console'da Proje Oluşturun
1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin.
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin.

### Adım 2: OAuth Consent Screen (Onay Ekranı) Ayarlayın
1. Sol menüden **APIs & Services > OAuth consent screen**'e gidin.
2. **External** seçeneğini seçin ve oluşturun.
3. Uygulama adı (Örn: MyShop), kullanıcı destek e-postası ve geliştirici iletişim bilgilerini doldurun.
4. **Scopes** kısmında `userinfo.email` ve `userinfo.profile` yetkilerini ekleyin.
5. **Test users** kısmına kendi gmail adresinizi ekleyin (Test aşaması için).

### Adım 3: İstemci Kimliği (Client ID) Alın
1. Sol menüden **Credentials**'a gidin.
2. **+ CREATE CREDENTIALS** butonuna tıklayın ve **OAuth client ID** seçin.
3. Application type olarak **Web application** seçin.
4. **Authorized JavaScript origins** kısmına şunları ekleyin:
   - `http://localhost:5173`
   - `http://localhost:5001`
5. **Create** butonuna basın.
6. Size verilen **Client ID** değerini kopyalayın.

### Adım 4: Projeye Ekleyin
1. Projenizin `frontend` klasöründeki `.env` dosyasını açın.
2. Aşağıdaki satırı ekleyin (kendi ID'nizi yapıştırın):
   ```env
   VITE_GOOGLE_CLIENT_ID=buraya_kopyaladiginiz_client_id_gelecek.apps.googleusercontent.com
   ```

---

## 2. Facebook ile Giriş Yap (Facebook Login)

### Adım 1: Meta for Developers'da Uygulama Oluşturun
1. [Meta for Developers](https://developers.facebook.com/) adresine gidin.
2. **My Apps** > **Create App** butonuna tıklayın.
3. Uygulama türü olarak **Consumer** veya **None** seçin.
4. Uygulama adı ve iletişim e-postasını girin.

### Adım 2: Facebook Login Ürününü Ekleyin
1. Uygulama panelinde **Products** kısmından **Facebook Login**'i bulun ve **Set Up** diyerek ekleyin.
2. **Web** seçeneğini seçin.
3. Site URL olarak `http://localhost:5173/` girin.

### Adım 3: Ayarları Yapın
1. Sol menüden **Facebook Login > Settings**'e gidin.
2. **Valid OAuth Redirect URIs** kısmına `http://localhost:5173/` ekleyin.

### Adım 4: App ID'yi Alın ve Projeye Ekleyin
1. Sol üst köşedeki **App ID** değerini kopyalayın.
2. Projenizin `frontend` klasöründeki `.env` dosyasını açın.
3. Aşağıdaki satırı ekleyin:
   ```env
   VITE_FACEBOOK_APP_ID=buraya_kopyaladiginiz_app_id_gelecek
   ```

---

## 3. Son Adım: Uygulamayı Yeniden Başlatın

`.env` dosyasını kaydettikten sonra terminalde çalışan frontend uygulamasını durdurun ve yeniden başlatın:

```bash
# Frontend terminalinde
CTRL + C
npm run dev
```

Artık giriş sayfasındaki Google ve Facebook butonları **Gerçek Modda** çalışacaktır!
Demo moduna geri dönmek isterseniz, `.env` dosyasındaki ilgili satırları silebilirsiniz.
