// Mono service - mocked for frontend dev.
// TODO: Replace with real Mono integration (server-side) and secure key handling.
export async function monoLink() {
  console.log("[monoService] monoLink called (mock)");
  // mimic redirect/flow and return mock accounts
  return new Promise((res) => setTimeout(() => res({ accounts: [{ id: "mono_acc_1", name: "Mono Bank Mock", accountNumber: "222333444", balance: 100000 }] }), 400));
}
