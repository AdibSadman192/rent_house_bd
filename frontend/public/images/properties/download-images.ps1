$imageUrls = @(
    # Apartment in Gulshan
    "https://images.unsplash.com/photo-1580041065738-e72023775cdc",
    # Modern apartment building in Dhaka
    "https://images.unsplash.com/photo-1613977257363-707ba9348227",
    # Residential area in Dhaka
    "https://images.unsplash.com/photo-1629371997433-d11e6161a8b3",
    # Modern apartment interior
    "https://images.unsplash.com/photo-1615529182904-14819c35db37",
    # Luxury apartment building
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c"
)

$destinationPath = "c:/Users/Admin/Desktop/P/rent_house_bd/frontend/public/images/properties"

for ($i = 0; $i -lt $imageUrls.Count; $i++) {
    $url = $imageUrls[$i]
    $fileName = "property$($i + 1).jpg"
    $destination = Join-Path $destinationPath $fileName
    
    Write-Host "Downloading $fileName..."
    Invoke-WebRequest -Uri $url -OutFile $destination
    Write-Host "Downloaded $fileName"
}
