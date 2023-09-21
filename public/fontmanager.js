const isAppPackaged = window.electron.isAppPackaged;
let basePath;

if (isAppPackaged) {
    // Production path
    basePath = __dirname; // Use Electron's __dirname for production
} else {
    // Development path
    basePath = '.'; // Relative path from the HTML file in development
}


async function loadFonts() {
    const fontSelector = document.getElementById('fontSelector');
    const previewText = document.getElementById('previewText');

    try {
        const fonts = await window.electron.getFonts(); // Use the correct object and await the result
        if (!fonts || fonts.length === 0) return;

        fonts.forEach(font => {
            const fontName = font.split('.')[0]; // Assuming font file name is the font name
            const option = new Option(fontName, fontName);
            fontSelector.add(option);

            const styleSheet = document.styleSheets[0];
            const fontFace = `@font-face {
                font-family: "${fontName}";
                src: url("${basePath}/fonts/${font}");
            }`;
            
            console.log(`Font Path:  ${basePath}/fonts/${font}`);

            styleSheet.insertRule(fontFace, styleSheet.cssRules.length);
        });

        fontSelector.addEventListener('change', () => {
            previewText.style.fontFamily = fontSelector.value;
        });
    } catch (error) {
        console.error('There has been a problem with your getFonts operation:', error);
    }
}

loadFonts();
