// Récupération des éléments HTML nécessaires
const btn = document.getElementById("generate-btn"); // Le bouton "QR code"
const input = document.querySelector(".div-input input"); // Champ de saisie URL
const div1 = document.querySelector(".div1"); // Section initiale (logo + input)
const div2 = document.querySelector(".div2"); // Section contenant le QR code et les boutons
const qrCodeContainer = document.querySelector(".div-qr-code"); // Conteneur du QR code généré

// Événement : clic sur le bouton QR code
btn.addEventListener("click", () => {
    const url = input.value.trim(); // Récupère et nettoie l'URL saisie

    // Vérification : champ vide
    if (url === "") {
        alert("Veuillez entrer une URL.");
        return; // Stoppe la fonction
    }

    // Création de l'image du QR code avec l'API
    const qrImage = document.createElement("img");
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=240x240`;
    qrImage.alt = "QR Code";

    // Nettoyer tout ancien QR code déjà présent
    qrCodeContainer.innerHTML = "";
    qrCodeContainer.appendChild(qrImage); // Affiche le nouveau QR code

    // Affiche la div2 (QR code + boutons) et masque div1
    div1.style.display = "none";
    div2.style.display = "flex";
});


const downloadBtn = document.getElementById("download-btn"); // Bouton Download
const shareBtn = document.getElementById("share-btn"); // Bouton Share

// Événement : clic sur bouton "Download"
downloadBtn.addEventListener("click", () => {
    const qrImg = document.querySelector(".div-qr-code img");
    if (!qrImg) return alert("QR code non trouvé."); // Vérifie que le QR existe

    // Crée un lien <a> invisible pour forcer le téléchargement
    const link = document.createElement("a");
    link.href = qrImg.src; // Lien vers l'image du QR
    link.download = "qrcode.png"; // Nom du fichier téléchargé
    document.body.appendChild(link); // Ajoute le lien au DOM
    link.click(); // Simule un clic pour télécharger
    document.body.removeChild(link); // Supprime le lien après
});


// Événement : clic sur bouton "Share"
shareBtn.addEventListener("click", async () => {
    const qrImg = document.querySelector(".div-qr-code img");
    if (!qrImg) return alert("QR code non trouvé."); // Vérifie que le QR existe

    try {
        // Télécharge l'image du QR code sous forme de blob
        const response = await fetch(qrImg.src);
        const blob = await response.blob();

        // Crée un fichier à partager
        const file = new File([blob], "qrcode.png", { type: "image/png" });

        // Vérifie si le navigateur peut partager des fichiers
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            // Utilise l'API Web Share (mobile / moderne)
            await navigator.share({
                title: "QR Code",
                files: [file],
            });
        } else {
            // Alternative : copie l'URL du QR code dans le presse-papiers
            await navigator.clipboard.writeText(qrImg.src);
            alert("Lien du QR code copié dans le presse-papiers !");
        }
    } catch (err) {
        alert("Partage impossible : " + err.message); // En cas d'erreur réseau ou API
    }
});
