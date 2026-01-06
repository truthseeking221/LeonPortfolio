#!/bin/bash
# Daily Smoke Test for DOPE Staging Environment
# Run: ./scripts/smoke-staging.sh
# See: docs/test/TEST_00_DAILY_SMOKE.md

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
WEB_BASE="${WEB_BASE:-https://staging.dope.example}"
API_BASE="${API_BASE:-https://api-staging.dope.example}"

echo "╔════════════════════════════════════════╗"
echo "║     DOPE Staging Smoke Test            ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "WEB_BASE: $WEB_BASE"
echo "API_BASE: $API_BASE"
echo ""

FAILED=0

# Test 1: Frontend reachable
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1) Frontend reachable..."
if curl -sSf -o /dev/null "$WEB_BASE" 2>/dev/null; then
    echo -e "   ${GREEN}✓ OK${NC}"
else
    echo -e "   ${RED}✗ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 2: API Health
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2) API Health..."
if HEALTH=$(curl -sSf "$API_BASE/v1/health" 2>/dev/null); then
    echo -e "   ${GREEN}✓ OK${NC}"
    echo "   $HEALTH" | head -c 200
    echo ""
else
    echo -e "   ${RED}✗ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 3: API Config
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3) API Config..."
if CONFIG=$(curl -sSf "$API_BASE/v1/config" 2>/dev/null); then
    echo -e "   ${GREEN}✓ OK${NC}"
    echo "   $CONFIG" | head -c 200
    echo ""
else
    echo -e "   ${RED}✗ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 4: WebSocket (optional, requires wscat)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4) WebSocket connectivity..."
if command -v wscat &> /dev/null; then
    if timeout 5 wscat -c "$API_BASE/v1/stream" --execute 'exit' 2>/dev/null; then
        echo -e "   ${GREEN}✓ OK${NC}"
    else
        echo -e "   ${YELLOW}⚠ Could not connect (may be OK if WS not deployed)${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠ SKIPPED (wscat not installed)${NC}"
fi

# Summary
echo ""
echo "╔════════════════════════════════════════╗"
echo "║     SUMMARY                            ║"
echo "╚════════════════════════════════════════╝"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}$FAILED test(s) failed${NC}"
    exit 1
fi

