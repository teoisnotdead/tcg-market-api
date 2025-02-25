# API - TCG Marketplace

---

## **Endpoints**

### **1. Autenticación**

#### **Registro de Usuario**
- **URL**: `/auth/register`
- **Método**: `POST`
- **Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- **Respuesta**:
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "token": "string"
}
```

---

#### **Inicio de Sesión**
- **URL**: `/auth/login`
- **Método**: `POST`
- **Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Respuesta**:
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "token": "string"
}
```

---

### **2. Gestión de Cartas**

#### **Obtener Todas las Cartas**
- **URL**: `/cards`
- **Método**: `GET`
- **Respuesta**:
```json
[
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "price": "decimal",
    "image_url": "string",
    "owner": {
      "id": "uuid",
      "name": "string"
    }
  }
]
```

---

#### **Crear una Carta**
- **URL**: `/cards`
- **Método**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "name": "string",
  "description": "string",
  "price": "decimal",
  "image_url": "string"
}
```
- **Respuesta**:
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "price": "decimal",
  "image_url": "string",
  "owner": {
    "id": "uuid",
    "name": "string"
  }
}
```

---

#### **Obtener Detalle de una Carta**
- **URL**: `/cards/{id}`
- **Método**: `GET`
- **Respuesta**:
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "price": "decimal",
  "image_url": "string",
  "owner": {
    "id": "uuid",
    "name": "string"
  },
  "comments": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "name": "string"
      },
      "content": "string",
      "created_at": "timestamp"
    }
  ]
}
```

---

#### **Eliminar una Carta**
- **URL**: `/cards/{id}`
- **Método**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta**:
```json
{
  "message": "Card deleted successfully"
}
```

---

### **3. Gestión de Comentarios**

#### **Crear un Comentario**
- **URL**: `/comments`
- **Método**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "card_id": "uuid",
  "content": "string"
}
```
- **Respuesta**:
```json
{
  "id": "uuid",
  "card_id": "uuid",
  "user": {
    "id": "uuid",
    "name": "string"
  },
  "content": "string",
  "created_at": "timestamp"
}
```

---

### **4. Gestión de Pedidos**
