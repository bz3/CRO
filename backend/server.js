require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/leads', async (req, res) => {
  const { nombre, email, web, telefono, mensaje } = req.body;
  if (!nombre || !email || !web) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email y web.' });
  }
  try {
    // Guardar en la base de datos primero
    await db.insertLead({ nombre, email, web, telefono, mensaje });
  } catch (err) {
    console.error('Error al guardar el lead en la base de datos:', err);
    return res.status(500).json({ error: 'Error al guardar el lead en la base de datos.' });
  }
  // Intentar enviar el email después
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'bizente@gmail.com',
      subject: 'Nuevo lead de auditoría CRO',
      text: `Nombre: ${nombre}\nEmail: ${email}\nWeb: ${web}\nTeléfono: ${telefono || ''}\nMensaje: ${mensaje || ''}`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al enviar el email:', err);
    res.status(500).json({ error: 'Lead guardado, pero error al enviar el email: ' + (err.message || 'Error desconocido') });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    const leads = await db.getLeads();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar los leads: ' + (err.message || 'Error desconocido') });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
}); 