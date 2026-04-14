<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Absensi Digital</title>

<style>
body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.container {
  background: #fff;
  padding: 25px;
  border-radius: 15px;
  width: 350px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  text-align: center;
}

h2 {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
  font-size: 14px;
}

video {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #4facfe;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #007bff;
}

.status {
  margin-top: 10px;
  font-size: 13px;
  color: #555;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>

</head>
<body>

<div class="container">
  <h2>📍 Absensi Digital</h2>

  <input type="text" id="nama" placeholder="Masukkan Nama">

  <video id="video" autoplay></video>
  <canvas id="canvas" width="300" height="200" style="display:none;"></canvas>

  <button onclick="absen()">📸 Absen Sekarang</button>

  <div id="status" class="status"></div>
</div>

<script>
const video = document.getElementById("video");
const statusText = document.getElementById("status");

// Kamera
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  video.srcObject = stream;
})
.catch(() => {
  statusText.innerHTML = "❌ Kamera tidak diizinkan";
  statusText.className = "status error";
});

// Fungsi Absen
function absen() {
  const nama = document.getElementById("nama").value;

  if (!nama) {
    statusText.innerHTML = "⚠️ Nama wajib diisi";
    statusText.className = "status error";
    return;
  }

  statusText.innerHTML = "⏳ Mengambil lokasi...";
  statusText.className = "status";

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, 300, 200);
    const foto = canvas.toDataURL("image/png");

    statusText.innerHTML = "📤 Mengirim data...";

    fetch("URL_WEB_APP_KAMU", {
      method: "POST",
      body: JSON.stringify({
        nama: nama,
        lat: lat,
        lng: lng,
        foto: foto
      })
    })
    .then(res => res.json())
    .then(() => {
      statusText.innerHTML = "✅ Absensi berhasil!";
      statusText.className = "status success";
    })
    .catch(() => {
      statusText.innerHTML = "❌ Gagal kirim data";
      statusText.className = "status error";
    });

  }, () => {
    statusText.innerHTML = "❌ Lokasi tidak diizinkan";
    statusText.className = "status error";
  });
}
</script>

</body>
</html>