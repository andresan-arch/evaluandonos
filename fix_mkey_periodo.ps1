$filePath = "g:\Otros ordenadores\Asus\Desktop\Evaluandonos\index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
$fixCount = 0

function ApplyFix($old, $new, $desc) {
    $cnt = ([regex]::Matches($script:content, [regex]::Escape($old))).Count
    if ($cnt -eq 0) {
        Write-Host "[WARN] No encontrado: $desc"
    } else {
        $script:content = $script:content.Replace($old, $new)
        $script:fixCount += $cnt
        Write-Host "[OK] ($cnt) $desc"
    }
}

# Replacement template for gNum
function MkNewGnum($indent) {
    $i = $indent
    return "${i}const esE1 = parseInt(currentPeriodo) === 1;`r`n${i}let mKey;`r`n${i}if (gNum <= 4)       mKey = '3-4';`r`n${i}else if (gNum === 5)  mKey = '5';`r`n${i}else if (gNum >= 10) mKey = esE1 ? '10-11-E1' : '10-11-E2E3';`r`n${i}else                 mKey = esE1 ? '6-9-E1'   : '6-9-E2E3';"
}

# Replacement template for gBase
function MkNewGbase($indent) {
    $i = $indent
    return "${i}const esE1 = parseInt(currentPeriodo) === 1;`r`n${i}let mKey;`r`n${i}if (gBase <= 4)       mKey = '3-4';`r`n${i}else if (gBase === 5)  mKey = '5';`r`n${i}else if (gBase >= 10) mKey = esE1 ? '10-11-E1' : '10-11-E2E3';`r`n${i}else                  mKey = esE1 ? '6-9-E1'   : '6-9-E2E3';"
}

$i14 = "              "   # 14 spaces
$i12 = "            "     # 12 spaces
$i16 = "                " # 16 spaces

Write-Host "=== Corrigiendo MATRIZ_RANGOS sensible al periodo (9 lugares) ==="

# FIX 1: L8279-8283 - Boletin individual - gNum multi-line - const config - 14sp
ApplyFix `
    "${i14}let mKey = '6-9';`r`n${i14}if (gNum <= 4) mKey = '3-4';`r`n${i14}else if (gNum === 5) mKey = '5';`r`n${i14}else if (gNum >= 10) mKey = '10-11';`r`n${i14}const config = MATRIZ_RANGOS[mKey];" `
    "$(MkNewGnum $i14)`r`n${i14}const config = MATRIZ_RANGOS[mKey];" `
    "L8279 Boletin individual (gNum multi-line const config 14sp)"

# FIX 2: L8697-8699 - Informe grupal - gNum single-line - let config - 14sp
ApplyFix `
    "${i14}let mKey = '6-9';`r`n${i14}if (gNum <= 4) mKey = '3-4'; else if (gNum === 5) mKey = '5'; else if (gNum >= 10) mKey = '10-11';`r`n${i14}let config = MATRIZ_RANGOS[mKey];" `
    "$(MkNewGnum $i14)`r`n${i14}let config = MATRIZ_RANGOS[mKey];" `
    "L8697 Informe grupal (gNum single-line let config 14sp)"

# FIX 3: L8908-8910 - cargarMaterias - gNum single-line - const configFull - 12sp
ApplyFix `
    "${i12}let mKey = '6-9';`r`n${i12}if (gNum <= 4) mKey = '3-4'; else if (gNum === 5) mKey = '5'; else if (gNum >= 10) mKey = '10-11';`r`n${i12}const configFull = MATRIZ_RANGOS[mKey];" `
    "$(MkNewGnum $i12)`r`n${i12}const configFull = MATRIZ_RANGOS[mKey];" `
    "L8908 cargarMateriasInformeAsignatura (gNum single-line const configFull 12sp)"

# FIX 4: L8948-8950 - generarInforme - gNum single-line - const configFull - 14sp
ApplyFix `
    "${i14}let mKey = '6-9';`r`n${i14}if (gNum <= 4) mKey = '3-4'; else if (gNum === 5) mKey = '5'; else if (gNum >= 10) mKey = '10-11';`r`n${i14}const configFull = MATRIZ_RANGOS[mKey];" `
    "$(MkNewGnum $i14)`r`n${i14}const configFull = MATRIZ_RANGOS[mKey];" `
    "L8948 generarInformeAsignatura (gNum single-line const configFull 14sp)"

# FIX 5: L9206-9210 - imprimirTodoElGrado - gNum multi-line - const config - 14sp
# NOTE: This pattern is identical to FIX1 except no trailing lines differ - 
# must check if FIX1 consumed it already. FIX1 included "const config" so they differ at end.
# Actually FIX1 already matched - this would be the same pattern but consumed by FIX1!
# Let's check: FIX1 target ends with "const config = MATRIZ_RANGOS[mKey];"
# FIX5 target also ends with "const config = MATRIZ_RANGOS[mKey];"
# Both are 14sp + gNum + multi-line + const config
# After FIX1 runs, this pattern may already be gone from L8279 area.
# We need to check if L9206 still needs fixing (it's a different location but same text).
# Since Replace() replaces ALL occurrences, FIX1 already fixed BOTH L8279 and L9206!
# Skipping FIX5 to avoid double replacement.
Write-Host "[SKIP] L9206 - already handled by FIX1 (same pattern, Replace is global)"

# FIX 6: L9385-9389 - imprimirTodaLaSede - gNum multi-line - const config - 16sp
ApplyFix `
    "${i16}let mKey = '6-9';`r`n${i16}if (gNum <= 4) mKey = '3-4';`r`n${i16}else if (gNum === 5) mKey = '5';`r`n${i16}else if (gNum >= 10) mKey = '10-11';`r`n${i16}const config = MATRIZ_RANGOS[mKey];" `
    "$(MkNewGnum $i16)`r`n${i16}const config = MATRIZ_RANGOS[mKey];" `
    "L9385 imprimirTodaLaSede (gNum multi-line const config 16sp)"

# FIX 7: L9733-9735 - actualizarGraficoAsignaturas - gNum single-line - const config - 12sp
ApplyFix `
    "${i12}let mKey = '6-9';`r`n${i12}if (gNum <= 4) mKey = '3-4'; else if (gNum === 5) mKey = '5'; else if (gNum >= 10) mKey = '10-11';`r`n${i12}const config = MATRIZ_RANGOS[mKey];" `
    "$(MkNewGnum $i12)`r`n${i12}const config = MATRIZ_RANGOS[mKey];" `
    "L9733 actualizarGraficoAsignaturas (gNum single-line const config 12sp)"

# FIX 8+9: L9809-9811 y L9897-9899 - gBase single-line - const config - 12sp (identicas)
ApplyFix `
    "${i12}let mKey = '6-9';`r`n${i12}if (gBase <= 4) mKey = '3-4'; else if (gBase === 5) mKey = '5'; else if (gBase >= 10) mKey = '10-11';`r`n${i12}const config = MATRIZ_RANGOS[mKey];" `
    "$(MkNewGbase $i12)`r`n${i12}const config = MATRIZ_RANGOS[mKey];" `
    "L9809+L9897 actualizarGraficoNivel + actualizarGraficoComparativo (gBase 12sp)"

Write-Host ""
Write-Host "=== Total bloques corregidos: $fixCount ==="

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "=== Archivo guardado ==="
