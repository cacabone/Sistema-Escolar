export default {
  testEnvironment: "node",
  verbose: true,
  transform: {},
  moduleFileExtensions: ["js", "json", "node"],
  testRunner: "jest-circus/runner",
  reporters: [
    "default",
    ["jest-html-reporter",
      {
        pageTitle: "Reporte de Pruebas - Sistema Escolar",
        outputPath: "./tests/report/test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
        sort: "status",
        styleOverridePath: "./tests/report/custom-style.css"
      },
    ],
  ],
};

