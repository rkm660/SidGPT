document.addEventListener("DOMContentLoaded", async () => {
    let textarea = document.getElementById("commentText");
    let saveButton = document.getElementById("saveText");

    let storedData = await chrome.storage.local.get("commentText");
    if (storedData.commentText) {
        textarea.value = storedData.commentText;
    }

    saveButton.addEventListener("click", () => {
        let commentText = textarea.value.trim();
        chrome.storage.local.set({ commentText });
        alert("Comment saved!");
    });
});