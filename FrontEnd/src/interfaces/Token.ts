export interface TokenSummary {
    availableTokens: number;
    distributedTokens: number;
    userBalances: Record<string, number>;
}