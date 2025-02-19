document.addEventListener('DOMContentLoaded', function() {
    // Ensure powerbi is available
    if (!window['powerbi-client']) {
        console.error('Power BI client library not loaded');
        return;
    }

    const reportContainer = document.getElementById('report-container');
    const models = window['powerbi-client'].models;

    // Initialize container
    powerbi.bootstrap(reportContainer, { type: "report" });


    fetch('/api/powerbi/embedToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: "0100072994",
            datasetIds: ["a6b6e23d-d51b-48d6-a61c-0ebb22d08082"],
            roles: ["MDG_Number"]
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(embedData => {
        console.log('Embed data received:', embedData);

        // Create the embed configuration
        const embedConfig = {
            type: 'report',
            tokenType: models.TokenType.Embed,
            accessToken: embedData.accessToken,
            embedUrl: embedData.embedUrl[0].embedUrl,
            id: embedData.embedUrl[0].reportId,
            // permissions: models.Permissions.All,
            settings: {
                background: models.BackgroundType.Transparent,
                filterPaneEnabled: true,
                navContentPaneEnabled: true
            }
        };

        // Embed the report
        const report = powerbi.embed(reportContainer, embedConfig);

        // Handle events
        report.on('loaded', function() {
            console.log('Report loaded successfully');
        });

        report.on('rendered', function() {
            console.log('Report rendered successfully');
        });

        report.on('error', function(event) {
            console.error('Error loading report:', event.detail);
            showError(event.detail.message || 'Error loading report');
        });
    })
    .catch(error => {
        console.error('Error:', error);
        showError(error.message);
    });
});

function showError(message) {
    const errorContainer = document.querySelector('.error-container');
    const reportContainer = document.getElementById('report-container');
    
    reportContainer.innerHTML = '';
    errorContainer.innerHTML = `
        <div class="alert alert-danger mt-3">
            <strong>Error:</strong> ${message}
        </div>
    `;
}