@echo off
setlocal enabledelayedexpansion

set "report_base=%WORKSPACE%\lighthouse-reports"
set "target_base=%WORKSPACE%\htmlreports"

if not exist "%target_base%" (
    mkdir "%target_base%"
)

for /D %%d in ("%report_base%\*") do (
    set "report_dir=%%d"
    set "report_name=%%~nxd"
    if exist "!report_dir!\lighthouse-report.html" (
        echo Publishing report for !report_name!
        if not exist "%target_base%\!report_name!" (
            mkdir "%target_base%\!report_name!"
        )
        copy "!report_dir!\lighthouse-report.html" "%target_base%\!report_name!\"
    )
)
