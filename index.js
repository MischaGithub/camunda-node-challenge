const express = require("express");
const axios = require("axios");
const BpmnModdle = require("bpmn-moddle");

const app = express();
const PORT = process.env.PORT || 8000;

// URL to fetch the BPMN diagram in XML format
const BPMN_XML_ENDPOINT = process.env.XML_ENDPOINT;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
