// Global değişkenler
let targetWord;
let guessesRemaining;
const messageElement = document.getElementById("game-message");
const guessInput = document.getElementById("guess");
const gameDiv = document.getElementById("game");

// Klavye Yerleşimi (Türkçe)
const KEYBOARD_LAYOUT = [
    ["e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i"],
    ["Enter", "z", "c", "v", "b", "n", "m", "ö", "ç", "Bsp"]
];

// Backend API'ından belirli bir uzunlukta kelime getiren fonksiyon
async function fetchNewWord(length) {
    try {
        const response = await fetch(`https://oguzhan-kelime-api.onrender.com/api/get-word?length=${length}`);
        if (!response.ok) {
            throw new Error(`API'dan ${length} harfli kelime alınamadı.`);
        }
        const data = await response.json();
        return data.word;
    } catch (error) {
        console.error("Hata:", error);
        throw error; // Hatayı yakalayıp bir üst fonksiyona fırlatıyoruz
    }
}

// Oyunu başlatan ana fonksiyon
async function initializeGame(length) {
    // 1. Gecikme mesajı için bir zamanlayıcı (timer) ayarlayalım
    let longWaitTimer = setTimeout(() => {
        showMessage("Sunucu uyanıyor olabilir, lütfen biraz bekleyin...", "orange");
    }, 4000); // 4 saniye sonra bu mesajı göster

    // 2. Normal yükleme mesajı
    showMessage("Yeni kelime yükleniyor...", "gray");
    gameDiv.innerHTML = "";
    guessInput.value = "";
    guessInput.disabled = true; // Butonları ve input'u kilitle

    // Klavyeyi sıfırla
    document.querySelectorAll('.key').forEach(btn => {
        btn.classList.remove("absent", "present", "correct");
    });

    try {
        // 3. Kelimeyi çekmeyi dene
        targetWord = await fetchNewWord(length);

        // 4. Başarılı olursa:
        clearTimeout(longWaitTimer); // "Sunucu uyanıyor" zamanlayıcısını iptal et
        guessesRemaining = 5;
        guessInput.maxLength = targetWord.length;
        document.getElementById("word-length").textContent = `Aradığımız isim ${targetWord.length} harfli, Türkçe bir isim`;
        showMessage("", "black"); // Tüm mesajları temizle
        guessInput.disabled = false; // Kilidi aç
        guessInput.focus();

    } catch (error) {
        // 5. Başarısız olursa (30sn bekledikten sonra):
        clearTimeout(longWaitTimer); // Zamanlayıcıyı iptal et
        showMessage("Oyun yüklenemedi. Sunucuya ulaşılamıyor.", 'red');
        document.getElementById("word-length").textContent = `Lütfen sayfayı yenileyip tekrar deneyin.`;
        targetWord = null; // Oyunu kilitli tut
    }
}

// Butonlara tıklandığında oyunu başlatan yeni fonksiyon
function startGameWithDifficulty(length) {
    // Tüm butonlardan 'active' sınıfını kaldır
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    // Tıklanan butona 'active' sınıfını ekle
    event.currentTarget.classList.add('active');
    
    initializeGame(length);
}

// Mesaj gösterme fonksiyonu
function showMessage(text, color = 'black') {
    messageElement.textContent = text;
    // Harcoded renkleri modern değişkenlerla eşleyelim
    const colorMap = {
        'black': 'var(--text-primary)',
        'gray': 'var(--text-secondary)',
        'orange': '#fbbf24',
        'red': '#f87171',
        'green': '#34d399'
    };
    messageElement.style.color = colorMap[color] || color;
}

// Klavyeyi oluşturan fonksiyon
function createKeyboard() {
    const keyboardContainer = document.getElementById("keyboard");
    if (!keyboardContainer) return;
    keyboardContainer.innerHTML = "";

    KEYBOARD_LAYOUT.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "keyboard-row";
        
        row.forEach(key => {
            const btn = document.createElement("button");
            btn.className = "key";
            if (key === "Enter" || key === "Bsp") {
                btn.classList.add("wide");
            }
            btn.textContent = key === "Bsp" ? "⌫" : (key === "Enter" ? "Tahmin Et" : key.toLocaleUpperCase("tr-TR"));
            btn.setAttribute("data-key", key.toLocaleLowerCase("tr-TR"));
            
            btn.addEventListener("click", () => handleKeyPress(key));
            rowDiv.appendChild(btn);
        });
        
        keyboardContainer.appendChild(rowDiv);
    });
}

