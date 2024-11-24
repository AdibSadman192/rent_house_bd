# File Analysis and Diagnostic Script
param(
    [Parameter(Mandatory=$true)]
    [string]$Path,
    
    [Parameter(Mandatory=$false)]
    [string]$SearchPattern = "*.*",
    
    [Parameter(Mandatory=$false)]
    [string]$TextSearch = ""
)

# Initialize results object
$results = @{
    Path = $Path
    SearchPattern = $SearchPattern
    TotalFiles = 0
    AccessibleFiles = 0
    InaccessibleFiles = 0
    FileDetails = @()
    StartTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    EndTime = ""
}

# Create log file
$logFile = Join-Path $Path "file-analysis.log"
$resultsFile = Join-Path $Path "file-analysis-results.json"

function Write-AnalysisLog {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Out-File -Append -FilePath $logFile
    Write-Host $Message
}

Write-AnalysisLog "Starting file analysis..."
Write-AnalysisLog "Path: $Path"
Write-AnalysisLog "Search Pattern: $SearchPattern"
if ($TextSearch) {
    Write-AnalysisLog "Text Search: $TextSearch"
}

try {
    # Get all files matching pattern
    $files = Get-ChildItem -Path $Path -Filter $SearchPattern -Recurse -File -ErrorAction SilentlyContinue
    $results.TotalFiles = $files.Count
    
    foreach ($file in $files) {
        $fileDetail = @{
            Path = $file.FullName
            Name = $file.Name
            Size = $file.Length
            LastModified = $file.LastWriteTime
            AccessCheck = @{
                Success = $true
                Error = ""
            }
            Encoding = "Unknown"
            SearchResults = @{
                Success = $true
                Error = ""
                Matches = @()
            }
        }

        # Check file access
        try {
            $content = Get-Content $file.FullName -Raw -ErrorAction Stop
            $results.AccessibleFiles++
            
            # Try to detect encoding
            $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
            if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
                $fileDetail.Encoding = "UTF-8 with BOM"
            }
            elseif ($bytes.Length -ge 2 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFE) {
                $fileDetail.Encoding = "UTF-16 LE"
            }
            elseif ($bytes.Length -ge 2 -and $bytes[0] -eq 0xFE -and $bytes[1] -eq 0xFF) {
                $fileDetail.Encoding = "UTF-16 BE"
            }
            else {
                $fileDetail.Encoding = "UTF-8"
            }

            # Perform text search if specified
            if ($TextSearch) {
                try {
                    $matches = Select-String -Path $file.FullName -Pattern $TextSearch -AllMatches
                    $fileDetail.SearchResults.Matches = @($matches | ForEach-Object {
                        @{
                            LineNumber = $_.LineNumber
                            Line = $_.Line.Trim()
                            Match = $_.Matches[0].Value
                        }
                    })
                }
                catch {
                    $fileDetail.SearchResults.Success = $false
                    $fileDetail.SearchResults.Error = $_.Exception.Message
                }
            }
        }
        catch {
            $results.InaccessibleFiles++
            $fileDetail.AccessCheck.Success = $false
            $fileDetail.AccessCheck.Error = $_.Exception.Message
        }

        $results.FileDetails += $fileDetail
        Write-AnalysisLog "Processed: $($file.Name)"
    }
}
catch {
    Write-AnalysisLog "Error during file analysis: $_"
    throw
}
finally {
    $results.EndTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $results | ConvertTo-Json -Depth 10 | Out-File $resultsFile
    Write-AnalysisLog "Analysis complete. Results written to: $resultsFile"
}
