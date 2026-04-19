<script setup>
const emit = defineEmits(['select', 'update:searchQuery']);

// Dentro del <script setup> del componente de la tabla
watch(() => props.productos, (newVal) => {
    console.log("🖼️ [Table Component] Recibió nuevas props 'productos':", newVal);
}, { immediate: true });

const seleccionar = (p) => {
    console.log("👆 [Table Component] Click en fila:", p);
    emit('select', p);
};

const props = defineProps({
    placeholder: {
        type: String,
        default: "Buscar..."
    },
    titulo: {
        type: String,
        default: "Listado"
    },
    productos: {
        type: Array,
        default: () => []
    },
    searchQuery: String
});

const seleccionar = (p) => {
    emit('select', p);
};

const handleInput = (e) => {
    emit('update:searchQuery', e.target.value);
};
</script>

<template>
    <div class="container">
        <div class="input-container">
            <text-button>{{ props.titulo }}</text-button>
            <input :value="props.searchQuery" @input="handleInput" :placeholder="props.placeholder"
                class="search-input">
        </div>

        <div v-if="props.productos && props.productos.length > 0" class="table-wrapper">
            <table class="product-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Documento</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(p, index) in props.productos" :key="p.id || index" @click="seleccionar(p)">
                        <td>{{ p.notes || 'Sin descripción' }}</td>
                        <td>{{ p.number || p.id }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="loading-state">
            <overline>Esperando datos o sin coincidencias</overline>
        </div>
    </div>
</template>

<style scoped>
/* Tu estilo está perfecto, no necesita cambios */
.container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 10px;
    padding: 20px;
    box-sizing: border-box;
}

.input-container {
    display: flex;
    flex-direction: column;
    width: 250px;
    height: auto;
    gap: 10px;
    box-sizing: border-box;
}

.input-container text-button {
    color: var(--color-brand-30);
}

.search-input {
    width: 100%;
    height: auto;
    justify-content: space-between;
    padding: 8px 10px;
    border-radius: 6px;
    box-sizing: border-box;
    background: var(--color-brand-80);
    border: 2px solid var(--color-brand-40);
}

.search-input::placeholder {
    font-family: arimo, serif;
    font-size: 16px;
    color: var(--color-brand-30);
}

.table-wrapper {
    max-height: 132px;
    overflow-y: auto;
}

.product-table {
    width: 100%;
    border-collapse: collapse;
    font-family: arimo, serif;
}

th {
    padding: 6px 10px;
    background: var(--color-brand-20);
    color: white;
    text-align: left;
}

td {
    padding: 2px 8px;
    cursor: pointer;
}

tbody tr:nth-child(odd) {
    background-color: white;
}

tbody tr:nth-child(even) {
    background-color: var(--color-brand-80);
}
</style>