<template>
  <div class="item-list">
    <input type="text" v-model="newItem" /><button @click="addItem">Add</button>
    <ul>
      <li v-for="(item, index) in modelValue" :key="index">
        <button @click="item.editing = !item.editing">{{ item.editing ? "save" : "edit" }}</button>
        <input v-if="item.editing" v-model="item.name" />
        <span v-else>{{ item.name }}</span>
        <button @click="removeItem(item)">-</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: Array,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      newItem: "",
    };
  },
  methods: {
    addItem() {
      let items = [...this.modelValue];
      items.push({ name: this.newItem });
      this.$emit("update:modelValue", items);
      this.newItem = "";
    },
    removeItem(item) {
      let items = [...this.modelValue];
      items.splice(items.indexOf(item), 1);
      this.$emit("update:modelValue", items);
    },
  },
};
</script>

<style lang="scss" scoped>
.item-list {
  ul {
    list-style: none;
  }
}
</style>
