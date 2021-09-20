import { reactive } from "@vue/reactivity"
import { quadrants, rings } from "@/data/defaults.js";

export const store = {
    state: reactive({
        quadrants,
        rings,
    }),
    setQuadrants(newVal) {
        this.state.quadrants = newVal;
    },
    setRings(newVal) {
        this.state.rings = newVal;
    }
}