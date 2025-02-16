self.addEventListener("push", function (event) {
    const options = {
        body: "Waktu tugas telah habis!",
        icon: "icon.png", // Ganti dengan ikon notifikasi
        vibrate: [200, 100, 200],
    };
    event.waitUntil(self.registration.showNotification("Pengingat Tugas", options));

    // Kirim pesan ke script utama agar bisa menjalankan suara
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({ action: "speak", message: "Waktu tugas telah habis!" });
        });
    });
});
