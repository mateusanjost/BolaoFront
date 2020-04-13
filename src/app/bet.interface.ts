export interface Bet {
    id: number;
    betDate: Date;
    playerId: number;
    playerName: string;
    roundId: number;
    userAdminId: number;
    resultBetId: number;
    results: string;
    status: number;
    value: number;
}