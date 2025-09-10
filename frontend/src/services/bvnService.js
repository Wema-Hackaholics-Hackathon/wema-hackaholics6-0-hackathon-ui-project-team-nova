// BVN service (mock)
// TODO: Implement server-side call to NIBSS BVN API, ensure compliance with CBN and NIBSS rules.
export async function verifyBVN(bvn) {
  console.log("[bvnService] verifyBVN called for", bvn);
  // Mock validation: simple format check + fake API delay
  if (!/^\d{11}$/.test(bvn)) {
    return { success: false, message: "Invalid BVN format (must be 11 digits)" };
  }
  return new Promise((res) => setTimeout(() => res({ success: true, name: "Mock User", bvn }), 600));
}
