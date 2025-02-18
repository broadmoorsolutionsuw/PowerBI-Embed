const models = window["powerbi-client"].models;
const reportContainer = $("#report-container").get(0);

// Initialize iframe for embedding report first
powerbi.bootstrap(reportContainer, { type: "report" });

// Then make the API call
$.ajax({
  type: "POST",
  url: "/api/powerbi/embedToken",
  dataType: "json",
  contentType: "application/json",
  data: JSON.stringify({
    username: "0100072994",
    datasetIds: ["a6b6e23d-d51b-48d6-a61c-0ebb22d08082"],
    roles: ["MDG_Number"]
  }),
  success: function (embedData) {
    // Create the embed configuration
    const reportLoadConfig = {
      type: "report",
      tokenType: models.TokenType.Embed,
      accessToken: embedData.accessToken,
      embedUrl: embedData.embedUrl[0].embedUrl,
      settings: {
        background: models.BackgroundType.Transparent,
      }
    };

    // Store token expiry
    tokenExpiry = embedData.expiry;

    // Embed the report
    const report = powerbi.embed(reportContainer, reportLoadConfig);

    // Clear and set event handlers
    report.off("loaded");
    report.on("loaded", function () {
      console.log("Report load successful");
    });

    report.off("rendered");
    report.on("rendered", function () {
      console.log("Report render successful");
    });

    report.off("error");
    report.on("error", function (event) {
      console.error("Error:", event.detail);
    });
  },
  error: function (err) {
    // Show error container
    const errorContainer = $(".error-container");
    $(".embed-container").hide();
    errorContainer.show();

    // Parse error message
    const errMsg = JSON.parse(err.responseText)['error'];
    const errorLines = errMsg.split("\r\n");

    // Create error header
    const errHeader = document.createElement("p");
    const strong = document.createElement("strong");
    const node = document.createTextNode("Error Details:");

    // Get error container
    const errContainer = errorContainer.get(0);

    // Add error header
    strong.appendChild(node);
    errHeader.appendChild(strong);
    errContainer.appendChild(errHeader);

    // Add error lines
    errorLines.forEach(element => {
      const errorContent = document.createElement("p");
      const node = document.createTextNode(element);
      errorContent.appendChild(node);
      errContainer.appendChild(errorContent);
    });
  }
});
