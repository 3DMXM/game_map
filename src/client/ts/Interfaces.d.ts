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

export interface IMap {
    id: number
    game_id: number
    tile_id: number
    map_name: string
    map_path: string
}

export interface ITile {
    id: number
    game_id: number
    tile_name: string
    tile_path: string
    tile_width: number
    tile_height: number
    tile_min_zoom: number
    tile_max_zoom: number
}

export interface IMarksType {
    id: number
    map_id: number[]
    mark_type_name: string
    mark_type_parent: string
    mark_type_icon: string
    mark_type_scale: number
}

export interface IMarks {
    id: number
    mark_type: number
    mark_name: string
    mark_position_x: number
    mark_position_y: number
    mark_des: string
    mark_links: { label: string, url: string }[]
    mark_images: string[]
}