<template>
  <div class="item-list">
    <input type="text" v-model="newItem" /><button @click="addItem" class="button-info">Add</button>
    <ul style="max-width: 600px;" class="m-auto">
      <li v-for="(item, index) in modelValue" :key="index">
        <div class="flex py-2 items-center">
          <button @click="removeItem(item)" class="button-danger">remove</button>
          <button class="button-info" @click="item.editing = !item.editing">
            {{ item.editing ? "save" : "edit" }}
          </button>
          <div class="flex justify-center">
            <input v-if="item.editing" v-model="item.name" class="" />
            <span v-else>{{ item.name }}</span>
          </div>
        </div>
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

input {
  @apply px-4 py-2 text-base text-black transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-100 focus:border-gray-500 focus:bg-white focus:outline-none focus:ring-2 ring-offset-current ring-offset-2;
}

button {
  @apply mx-2 py-2 px-4 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2  focus:ring-opacity-75;
}

.button-info {
  @apply bg-indigo-500 hover:bg-indigo-700 focus:ring-indigo-400;
}

.button-danger {
  @apply bg-red-500 hover:bg-red-700 focus:ring-red-400;
}
</style>
