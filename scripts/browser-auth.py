#!/usr/bin/env python3
"""Save and restore Cursor embedded-browser cookies per job board.

Cookies live in Chromium's SQLite store (plain `value` column on desktop).
Files: pipeline/browser-auth/<board>.json (gitignored — contains session tokens).

Usage:
  python3 scripts/browser-auth.py save linkedin
  python3 scripts/browser-auth.py save ycombinator
  python3 scripts/browser-auth.py save myboard --host '%indeed%' --verify-url https://www.indeed.com/
  python3 scripts/browser-auth.py restore linkedin
  python3 scripts/browser-auth.py restore all
  python3 scripts/browser-auth.py list
  python3 scripts/browser-auth.py register myboard --host '%example%' --label 'Example' --verify-url https://example.com/
"""

from __future__ import annotations

import argparse
import json
import os
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
AUTH_DIR = REPO_ROOT / "pipeline" / "browser-auth"
REGISTRY_PATH = AUTH_DIR / "boards.json"

BUILTIN_BOARDS: dict[str, dict] = {
    "linkedin": {
        "label": "LinkedIn",
        "host_patterns": ["%linkedin%"],
        "required_cookie": ["li_at", ".www.linkedin.com"],
        "verify_url": "https://www.linkedin.com/feed/",
    },
    "ycombinator": {
        "label": "Y Combinator / Work at a Startup",
        "host_patterns": ["%ycombinator%", "%workatastartup%"],
        "required_cookie": ["_sso.key", ".ycombinator.com"],
        "verify_url": "https://account.ycombinator.com/",
    },
}

COOKIE_COLUMNS = [
    "creation_utc",
    "host_key",
    "top_frame_site_key",
    "name",
    "value",
    "path",
    "expires_utc",
    "is_secure",
    "is_httponly",
    "last_access_utc",
    "has_expires",
    "is_persistent",
    "priority",
    "samesite",
    "source_scheme",
    "source_port",
    "last_update_utc",
    "source_type",
    "has_cross_site_ancestor",
]


def _cookie_paths() -> list[Path]:
    home = Path.home()
    candidates = [
        home / ".config/Cursor/Partitions/cursor-browser/Cookies",
        home / "Library/Application Support/Cursor/Partitions/cursor-browser/Cookies",
    ]
    appdata = os.environ.get("APPDATA")
    if appdata:
        candidates.append(Path(appdata) / "Cursor/Partitions/cursor-browser/Cookies")
    return candidates


def _find_cookies_db() -> Path:
    for path in _cookie_paths():
        if path.exists():
            return path
    tried = "\n  ".join(str(p) for p in _cookie_paths())
    sys.exit(f"Cursor browser cookie store not found. Tried:\n  {tried}")


def _load_boards() -> dict[str, dict]:
    boards = {k: dict(v) for k, v in BUILTIN_BOARDS.items()}
    if REGISTRY_PATH.exists():
        custom = json.loads(REGISTRY_PATH.read_text())
        for board_id, meta in custom.items():
            boards[board_id] = meta
    return boards


def _save_registry(boards: dict[str, dict]) -> None:
    AUTH_DIR.mkdir(parents=True, exist_ok=True)
    custom = {k: v for k, v in boards.items() if k not in BUILTIN_BOARDS}
    REGISTRY_PATH.write_text(json.dumps(custom, indent=2) + "\n")


def _cookies_db(readonly: bool = False) -> sqlite3.Connection:
    path = _find_cookies_db()
    if readonly:
        return sqlite3.connect(f"file:{path}?mode=ro", uri=True)
    return sqlite3.connect(path, timeout=5)


def _fetch_board_cookies(conn: sqlite3.Connection, board: str, boards: dict) -> list[dict]:
    patterns = boards[board]["host_patterns"]
    clauses = " OR ".join("host_key LIKE ?" for _ in patterns)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        f"SELECT {', '.join(COOKIE_COLUMNS)} FROM cookies WHERE {clauses}",
        patterns,
    ).fetchall()
    return [dict(row) for row in rows]


def _has_session(cookies: list[dict], board: str, boards: dict) -> bool:
    req = boards[board].get("required_cookie")
    if req:
        name, host = req[0], req[1]
        if any(c["name"] == name and c["host_key"] == host for c in cookies):
            return True
        if board == "ycombinator" and name == "_sso.key":
            return any(c["name"] == "_sso.key" for c in cookies)
        return False
    return len(cookies) > 0


def cmd_register(board: str, host: str, label: str | None, verify_url: str | None) -> None:
    boards = _load_boards()
    if board in BUILTIN_BOARDS:
        sys.exit(f"{board} is a built-in board; edit BUILTIN_BOARDS in the script if needed.")
    pattern = host if "%" in host else f"%{host}%"
    boards[board] = {
        "label": label or board,
        "host_patterns": [pattern],
        "verify_url": verify_url or f"https://{host.strip('%')}/",
    }
    _save_registry(boards)
    print(f"Registered custom board {board} → {boards[board]}")


