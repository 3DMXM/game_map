
export const useGamemap = defineStore("Gamemap", {
    state: () => ({
        mapboxgl: null as GameMap | null,
        isinit: false,
    }),
    actions: {

    }
})
