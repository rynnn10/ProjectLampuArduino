// Contoh: Jika Anda menggunakan IP Publik atau DDNS
const endPoint = "http://your-public-ip:80";  // atau menggunakan DDNS

let allLampsOn = false;  // Status apakah semua lampu sedang dinyalakan atau tidak

// Fungsi untuk mengecek apakah semua lampu sudah mati
function checkAllLampsOff() {
    return Promise.all([
        fetch(endPoint + "/dapurState").then(response => response.text()),
        fetch(endPoint + "/tamuState").then(response => response.text()),
        fetch(endPoint + "/makanState").then(response => response.text())
    ]).then(([dapurStatus, tamuStatus, makanStatus]) => {
        // Periksa apakah semua status lampu "OFF"
        return (dapurStatus === "OFF" && tamuStatus === "OFF" && makanStatus === "OFF");
    });
}

// Fungsi untuk mengubah status lampu dapur
function setDapurLed() {
    fetch(endPoint + "/dapur", { method: "GET" })
    .then(response => response.text())
    .then(result => {
        console.log(result);

        // Ubah status berdasarkan kondisi ON/OFF lampu
        if (result === "ON") {
            ledDapur.style.backgroundColor = "red";
            dapurLedImage.src = "./Asset/led-on.png";
            ledDapur.textContent = "MATIKAN";
        } else {
            ledDapur.style.backgroundColor = "#579fff";
            dapurLedImage.src = "./Asset/led-off.png";
            ledDapur.textContent = "NYALAKAN";
        }

        // Setelah mengubah status lampu dapur, periksa apakah semua lampu mati
        checkAllLampsOff().then(allOff => {
            const controlAllButton = document.getElementById("controlAllButton");
            if (allOff) {
                controlAllButton.innerText = "NYALAKAN SEMUA LAMPU";
                allLampsOn = false;
            } else {
                controlAllButton.innerText = "MATIKAN SEMUA LAMPU";
                allLampsOn = true;
            }
        });
    });
}

// Fungsi untuk mengubah status lampu tamu
function setTamuLed() {
    fetch(endPoint + "/tamu", { method: "GET" })
    .then(response => response.text())
    .then(result => {
        console.log(result);

        if (result === "ON") {
            ledTamu.style.backgroundColor = "red";
            tamuLedImage.src = "./Asset/led-on.png";
            ledTamu.textContent = "MATIKAN";
        } else {
            ledTamu.style.backgroundColor = "#579fff";
            tamuLedImage.src = "./Asset/led-off.png";
            ledTamu.textContent = "NYALAKAN";
        }

        // Setelah mengubah status lampu tamu, periksa apakah semua lampu mati
        checkAllLampsOff().then(allOff => {
            const controlAllButton = document.getElementById("controlAllButton");
            if (allOff) {
                controlAllButton.innerText = "NYALAKAN SEMUA LAMPU";
                allLampsOn = false;
            } else {
                controlAllButton.innerText = "MATIKAN SEMUA LAMPU";
                allLampsOn = true;
            }
        });
    });
}

// Fungsi untuk mengubah status lampu makan
function setMakanLed() {
    fetch(endPoint + "/makan", { method: "GET" })
    .then(response => response.text())
    .then(result => {
        console.log(result);

        if (result === "ON") {
            ledMakan.style.backgroundColor = "red";
            makanLedImage.src = "./Asset/led-on.png";
            ledMakan.textContent = "MATIKAN";
        } else {
            ledMakan.style.backgroundColor = "#579fff";
            makanLedImage.src = "./Asset/led-off.png";
            ledMakan.textContent = "NYALAKAN";
        }

        // Setelah mengubah status lampu makan, periksa apakah semua lampu mati
        checkAllLampsOff().then(allOff => {
            const controlAllButton = document.getElementById("controlAllButton");
            if (allOff) {
                controlAllButton.innerText = "NYALAKAN SEMUA LAMPU";
                allLampsOn = false;
            } else {
                controlAllButton.innerText = "MATIKAN SEMUA LAMPU";
                allLampsOn = true;
            }
        });
    });
}

// Fungsi untuk mengubah status semua lampu sekaligus
function toggleAllLamps() {
    allLampsOn = !allLampsOn;  // Berubah state untuk semua lampu
    
    const newState = allLampsOn ? "ON" : "OFF";  // Tentukan state baru
    
    // Set semua lampu
    fetch(endPoint + "/all", {
        method: "POST",  // Menggunakan POST untuk mengirim state baru ke ESP8266
        body: JSON.stringify({ state: newState }),  // Kirim state baru dalam JSON
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Gagal menghubungi server');
        }
        return response.text();
    })
    .then(result => {
        console.log(result);

        // Ubah tampilan setiap lampu
        dapurLedImage.src = newState === "ON" ? "./Asset/led-on.png" : "./Asset/led-off.png";
        tamuLedImage.src = newState === "ON" ? "./Asset/led-on.png" : "./Asset/led-off.png";
        makanLedImage.src = newState === "ON" ? "./Asset/led-on.png" : "./Asset/led-off.png";
        
        ledDapur.style.backgroundColor = newState === "ON" ? "red" : "#579fff";
        ledTamu.style.backgroundColor = newState === "ON" ? "red" : "#579fff";
        ledMakan.style.backgroundColor = newState === "ON" ? "red" : "#579fff";

        ledDapur.textContent = newState === "ON" ? "MATIKAN" : "NYALAKAN";
        ledTamu.textContent = newState === "ON" ? "MATIKAN" : "NYALAKAN";
        ledMakan.textContent = newState === "ON" ? "MATIKAN" : "NYALAKAN";

        // Ubah teks tombol kontrol semua
        const controlAllButton = document.getElementById("controlAllButton");
        controlAllButton.innerText = allLampsOn ? "MATIKAN SEMUA LAMPU" : "NYALAKAN SEMUA LAMPU";
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
