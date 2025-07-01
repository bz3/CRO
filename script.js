document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('leadForm');
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      web: form.web.value,
      telefono: form.telefono.value,
      mensaje: form.mensaje.value
    };
    try {
      const res = await fetch('http://localhost:3001/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        form.classList.add('hidden');
        success.classList.remove('hidden');
      } else {
        alert('Error al enviar el formulario. Intenta de nuevo.');
      }
    } catch (err) {
      alert('Error de conexión con el servidor.');
    }
  });
}); 