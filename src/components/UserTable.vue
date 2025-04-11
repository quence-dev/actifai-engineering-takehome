<template>
  <div>
    <h2>User Sales</h2>
    <div class="mb-3">
      <label for="filterInput" class="form-label">Filter by Name</label>
      <input v-model="filter" id="filterInput" class="form-control" placeholder="Enter name to filter">
    </div>
    <TableComponent :data="filteredData" :headers="headers" />
  </div>
</template>

<script>
  import TableComponent from './TableComponent.vue';

  export default {
    name: 'UserTable',
    components: { TableComponent },
    data() {
      return {
        data: [],
        filter: '',
        headers: {
          sales_month: 'Month',
          user_name: 'User Name',
          group_names: 'Groups',
          total_revenue: 'Total Revenue ($)',
          average_revenue: 'Average Revenue ($)'
        }
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
    async created() {
      await this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const response = await fetch('/user-sales');
          const result = await response.json();
          console.log('User Sales Data:', result);
          this.data = result;
        } catch (error) {
          console.error('Error fetching user sales data:', error);
        }
      }
    }
  };
</script>