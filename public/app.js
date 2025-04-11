const app = Vue.createApp({
  data() {
    return {
      selectedEndpoint: 'user-sales', // Default endpoint
      filter: '', // Filter input
      data: [], // Fetched data
      headers: [] // Table headers
    };
  },
  computed: {
    filteredData() {
      if (!this.filter) return this.data;
      const lowerFilter = this.filter.toLowerCase();
      return this.data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(lowerFilter)
        )
      );
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch(`/${this.selectedEndpoint}`);
        const result = await response.json();
        this.data = result;
        this.headers = result.length > 0 ? Object.keys(result[0]) : [];
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
});

app.mount('#app');
