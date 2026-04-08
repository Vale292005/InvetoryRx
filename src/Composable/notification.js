import { ref, computed } from 'vue';
import { getNotificationsAPI } from '../api/notifications.js';
import { useAuthStore } from '../stores/auth.store.js';

export function useNotification() {
  const notifications = ref([]);
  const loading = ref(false);
  const authStore=useAuthStore();

  const fetchNotifications=async () => {
    loading.value=true;
    try{
        const data=await getNotificationsAPI();
        notifications.value=data;
    }finally{
            loading.value=false;
        }
    };

    return{
        notifications,
        loading,
        fetchNotifications,
        userRole: computed(() => authStore.userRole)
    }
  }