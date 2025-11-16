/* eslint-disable no-unused-vars */
export function buildQuery(params: Record<string, any>): string {
  const filteredEntries = Object.entries(params).filter(
    ([_, value]) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0)
  );

  const searchParams = new URLSearchParams();

  for (const [key, value] of filteredEntries) {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}
