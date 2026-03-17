# Oğuzhan Cantekin - Kişisel Portfolyo & Mini Oyun Projesi 🚀

Merhabalar! Bu depo (repository), hem yeteneklerimi, iş deneyimlerimi ve projelerimi sergilediğim kişisel bir portfolyo web sitesini, hem de kendi yazdığım API üzerinden beslenen **dinamik bir Türkçe isim tahmin oyununu** (Wordle konseptinde) barındırmaktadır.

🌐 **Canlı Siteyi İncele / Oyunu Oyna:** [https://oguzhancantekin.github.io/](https://oguzhancantekin.github.io/)

---

## 🎨 Tasarım ve Arayüz (UI/UX)
Proje, kullanıcıyı yormayan ve aynı zamanda modern teknolojileri barındıran **"Premium Dark Theme" (Gece Modu)** ve **Glassmorphism (Cam Efekti)** tasarım pratikleri kullanılarak sıfırdan oluşturulmuştur.
* Modern web güvenli tipografiler (`Outfit` fontu).
* Akıcı durum geçişleri (CSS Animations) ve hover efektleri.
* Tamamen duyarlı (Responsive), hem mobil cihazlara hem de geniş ekranlara uyumlu yapı.

## 💻 Kullanılan Teknolojiler
* **Frontend:** HTML5, CSS3 (Vanilla, Özel Değişken Mimarisi), JavaScript (ES6+)
* **Backend Modülü (Oyun için):** Ayrı bir repository olan [kelime-api](https://github.com/oguzhancantekin/kelime-api) üzerinde Node.js ve Express.js ile geliştirilmiştir. (Render üzerinden asenkron yayınlanmaktadır).
* **Versiyon Kontrol & Deployment:** Git, GitHub Pages 

---

## 🎮 İsim Tahmin Oyunu Nasıl Çalışır?
1. Siteye girdiğiniz anda "Oyun" sekmesi sizi karşılar. Ana bileşen `script.js` dosyasıdır.
2. Arka planda Node.js tabanlı REST API sunucuma `fetch` isteği atılarak oyun zorluğuna (harf sayısına) göre rastgele ve kelime haznesinde bulunan gerçek Türkçe isimler çekilir.
3. Wordle mekaniklerinde olduğu gibi:
   - 🟩 **Yeşil (Correct):** Harf kelimede var ve yeri doğru.
   - 🟨 **Sarı (Present):** Harf kelimede var ancak yeri yanlış.
   - ⬛ **Gece Mavisi (Absent):** Harf kelimede bulunmuyor.
4. Toplam 5 tahmin hakkı sunulur ve zorluk ayarı (3 harften 7 harfe kadar) seçilebilir.

---

## 📞 İletişim

**Oğuzhan Cantekin**  
*Bilgisayar Mühendisliği Öğrencisi & Yazılım Geliştirici*
- 🌐 **LinkedIn:** [linkedin.com/in/oguzhancantekin](https://www.linkedin.com/in/oguzhancantekin/)
- 💻 **E-posta:** [oguzhancantekin24@gmail.com](mailto:oguzhancantekin24@gmail.com)

Projeyi incelediğiniz için teşekkür ederim! ✨
