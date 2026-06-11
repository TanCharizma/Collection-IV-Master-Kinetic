/**
 * CLIENT CONFIGURATION
 * Update this object for each new client. Variables here automatically 
 * populate the navigation, footer, and booking page links.
 */
window.CLIENT_CONFIG = {
    // 1. Basic Info
    name: "CLIENT NAME",
    email: "contact@client.com",
    
    // 2. Roles / Taglines
    taglineEn: "Model · Creative Director",
    taglineTh: "นางแบบ · ครีเอทีฟไดเรกเตอร์",
    splashCaption: "Kinetic Portfolio",

    // 3. Measurements
    measurements: {
        height: "179",
        bust: "84",
        waist: "61",
        hips: "90",
        shoes: "40",
        hairEn: "Blonde",
        hairTh: "บลอนด์",
        eyesEn: "Blue",
        eyesTh: "สีฟ้า"
    },

    // 4. Comp Card
    compCardUrl: "", // Example: "image/Folio-Lab-Compcard Kinetic.webp" (leave blank "" to hide button)
    compCardDownloadUrl: "", // Example: "image/Folio-Lab-Compcard Kinetic.png"

    // 5. Image Modal Captions
    // Set showImageCaptions to false to hide captions and the caption toggle everywhere.
    // Delete or leave a specific image entry blank if that image should not show captions.
    showImageCaptions: true,
    imageCaptions: {
        "image/highlights/01.webp": {
            kicker: "Highlights / 01",
            en: "A sharp editorial frame built around movement, attitude, and controlled impact.",
            th: "ภาพแฟชั่นเอดิทอเรียลที่เน้นการเคลื่อนไหว ท่าที และพลังที่คุมไว้อย่างตั้งใจ."
        },
        "image/highlights/IMG_1733.webp": {
            kicker: "Highlights / 02",
            en: "Graphic presence with a high-energy, modern portfolio rhythm.",
            th: "พลังภาพที่ชัดเจน พร้อมจังหวะพอร์ตโฟลิโอที่ทันสมัยและมีชีวิต."
        },
        "image/highlights/IMG_0470.WEBP": {
            kicker: "Highlights / 03",
            en: "A kinetic portrait study with clean direction and confident pacing.",
            th: "พอร์ตเทรตเชิงเคลื่อนไหวที่มีทิศทางชัดและจังหวะมั่นใจ."
        },
        "image/highlights/04.webp": {
            kicker: "Highlights / 04",
            en: "Editorial clarity with a bold, energetic visual signature.",
            th: "ความคมชัดแบบเอดิทอเรียล พร้อมเอกลักษณ์ภาพที่ชัดและมีพลัง."
        },
        "image/portfolio/01.webp": {
            kicker: "Portfolio / 01",
            en: "Client image caption placeholder. Replace this with wardrobe, campaign, photographer, or location details.",
            th: "ตัวอย่างคำบรรยายภาพ ลูกค้าสามารถใส่รายละเอียดชุด แคมเปญ ช่างภาพ หรือสถานที่ได้ที่นี่."
        },
        "image/portfolio/02.webp": {
            kicker: "Portfolio / 02",
            en: "Client image caption placeholder. Keep it short, editorial, and useful.",
            th: "ตัวอย่างคำบรรยายภาพ ควรเขียนให้สั้น มีสไตล์ และช่วยเล่าเรื่องภาพ."
        },
        "image/portfolio/03.webp": {
            kicker: "Portfolio / 03",
            en: "Client image caption placeholder for campaign notes or image context.",
            th: "ตัวอย่างคำบรรยายภาพสำหรับรายละเอียดแคมเปญหรือบริบทของภาพ."
        },
        "image/portfolio/04.webp": {
            kicker: "Portfolio / 04",
            en: "Client image caption placeholder for credits, styling, or concept notes.",
            th: "ตัวอย่างคำบรรยายภาพสำหรับเครดิต สไตลิ่ง หรือคอนเซปต์ของภาพ."
        }
    },

    // 6. Links
    instagram: "https://instagram.com/yourclient",
    line: "https://line.me/",
    whatsapp: "https://wa.me/1234567890"
};