def cmd_save(board: str, boards: dict) -> None:
    if board not in boards:
        sys.exit(f"Unknown board {board}. Known: {', '.join(boards)} (or register first)")
    AUTH_DIR.mkdir(parents=True, exist_ok=True)
    conn = _cookies_db(readonly=True)
    cookies = _fetch_board_cookies(conn, board, boards)
    conn.close()

    if not cookies:
        sys.exit(
            f"No cookies found for {boards[board]['label']}. "
            "Log in in the Cursor browser first."
        )

    if not _has_session(cookies, board, boards):
        print(
            f"Warning: no obvious session cookie for {boards[board]['label']}. "
            "Saving anyway — restore may not re-authenticate.",
            file=sys.stderr,
        )

    payload = {
        "board": board,
        "label": boards[board]["label"],
        "saved_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "verify_url": boards[board].get("verify_url", ""),
        "host_patterns": boards[board]["host_patterns"],
        "cookie_count": len(cookies),
        "cookies": cookies,
    }
    out = AUTH_DIR / f"{board}.json"
    out.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"Saved {len(cookies)} cookies → {out}")


def cmd_restore(board: str, boards: dict) -> None:
    path = AUTH_DIR / f"{board}.json"
    if not path.exists():
        sys.exit(f"No saved state: {path}\nRun: python3 scripts/browser-auth.py save {board}")

    payload = json.loads(path.read_text())
    cookies: list[dict] = payload["cookies"]
    patterns = payload.get("host_patterns") or boards.get(board, {}).get("host_patterns")
    if not patterns:
        sys.exit(f"No host patterns for {board}")

    conn = _cookies_db(readonly=False)
    try:
        clauses = " OR ".join("host_key LIKE ?" for _ in patterns)
        deleted = conn.execute(
            f"DELETE FROM cookies WHERE {clauses}",
            patterns,
        ).rowcount
        placeholders = ", ".join("?" for _ in COOKIE_COLUMNS)
        insert_sql = (
            f"INSERT INTO cookies ({', '.join(COOKIE_COLUMNS)}, encrypted_value) "
            f"VALUES ({placeholders}, X'')"
        )
        for c in cookies:
            conn.execute(insert_sql, [c[col] for col in COOKIE_COLUMNS])
        conn.commit()
    finally:
        conn.close()

    label = payload.get("label", board)
    verify = payload.get("verify_url", "")
    print(
        f"Restored {len(cookies)} cookies for {label} "
        f"(removed {deleted} existing). Reload the Cursor browser tab or navigate to {verify}"
    )


def cmd_list(boards: dict) -> None:
    path = _find_cookies_db()
    print(f"Cookie store: {path}\n")
    known = set(boards.keys())
    for f in sorted(AUTH_DIR.glob("*.json")):
        if f.name == "boards.json":
            continue
        known.add(f.stem)
    for board in sorted(known):
        meta = boards.get(board, {"label": board, "host_patterns": []})
        file_path = AUTH_DIR / f"{board}.json"
        live_count = 0
        if meta.get("host_patterns"):
            live = _cookies_db(readonly=True)
            live_count = len(_fetch_board_cookies(live, board, {board: meta}))
            live.close()
        if file_path.exists():
            payload = json.loads(file_path.read_text())
            print(
                f"  {meta.get('label', board)}: file={payload['cookie_count']} cookies "
                f"(saved {payload['saved_at']}), live profile={live_count}"
            )
        else:
            print(f"  {meta.get('label', board)}: no saved file, live profile={live_count}")


def main() -> None:
    boards = _load_boards()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "action",
        choices=["save", "restore", "list", "register"],
        help="save | restore | list | register",
    )
    parser.add_argument("board", nargs="?", help="Board id or 'all' for restore/save")
    parser.add_argument("--host", help="Host pattern for register/save custom (e.g. %%indeed%%)")
    parser.add_argument("--label", help="Display label for register")
    parser.add_argument("--verify-url", help="URL to open after restore")
    args = parser.parse_args()

    if args.action == "list":
        cmd_list(boards)
        return

    if args.action == "register":
        if not args.board or not args.host:
            parser.error("register requires board and --host")
        cmd_register(args.board, args.host, args.label, args.verify_url)
        return

    if not args.board:
        parser.error(f"board required for {args.action}")

    if args.action == "save" and args.host and args.board not in boards:
        cmd_register(args.board, args.host, args.label, args.verify_url)
        boards = _load_boards()

    if args.action == "save":
        if args.board == "all":
            for board in list(boards.keys()):
                try:
                    cmd_save(board, boards)
                except SystemExit as e:
                    print(e, file=sys.stderr)
        else:
            cmd_save(args.board, boards)
    elif args.action == "restore":
        targets = list(boards.keys()) if args.board == "all" else [args.board]
        if args.board == "all":
            targets = [p.stem for p in AUTH_DIR.glob("*.json") if p.name != "boards.json"]
        for board in targets:
            cmd_restore(board, boards)


if __name__ == "__main__":
    main()
