Name "ShellControl"
OutFile "ShellControl-setup.exe"

InstallDir "$PROGRAMFILES\ShellControl"

!include "MUI2.nsh"

!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "Install" SEC01
  SetOutPath "$INSTDIR"
  File /r ".\dist\*.*"
  CreateShortcut "$SMPROGRAMS\ShellControl\ShellControl.lnk" "$INSTDIR\shellcontrol.exe"
SectionEnd

Section "Uninstall"
  Delete "$SMPROGRAMS\ShellControl\ShellControl.lnk"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ShellControl"
SectionEnd

Section -Post
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ShellControl" \
              "DisplayName" "ShellControl"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd
