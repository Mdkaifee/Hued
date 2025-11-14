/**
 * fixAutolinkingCMake.js
 * Removes invalid add_subdirectory entries from Android-autolinking.cmake
 * so Gradle builds (debug & release) no longer fail.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const cmakePath = path.resolve(
  projectRoot,
  'app',
  'build',
  'generated',
  'autolinking',
  'src',
  'main',
  'jni',
  'Android-autolinking.cmake'
);

if (!fs.existsSync(cmakePath)) {
  console.log(
    'ℹ️  Android-autolinking.cmake not found yet – skipping fix (will be generated later).'
  );
  process.exit(0);
}

const repoRoot = path.resolve(projectRoot, '..');
const libraryDirMap = {
  react_codegen_rngesturehandler_codegen: path.join(
    repoRoot,
    'node_modules',
    'react-native-gesture-handler',
    'android',
    'build',
    'generated',
    'source',
    'codegen',
    'jni'
  ),
  react_codegen_rnreanimated: path.join(
    repoRoot,
    'node_modules',
    'react-native-reanimated',
    'android',
    'build',
    'generated',
    'source',
    'codegen',
    'jni'
  ),
  react_codegen_safeareacontext: path.join(
    repoRoot,
    'node_modules',
    'react-native-safe-area-context',
    'android',
    'src',
    'main',
    'jni'
  ),
  react_codegen_rnscreens: path.join(
    repoRoot,
    'node_modules',
    'react-native-screens',
    'android',
    'src',
    'main',
    'jni'
  ),
  react_codegen_rnsvg: path.join(
    repoRoot,
    'node_modules',
    'react-native-svg',
    'android',
    'src',
    'main',
    'jni'
  ),
  react_codegen_RNWorkletsSpec: path.join(
    repoRoot,
    'node_modules',
    'react-native-worklets-core',
    'android',
    'build',
    'generated',
    'source',
    'codegen',
    'jni'
  ),
};

const lines = fs.readFileSync(cmakePath, 'utf8').split('\n');
const rewritten = [];
const collectedLibraries = new Set();
let librariesOrder = [];
let insideLibraries = false;

for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  const nextTrimmed = lines[i + 1] ? lines[i + 1].trim() : '';
  const next2Trimmed = lines[i + 2] ? lines[i + 2].trim() : '';

  if (trimmed.startsWith('set(AUTOLINKED_LIBRARIES')) {
    insideLibraries = true;
    librariesOrder = [];
    continue;
  }

  if (insideLibraries) {
    if (trimmed === ')') {
      insideLibraries = false;
      // Rebuild the AUTOLINKED_LIBRARIES block with guards.
      rewritten.push('set(AUTOLINKED_LIBRARIES)');
      rewritten.push('');
      for (const lib of librariesOrder) {
        const absolute = libraryDirMap[lib];
        if (absolute) {
          rewritten.push(`if(EXISTS "${absolute}")`);
          rewritten.push(`  list(APPEND AUTOLINKED_LIBRARIES ${lib})`);
          rewritten.push('endif()');
        } else {
          rewritten.push(`list(APPEND AUTOLINKED_LIBRARIES ${lib})`);
        }
      }
      rewritten.push('');
      continue;
    }

    if (trimmed.length > 0) {
      const libName = trimmed.split(/\s+/)[0];
      if (!collectedLibraries.has(libName)) {
        collectedLibraries.add(libName);
        librariesOrder.push(libName);
      }
    }
    continue;
  }

  const matchAdd = trimmed.match(/^add_subdirectory\("([^"]+)"\s*(.*)\)$/);

  if (trimmed.startsWith('if(EXISTS') && nextTrimmed.startsWith('add_subdirectory(') && next2Trimmed === 'endif()') {
    // Normalize existing guard blocks.
    const innerMatch = nextTrimmed.match(/^add_subdirectory\("([^"]+)"\s*(.*)\)$/);
    if (innerMatch) {
      const dirPath = innerMatch[1];
      const rest = innerMatch[2].trim();
      rewritten.push(`if(EXISTS "${dirPath}")`);
      rewritten.push(`  add_subdirectory("${dirPath}"${rest ? ' ' + rest : ''})`);
      rewritten.push('endif()');
      i += 2;
      continue;
    }
  }

  if (matchAdd) {
    const dirPath = matchAdd[1];
    const rest = matchAdd[2].trim();
    rewritten.push(`if(EXISTS "${dirPath}")`);
    rewritten.push(`  add_subdirectory("${dirPath}"${rest ? ' ' + rest : ''})`);
    rewritten.push('endif()');
    continue;
  }

  rewritten.push(lines[i]);
}

fs.writeFileSync(cmakePath, rewritten.join('\n'));
console.log('✅ Android-autolinking.cmake guarded successfully!');
