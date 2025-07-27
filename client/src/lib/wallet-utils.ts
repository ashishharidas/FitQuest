export const formatAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEthAmount = (amount: string | number): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toFixed(3);
};

export const formatUsdAmount = (ethAmount: string | number, ethPrice: number = 1800): string => {
  const num = typeof ethAmount === "string" ? parseFloat(ethAmount) : ethAmount;
  const usdAmount = num * ethPrice;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(usdAmount);
};

export const generateMockTxHash = (): string => {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const isValidEthAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
