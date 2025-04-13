<template>
  <div>
    <h2>User Sales</h2>
    <TableComponent :data="data" :headers="headers" />
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
        headers: {
          sales_month: 'Month',
          user_name: 'User Name',
          group_names: 'Groups',
          total_revenue: 'Total Revenue ($)',
          average_revenue: 'Average Revenue ($)'
        }
      };
    },
    async created() {
      await this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const response = await fetch('/user-sales');
          const result = await response.json();
          this.data = result;
        } catch (error) {
          console.error('Error fetching user sales data:', error);
        }
      }
    }
  };
</script>