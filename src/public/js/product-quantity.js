document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity-step]");
  if (!button) return;

  const input = button
    .closest(".product-detail__stepper")
    ?.querySelector('input[name="quantity"]');
  if (!input) return;

  const min = Number(input.min) || 1;
  const max = input.max ? Number(input.max) : Number.POSITIVE_INFINITY;
  const current = Number(input.value) || min;
  const step = Number(input.step) || 1;
  input.value = String(Math.min(max, Math.max(min, current + Number(button.dataset.quantityStep) * step)));
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
