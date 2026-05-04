// 1. FUNCIÓN PARA OBTENER DATA DE LA API

async function getMonedas() {
  const res = await fetch("https://mindicador.cl/api/");
  const data = await res.json();
  return data;
}

async function getDataToChart(moneda) {
  const res = await fetch(`https://mindicador.cl/api/${moneda}`);
  const data = await res.json();

  const ultimos10 = data.serie.slice(0, 10);

  const labels = ultimos10.map(item => item.fecha.split("T")[0]);
  const valores = ultimos10.map(item => item.valor);

  const datasets = [
    {
      label: `Historial ${moneda}`,
      borderColor: "blue",
      data: valores
    }
  ];

  return { labels, datasets };
}


// 2. EVENTO DEL BOTÓN

const boton = document.getElementById("btnConvertir");
let chart;

boton.addEventListener("click", async function () {

  const monto = document.getElementById("inputCLP").value;
  const moneda = document.getElementById("selectMoneda").value;

  const mensaje = document.getElementById("mensajeResultado");
  const valorFinal = document.getElementById("valorFinal");

  
  if (!monto || monto <= 0) {
    mensaje.textContent = "Ingresa un monto válido";
    mensaje.classList.remove("oculto");
    return;
  }

  try {
    const data = await getMonedas();

    let valorMoneda = 0;

    if (moneda === "dolar") {
      valorMoneda = data.dolar.valor;
    } else if (moneda === "euro") {
      valorMoneda = data.euro.valor;
    }

    const resultado = monto / valorMoneda;

    valorFinal.textContent = resultado.toFixed(2);
    mensaje.classList.remove("oculto");

    
    renderGrafica(moneda);

  } catch (error) {
    mensaje.textContent = "Error al obtener los datos.";
    mensaje.classList.remove("oculto");
    console.log(error);
  }
});


// 3. FUNCIÓN DEL GRÁFICO

async function renderGrafica(moneda) {
  const data = await getDataToChart(moneda);

  const config = {
    type: "line",
    data: {
      labels: data.labels,
      datasets: data.datasets
    }
  };

  const ctx = document.getElementById("myChart");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, config);
}