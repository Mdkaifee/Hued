#!/bin/bash
# ✅ Automatically patch Android-autolinking.cmake to ignore missing JNI folders
CMAKE_FILE="android/app/build/generated/autolinking/src/main/jni/Android-autolinking.cmake"

if [ ! -f "$CMAKE_FILE" ]; then
  echo "⚠️  $CMAKE_FILE not found. Run 'npx react-native codegen' first."
  exit 0
fi

echo "🔧 Patching $CMAKE_FILE ..."

# Wrap every add_subdirectory line with if(EXISTS ...) guard
# macOS sed syntax:
sed -i '' 's|^add_subdirectory(\(.*\))$|if(EXISTS \1)\n  add_subdirectory(\1)\nendif()|g' "$CMAKE_FILE"

echo "✅ Patch complete — safe CMake file ready."
