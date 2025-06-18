# Camunda BPMN Path Finder (Node.js)

This Node.js app allows you to traverse a BPMN diagram by treating it as a directed graph and finding a possible path between two node IDs. It uses the official `bpmn-moddle` library to parse the BPMN XML and exposes a minimal Express server with a single GET endpoint.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MischaGithub/camunda-node-challenge
cd bpmn-path-finder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```bash
cp .env
```

Edit `.env` and add your BPMN XML endpoint:

```env
XML_ENDPOINT="your xml api endpoint here"
```

---

## ▶️ Running the App

```bash
node index.js
```

The server will start at:

```
http://localhost:8000
```

---

## 🔍 Usage

Make a GET request to `/path` with `from` and `to` query parameters.

Example:

```bash
curl "http://localhost:8000/path?from=approveInvoice&to=invoiceProcessed"
```

Sample response:

```json
{
  "from": "approveInvoice",
  "to": "invoiceProcessed",
  "path": [
    "approveInvoice",
    "invoice_approved",
    "prepareBankTransfer",
    "ServiceTask_1",
    "invoiceProcessed"
  ]
}
```

---
