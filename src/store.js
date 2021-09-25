import { reactive } from "@vue/reactivity"
import { quadrants, rings } from "@/data/defaults.js";


let local = {
    quadrants: JSON.parse(localStorage.getItem("quadrants")),
    rings: JSON.parse(localStorage.getItem("rings"))
};

export const store = {
    state: reactive({
        quadrants: local.quadrants ?? quadrants,
        rings: local.rings ?? rings,
    }),
    setQuadrants(newVal) {
        this.state.quadrants = newVal;
        // persist to localStorage, so we can retrieve the data after hard reload
        localStorage.setItem("quadrants", JSON.stringify(newVal));
    },
    setRings(newVal) {
        this.state.rings = newVal;
        // persist to localStorage, so we can retrieve the data after hard reload
        localStorage.setItem("rings", JSON.stringify(newVal));
    }
}