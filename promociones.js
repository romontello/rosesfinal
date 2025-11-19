// Bloquea números negativos automáticamente
function validarPositivo(input) {
  if (input.value < 1) {
    input.value = "";
  }
}

function calcularPromocion() {
  let precio = parseFloat(document.getElementById("producto").value);
  let cantidad = parseInt(document.getElementById("cantidad").value);
  let promo = document.getElementById("promocion").value;

  // Si faltan datos → no calcular
  if (!precio || !cantidad || precio < 1 || cantidad < 1) {
    document.getElementById("resultados").innerHTML =
      "<p>Total sin descuento: —</p>" +
      "<p>Descuento aplicado: —</p>" +
      "<p><strong>Total final: —</strong></p>";
    return;
  }

  let totalSinDescuento = precio * cantidad;
  let descuento = 0;

  if (promo === "50segundo" && cantidad >= 2) {
    descuento = precio * 0.5;

  } else if (promo === "3x2" && cantidad >= 3) {
    descuento = precio;

  } else if (promo === "10porciento" && totalSinDescuento > 30000) {
    descuento = totalSinDescuento * 0.10;
  }

  let totalFinal = totalSinDescuento - descuento;

  document.getElementById("resultados").innerHTML =
    "<p>Total sin descuento: $" + totalSinDescuento + "</p>" +
    "<p>Descuento aplicado: $" + descuento + "</p>" +
    "<p><strong>Total final: $" + totalFinal + "</strong></p>";
}
