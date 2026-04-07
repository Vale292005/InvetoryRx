<script setup>
import { onMounted } from 'vue';
import CustomButton from "@/components/CustomButton.vue";
import { useNotification } from '../Composable/notification';
import { useRouter } from 'vue-router';

const route = useRouter();

const { notifications, loading, fetchNotifications, userRole } = useNotification();

onMounted(() => {
    fetchNotifications();
});
const handleNotificationClick = (url) => {
    route.push(url);
};
</script>
<template>
    <div v-if="notifications.length > 0" class="notification-container">
    <div v-for="notifi in notifications" :key="notifi.id" class="notification-item">
        <h3>{{ notifi.title }}</h3>
        <p>{{ notifi.message }}</p>

        <div class="actions">

            <CustomButton v-if="userRole === 'WAREHOUSE' || userRole === 'ADMIN'" label="Ver detalles"
                @click="handleNotificationClick(notifi.actionUrl)" />
        </div>
    </div>
    </div>
</template>
<style scoped>
.notification-container {
    display: flex;
    flex-direction: row;
    padding: 20px;
    gap: 1rem;
    justify-content: flex-start;
}
@media screen and (max-width: 768px) {
    .notification-container {
        flex-direction: column;
        align-items: center;
    }
    
}
.notification-item {
    padding: 1rem;
    margin-bottom: 0.5rem;
    background-color: var(--color-brand-80);
    max-width: 300px;
    border-radius: 6px;
}
</style>