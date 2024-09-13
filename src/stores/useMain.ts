import axios from 'axios'
import { defineStore } from 'pinia'

export const useMain = defineStore('main', {
    state: () => ({
        drawer: null as null | boolean,
        maps: [] as any[],
        selectMap: {} as any,
        points: {} as { [key: string]: string[] },
    }),
    getters: {

    },
    actions: {
        async getMaps() {
            let { data } = await axios.get("/data/maplist.json")
            this.maps = data

            this.selectMap = this.maps[0]
        },
        async getPoints() {
            let { data } = await axios.get("/data/points.json")
            this.points = data.reduce((acc: { [key: string]: string[] }, item: { name: string, type: string }) => {
                if (!acc[item.type]) {
                    acc[item.type] = []
                }
                acc[item.type].push(item.name)
                return acc
            }, {})
            console.log(this.points);

        }
    },

})
