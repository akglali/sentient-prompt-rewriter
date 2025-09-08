chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sentient-rewrite",
    title: "Rewrite with Dobby",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "sentient-rewrite" || !tab?.id) return;

  // Grab selected text from the page
  const [{ result: selected = "" } = {}] = await chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() || "",
    }
  );

  // Save it so the popup can prefill
  await chrome.storage.local.set({ lastSelection: selected });

  // Try to open the popup (works when triggered by a user gesture)
  if (chrome.action.openPopup) {
    try {
      await chrome.action.openPopup();
    } catch {
      /* fallback below */
    }
  }
});
