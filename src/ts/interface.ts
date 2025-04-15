declare global {
    interface IGameMapOptions {
        container: string | HTMLElement
        tiles: string
        tileSize: number
        minzoom: number
        maxzoom: number
        center?: [number, number]
        zoom?: number
    }

    interface IGameMapPoint extends IGameMapPointProperties {
        type: "points" | "buffer"
        coordinates: [number, number]
        // 点 样式
        iconImage?: string
        iconSize?: number
        // 范围 样式
        fillColor?: string
        fillOpacity?: number
        fillOutlineColor?: string
        radius?: number
    }

    interface IGameMapPointProperties {
        title: string
        description: string
        images?: string[]
        links?: { url: string, title: string }[]
    }
}