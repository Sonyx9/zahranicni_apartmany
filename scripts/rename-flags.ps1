# Přejmenuje vlajky v public/images/flags/ na vlajka-{slug}.webp
# Spusťte z kořene projektu: .\scripts\rename-flags.ps1

$flagsDir = Join-Path $PSScriptRoot "..\public\images\flags"
if (-not (Test-Path $flagsDir)) {
    Write-Error "Složka $flagsDir neexistuje."
    exit 1
}

# Mapování: část názvu souboru (bez diakritiky, malá písmena) -> slug pro cílový soubor
$map = @{
    "albanie"    = "albanie"
    "alban"      = "albanie"
    "bulharsko"  = "bulharsko"
    "bulhar"     = "bulharsko"
    "cyprus"     = "cyprus"
    "kypr"       = "cyprus"
    "chorvatsko" = "chorvatsko"
    "chorvat"    = "chorvatsko"
    "italie"     = "italie"
    "ital"       = "italie"
    "spanelsko"  = "spanelsko"
    "spanel"     = "spanelsko"
    "recko"      = "recko"
    "reck"       = "recko"
    "cerna"      = "cerna-hora"
    "cernahora"  = "cerna-hora"
    "montenegro" = "cerna-hora"
    "thajsko"    = "thajsko"
    "thaj"       = "thajsko"
    "turecko"    = "turecko"
    "tureck"     = "turecko"
    "kapverdy"   = "kapverdy"
    "kapverd"    = "kapverdy"
    "egypt"      = "egypt"
}

# Normalizace: odstranit diakritiku pro porovnání
function Normalize($s) {
    $s = $s.ToLowerInvariant()
    $s = $s -replace '[áàäâã]','a' -replace '[éèëê]','e' -replace '[íìïî]','i' -replace '[óòöôõ]','o' -replace '[úùüû]','u' -replace '[ýÿ]','y' -replace 'č','c' -replace 'ř','r' -replace 'š','s' -replace 'ž','z' -replace 'ě','e' -replace 'ň','n' -replace 'ď','d' -replace 'ť','t'
    $s -replace '[^a-z0-9]',''
}

$renamed = 0
Get-ChildItem $flagsDir -File | Where-Object { $_.Name -notmatch '^vlajka-[a-z-]+\.webp$' -and $_.Name -ne 'README.md' -and $_.Name -ne '.gitkeep' } | ForEach-Object {
    $file = $_
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $ext = $file.Extension
    $norm = Normalize $baseName

    $targetSlug = $null
    foreach ($key in $map.Keys) {
        if ($norm -like "*$key*") {
            $targetSlug = $map[$key]
            break
        }
    }
    if (-not $targetSlug) {
        Write-Host "Preskakuji (neznamy stat): $($file.Name)"
        return
    }

    # Cílový formát: vlajka-{slug}.webp (příponu zachováme ze zdroje)
    $targetName = "vlajka-$targetSlug$ext"
    $targetPath = Join-Path $flagsDir $targetName

    if ($file.Name -eq $targetName) {
        return
    }
    if (Test-Path $targetPath) {
        Write-Host "Cil jiz existuje, preskakuji: $($file.Name) -> $targetName"
        return
    }

    Rename-Item -LiteralPath $file.FullName -NewName $targetName -Force
    Write-Host "Prejmenovano: $($file.Name) -> $targetName"
    $renamed++
}

Write-Host "Hotovo. Prejmenovano souboru: $renamed"
