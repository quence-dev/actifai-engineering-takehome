<template>
  <div class="container mt-5">
    <h1 class="text-center">Sales Dashboard</h1>
    <div class="mb-3">
      <button @click="currentView = 'UserTable'"
        class="btn me-2"
        :class="[currentView === 'UserTable' ? 'btn-primary' : 'btn-secondary']">
        User Sales
      </button>
      <button @click="currentView = 'GroupTable'"
        class="btn"
        :class="[currentView === 'GroupTable' ? 'btn-primary' : 'btn-secondary']">
        Group Sales
      </button>
    </div>
    <component :is="currentView" />
  </div>
</template>

<script>
  import UserTable from './components/UserTable.vue';
  import GroupTable from './components/GroupTable.vue';

  export default {
    components: { UserTable, GroupTable },
    data() {
      return {
        currentView: 'UserTable' // Default view
      };
    }
  };
</script>