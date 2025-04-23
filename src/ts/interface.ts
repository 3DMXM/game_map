declare global {
    interface Window {
        $gmap: GameMap | undefined;
    }

    interface IGameMapOptions {
        container: string | HTMLElement
        tiles: string
        tileSize: number
        minzoom: number
        maxzoom: number
        popup: mapboxgl.Popup
        LayerRef: HTMLElement
        center?: [number, number]
        zoom?: number
        contextMenu?: HTMLElement
        isEdit?: boolean
        onPointDragEnd?: (pointId: string, newPosition: mapboxgl.LngLat) => void;

    }

    interface IGameMark {
        /** 类型组唯一ID */
        id: number;
        /** 类型组名称 */
        mark_type_name: string;
        /** 类型组父类别 */
        mark_type_parent: string;
        /** 类型组图标路径 */
        mark_type_icon: string;
        /** 类型组图标缩放比例 */
        mark_type_scale: number;
        /** 此类型下的所有标记点 */
        marks: IGameMapPoint[];
    }

    interface MarkLink {
        /** 链接显示的文本 */
        label: string;
        /** 链接的URL地址 */
        url: string;
    }

    interface IGameMapPoint {
        /** 标记点唯一ID */
        id: number;
        /** 标记点类型 (points/buffer等) */
        mark_type: "points" | "buffer";
        /** 标记点名称 */
        mark_name: string;
        /** 标记点坐标 */
        mark_position: [number, number];
        /** 如果是buffer类型标记点，表示其影响半径 */
        mark_radius?: number;
        /** 标记点详细描述 */
        mark_des?: string;
        /** 标记点相关链接，可能为null */
        mark_links?: MarkLink[] | null;
        /** 标记点相关图片路径，可能为null */
        mark_images?: string[] | null;
    }
}

export { }