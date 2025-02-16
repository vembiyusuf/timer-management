if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(reg => console.log("Service Worker terdaftar!", reg))
        .catch(err => console.log("Service Worker gagal!", err));
}

if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
        if (permission !== "granted") {
            alert("Izinkan notifikasi agar pengingat bisa muncul!");
        }
    });
}

// Menerima pesan dari Service Worker dan menjalankan suara
navigator.serviceWorker.addEventListener("message", function (event) {
    if (event.data && event.data.action === "speak") {
        speak(event.data.message);
    }
});

function notifyUser() {
    if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification("Pengingat Tugas", {
                body: "Waktu tugas telah habis!",
                icon: "icon.png",
                vibrate: [200, 100, 200],
            });
        });
    }
}

function updateTimer() {
    if (countdownTime <= 0) {
        clearInterval(timerInterval);
        document.getElementById("timer").classList.add("hidden");
        speak("Waktu tugas telah habis!");
        notifyUser(); // Kirim notifikasi

        // Kirim event ke Service Worker agar bisa tetap memunculkan suara
        navigator.serviceWorker.controller?.postMessage({ action: "speak", message: "Waktu tugas telah habis!" });

        return;
    }
    countdownTime--;
    updateTimerDisplay();
}

function speak(text) {
    let speech = new SpeechSynthesisUtterance();
    speech.lang = "id-ID";
    speech.text = text;
    speech.volume = 1.0;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}
