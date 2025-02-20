(async function pasteIntoFacebookComment() {
    setTimeout(() => {
        window.alert = function() {};
    }, 100);

    let text = (await chrome.storage.local.get("commentText"))?.commentText || "Default automated comment";

    let commentBox = document.querySelector('div[aria-label^="Answer as"]');

    if (!commentBox) {
        console.log("Comment box not found.");
        return;
    }

    commentBox.focus();

    setTimeout(() => {
        document.execCommand("insertText", false, text);

        let inputEvent = new InputEvent("input", { bubbles: true });
        commentBox.dispatchEvent(inputEvent);

        console.log("Paste command executed.");
    }, 2000);

    setTimeout(() => {
        let enterKeyEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            keyCode: 13,
            code: "Enter",
            which: 13,
            bubbles: true,
        });

        commentBox.dispatchEvent(enterKeyEvent);
        console.log("Enter key event dispatched.");
    }, 4000);
})();