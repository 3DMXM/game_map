import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';


export class GameMap {
    public mapboxgl: mapboxgl.Map;
    public isinit: boolean = false;
    public options: IGameMapOptions

    constructor(options: IGameMapOptions) {
        this.options = options
        this.mapboxgl = new mapboxgl.Map({
            container: options.container,
            style: {
                version: 8,
                sources: {
                    'local-tiles': {
                        type: 'raster',
                        tiles: [
                            options.tiles,
                        ],
                        tileSize: options.tileSize
                    }
                },
                layers: [
                    {
                        id: 'local-tiles-layer',
                        type: 'raster',
                        source: 'local-tiles',
                        minzoom: options.minzoom,
                        maxzoom: options.maxzoom,
                    }
                ]
            },
            center: options.center, // 中心点经纬度
            zoom: options.zoom,// 初始缩放级别
            accessToken: import.meta.env.VITE_ACCESS_TOKEN,
            antialias: true,
            dragRotate: false,
            preserveDrawingBuffer: true,
            renderWorldCopies: false,
            doubleClickZoom: false,
        })

        this.mapboxgl.on("dblclick", (e) => {
            console.log(e.lngLat);
        })

        this.isinit = true
    }



    public addPoints(pointsList: IGameMapPoint[]) {
        // 点 图层
        this.mapboxgl.addLayer({
            id: 'points',
            type: 'symbol',
            source: {
                type: 'geojson',
                data: (() => {
                    let points = pointsList.filter((point) => point.type === "points")
                    const buffers = points.map((point) => {
                        return turf.point(point.coordinates, point)
                    })
                    const combinedBuffers = turf.featureCollection(buffers);
                    return combinedBuffers

                })()
            },
            layout: {
                'icon-image': ['coalesce', ['get', 'iconImage'], 'custom-icon'], // 使用自定义图标
                'icon-size': ['coalesce', ['get', 'iconSize'], 0.3], // 调整图标大小
                'icon-allow-overlap': true // 允许图标重叠
            }
        })

        // 圆形缓冲区
        this.mapboxgl.addLayer({
            id: 'circles',
            type: 'fill',
            source: {
                type: 'geojson',
                data: (() => {
                    let points = pointsList.filter((point) => point.type === "buffer");

                    // 如果没有buffer类型的点，返回空的FeatureCollection
                    if (points.length === 0) {
                        return turf.featureCollection([]);
                    }

                    // 将每个点转换为缓冲区，并将所有缓冲区直接添加到 FeatureCollection
                    const bufferFeatures: any = points.map((point) => {
                        const p = turf.point(point.coordinates, point);
                        return turf.buffer(p, point.radius || 300, { units: "miles" });
                    });

                    // 创建包含所有缓冲区的 FeatureCollection
                    return turf.featureCollection(bufferFeatures);
                })()
            },
            paint: {
                'fill-color': ['coalesce', ['get', 'fillColor'], '#448AFF'],
                'fill-opacity': ['coalesce', ['get', 'fillOpacity'], 0.3],
                'fill-outline-color': ['coalesce', ['get', 'fillOutlineColor'], '#3bb2d0'],
            },

        })

    }

}