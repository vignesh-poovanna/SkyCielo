$srcRoot = "C:\Users\vigne\Downloads\SkyCielo"
$dstDir  = "$srcRoot\public\frames"

New-Item -ItemType Directory -Force -Path "$srcRoot\public" | Out-Null
New-Item -ItemType Directory -Force -Path $dstDir | Out-Null

# Copy logo to public
Copy-Item -Path "$srcRoot\logo.png" -Destination "$srcRoot\public\logo.png" -Force
Write-Host "Logo copied."

$scenes = @("fireplace-hall","hall-hallway","hallway-house")
$total  = 240
$take   = 80

for ($i = 0; $i -lt 3; $i++) {
    $scene = $scenes[$i]
    $sNum  = $i + 1
    Write-Host "Sampling scene $sNum ($scene)..."
    for ($f = 0; $f -lt $take; $f++) {
        $srcIdx = [int][Math]::Round(($f / ($take - 1)) * ($total - 1)) + 1
        $srcFile = "$srcRoot\$scene\ezgif-frame-$($srcIdx.ToString('000')).png"
        $dstFile = "$dstDir\s${sNum}_$($($f + 1).ToString('000')).png"
        if (Test-Path $srcFile) {
            Copy-Item -Path $srcFile -Destination $dstFile -Force
        } else {
            Write-Warning "Missing: $srcFile"
        }
    }
    Write-Host "  Scene $sNum done (80 frames)."
}

Write-Host "All frames sampled successfully!"
