Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\swaya\.gemini\antigravity\brain\5491690e-3e08-4b1a-8d76-34aa3fd4d297\ganesha_hero_sanctuary_4k_clean_1793804258594.jpg"
$destPath1 = "customer-frontend\public\images\ganesha-hero-sanctuary-desktop.jpg"
$destPath2 = "customer-frontend\public\images\ganesha-hero-sanctuary-desktop-clean-4k.jpg"

$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$targetWidth = 3840
$targetHeight = [int][Math]::Round($targetWidth * ($srcBmp.Height / $srcBmp.Width))

Write-Host "Upscaling clean artwork from $($srcBmp.Width)x$($srcBmp.Height) to $($targetWidth)x$($targetHeight)..."

$destBmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$destBmp.SetResolution(300, 300)

$graphics = [System.Drawing.Graphics]::FromImage($destBmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$rect = New-Object System.Drawing.Rectangle(0, 0, $targetWidth, $targetHeight)
$graphics.DrawImage($srcBmp, $rect, 0, 0, $srcBmp.Width, $srcBmp.Height, [System.Drawing.GraphicsUnit]::Pixel)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]98)

$destBmp.Save($destPath1, $codec, $encoderParams)
$destBmp.Save($destPath2, $codec, $encoderParams)

$graphics.Dispose()
$destBmp.Dispose()
$srcBmp.Dispose()

Write-Host "4K Clean Upscale Completed Successfully!"

