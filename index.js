const express = require('express');
const app = express();
const port = 3000;

// Captura qualquer rota que comece com /login
app.get(/^\/login/, (req, res) => {
  const queryParams = req.originalUrl.split('?')[1];
  const cognitoBaseUrl = 'https://us-east-1tdcs53wtg.auth.us-east-1.amazoncognito.com/login';

  if (!queryParams) {
    return res.status(400).send('❌ Parâmetros de consulta ausentes.');
  }

  const redirectUrl = `${cognitoBaseUrl}?lang=pt-BR&${queryParams}`;

  console.log('🔁 Redirecionando para Cognito com URL completa:');
  console.log(redirectUrl);

  res.redirect(302, redirectUrl);
});

// app.listen(port, () => {
//   console.log(`✅ Proxy ouvindo em http://localhost:${port}`);
// });

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Proxy rodando em 0.0.0.0:${port}`);
});