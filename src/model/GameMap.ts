import mapboxgl from '@glossmod/mapbox-gl';
import '@glossmod/mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';


export class GameMap {
    public mbgl: mapboxgl.Map;
    public isinit: boolean = false;
    public options: IGameMapOptions

    constructor(options: IGameMapOptions) {
        this.options = options
        this.mbgl = new mapboxgl.Map({
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
                // 添加 glyphs 属性
                glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
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
            // accessToken: import.meta.env.VITE_ACCESS_TOKEN,
            antialias: true,
            dragRotate: false,
            preserveDrawingBuffer: true,
            renderWorldCopies: false,
            doubleClickZoom: false,
        })

        this.mbgl.on("dblclick", (e) => {
            console.log(e.lngLat);
        })

        this.isinit = true
    }

    public async initGameMap(data: IGameMark[], popup: mapboxgl.Popup, LayerRef: HTMLElement, pointData: IGameMapPoint, showText: boolean) {

        await this.loadAllImage(data)

        const pointsIds = this.addPoints(data, showText)

        this.mbgl.on('click', pointsIds, async (e) => {
            if (e.features) {
                const properties = e.features[0].properties;

                // 添加安全解析函数
                const safeJsonParse = (jsonStr: string | undefined | null, defaultValue: any = []) => {
                    if (!jsonStr) return defaultValue;
                    try {
                        return JSON.parse(jsonStr);
                    } catch (e) {
                        console.warn('JSON解析错误:', e);
                        return defaultValue;
                    }
                };

                // // 优化属性赋值
                // 更新传入的pointData对象，而不是创建新对象
                Object.assign(pointData, {
                    ...properties,
                    mark_images: safeJsonParse(properties?.mark_images),
                    mark_links: safeJsonParse(properties?.mark_links),
                    mark_position: safeJsonParse(properties?.mark_position, [0, 0])
                });

                popup
                    .setLngLat(pointData.mark_position)
                    .setDOMContent(LayerRef)
                    .addTo(this.mbgl);

            }

        });

        this.mbgl.on('mouseenter', pointsIds, () => {
            this.mbgl.getCanvas().style.cursor = 'pointer';
        });

        this.mbgl.on('mouseleave', pointsIds, () => {
            this.mbgl.getCanvas().style.cursor = '';
        });

        return pointsIds
    }

    public async loadAllImage(pointsList: IGameMark[]): Promise<void> {
        const imagePromises = pointsList.map((points) => {
            return new Promise<void>((resolve, reject) => {

                const name = `image-${points.id}`
                // 判断同名图片是否已被加载
                if (this.mbgl.hasImage(name)) {
                    resolve();
                    return;
                }


                this.mbgl.loadImage(points.mark_type_icon, (error, image) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                        return;
                    }
                    if (image) {
                        this.mbgl.addImage(name, image);
                    }
                    resolve();
                });
            });
        });

        await Promise.all(imagePromises);
    }


    public addPoints(pointsList: IGameMark[], showText: boolean = false, oldIds: string[] = []) {
        // 移除旧的图层和数据源
        if (oldIds.length > 0) {
            // 首先移除图层，然后移除数据源
            oldIds.forEach(id => {
                if (this.mbgl.getLayer(id)) {
                    this.mbgl.removeLayer(id);
                }
                // 检查是否是数据源ID (source-开头)
                if (id.startsWith('source-') && this.mbgl.getSource(id)) {
                    this.mbgl.removeSource(id);
                }
            });
        }

        let newIds: string[] = [];

        pointsList.forEach((points) => {
            points.marks.forEach(mark => {
                const sourceName = `source-${mark.id}`;
                // newIds.push(sourceName);

                if (mark.mark_type == "points") {
                    // 点
                    if (!this.mbgl.getSource(sourceName)) {
                        // 添加数据源
                        this.mbgl.addSource(sourceName, {
                            type: 'geojson',
                            data: turf.point(mark.mark_position, mark)
                        });
                    }

                    // 添加图层
                    const layerId = `points-${mark.id}`;
                    newIds.push(layerId);
                    this.mbgl.addLayer({
                        id: layerId,
                        type: 'symbol',
                        source: sourceName,
                        layout: {
                            'icon-image': `image-${points.id}`,
                            'icon-size': points.mark_type_scale || 0.25,
                            'icon-allow-overlap': true,
                            // 根据showText参数决定是否显示文本
                            'text-field': showText ? ['get', 'mark_name'] : '',
                            'text-size': 14,
                            'text-offset': [0, -1.5],
                            'text-anchor': 'bottom',
                            'text-allow-overlap': true,
                        },
                        paint: {
                            // 文本样式
                            'text-color': '#c6c6c6',
                            'text-halo-color': '#000',
                            'text-halo-width': 1
                        }
                    });
                }

                if (mark.mark_type == "buffer") {
                    // 范围
                    if (!this.mbgl.getSource(sourceName)) {
                        // 添加数据源
                        this.mbgl.addSource(sourceName, {
                            type: 'geojson',
                            data: turf.buffer(turf.point(mark.mark_position, mark), mark.mark_radius || 300, { units: "miles" })
                        });
                    }

                    // 添加图层
                    const layerId = `buffer-${mark.id}`;
                    newIds.push(layerId);
                    this.mbgl.addLayer({
                        id: layerId,
                        type: 'fill',
                        source: sourceName,
                        paint: {
                            'fill-color': ['coalesce', ['get', 'fillColor'], '#448AFF'],
                            'fill-opacity': ['coalesce', ['get', 'fillOpacity'], 0.3],
                            'fill-outline-color': ['coalesce', ['get', 'fillOutlineColor'], '#3bb2d0'],
                        },
                    });
                }
            });
        });

        return newIds;
    }

}