# 📦 API Node.js com Express e Sequelize

## 📌 Descrição

API REST desenvolvida com foco em **boas práticas de arquitetura backend**, incluindo:

* Estrutura modular (controllers, models, utils)
* Validação de dados robusta
* Upload de arquivos com organização por data
* Autenticação com JWT
* Filtros dinâmicos e paginação
* Documentação com Swagger

---

## 🚀 Tecnologias utilizadas

* **Node.js**
* **Express**
* **Sequelize**
* **PostgreSQL**
* **JWT (jsonwebtoken)**
* **bcrypt**
* **multer**
* **Yup**
* **Nodemon**
* **ESLint**

---

## 📁 Estrutura do projeto

```bash
src/
 ├── app/
 │   ├── controllers/
 │   ├── models/
 │   ├── middleware/
 │   ├── utils/
 │   │   ├── parsers/
 │   │   ├── sequelize/
 │   │   └── files/
 │   └── validators/
 │
 ├── config/
 │   ├── auth.js
 │   └── multer.js
 │
 ├── database/
 │   └── migrations/
 │
 ├── routes.js
 └── server.js

tmp/
 └── uploads/
     └── YYYY/MM/
```

---

## ⚙️ Configuração inicial

```bash
yarn install
```

---

## ▶️ Rodando o projeto

```bash
yarn dev
```

---

## 🗄️ Banco de dados

### Rodar migrations

```bash
yarn dev:create
```

### Desfazer migrations

```bash
yarn dev:delete
```

### Reset completo

```bash
yarn dev:reset
```

---

## 🔐 Autenticação

A API utiliza **JWT**.

### Login

```http
POST /sessions
```

#### Body:

```json
{
  "name": "admin",
  "password": "12345678"
}
```

#### Response:

```json
{
  "user": {
    "id": 1,
    "name": "admin",
    "status": true
  },
  "token": "JWT_TOKEN"
}
```

---

## 👤 Usuários

### Funcionalidades:

* Listagem com filtros
* Paginação
* Ordenação
* Includes dinâmicos:

  * `permissions`
  * `file`

### Exemplo:

```http
GET /users?name=joao&status=true&includelist=permissions,file&page=1&limit=10
```

---

## 🔐 Permissões

CRUD completo:

```http
GET    /permissions-users
GET    /permissions-users/:id
POST   /permissions-users
PUT    /permissions-users/:id
DELETE /permissions-users/:id
```

---

## 📁 Upload de arquivos

### Upload

```http
POST /files
Content-Type: multipart/form-data
```

Campo:

```
file: binary
```

---

### Estrutura de armazenamento

Arquivos são organizados automaticamente:

```bash
tmp/uploads/2026/04/arquivo.png
```

---

### Funcionalidades:

* Upload com nome único (hash)
* Organização por ano/mês
* Registro no banco
* Deleção segura (banco → arquivo físico)

---

## 🧠 Filtros disponíveis

Padrão aplicado em vários endpoints:

* `name`
* `status`
* `createdBefore`
* `createdAfter`
* `updatedBefore`
* `updatedAfter`
* `sort=campo:ASC|DESC`
* `page`
* `limit`

---

## 🛠️ Utils criadas

* `ParseBoolean` → converte string em boolean
* `ParseDateRange` → monta filtros de data (Sequelize)
* `BuildIncludes` → includes dinâmicos
* `deleteFile` → remoção segura de arquivos

---

## 🔒 Segurança

* Senhas com **bcrypt**
* Autenticação com **JWT**
* Preparado para proteção contra brute force
* Validação com **Yup**

---

## 📄 Documentação

Swagger disponível para todos os endpoints:

* Users
* PermissionsUsers
* Files
* Auth

---

## ⚠️ Observações importantes

* `file_id` é opcional (`nullable`)
* Ao deletar arquivo:

  * Remove do banco
  * Remove do disco
  * Ignora erro caso arquivo já não exista

---

## 📌 Padrões adotados

* Controllers enxutos
* Reutilização via utils
* Separação de responsabilidades
* Respostas padronizadas
* Código preparado para escala

---

## 🚀 Próximos passos (sugestões)

* Rate limit (anti brute force)
* Refresh token
* Upload para S3
* Cache com Redis
* Logs estruturados (Winston/Pino)

---

## 👨‍💻 Autor

Projeto desenvolvido para estudo e evolução em backend Node.js.
