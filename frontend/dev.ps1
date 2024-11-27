# Install dependencies if needed
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
}

# Run the development server
Write-Host "Starting development server..."
npm run dev
