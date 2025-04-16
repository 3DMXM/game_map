import mapboxgl from '@glossmod/mapbox-gl';


export const useGamemap = defineStore("GameMap", {
    state: () => ({
        // gmap: null as GameMap | null,
        isinit: false,
        marks: [] as IGameMark[],
        unshowMarks: [] as number[],
        pointsIds: [] as string[],
    }),
    getters: {
        fillterMarks(state) {
            return state.marks.filter(mark => !state.unshowMarks.includes(mark.id))
        }
    },
    actions: {
        async getMarksData() {
            const { data } = await axios.get('/data/points.json')
            this.marks = data

            return this.marks
        },
    }
})