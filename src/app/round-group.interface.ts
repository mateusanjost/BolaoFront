export interface RoundGroup {
    name: string;
    rounds: number[];
    childrens: RoundGroup[];
    id: number;
}
