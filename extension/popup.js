const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const useSelectionBtn = document.getElementById("useSelection");
const rewriteBtn = document.getElementById("rewrite");
const endpointInput = document.getElementById("endpoint");
const saveEndpointBtn = document.getElementById("saveEndpoint");
const copyBtn = document.getElementById("copyOutput");

// Prefill from context-menu path if available
chrome.storage.local
  .get(["lastSelection", "apiEndpoint"])
  .then(({ lastSelection, apiEndpoint }) => {
    if (lastSelection) {
      inputEl.value = lastSelection;
      chrome.storage.local.remove(["lastSelection"]);
    }
    if (apiEndpoint) {
      endpointInput.value = apiEndpoint;
    } else {
      endpointInput.value = "https://api.sentient-rewrite.xyz/rewrite";
    }
    toggleRewrite();
  });

// Save endpoint
saveEndpointBtn.addEventListener("click", async () => {
  const url = endpointInput.value.trim();
  if (!url)
    return alert(
      "Enter your proxy URL if you don't have domain (e.g., http://91.98.16.122:8787/rewrite)"
    );
  await chrome.storage.local.set({ apiEndpoint: url });
  alert("Endpoint saved.");
  toggleRewrite();
});

// Enable/disable rewrite button
function toggleRewrite() {
  rewriteBtn.disabled = !(inputEl.value.trim() && endpointInput.value.trim());
}
inputEl.addEventListener("input", toggleRewrite);
endpointInput.addEventListener("input", toggleRewrite);

// Pull current selection (when popup is open) via scripting API
useSelectionBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  const [{ result: selected = "" } = {}] = await chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() || "",
    }
  );

  if (selected) inputEl.value = selected;
  toggleRewrite();
});

// Call your proxy
rewriteBtn.addEventListener("click", async () => {
  outputEl.value = "";
  rewriteBtn.disabled = true;
  const original = rewriteBtn.textContent;
  rewriteBtn.textContent = "Rewriting…";

  const text = inputEl.value.trim();
  const tone = "clear, concise, direct";
  const { apiEndpoint } = await chrome.storage.local.get("apiEndpoint");

  const url = (apiEndpoint || endpointInput.value || "").trim();
  if (!url) {
    rewriteBtn.textContent = original;
    rewriteBtn.disabled = false;
    return alert("Set your proxy URL first.");
  }

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, tone }),
    });

    const data = await r.json();
    if (!r.ok) throw new Error(data?.error || r.statusText);
    outputEl.value = data.rewritten || "(empty response)";
  } catch (e) {
    outputEl.value = `Error: ${e.message}`;
  } finally {
    rewriteBtn.textContent = original;
    rewriteBtn.disabled = false;
  }
});

// Copy output
copyBtn.addEventListener("click", async () => {
  const val = outputEl.value.trim();
  if (!val) return;
  try {
    await navigator.clipboard.writeText(val);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 900);
  } catch {
    // fallback if clipboard blocked
    outputEl.select();
    document.execCommand("copy");
  }
});
