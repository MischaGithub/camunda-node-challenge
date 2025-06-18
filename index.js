const express = require("express");
const axios = require("axios");
const BpmnModdle = require("bpmn-moddle");

const app = express();
const PORT = process.env.PORT || 8000;

// URL to fetch the BPMN diagram in XML format
const BPMN_XML_ENDPOINT = process.env.XML_ENDPOINT;

// Endpoint to find a path between two BPMN node IDs
app.get("/path", async (req, res) => {
  const { from: startNodeId, to: endNodeId } = req.query;

  if (!startNodeId || !endNodeId) {
    return res.status(400).json({
      error: "Please provide both 'from' and 'to' node IDs as query params",
    });
  }

  try {
    // Fetch the BPMN XML from remote API
    const { data } = await axios.get(BPMN_XML_ENDPOINT);
    const rawXml = data.bpmn20Xml;

    // Parse the XML into a BPMN model
    const moddle = new BpmnModdle();
    const { rootElement: definitions } = await moddle.fromXML(rawXml);

    // Find the main process containing flow elements
    const processDefinition = definitions.rootElements.find(
      (element) => element.$type === "bpmn:Process"
    );
  } catch (error) {
    console.error("Error during BPMN processing:", error.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
