const express = require('express');
const app = express();
const port = 3000;

app.get('/login', (req, res) => {
  const { client_id, redirect_uri, state } = req.query;

  if (!client_id || !redirect_uri || !state) {
    return res.status(400).send('Parâmetros obrigatórios ausentes.');
  }

  const cognitoBase = 'https://us-east-1tdcs53wtg.auth.us-east-1.amazoncognito.com';
  const finalUrl = `${cognitoBase}/login?lang=pt-BR&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_mode=query&response_type=code&scope=openid+profile+email&state=${state}`;

  res.redirect(finalUrl);
});

app.listen(port, () => {
  console.log(`Servidor proxy rodando em http://localhost:${port}`);
});
