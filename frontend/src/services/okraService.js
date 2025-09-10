// Frontend wrapper for Okra widget (sandbox).
// TODO: Implement server-side token exchange. Never keep secrets in frontend.
export const openOkraWidget = ({ env = "sandbox", publicKey, onSuccess, onExit }) => {
  // In production, Okra widget script should be included and server-side exchange performed.
  // For sandbox dev we mimic widget behaviour.
  try {
    console.log("[okraService] openOkraWidget called", { env, publicKey });
    // If Okra script is included, it usually exposes window.Okra
    if (window.Okra && typeof window.Okra.buildWithOptions === "function") {
      window.Okra.buildWithOptions({
        env,
        key: publicKey,
        token: "",
        onSuccess: data => {
          console.log("[okraService] Okra success", data);
          onSuccess && onSuccess(data);
        },
        onClose: data => {
          console.log("[okraService] Okra closed", data);
          onExit && onExit(data);
        }
      });
      return;
    }
    // Sandbox mock behavior
    setTimeout(() => {
      const fakePayload = { accounts: [{ id: "acc_3", name: "Mock Bank", accountNumber: "111222333", balance: 50000 }] };
      console.log("[okraService] Mocking okra success payload", fakePayload);
      onSuccess && onSuccess(fakePayload);
    }, 500);
  } catch (err) {
    console.error("[okraService] error opening widget", err);
    onExit && onExit(err);
  }
};
