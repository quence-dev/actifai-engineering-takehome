<template>
  <div>
    <h2>Group Sales</h2>
    <TableComponent :data="data" :headers="headers" />
  </div>
</template>

<script>
  import TableComponent from './TableComponent.vue';

  export default {
    name: 'GroupTable',
    components: { TableComponent },
    data() {
      return {
        data: [],
        headers: {
          sales_month: 'Month',
          group_name: 'Group Name',
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
          const response = await fetch('/group-sales');
          const result = await response.json();
          console.log('Group Sales Data:', result);
          this.data = result;
        } catch (error) {
          console.error('Error fetching group sales data:', error);
        }
      }
    }
  };
</script>