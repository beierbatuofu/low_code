export default {
  methods: {
    t(...args) {
      return this.$t.apply(this, args);
    }
  }
};