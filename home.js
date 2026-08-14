 const blobs = document.querySelectorAll('.blob');

blobs.forEach((blob, index) => {
  let x = 0;
  let y = 0;

  setInterval(() => {
    x += (Math.random() - 0.5) * 20;
    y += (Math.random() - 0.5) * 20;

    blob.style.transform = `translate(${x}px, ${y}px)`;
  }, 2000 + index * 500);
});

document.querySelector('.contato-form').addEventListener('submit', function(e) {
  e.preventDefault();

  alert('Mensagem enviada com sucesso! 🌸');
});