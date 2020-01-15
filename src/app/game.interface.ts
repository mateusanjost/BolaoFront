export interface Game {
    homeTeamId: number;
    homeName: string;
    awayTeamId: number;
    awayName: string;
    roundId: number;
    homeTeamScore: number;
    awayTeamScore: number;
    dateTime: Date;
    id: number;
    matchResult: string;
}