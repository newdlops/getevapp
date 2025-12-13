#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
  cat <<'EOF'
Usage:
  ./build-android-apk.sh [OUT_DIR] [release|debug]

Options:
  -o, --out DIR        Output directory (default: ./build/apk)
  -v, --variant NAME   Build variant: release|debug (default: release)
  --clean              Run Gradle clean before build
  --force-bundling     For debug builds, force JS bundle generation (uses FORCE_BUNDLING env)
  -h, --help           Show this help

Notes:
  - For a Metro-independent APK, prefer the release build.
EOF
}

OUT_DIR=""
VARIANT=""
DO_CLEAN=0
FORCE_BUNDLING=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    -o|--out|--output)
      OUT_DIR="${2:-}"; shift 2 ;;
    -v|--variant)
      VARIANT="${2:-}"; shift 2 ;;
    --clean)
      DO_CLEAN=1; shift ;;
    --force-bundling)
      FORCE_BUNDLING=1; shift ;;
    -h|--help)
      usage; exit 0 ;;
    -*)
      echo "Unknown option: $1" >&2
      usage
      exit 1 ;;
    *)
      if [[ -z "$OUT_DIR" && "$1" != "debug" && "$1" != "release" ]]; then
        OUT_DIR="$1"; shift; continue
      fi
      if [[ -z "$VARIANT" && ( "$1" == "debug" || "$1" == "release" ) ]]; then
        VARIANT="$1"; shift; continue
      fi
      echo "Unknown argument: $1" >&2
      usage
      exit 1 ;;
  esac
done

if [[ -z "$VARIANT" ]]; then
  VARIANT="release"
fi

if [[ -z "$OUT_DIR" ]]; then
  OUT_DIR="$ROOT_DIR/build/apk"
fi

case "$OUT_DIR" in
  "~"|"~/"*)
    OUT_DIR="${OUT_DIR/#\~/$HOME}" ;;
esac

if [[ "$OUT_DIR" != /* ]]; then
  OUT_DIR="$ROOT_DIR/$OUT_DIR"
fi

ANDROID_DIR="$ROOT_DIR/android"
GRADLEW="$ANDROID_DIR/gradlew"

if [[ ! -x "$GRADLEW" ]]; then
  echo "gradlew not found or not executable: $GRADLEW" >&2
  exit 1
fi

TASK=""
APK_SEARCH_DIR=""
case "$VARIANT" in
  release)
    TASK=":app:assembleRelease"
    APK_SEARCH_DIR="$ROOT_DIR/android/app/build/outputs/apk/release"
    ;;
  debug)
    TASK=":app:assembleDebug"
    APK_SEARCH_DIR="$ROOT_DIR/android/app/build/outputs/apk/debug"
    ;;
  *)
    echo "Invalid variant: $VARIANT (expected: release|debug)" >&2
    exit 1
    ;;
esac

mkdir -p "$OUT_DIR"

pushd "$ANDROID_DIR" >/dev/null
if [[ "$DO_CLEAN" -eq 1 ]]; then
  ./gradlew clean
fi

if [[ "$VARIANT" == "debug" && "$FORCE_BUNDLING" -eq 1 ]]; then
  FORCE_BUNDLING=1 ./gradlew "$TASK"
else
  ./gradlew "$TASK"
fi
popd >/dev/null

timestamp="$(date '+%Y%m%d-%H%M%S')"
gitsha="nogit"
if command -v git >/dev/null 2>&1 && git -C "$ROOT_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  gitsha="$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || echo nogit)"
fi

copied=0
if [[ -d "$APK_SEARCH_DIR" ]]; then
  while IFS= read -r -d '' apk; do
    base="$(basename "$apk")"
    out="$OUT_DIR/$(basename "$ROOT_DIR")-${VARIANT}-${timestamp}-${gitsha}-${base}"
    cp -f "$apk" "$out"
    echo "Copied: $out"
    copied=$((copied + 1))
  done < <(find "$APK_SEARCH_DIR" -maxdepth 1 -type f -name "*.apk" -print0)
fi

if [[ "$copied" -eq 0 ]]; then
  echo "Build finished, but no APK found in: $APK_SEARCH_DIR" >&2
  echo "Searched task: $TASK" >&2
  exit 1
fi

echo "Done. Output dir: $OUT_DIR"
