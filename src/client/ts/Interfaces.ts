export interface ISeries {
    type: string;
    name: string;
    data: ISeriesData[];
    symbolSize: number;
    symbol: string;
}

export interface ISeriesData {
    name: string;
    value: [
        number,
        number,
        string,
        ISeriesLink[],
        string[]
    ];
    selected?: boolean;
}

export interface ISeriesLink {
    name: string;
    url: string;
}

export interface IGame {
    id: number
    game_name: string
}