$path = "c:\Users\ANDRESAN\Desktop\control notas\icon.png"
if (Test-Path $path) {
    $bytes = [IO.File]::ReadAllBytes($path)
    $b64 = [Convert]::ToBase64String($bytes)
    $b64 | Out-File -FilePath "c:\Users\ANDRESAN\Desktop\Evaluandonos\b64_control.txt" -Encoding ascii
    Write-Output "Success"
} else {
    Write-Output "File not found at $path"
}
