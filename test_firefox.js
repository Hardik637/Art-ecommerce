const { firefox } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await firefox.launch();
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to http://localhost:3000...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Check if Logo Link is in DOM
    const logoLink = await page.$('header a[href="/"]');
    if (!logoLink) {
      console.log("Logo Link not found inside header!");
    } else {
      console.log("Logo link found!");
      
      const box = await logoLink.boundingBox();
      console.log("Logo Link bounding box:", box);

      // Check the text content
      const text = await logoLink.innerText();
      console.log("Logo Link text content:", text);

      // Check computed styles
      const computedStyles = await logoLink.evaluate((el) => {
        const span = el.querySelector('span');
        if (!span) return { error: "No span found inside a" };
        const style = window.getComputedStyle(span);
        return {
          display: style.display,
          width: style.width,
          height: style.height,
          color: style.color,
          visibility: style.visibility,
          opacity: style.opacity,
          fontSize: style.fontSize,
          fontFamily: style.fontFamily
        };
      });
      console.log("Logo span computed styles:", computedStyles);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'firefox_screenshot.png' });
    console.log("Screenshot saved to firefox_screenshot.png");
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
})();
