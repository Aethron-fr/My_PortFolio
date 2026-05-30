export function generateKeepsakeHTML(decision) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const decisionText = decision === 'keep' 
    ? 'You chose to keep this story alive.'
    : 'You chose to let it fade away.';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OneLastSmile - Memory Capsule</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #020002;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            padding: 40px;
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%);
            text-align: center;
        }
        .date {
            font-family: monospace;
            font-size: 0.75rem;
            letter-spacing: 2px;
            color: rgba(255,255,255,0.3);
            text-transform: uppercase;
            margin-bottom: 40px;
        }
        .message {
            font-size: 1.2rem;
            font-weight: 300;
            line-height: 1.8;
            color: rgba(255,255,255,0.8);
            margin-bottom: 30px;
        }
        .decision {
            font-size: 1rem;
            color: rgba(0, 247, 255, 0.7);
            font-style: italic;
            margin-bottom: 60px;
        }
        .closing {
            font-family: monospace;
            font-size: 0.75rem;
            letter-spacing: 4px;
            color: rgba(255,255,255,0.2);
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="date">${date}</div>
        
        <div class="message">
            Every line. Every animation. Every decision.<br>
            Was built for a memory that no longer exists in the present.<br><br>
            Thank you for holding onto it for a little while.
        </div>
        
        <div class="decision">${decisionText}</div>
        
        <div class="closing">You reached the end.</div>
    </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `OneLastSmile_Memory_${date.replace(/[\s,:]/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
