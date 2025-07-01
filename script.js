document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('leadForm');
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Aquí podrías enviar los datos a un backend o servicio externo
    form.classList.add('hidden');
    success.classList.remove('hidden');
  });
}); 