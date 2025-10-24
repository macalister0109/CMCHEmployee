const webp = require("webp-converter");
const fs = require("fs");
const path = require("path");

// 📂 Ajusta esta ruta a tu carpeta real con las imágenes
const inputFolder = path.join(__dirname, "../../assets/img_contactos");

const files = fs.readdirSync(inputFolder);

files.forEach((file) => {
    if (
        file.endsWith(".png") ||
        file.endsWith(".jpg") ||
        file.endsWith(".jpeg")
    ) {
        const inputPath = path.join(inputFolder, file);
        const outputPath = path.join(
            inputFolder,
            file.replace(/\.(png|jpg|jpeg)$/i, ".webp")
        );

        // 👇 Ejecutamos la conversión correctamente
        webp.cwebp(inputPath, outputPath, "-q 90")
            .then(() => console.log(`${file} → convertido a WEBP ✅`))
            .catch((err) => console.error(`❌ Error con ${file}:`, err));
    }
});
