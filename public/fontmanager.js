const isAppPackaged = window.electron.isAppPackaged;

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
                src: url("${isAppPackaged ? './public/fonts' : '/public/fonts'}/${font}");
            }`;
            
            console.log(`Font Path: ${isAppPackaged ? './public/fonts' : '/public/fonts'}/${font}`);

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
