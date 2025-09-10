const CATEGORY_KEYWORDS = {
  food: ["restaurant","mart","food","mcdonald","pizza","canteen","kuda","shop"],
  transport: ["uber","bolt","taxi","transport","fuel","bus"],
  entertainment: ["netflix","spotify","movie","cinema","concert"],
  utilities: ["electric","light","water","bill","data","mtn"],
  salary: ["salary","pay","payroll","salary"]
};

export function categorizeTransaction(tx) {
  const desc = (tx.description || "").toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => desc.includes(k))) return cat;
  }
  return "other";
}
