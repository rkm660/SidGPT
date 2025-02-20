const CSV_URL = "https://raw.githubusercontent.com/rkm660/SidGPT/refs/heads/main/test.csv"

chrome.alarms.create("fetchCSV", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "fetchCSV") {
        console.log("Fetching CSV...");
        await fetchAndProcessCSV();
    }
});

async function fetchAndProcessCSV() {
    try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        const urls = parseCSV(csvText);
        const processedLinks = (await chrome.storage.local.get("processedLinks"))?.processedLinks || [];

        for (let url of urls) {
            if (!processedLinks.includes(url)) {
                console.log(`Processing: ${url}`);

                chrome.tabs.create({ url: url, active: false }, (tab) => {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ["content.js"]
                    });

                    processedLinks.push(url);
                    chrome.storage.local.set({ processedLinks });
                });

                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    } catch (error) {
        console.error("Error fetching or processing CSV:", error);
    }
}

function parseCSV(csvText) {
    let lines = csvText.split("\n");
    let headers = lines[0].split(",");
    let urlIndex = headers.indexOf("url");

    if (urlIndex === -1) {
        console.error("CSV does not contain 'url' column.");
        return [];
    }

    return lines.slice(1)
        .map(line => line.split(",")[urlIndex]?.trim())
        .filter(url => url && url !== "null"); // Ignore empty and "null" values
}