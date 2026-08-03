#!/bin/bash
# version.sh — semantic version helpers for the release pipeline.
#
# OpenPay uses SemVer: vMAJOR.MINOR.PATCH
#   major:  v1.x.x → v2.x.x  (breaking, schema/API/deployment changes)
#   minor:  v1.1.x → v1.2.x  (new features, additive)
#   patch:  v1.1.x → v1.1.y  (bug/security fixes)
#
# Usage:
#   version.sh validate <tag>                  exit 0 iff exact vMAJOR.MINOR.PATCH
#   version.sh bump <tag> <major|minor|patch>  prints the next version
#   version.sh compare <a> <b>                 exit 0 iff a > b (a,b may be bare or v-prefixed)
#   version.sh sort [-r] <file|->              print tags sorted semver-wise
#   version.sh diff <a> <b>                    prints: major|minor|patch|same
set -euo pipefail

normalize() { echo "$1" | sed 's/^v//'; }

read_parts() {
  local v
  v="$(normalize "$1")"
  case "$v" in
    [0-9]*.[0-9]*.[0-9]*) ;;
    *) return 1 ;;
  esac
  IFS=. read -r MAJOR MINOR PATCH <<< "$v"
}

case "${1:-}" in
  validate)
    read_parts "$2" 2>/dev/null || { echo "invalid: $2 (expected vMAJOR.MINOR.PATCH)" >&2; exit 1; }
    echo "ok: $2"
    ;;
  bump)
    read_parts "$2" || { echo "invalid version: $2" >&2; exit 1; }
    case "${3:-}" in
      major) echo "v$((MAJOR + 1)).0.0" ;;
      minor) echo "v$MAJOR.$((MINOR + 1)).0" ;;
      patch) echo "v$MAJOR.$MINOR.$((PATCH + 1))" ;;
      *) echo "usage: version.sh bump <tag> <major|minor|patch>" >&2; exit 1 ;;
    esac
    ;;
  compare)
    read_parts "$2" || exit 1
    a_maj=$MAJOR; a_min=$MINOR; a_pat=$PATCH
    read_parts "$3" || exit 1
    if [ "$a_maj" -gt "$MAJOR" ]; then exit 0; fi
    if [ "$a_maj" -lt "$MAJOR" ]; then exit 1; fi
    if [ "$a_min" -gt "$MINOR" ]; then exit 0; fi
    if [ "$a_min" -lt "$MINOR" ]; then exit 1; fi
    [ "$a_pat" -gt "$PATCH" ] && exit 0 || exit 1
    ;;
  sort)
    local src="${2:--}" rev="${3:-}"
    if [ "$src" = "-" ]; then
      while IFS= read -r l; do echo "$l"; done
    else
      cat "$src"
    fi | sed -E 's/^v?([0-9]+)\.([0-9]+)\.([0-9]+)$/\1 \2 \3 &/' \
      | sort -k1,1n -k2,2n -k3,3n $([ "$rev" = "-r" ] && echo "-r") \
      | awk '{print $NF}'
    ;;
  diff)
    read_parts "$2" || exit 1
    a_maj=$MAJOR; a_min=$MINOR; a_pat=$PATCH
    read_parts "$3" || exit 1
    if [ "$a_maj" -ne "$MAJOR" ]; then echo major; exit 0; fi
    if [ "$a_min" -ne "$MINOR" ]; then echo minor; exit 0; fi
    if [ "$a_pat" -ne "$PATCH" ]; then echo patch; exit 0; fi
    echo same
    ;;
  *) echo "usage: version.sh <validate|bump|compare|sort|diff> ..." >&2; exit 1 ;;
esac