// Klavye tuşuna basıldığında
function handleKeyPress(key) {
    if (guessInput.disabled) return;
    
    if (key === "Enter") {
        submitGuess();
    } else if (key === "Bsp") {
        guessInput.value = guessInput.value.slice(0, -1);
    } else {
        if (guessInput.value.length < guessInput.maxLength) {
            guessInput.value += key.toLocaleLowerCase("tr-TR");
        }
    }
}

// Klavyedeki harflerin rengini güncelle
function updateKeyboardColor(letter, status) {
    const keyBtn = document.querySelector(`.key[data-key="${letter}"]`);
    if (!keyBtn) return;
    
    // Öncelik: correct > present > absent
    if (keyBtn.classList.contains("correct")) return; // Doğruysa değiştirme
    if (keyBtn.classList.contains("present") && status === "absent") return; // Yerindeyse veya yoksa değiştirme
    
    keyBtn.classList.remove("absent", "present", "correct");
    keyBtn.classList.add(status);
}

// Tahmin gönderme fonksiyonu (değişiklik yok)
function submitGuess() {
    if (!targetWord || guessInput.disabled) return; // Oyun başlamadıysa bir şey yapma

    const currentGuess = guessInput.value.toLocaleLowerCase('tr-TR');
    
    showMessage("");

    if (currentGuess.length !== targetWord.length) {
        showMessage(`Lütfen ${targetWord.length} harfli bir isim girin.`, 'orange');
        return;
    }

    if (guessesRemaining <= 0) {
        showMessage("Tahmin hakkınız kalmadı. Yeni bir oyun başlatın.", 'red');
        return;
    }

    guessesRemaining--;
    const guessDiv = document.createElement("div");
    guessDiv.className = "guess";

    const letterCount = {};
    for (let letter of targetWord) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    const result = [];
    for (let i = 0; i < currentGuess.length; i++) {
        const letter = currentGuess[i];
        const letterDiv = document.createElement("div");
        letterDiv.className = "letter";
        letterDiv.textContent = letter.toLocaleUpperCase("tr-TR");

        if (letter === targetWord[i]) {
            letterDiv.classList.add("correct");
            result.push("correct");
            letterCount[letter]--;
            updateKeyboardColor(letter, "correct");
        } else {
            result.push(null);
        }
        guessDiv.appendChild(letterDiv);
    }

    for (let i = 0; i < currentGuess.length; i++) {
        const letter = currentGuess[i];
        const letterDiv = guessDiv.children[i];

        if (!result[i]) {
            if (targetWord.includes(letter) && letterCount[letter] > 0) {
                letterDiv.classList.add("present");
                letterCount[letter]--;
                updateKeyboardColor(letter, "present");
            } else {
                letterDiv.classList.add("absent");
                updateKeyboardColor(letter, "absent");
            }
        }
    }

    gameDiv.appendChild(guessDiv);

    if (currentGuess === targetWord) {
        showMessage("Tebrikler, doğru tahmin ettiniz!", 'green');
        guessesRemaining = 0;
        guessInput.disabled = true;
    } else if (guessesRemaining === 0) {
        showMessage(`Tahmin hakkınız bitti. Doğru kelime: ${targetWord.toLocaleUpperCase('tr-TR')}`, 'red');
        guessInput.disabled = true;
    }

    guessInput.value = '';
    guessInput.focus();
}

// "Yeni İsim" butonu artık aktif olan zorluk seviyesine göre yeni kelime getirir
function resetGame() {
    const activeButton = document.querySelector('.difficulty-btn.active');
    const length = activeButton ? parseInt(activeButton.innerText.match(/\d+/)[0]) : 5;
    initializeGame(length);
}

// Sayfa ilk yüklendiğinde varsayılan zorlukla (Orta - 5 Harf) oyunu başlat
// ve "Enter" tuşunu dinle
document.addEventListener('DOMContentLoaded', () => {
    createKeyboard();
    initializeGame(5);

    if (guessInput) {
        guessInput.addEventListener('keydown', function(event) {
            // Eğer basılan tuş 'Enter' ise
            if (event.key === 'Enter') {
                event.preventDefault(); // Varsayılan davranışı (örn: form gönderme) engelle
                
                // Eğer input kilitli değilse (oyun devam ediyorsa)
                if (!guessInput.disabled) {
                    submitGuess(); // Normal 'Tahmin Et' butonuna basılmış gibi yap
                }
            }
        });
    } else {
        console.error("Hata: 'guessInput' elementi bulunamadı.");
    }
});