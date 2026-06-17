@echo off
:: Configurar codificación para caracteres especiales en español
chcp 65001 > nul

echo ======================================================
echo          ACTUALIZACIÓN Y SUBIDA A GITHUB - MATCH PRO
echo ======================================================
echo.

:: Verificar si git está instalado
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git no está instalado o no se encuentra en el PATH.
    echo Por favor, instala Git y vuelve a intentarlo.
    pause
    exit /b
)

:: Agregar todos los cambios locales al área de preparación
echo Detectando y preparando cambios locales...
git add -A

:: Verificar si hay cambios locales para comprometer
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo [INFO] No hay cambios locales nuevos para subir.
    echo Actualizando tu proyecto local con lo que hay en GitHub...
    echo.
    git pull
    if %errorlevel% equ 0 (
        echo.
        echo ======================================================
        echo  [✓] Tu proyecto local se ha actualizado con éxito.
        echo ======================================================
    ) else (
        echo.
        echo ======================================================
        echo  [X] Ocurrió un error al descargar cambios de GitHub.
        echo ======================================================
    )
    echo.
    pause
    exit /b
)

:: Si hay cambios locales, mostrar estado resumido
echo.
echo Cambios locales detectados para subir:
git status -s
echo.

:: Solicitar mensaje de commit al usuario
set "commit_msg="
set /p commit_msg="Introduce el mensaje de los cambios (presiona ENTER para 'Actualización automática'): "

if "%commit_msg%"=="" (
    :: Generar un mensaje por defecto con fecha y hora si se presiona ENTER
    set commit_msg=Actualización automática - %date% %time%
)

:: Realizar el commit
echo.
echo Confirmando cambios localmente (commit)...
git commit -m "%commit_msg%"

:: Descargar últimos cambios de GitHub para fusionarlos y evitar conflictos
echo.
echo Descargando y fusionando cambios desde GitHub (git pull)...
git pull --no-rebase

if %errorlevel% neq 0 (
    echo.
    echo ======================================================
    echo  [X] Conflicto o error al fusionar con GitHub.
    echo      Es posible que debas resolver conflictos de código
    echo      manualmente antes de poder subir.
    echo ======================================================
    echo.
    pause
    exit /b
)

:: Subir los cambios a GitHub
echo.
echo Subiendo todos tus cambios a GitHub (git push)...
git push

if %errorlevel% equ 0 (
    echo.
    echo ======================================================
    echo  [✓] ¡Todo tu proyecto se ha actualizado en GitHub!
    echo ======================================================
) else (
    echo.
    echo ======================================================
    echo  [X] Ocurrió un error al subir los cambios a GitHub.
    echo      Verifica tu conexión a internet o credenciales.
    echo ======================================================
)

echo.
pause
