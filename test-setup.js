// Test script to verify the application works
const path = require("path");\n\nconsole.log("=== Checking Application Setup ===\\n");\n\ntry {
    const packageJson = require("./package.json");
    console.log("✓ package.json found");
    console.log("✓ pdfkit version:", packageJson.dependencies.pdfkit);
} catch (err) {
    console.error("✗ Error loading package.json:", err.message);
}\n\ntry {
    const models = require("./src/models");
    console.log("✓ Models loaded successfully");
    console.log("✓ Available models:", Object.keys(models));
} catch (err) {
    console.error("✗ Error loading models:", err.message);
}\n\ntry {
    const pdfService = require("./src/services/pdfService");
    console.log("✓ PDF Service loaded");
    console.log("✓ PDF Service exports:", Object.keys(pdfService));
} catch (err) {
    console.error("✗ Error loading PDF service:", err.message);
}\n\ntry {
    const articleController = require("./src/controllers/articleController");
    console.log("✓ Article Controller loaded");
    console.log("✓ Has exportPdf method:", typeof articleController.exportPdf === 'function');
} catch (err) {
    console.error("✗ Error loading article controller:", err.message);
}\n\nconsole.log("\\n=== Setup Check Complete ===");
