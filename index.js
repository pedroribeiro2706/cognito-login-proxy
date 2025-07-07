const express = require('express');
const app = express();

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

// 3. inicia o servidor corretamente
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Proxy ouvindo em http://0.0.0.0:${port}`);
});
