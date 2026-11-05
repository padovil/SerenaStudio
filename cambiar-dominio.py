#!/usr/bin/env python3
"""Cambia el dominio del sitio en todos los archivos (canonical, Open Graph, sitemap, robots).

Uso:  python3 cambiar-dominio.py https://serenastudio.co
"""
import pathlib, sys

ACTUAL = "https://serena-studio.vercel.app"

if len(sys.argv) != 2 or not sys.argv[1].startswith("https://"):
    sys.exit("Uso: python3 cambiar-dominio.py https://nuevo-dominio.com")
nuevo = sys.argv[1].rstrip("/")
raiz = pathlib.Path(__file__).parent
cambiados = 0
for p in raiz.rglob("*"):
    if p.suffix not in {".html", ".js", ".xml", ".txt", ".md"} or ".git" in p.parts or p.name == "cambiar-dominio.py":
        continue
    texto = p.read_text(encoding="utf-8")
    if ACTUAL in texto:
        p.write_text(texto.replace(ACTUAL, nuevo), encoding="utf-8")
        cambiados += 1
        print("✓", p.relative_to(raiz))
pathlib.Path(__file__).write_text(
    pathlib.Path(__file__).read_text(encoding="utf-8").replace(f'ACTUAL = "{ACTUAL}"', f'ACTUAL = "{nuevo}"'), encoding="utf-8")
print(f"{cambiados} archivos actualizados a {nuevo}")
