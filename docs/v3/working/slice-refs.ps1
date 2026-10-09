param(
  [string]$InDir = "gui-test-screenshots\v3-research",
  [int]$SliceH = 2000
)
Add-Type -AssemblyName System.Drawing
$targets = @('figma.png','figma-mobile.png','framer.png','framer-mobile.png','webflow.png','webflow-mobile.png','raycast.png','raycast-mobile.png','supabase.png','supabase-mobile.png')
foreach ($t in $targets) {
  $src = Join-Path $InDir $t
  if (-not (Test-Path $src)) { Write-Output "MISSING $t"; continue }
  $img = [System.Drawing.Image]::FromFile((Resolve-Path $src))
  $w = $img.Width; $h = $img.Height
  $n = [math]::Ceiling($h / $SliceH)
  for ($i = 0; $i -lt $n; $i++) {
    $sh = [math]::Min($SliceH, $h - ($i * $SliceH))
    $bmp = New-Object System.Drawing.Bitmap($w, $sh)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $sh)), (New-Object System.Drawing.Rectangle(0, ($i * $SliceH), $w, $sh)), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $out = Join-Path $InDir ($t -replace '\.png$', ("-s{0:d2}.png" -f $i))
    $bmp.Save((Resolve-Path $InDir).Path + "\" + ($t -replace '\.png$', ("-s{0:d2}.png" -f $i)), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output "$t slice $i => ${w}x${sh}"
  }
  $img.Dispose()
}
