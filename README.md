# Attachments and Notifications App

Запуск из консоли:

```bash
npm install
npm start
```

Приложение поднимает HTTP сервер на `http://localhost:3000`, раздаёт фронтенд и API.

Функциональность:

- CRUD статей в памяти.
- Загрузка вложений к статьям. Разрешены только JPG, PNG, PDF.
- Вложения хранятся в `backend/uploads` и доступны по `/uploads/<filename>`.
- Уведомления в реальном времени через WebSockets (socket.io):
  - создание, обновление, удаление статьи;
  - добавление вложения.
- Фронтенд:
  - форма создания статьи;
  - список статей;
  - превью изображений и ссылки на PDF в блоке Attachments;
  - кнопка Attach для загрузки файла к статье;
  - тосты для уведомлений и ошибок.

Основные файлы:

- `backend/server.js` — запуск HTTP и WebSocket серверов.
- `backend/app.js` — конфигурация Express, статика, маршруты и обработчик ошибок.
- `backend/routes/articles.js` — маршруты для статей и вложений.
- `backend/controllers/articlesController.js` — логика CRUD и работы с вложениями.
- `backend/services/notifications.js` — отправка уведомлений по WebSocket.
- `frontend/index.html` — UI.
- `frontend/script.js` — логика работы на стороне клиента.
