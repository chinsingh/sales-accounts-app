<template>
  <Panel>
    <div class="d-flex flex-row justify-content-between">
      <div>
        <h1>Accounts</h1>
        <p class="m-0">
          <strong>Dummy Salesforce Org</strong><br>
          <small>Accounts sorted alphabetically (Click on any account for more info)</small>
        </p>
      </div>
      <div>
        <Avatar icon="pi pi-user" class="mr-2" size="large" @click="toggleMenu" shape="circle" aria-haspopup="true" aria-controls="overlay_menu"/>
        <Menu ref="menuToggle" id="overlay_menu" :model="items" :popup="true" />
      </div>
    </div>
  </Panel>
  <div class="card">
    <DataTable
        :value="accounts"
        scrollable stripedRows scrollHeight="flex" tableStyle="min-width: 50rem" resizableColumns
        lazy paginator :loading="isFetching" :first="offset" paginatorPosition="top" :rowsPerPageOptions="rowOptions" :rows="limit" :totalRecords @page="onPageChange($event)" @update:rows="limit = $event"
        paginatorTemplate=" FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate="rows per page"
        v-model:selection="selectedAccount" selectionMode="single" :metaKeySelection="false" @rowSelect="dialogVisible = true">
        <template #header>
    </template>
    <template #empty> No accounts found. </template>
    <template #loading> Loading accounts data. Please wait. </template>
      <Column field="Name" header="Account Name"></Column>
      <Column field="Website" header="Website"></Column>
      <Column field="Type" header="Type"> </Column>
      <Column field="Phone" header="Phone"> </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" maximizable modal header="Account Details"  :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <Panel class="m-0">
          <h1>{{ selectedAccount.Name }}</h1>
          <div class="d-flex flex-row justify-content-left gap-2">
            <Tag :severity="getSeverity(selectedAccount.Type)">{{ selectedAccount.Type }}</Tag>
            <Tag icon="pi pi-link" severity="secondary" class="ml-20" rounded >{{ selectedAccount.Website }}</Tag>
            <Tag icon="pi pi-phone" severity="secondary" class="ml-20" rounded >{{ selectedAccount.Phone }}</Tag>
          </div>
          <hr>
          <div>
          <p>{{ selectedAccount.Description }}</p>
            <div>
              <strong>Shipping Address</strong> <i class="pi pi-box"></i>
                <p>
                <span v-if="selectedAccount.ShippingAddress.street">
                  {{ selectedAccount.ShippingAddress.street }}<br>
                </span>
                <span v-if="selectedAccount.ShippingAddress.city">
                  {{ selectedAccount.ShippingAddress.city }}<br>
                </span>
                <span v-if="selectedAccount.ShippingAddress.state">
                  {{ selectedAccount.ShippingAddress.state }}<br>
                </span>
                <span v-if="selectedAccount.ShippingAddress.country">
                  {{ selectedAccount.ShippingAddress.country }}<br>
                </span>
                <span v-if="selectedAccount.ShippingAddress.postalCode">
                  {{ selectedAccount.ShippingAddress.postalCode }}
                </span>
              </p>
            </div>
            <div>
              <strong>Billing Address</strong> <i class="pi pi-receipt"></i>
                <p>
                <span v-if="selectedAccount.BillingAddress.street">
                  {{ selectedAccount.BillingAddress.street }}<br>
                </span>
                <span v-if="selectedAccount.BillingAddress.city">
                  {{ selectedAccount.BillingAddress.city }}<br>
                </span>
                <span v-if="selectedAccount.BillingAddress.state">
                  {{ selectedAccount.BillingAddress.state }}<br>
                </span>
                <span v-if="selectedAccount.BillingAddress.country">
                  {{ selectedAccount.BillingAddress.country }}<br>
                </span>
                <span v-if="selectedAccount.BillingAddress.postalCode">
                  {{ selectedAccount.BillingAddress.postalCode }}
                </span>
              </p>
            </div>
          </div>
        </Panel>
    </Dialog>
  </div>
</template>

<script setup lang="ts">

  import { ref, type ComputedRef, onBeforeMount } from 'vue';
  import axios, { type AxiosResponse } from 'axios';
  import { useRouter } from 'vue-router';
  import { type Account, type CountResponse } from '../models/accounts.model';
  import { BACKEND_BASE_URL } from '../constants';


  //prime vue components
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { Tag, Avatar, Menu } from 'primevue';
  import Dialog from "primevue/dialog";
  import Panel from 'primevue/panel';

  //for pagination
  import { computed } from 'vue';
  import { useFetch } from '@vueuse/core';



  const router = useRouter();



  const selectedAccount = ref();
  const dialogVisible = ref(false);
  const menuToggle = ref();

  onBeforeMount(async ()=>{
    try {
      const apiUrl = `${BACKEND_BASE_URL}/api/v1/accounts/count`;
      const response: AxiosResponse<CountResponse> = await axios.get(apiUrl, {withCredentials: true});
      totalRecords.value = response.data.count;
    } catch (error) {
        router.push('/login');
    }
  });
  const totalRecords = ref(0);

const logOut = async ()=>{
    try {
      const apiUrl = `${BACKEND_BASE_URL}/api/v1/auth/logout`;
      const response: AxiosResponse<any> = await axios.get(apiUrl, {
        withCredentials: true
      });

      router.push('/login');
    } catch (error) {
      alert('Logout failed');
    }
};


const items = ref([
    {
        label: 'Actions',
        items: [
            {
                label: 'Log out',
                icon: 'pi pi-sign-out',
                command: logOut
            }
        ]
    }
]);

const toggleMenu = (event: any) => {
    menuToggle.value.toggle(event);
};


//Pagination Logic
const url = computed(
  () =>
    `${BACKEND_BASE_URL}/api/v1/accounts?limit=${limit.value}&offset=${offset.value}`
);

const page = ref(0);
const accounts:ComputedRef<Account[]> = computed(() => data.value);

const rowOptions = [50, 100, 500, 1000];

const limit = ref(rowOptions[1]);
const offset = computed(() => Number(limit.value * page.value));

const { isFetching, error, data } = useFetch(url, { credentials: 'include' }, {refetch: true}).json();

if(error.value) router.push("/login");
async function onPageChange(event: { page: number; }) {
  page.value = event.page;
  console.log(event.page);
}


//Dialog
const getSeverity = (type: string):string => {
    switch (type) {
        case 'Analyst'   : return 'info';
        case 'Competitor': return 'danger';
        case 'Customer'  : return 'success';
        case 'Integrator': return 'info';
        case 'Investor'  : return 'success';
        case 'Partner'   : return 'info';
        case 'Press'     : return 'warn';
        case 'Prospect'  : return 'success';
        case 'Reseller'  : return 'info';
        default:
            return "secondary";
    }
};
</script>
