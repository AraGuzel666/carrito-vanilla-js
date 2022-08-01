

const db = {
    metodos: {
        find: (id) => {
            return db.item.find((item) => item.id == id);
        },
        remover: (items) => {
            items.forEach((item) => {
                const producto = db.metodos.find(item.id); // o .find
                producto.cantidad = producto.cantidad - item.cantidad;
            });
            //console.log(db);
        }
    },
    item: [
        {
            id: 0,
            titulo: 'Macbook 1',
            precio: 250000,
            cantidad: 5
        },
        {
            id: 1,
            titulo: 'Macbook 2',
            precio: 650000,
            cantidad: 12
        },
        {
            id: 2,
            titulo: 'Macbook 3',
            precio: 950000,
            cantidad: 50
        },
        {
            id: 3,
            titulo: 'Macbook 4',
            precio: 955500,
            cantidad: 2
        }
    ]
};

const carritoCompras = {
    items: [],
    metodos: {
        agregar: (id, cantidad) => {

            const carritoItem = carritoCompras.metodos.get(id);

            if (carritoItem){
                if (carritoCompras.metodos.hayInventario(id, cantidad + carritoItem.cantidad)){
                    carritoItem.cantidad++;
                }else{
                    alert("No hay inventario");
                }
            }else{
                carritoCompras.items.push({id,cantidad});
            }

        },
        remover: (id, cantidad) => {

            const carritoItem = carritoCompras.metodos.get(id);

            if ((carritoItem.cantidad - cantidad) > 0){
                carritoItem.cantidad--;
            }else{
                carritoCompras.items = carritoCompras.items.filter((item) => item.id !== id);
            }

        },
        contador: () => {

            return carritoCompras.items.reduce((ac, item) => ac + item.cantidad, 0);

        },
        get: (id) => {
            const indice = carritoCompras.items.findIndex((item) => item.id === id);  //.findIndex
            return indice >= 0 ? carritoCompras.items[indice] : null; 
        },
        getTotal: () => {

            let total = 0;
            carritoCompras.items.forEach((item) => {
                const found = db.metodos.find(item.id);
                total += (found.precio * item.cantidad);
            });
            return total;

        },
        hayInventario: (id, cantidad) => {
            return db.item.find((item) => item.id === id).cantidad - cantidad >= 0;
        },
        comprar: () => {

            db.metodos.remover(carritoCompras.items);
            carritoCompras.items = [];

        } 
    }
};
renderizarItems();

function renderizarItems(){
    const html = db.item.map((item) => {
        return `
            <div class="item">
                <div class="titulo">${item.titulo}</div>
                <div class="precio">${precioNumero(item.precio)}</div>
                <div class="cantidad">${item.cantidad} unidades</div>

                <div class="acciones">
                    <button class="agregar" data-id="${item.id}">
                        Agregar al Carrito
                    </button>
                </div>

            </div>
        `
    });

    document.querySelector('#store-container').innerHTML = html.join("");

    document.querySelectorAll('.item .acciones .agregar').forEach((boton) => {
        boton.addEventListener('click', e => {
            const id = parseInt(boton.getAttribute('data-id'));
            const item = db.metodos.find(id);

            if ((item && item.cantidad -1) > 0){
                //añadir
                carritoCompras.metodos.agregar(id, 1);
                //console.log(db, carritoCompras)
                renderizarCarrito();
            }else{
                alert("Ya no hay inventario");
            }
        })
    })
}


function precioNumero(n){
    return new Intl.NumberFormat('en-US',{
        maximumSignificantDigits: 2,
        style: 'currency',
        currency: 'USD'
    }).format(n);
}

function renderizarCarrito(){
    const html = carritoCompras.items.map((item) => {
        const dbItem = db.metodos.find(item.id);
        return `
            <div class="item">
                <div class="titulo">${dbItem.titulo}</div>
                <div class="precio">${precioNumero(dbItem.precio)}</div>
                <div class="cantidad">${item.cantidad} unidades</div>

                <div class="subtotal">
                    Subtotal: ${precioNumero(item.cantidad * dbItem.precio)} 
                </div>

                <div class="acciones">
                    <button class="agregarUno" data-id="${item.id}">+</button>
                    <button class="restarUno" data-id="${item.id}">-</button>
                </div>
            </div>
        `
    });

    const botonCierre = `
        <div class="carrito-header">
            <button class="bCerrar">Cerrar</button>
        </div>
    `

    const botonCompra = carritoCompras.items.length > 0 ? `
        <div class="carrito-acciones">
            <button class="bComprar">Comprar</button>
        </div>
    `
    : "" ;

    const total = carritoCompras.metodos.getTotal();
    const contenedorTotal = `<div class="total">Total: ${precioNumero(total)}</div>`

    const carritoContainer = document.querySelector('#carrito-container');
    carritoContainer.innerHTML = botonCierre + html.join('') + contenedorTotal + botonCompra;

    carritoContainer.classList.remove("hide");
    carritoContainer.classList.add("show");


    document.querySelectorAll('.agregarUno').forEach(boton => {
        boton.addEventListener('click', e =>{
            const id = parseInt(boton.getAttribute('data-id'));
            carritoCompras.metodos.agregar(id, 1);
            renderizarCarrito();
        });
    });

    document.querySelectorAll('.restarUno').forEach(boton => {
        boton.addEventListener('click', e =>{
            const id = parseInt(boton.getAttribute('data-id'));
            carritoCompras.metodos.remover(id, 1);
            renderizarCarrito();
        });
    });

    const bCerrar = document.querySelector('.bCerrar');
    bCerrar.addEventListener('click', e =>{
            carritoContainer.classList.remove("show");
            carritoContainer.classList.add("hide");
        })


    const bComprar = document.querySelector('.bComprar')

        if (bComprar){
            bComprar.addEventListener('click', e =>{
              carritoCompras.metodos.comprar();
              renderizarCarrito();
              renderizarItems();
            });
        }
    }

    const carrito = document.querySelector("#carrito-container");
    const bAbrir = document.querySelector("#abrirCarrito");
    bAbrir.addEventListener('click', e =>{
        if (carrito.classList == "hide"){
            carrito.classList.remove("hide");
            carrito.classList.add("show");
            renderizarCarrito();
        }
    })