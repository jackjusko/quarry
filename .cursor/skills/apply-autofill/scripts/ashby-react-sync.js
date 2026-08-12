(() => {
  /**
   * Ashby custom textareas: setting .value (or bulk CDP fill) can show text in the DOM
   * while React state stays empty → "Missing entry for required field" on submit.
   * Walk __reactFiber* and call props.onChange so Ashby accepts the value.
   * Eval after browser_type (clear: true) on each essay/text field you filled.
   */
  function reactOnChange(el, value) {
    const key = Object.keys(el).find((k) => k.startsWith("__reactFiber"));
    let fiber = el[key];
    while (fiber) {
      const props = fiber.memoizedProps || fiber.pendingProps;
      if (props && typeof props.onChange === "function") {
        props.onChange({ target: { value, name: el.name } });
        return true;
      }
      fiber = fiber.return;
    }
    return false;
  }
  function reactOnClick(el) {
    const key = Object.keys(el).find((k) => k.startsWith("__reactFiber"));
    let fiber = el[key];
    while (fiber) {
      const props = fiber.memoizedProps || fiber.pendingProps;
      if (props && typeof props.onClick === "function") {
        props.onClick({ preventDefault() {}, stopPropagation() {} });
        return true;
      }
      fiber = fiber.return;
    }
    el.click();
    return false;
  }
  const synced = [];
  for (const el of document.querySelectorAll(
    "textarea, input[type=text], input[type=email], input:not([type])"
  )) {
    if (el.readOnly || el.type === "file" || !el.value?.trim()) continue;
    if (reactOnChange(el, el.value))
      synced.push(["input", el.name || el.id, el.value.length]);
  }
  const yesNo = [];
  let pair = [];
  for (const btn of document.querySelectorAll("button")) {
    const t = btn.textContent.trim();
    if (t === "Yes" || t === "No") {
      pair.push(btn);
      if (pair.length === 2) {
        yesNo.push(pair);
        pair = [];
      }
    }
  }
  const banner = document.body.innerText.includes("Your form needs corrections");
  const missing = document.body.innerText.match(/Missing entry[^\n]*/g) || [];
  const groups = yesNo.map((p) =>
    p.map((b) => ({ t: b.textContent.trim(), active: b.className.includes("_active") }))
  );
  return JSON.stringify({ synced, groups, banner, missing }, null, 2);
})();
