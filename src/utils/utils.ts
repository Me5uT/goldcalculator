export type DataItem = {
  Buying: number;
  Change: number;
  Name: string;
  Selling: number;
  Type: string;
};

export const filterGoldItems = (
  obj: Record<string, DataItem>
): Record<string, DataItem> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value.Type === "Gold")
  );
};
