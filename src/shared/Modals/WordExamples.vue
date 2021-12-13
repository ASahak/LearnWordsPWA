<template>
  <div class="title-container">
    <font-awesome-icon
      icon="arrow-left"
      @click.stop="goBackToCRUD"
      class="back-btn"
    />
    <h3 class="title">{{ dataWord }}</h3>
  </div>
  <div
    :class="[
      'example-container',
      !listReceived ? 'example-container--still-getting' : '',
    ]"
  >
    <LoadingIndicator v-if="!listReceived" />
    <template v-else>
      <ul class="words-list" v-if="exampleWordsList.length">
        <li v-for="(word, index) in exampleWordsList" :key="word + index">
          {{ word }}
        </li>
      </ul>
      <p v-else class="no-result">No result</p>
    </template>
  </div>
</template>
<script>
import { toRef, computed } from "vue";
import { LoadingIndicator } from "@/shared/UI";
import { useStore } from "vuex";

export default {
  name: "word-examples-modal",
  components: {
    LoadingIndicator,
  },
  emits: ["goBackCRUD"],
  props: {
    word: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const store = useStore();

    const dataWord = toRef(props, "word");

    const exampleWordsList = computed(() => {
      return store.getters["base/getExampleWordsList"];
    });

    const listReceived = computed(() => {
      return store.getters["base/isReceivedExampleWordsList"];
    });

    const goBackToCRUD = () => context.emit("goBackCRUD");

    return {
      goBackToCRUD,
      dataWord,
      listReceived,
      exampleWordsList,
    };
  },
};
</script>
<style lang="scss" scoped>
.title-container {
  display: flex;
  align-items: center;
}

.back-btn {
  margin-right: 10px;
  cursor: pointer;
}

.example-container {
  position: relative;
  &.example-container--still-getting {
    min-height: 50px;
    overflow: hidden;
  }
  & .no-result {
    margin: 10px 0;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
  }
}
.words-list {
  margin-top: 10px;
  margin-bottom: 0px;
  padding-left: 20px;
  overflow-x: hidden;
  max-height: 250px;
  &::-webkit-scrollbar {
    width: 4px;
    background-color: #efefef;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #c9c9d3;
  }
  & li {
    margin-bottom: 5px;
    font-size: 14px;
  }
}
</style>
