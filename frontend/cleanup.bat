@echo off
echo Cleaning up directory structure...

rem Move any remaining files from src/contexts to contexts
xcopy /y /s "src\contexts\*" "contexts\"

rem Move any remaining files from src/components to components
xcopy /y /s "src\components\*" "components\"

rem Move any remaining files from src/pages to pages
xcopy /y /s "src\pages\*" "pages\"

rem Delete src directory after moving files
rmdir /s /q "src"

echo Cleanup complete!
