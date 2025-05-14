
export const useMain = defineStore('main', {
    state: () => ({
        drawer: undefined as undefined | boolean,// 左侧菜单栏
        movileDrawer: false,// 移动端底部菜单栏
    })
})