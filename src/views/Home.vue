<template>
  <div>
    <Header />
    <Filters />
  </div>
</template>

<script>
import Header from "@/components/Header/index";
import Filters from "@/components/Filters/index";

export default {
  name: "Home",
  components: {
    Header,
    Filters,
  },
};
</script>
