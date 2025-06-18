require("dotenv").config();
const express = require("express");
const axios = require("axios");
const BpmnModdle = require("bpmn-moddle");

const app = express();
const PORT = process.env.PORT || 4000;

// URL to fetch the BPMN diagram in XML format
const BPMN_XML_ENDPOINT =
  process.env.XML_ENDPOINT || "https://n35nug.csb.app/process.bpmn";

// Endpoint to find a path between two BPMN node IDs
app.get("/path", async (req, res) => {
  const { from: startNodeId, to: endNodeId } = req.query;

  if (!startNodeId || !endNodeId) {
    return res.status(400).json({
      error: "Please provide both 'from' and 'to' node IDs as query parameters",
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

    // Error Handling for elements not found in BP
    if (!processDefinition || !processDefinition.flowElements) {
      return res
        .status(500)
        .json({ error: "Could not find process elements in BPMN" });
    }

    // Create a map of all elements by their ID
    const flowNodeMap = {};
    processDefinition.flowElements.forEach((node) => {
      flowNodeMap[node.id] = node;
    });

    // Search to find a path from start to end
    const visited = new Set();
    const path = [];

    // Find the path
    const pathExists = findPathFrom(startNodeId);

    // Checking if the path exists
    if (pathExists) {
      return res.json({ from: startNodeId, to: endNodeId, path });
    } else {
      return res
        .status(404)
        .json({ from: startNodeId, to: endNodeId, error: "No path found" });
    }
  } catch (error) {
    console.error("Error during BPMN processing:", error.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
