
import {computed, ref} from "vue";

const carrito = ref([]);

const agregarAlCarrito = (producto) => {
    const existe = carrito.value.find(item => item.id === producto.id);

    if (existe) {
        existe.cantidadSeleccionada++;
    } else {
        carrito.value.push({
            id: producto.id,
            nombre: producto.name,
            codigo: producto.code,
            precio: producto.price,
            stockMaximo: producto.stock,
            cantidadSeleccionada: 1
        });
    }
};

const totalVenta = computed(() => {
    return carrito.value.reduce((acc, item) => acc + (item.precio * item.cantidadSeleccionada), 0);
});