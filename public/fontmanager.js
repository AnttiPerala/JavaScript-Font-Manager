

const isAppPackaged = window.electron.isAppPackaged;


async function fetchFonts() {
    try {
        const response = await fetch('/fonts');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function loadFonts() {
    const fontSelector = document.getElementById('fontSelector');
    const previewText = document.getElementById('previewText');

    fetchFonts().then(fonts => {
        if (!fonts) return;

        fonts.forEach(font => {
            const fontName = font.split('.')[0]; // Assuming font file name is the font name
            const option = new Option(fontName, fontName);
            fontSelector.add(option);

            const styleSheet = document.styleSheets[0];
            const fontFace = `@font-face {
            font-family: "${fontName}";
            src: url("${isAppPackaged ? './public/fonts' : '/public/fonts'}/${font}");
            }`;
            styleSheet.insertRule(fontFace, styleSheet.cssRules.length);
        });

        fontSelector.addEventListener('change', () => {
            previewText.style.fontFamily = fontSelector.value;
        });
    });
}

loadFonts();
