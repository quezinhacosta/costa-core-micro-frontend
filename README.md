<div align="center">

# costa-core-mfe

**Core Microfrontend, Design System Atômico & Módulos de Engenharia em Tema Claro**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![tsup](https://img.shields.io/badge/Bundled_with-tsup-000000?style=flat-square)](https://tsup.egoist.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

<p align="center">
  Biblioteca autoral de microcomponentes, contratos de API e especificação visual inspirada no rigor técnico da <b>Vercel (Geist UI)</b> e na expressividade micro-interativa do <b>Aceternity UI</b>.
</p>

</div>

---

## 🎯 Sobre o Projeto

O **`costa-core-mfe`** foi projetado para servir como a espinha dorsal de infraestrutura de front-end para o ecossistema de aplicações de **Quezia Costa**. Ele encapsula a identidade visual autoral em tema claro, elimina redundância de código e expõe componentes atômicos, utilitários de comunicação com backends (FastAPI) e hooks tipados.

### Principais Pilares
- **🎨 Tema Claro Integrado:** Paleta baseada em superfícies *off-white* (`#F8F9FA`), cards limpos (`#FFFFFF`) e acentos de alto contraste em **Azul Tech (`#2563EB`)** e **Rosa Criativo (`#EC4899`)**.
- **🧱 Design System Atômico:** Botões com física de estados, contêineres Bento com inclinação 3D (*tilt*), badges pulsantes e micro-interações em *Framer Motion*.
- **⚡ Conectores de Negócio Encapsulados:** Client HTTP desacoplado para integração com serviços Python/FastAPI e hook nativo para feed público do GitHub em tempo real.
- **🛡️ Resiliência & Isolamento:** Suporte a *Error Boundaries* dedicados para impedir que falhas no microfrontend afetem o container hospedeiro (*Host/Shell*).
- **📦 Empacotamento Moderno:** Compilação ultrarrápida via `tsup` (`esbuild`) emitindo distribuições em **ESM**, **CommonJS** e declarações de tipos estritas (`.d.ts`).

---

## 🎨 Design Tokens & Especificação Visual

O sistema utiliza variáveis estritas integradas ao Tailwind CSS para garantir uniformidade em todas as telas:
