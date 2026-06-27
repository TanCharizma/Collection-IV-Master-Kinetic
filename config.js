/**
 * CLIENT CONFIGURATION
 *
 * Fast client swap:
 * 1. Edit the blocks marked SWAP below.
 * 2. Replace files in /image with the same filenames when possible.
 * 3. Leave optional links or comp-card paths blank ("") to hide unavailable UI.
 * 4. Add image captions only for images that should show modal captions.
 *
 * The template reads window.CLIENT_CONFIG. Keep the exported keys at the bottom
 * unless you are also updating main.js/nav.js/footer.js.
 */
(() => {
    const isUrl = (value) => /^https?:\/\//i.test(String(value || "").trim());
    const cleanHandle = (value) => String(value || "").trim().replace(/^@+/, "");
    const digitsOnly = (value) => String(value || "").replace(/[^\d+]/g, "");

    const instagramLink = (value) => {
        const handle = cleanHandle(value);
        if (!handle) return "";
        return isUrl(handle) ? handle : `https://instagram.com/${handle}`;
    };

    const lineLink = (value) => {
        const input = String(value || "").trim();
        if (!input) return "";
        return isUrl(input) ? input : `https://line.me/ti/p/${input.replace(/^@+/, "")}`;
    };

    const whatsappLink = (value) => {
        const input = String(value || "").trim();
        if (!input) return "";
        return isUrl(input) ? input : `https://wa.me/${digitsOnly(input)}`;
    };

    const path = {
        hero: "image/hero/hero.webp",
        about: "image/about/01.webp",
        compCardWeb: "image/Folio-Lab-Compcard Motion Study.webp",
        compCardDownload: "image/Folio-Lab-Compcard Motion Study.png",
        highlights: [
            "image/highlights/01.webp",
            "image/highlights/IMG_1733.webp",
            "image/highlights/IMG_0470.WEBP",
            "image/highlights/04.webp"
        ],
        portfolio: Array.from({ length: 20 }, (_, index) => {
            const number = String(index + 1).padStart(2, "0");
            return `image/portfolio/${number}.webp`;
        }),
        digitals: [
            "image/digitals/01.webp",
            "image/digitals/02.webp",
            "image/digitals/03.webp",
            "image/digitals/04.webp"
        ]
    };

    // SWAP: client identity, contact, and hero copy.
    const client = {
        name: "CLIENT NAME",
        email: "contact@client.com",
        instagram: "yourclient", // Accepts "yourclient", "@yourclient", or a full URL.
        line: "", // Accepts a LINE id/path or a full URL.
        whatsapp: "1234567890", // Accepts a phone number or a full wa.me URL.
        taglineEn: "Model · Creative Director",
        taglineTh: "นางแบบ · ครีเอทีฟไดเรกเตอร์",
        splashCaption: "Motion Study Portfolio"
    };

    // SWAP: About page copy.
    const about = {
        bioEn: [
            "Client bio opening. Replace this with a concise statement about movement, presence, and visual direction.",
            "Use this second line for selected campaigns, creative roles, availability, or the kind of collaborations the client is seeking.",
            "Keep it direct, energetic, and editorial."
        ],
        bioTh: [
            "ย่อหน้าเปิดประวัติ แทนที่ด้วยคำแนะนำตัวที่กระชับเกี่ยวกับการเคลื่อนไหว ตัวตน และทิศทางภาพ",
            "ใช้ย่อหน้าที่สองสำหรับแคมเปญ บทบาทสร้างสรรค์ ความพร้อมรับงาน หรือรูปแบบงานที่ต้องการร่วมงาน",
            "เขียนให้ตรง มีพลัง และมีโทนแบบเอดิทอเรียล"
        ],
        manifestoEn: "Client manifesto placeholder. Replace with one sharp line that captures their motion, energy, and point of view.",
        manifestoTh: "ตัวอย่างแมนิเฟสโตของลูกค้า แทนที่ด้วยประโยคสั้นคมที่สะท้อนการเคลื่อนไหว พลัง และมุมมองของลูกค้า"
    };

    // SWAP: measurements shown on the homepage.
    const measurements = {
        height: "179",
        bust: "84",
        waist: "61",
        hips: "90",
        shoes: "40",
        hairEn: "Blonde",
        hairTh: "บลอนด์",
        eyesEn: "Blue",
        eyesTh: "สีฟ้า"
    };

    // SWAP: optional comp card.
    const compCard = {
        image: path.compCardWeb,
        download: path.compCardDownload
    };

    // SWAP: modal captions. Remove an entry or set showImageCaptions false to hide it.
    const captions = {
        showImageCaptions: true,
        items: {
            [path.highlights[0]]: {
                kicker: "Highlights / 01",
                en: "A sharp editorial frame built around movement, attitude, and controlled impact.",
                th: "ภาพแฟชั่นเอดิทอเรียลที่เน้นการเคลื่อนไหว ท่าที และพลังที่คุมไว้อย่างตั้งใจ."
            },
            [path.highlights[1]]: {
                kicker: "Highlights / 02",
                en: "Graphic presence with a high-energy, modern portfolio rhythm.",
                th: "พลังภาพที่ชัดเจน พร้อมจังหวะพอร์ตโฟลิโอที่ทันสมัยและมีชีวิต."
            },
            [path.highlights[2]]: {
                kicker: "Highlights / 03",
                en: "A motion-study portrait with clean direction and confident pacing.",
                th: "พอร์ตเทรตเชิงเคลื่อนไหวที่มีทิศทางชัดและจังหวะมั่นใจ."
            },
            [path.highlights[3]]: {
                kicker: "Highlights / 04",
                en: "Editorial clarity with a bold, energetic visual signature.",
                th: "ความคมชัดแบบเอดิทอเรียล พร้อมเอกลักษณ์ภาพที่ชัดและมีพลัง."
            },
            [path.portfolio[0]]: {
                kicker: "Portfolio / 01",
                en: "Client image caption placeholder. Replace this with wardrobe, campaign, photographer, or location details.",
                th: "ตัวอย่างคำบรรยายภาพ ลูกค้าสามารถใส่รายละเอียดชุด แคมเปญ ช่างภาพ หรือสถานที่ได้ที่นี่."
            },
            [path.portfolio[1]]: {
                kicker: "Portfolio / 02",
                en: "Client image caption placeholder. Keep it short, editorial, and useful.",
                th: "ตัวอย่างคำบรรยายภาพ ควรเขียนให้สั้น มีสไตล์ และช่วยเล่าเรื่องภาพ."
            },
            [path.portfolio[2]]: {
                kicker: "Portfolio / 03",
                en: "Client image caption placeholder for campaign notes or image context.",
                th: "ตัวอย่างคำบรรยายภาพสำหรับรายละเอียดแคมเปญหรือบริบทของภาพ."
            },
            [path.portfolio[3]]: {
                kicker: "Portfolio / 04",
                en: "Client image caption placeholder for credits, styling, or concept notes.",
                th: "ตัวอย่างคำบรรยายภาพสำหรับเครดิต สไตลิ่ง หรือคอนเซปต์ของภาพ."
            }
        }
    };

    window.CLIENT_CONFIG = {
        // Existing template keys consumed by main.js/nav.js/footer.js.
        name: client.name,
        email: client.email,
        taglineEn: client.taglineEn,
        taglineTh: client.taglineTh,
        splashCaption: client.splashCaption,
        aboutBioEn: about.bioEn,
        aboutBioTh: about.bioTh,
        manifestoEn: about.manifestoEn,
        manifestoTh: about.manifestoTh,
        measurements,
        compCardUrl: compCard.image,
        compCardDownloadUrl: compCard.download,
        showImageCaptions: captions.showImageCaptions,
        imageCaptions: captions.items,
        instagram: instagramLink(client.instagram),
        line: lineLink(client.line),
        whatsapp: whatsappLink(client.whatsapp),

        // Extra organized data for future template upgrades.
        client,
        about,
        assets: path,
        compCard,
        captions
    };
})();
