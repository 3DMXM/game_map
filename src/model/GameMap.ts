import mapboxgl from '@glossmod/mapbox-gl';
import '@glossmod/mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';


export class GameMap {
    public mbgl: mapboxgl.Map;
    public isinit: boolean = false;
    public options: IGameMapOptions

    private temporaryMarkers: Map<string, mapboxgl.Marker> = new Map();
    public contextMenuPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        maxWidth: '150px',
        className: 'map-popup',
        anchor: 'left'
    })

    public contextmenuEvent: mapboxgl.MapMouseEvent | undefined = undefined

    private markerList: mapboxgl.Marker[] = []

    private boundClickHandler: any;
    private boundMouseEnterHandler: any;
    private boundMouseLeaveHandler: any;
    private boundContextmenuEventHandler: any;

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
                        tileSize: options.tileSize,
                        minzoom: options.minzoom - 1,
                        maxzoom: options.maxzoom,
                    }
                },
                // 添加 glyphs 属性
                glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
                layers: [
                    {
                        id: 'local-tiles-layer',
                        type: 'raster',
                        source: 'local-tiles',
                    }
                ],
            },
            center: options.center, // 中心点经纬度
            zoom: options.zoom,// 初始缩放级别
            minZoom: options.minzoom, // 添加全局最小缩放限制
            maxZoom: options.maxzoom - 1, // 允许额外放大一个级别
            antialias: true,
            dragRotate: false,
            preserveDrawingBuffer: true,
            renderWorldCopies: false,
            doubleClickZoom: false,
            // rasterFadeDuration: 0 // 禁用瓦片淡入淡出效果，防止过渡黑屏
        })

        this.mbgl.on("dblclick", (e) => {
            console.log(e.lngLat);
        })

        // 添加瓦片加载错误处理
        this.mbgl.on('error', (e) => {
            console.error('MapBox GL error:', e);
        });

        // 添加瓦片错误处理
        this.mbgl.on('sourcedataloading', (e) => {
            const source = this.mbgl.getSource(e.sourceId || '');
            if (source && source.type === 'raster') {
                // 这里可以添加瓦片加载中的处理逻辑
                console.log(`Loading tiles for source: ${e.sourceId}`);
            }
        });

        // 监听缩放事件，防止黑屏
        this.mbgl.on('zoom', () => {
            const currentZoom = this.mbgl.getZoom();
            if (currentZoom > options.maxzoom) {
                // 如果缩放级别超过最大值，可以增加透明度或其他视觉反馈
                const overZoomAmount = currentZoom - options.maxzoom;
                const opacity = Math.max(0.3, 1 - overZoomAmount * 0.3); // 随着超过最大缩放程度增加而降低透明度

                // 更新图层透明度
                if (this.mbgl.getLayer('local-tiles-layer')) {
                    this.mbgl.setPaintProperty('local-tiles-layer', 'raster-opacity', opacity);
                }
            } else {
                // 正常缩放范围内恢复正常透明度
                if (this.mbgl.getLayer('local-tiles-layer')) {
                    this.mbgl.setPaintProperty('local-tiles-layer', 'raster-opacity', 1);
                }
            }
        });

        this.isinit = true
    }

    /**
     * 初始化地图
     * @param data 
     * @param pointData 
     * @param showText 
     * @returns 
     */
    public async initGameMap(data: IGameMark[], showText: boolean) {

        await this.loadAllImage(data)

        const pointsIds = this.addPoints(data, showText)



        return pointsIds
    }

    /**
     * 加载所有图片
     * @param pointsList 列表
     */
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


    /**
     * 添加点位到地图上
     * @param pointsList 点位列表
     * @param showText 是否显示文本
     * @param oldIds 旧的图层ID列表
     * @param re 是否重新添加
     * @returns 新的图层ID列表
     */
    public addPoints(pointsList: IGameMark[], showText: boolean = false, oldIds: string[] = [], re: boolean = false) {
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

            // 再移除事件
            this.unBuddleEvents(oldIds)
        }

        if (this.markerList.length > 0 && re) {
            // 如果是重新渲染, 则移除旧的marker
            this.markerList.forEach(item => {
                item.remove()
            })
            this.markerList = []
        }

        let newIds: string[] = [];

        pointsList.forEach((mark) => {
            mark.marks_point.forEach(point => {
                newIds.push(...this.addPointsToMap(point, mark, showText))
            });
        });

        this.addEventToPoints(newIds)

        return newIds;
    }

    /**
     * 添加点位到地图上
     * @param point 点位数据
     * @param mark 点位类型数据
     * @param showText 是否显示文本
     * @param re 是否重新添加
     * @returns 新的图层ID列表
     */
    public addPointsToMap(point: IGameMapPoint, mark: IGameMark, showText?: boolean) {
        let newIds = [];

        const sourceName = `source-${point.id}`;
        if (point.mark_type == "points") {
            // 点
            if (!this.mbgl.getSource(sourceName)) {
                // 添加数据源
                this.mbgl.addSource(sourceName, {
                    type: 'geojson',
                    data: turf.point(point.mark_position, point)
                });
            }

            // 添加图层
            const layerId = `points-${point.id}`;
            newIds.push(layerId);
            this.mbgl.addLayer({
                id: layerId,
                type: 'symbol',
                source: sourceName,
                layout: {
                    'icon-image': `image-${mark.id}`,
                    'icon-size': mark.mark_type_scale || 0.25,
                    'icon-allow-overlap': true,
                    // 根据showText参数决定是否显示文本
                    'text-field': showText ? ['get', 'mark_name'] : '',
                    // 'text-size': 14,
                    'text-size': ['coalesce', ['get', 'textSize'], 14],
                    'text-offset': [0, -1.5],
                    'text-anchor': 'bottom',
                    'text-allow-overlap': true,
                },
                paint: {
                    // 文本样式
                    'text-color': ['coalesce', ['get', 'textColor'], '#c6c6c6'],
                    'text-halo-color': ['coalesce', ['get', 'textHaloColor'], '#000'],
                    'text-halo-width': 1,
                }
            });

            // 如果开启了编辑模式，添加拖拽支持
            if (this.options.isEdit) {

                // 使用Marker替代或增强图层点位，允许拖拽
                const marker = new mapboxgl.Marker({
                    draggable: true,
                    element: this.createCustomMarker(mark.mark_type_icon, 1)
                })
                    .setLngLat(point.mark_position)
                    .addTo(this.mbgl);

                // 存储marker引用
                this.temporaryMarkers.set(`${point.id}`, marker);

                // 添加拖拽结束事件
                marker.on('dragend', () => {
                    const newPosition = marker.getLngLat();
                    // 更新GeoJSON数据源中的点位置
                    this.updatePointPosition(point.id, newPosition);

                    // 如果有拖拽结束回调，可以在这里调用
                    if (this.options.onPointDragEnd) {
                        this.options.onPointDragEnd(`${point.id}`, newPosition);
                    }
                });

                this.markerList.push(marker);
            }
        }

        if (point.mark_type == "buffer") {
            // 范围
            if (!this.mbgl.getSource(sourceName)) {
                // 添加数据源
                this.mbgl.addSource(sourceName, {
                    type: 'geojson',
                    data: turf.buffer(turf.point(point.mark_position, point), point.mark_radius || 300, { units: "miles" })
                });
            }

            // 添加图层
            const layerId = `buffer-${point.id}`;
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

        return newIds
    }


    public addEventToPoints(pointsIds: string[]) {
        // // 清空旧的所有事件
        // this.unBuddleEvents(pointsIds)

        // 保存绑定后的函数引用
        this.boundClickHandler = this.clickEventHandler.bind(this);
        this.boundMouseEnterHandler = this.mouseenterEventHandler.bind(this);
        this.boundMouseLeaveHandler = this.mouseleaveEventHandler.bind(this);


        // 添加新的事件
        this.mbgl.on('click', pointsIds, this.boundClickHandler);
        this.mbgl.on('mouseenter', pointsIds, this.boundMouseEnterHandler);
        this.mbgl.on('mouseleave', pointsIds, this.boundMouseLeaveHandler);

        if (this.options.isEdit) {
            // 添加右键菜单事件
            this.setupContextMenu();
        }
    }

    // 清空所有事件
    public unBuddleEvents(pointsIds: string[]) {
        // 移除所有现有的点击、鼠标进入和鼠标离开事件
        this.mbgl.off('click', pointsIds, this.boundClickHandler);
        this.mbgl.off('mouseenter', pointsIds, this.boundMouseEnterHandler);
        this.mbgl.off('mouseleave', pointsIds, this.boundMouseLeaveHandler);
        this.mbgl.off('contextmenu', this.boundContextmenuEventHandler);
        console.log("unBuddleEvents", pointsIds);
    }

    /**
     * 设置右键菜单，支持右键添加新点位
     * @private
     */
    private setupContextMenu(): void {
        // 阻止默认右键菜单
        this.mbgl.getCanvas().addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        this.boundContextmenuEventHandler = this.contextmenuEventHandler.bind(this);

        // 监听右键点击
        this.mbgl.on('contextmenu', this.boundContextmenuEventHandler);
    }

    /**
     * 鼠标点击事件处理函数
     * @param e 
     */
    private clickEventHandler(e: mapboxgl.MapMouseEvent) {
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
            Object.assign(this.options.pointData, {
                ...properties,
                mark_images: safeJsonParse(properties?.mark_images),
                mark_links: safeJsonParse(properties?.mark_links),
                mark_position: safeJsonParse(properties?.mark_position, [0, 0])
            });


            // console.log(e);


            this.options.popup
                .setLngLat(this.options.pointData.mark_position)
                .setDOMContent(this.options.LayerRef)
                .addTo(this.mbgl);
        }
    }

    /**
     * 右键菜单事件处理函数
     * @param e 
     */
    private contextmenuEventHandler(e: mapboxgl.MapMouseEvent) {
        if (this.options.contextMenu) {
            // 移除旧的菜单
            this.contextMenuPopup.remove();
            // 添加新的菜单
            this.contextMenuPopup.setLngLat(e.lngLat)
                .setDOMContent(this.options.contextMenu)
                .addTo(this.mbgl);

            // 记录右键事件
            this.contextmenuEvent = e
        }
    }

    /**
     * 鼠标进入事件处理函数
     * @param e 
     */
    private mouseenterEventHandler(e: mapboxgl.MapMouseEvent) {
        this.mbgl.getCanvas().style.cursor = 'pointer';
    }

    /**
     * 鼠标离开事件处理函数
     * @param e 
     */
    private mouseleaveEventHandler(e: mapboxgl.MapMouseEvent) {
        this.mbgl.getCanvas().style.cursor = '';
    }

    /**
     * 创建自定义标记元素
     * @param iconUrl 图标URL
     * @param scale 图标缩放比例
     * @returns HTML元素
     */
    private createCustomMarker(iconUrl: string, scale: number): HTMLElement {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundImage = `url(${iconUrl})`;
        el.style.width = `${40 * scale}px`;
        el.style.height = `${40 * scale}px`;
        el.style.backgroundSize = 'contain';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = 'center';
        el.style.cursor = this.options.isEdit ? 'move' : 'pointer';
        return el;
    }


    /**
     * 更新点位的位置
     * @param pointId 点位ID
     * @param newPosition 新位置
     */
    public updatePointPosition(pointId: number, newPosition: mapboxgl.LngLat) {
        const sourceName = `source-${pointId}`;
        const source = this.mbgl.getSource(sourceName) as mapboxgl.GeoJSONSource;

        if (source) {
            const properties = (source._options.data as any).properties || {}
            properties.mark_position = newPosition.toArray()
            // console.log(properties);
            // 更新GeoJSON数据源
            const pointData = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: newPosition.toArray()
                },
                properties: {
                    id: pointId,
                    ...properties
                }
            };
            const geoJSON = turf.point(newPosition.toArray(), properties)
            source.setData(geoJSON);
        }
    }


}