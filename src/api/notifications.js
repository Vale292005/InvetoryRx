import client from "./client";

export function getNotificationsAPI() {
    return client.get('/api/notifications').then(r => r.data);
}