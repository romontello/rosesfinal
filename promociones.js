function calcularPromocion() {
  let precio = parseFloat(document.getElementById("producto").value);
  let cantidad = parseInt(document.getElementById("cantidad").value);
  let promo = document.getElementById("promocion").value;

  let totalSinDescuento = precio * cantidad;
  let descuento = 0;

  if (promo === "50segundo" && cantidad >= 2) {
    descuento = precio * 0.5;
  } else if (promo === "3x2" && cantidad >= 3) {
    descuento = precio;
  } else if (promo === "10porciento" && totalSinDescuento > 30000) {
    descuento = totalSinDescuento * 0.10;
  } else {
    descuento = 0;
  }

  let totalFinal = totalSinDescuento - descuento;

  document.getElementById("resultados").innerHTML =
    "<p>Total sin descuento: $" + totalSinDescuento + "</p>" +
    "<p>Descuento aplicado: $" + descuento + "</p>" +
    "<p><strong>Total final: $" + totalFinal + "</strong></p>";
}
