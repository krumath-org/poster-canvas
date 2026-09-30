# Templates

Starter templates ship in `src/data/templates.ts`. Open **Templates** from the toolbar or command palette (`Cmd/Ctrl+P` → Open Templates). Newest entries are listed first.

| Template               | Category    | Size      |
| ---------------------- | ----------- | --------- |
| 3D Product Hero        | 3D          | 1080×1350 |
| Website UI Mockup      | UI          | 1440×900  |
| KaTeX Math Lab         | Education   | (varies)  |
| Phnom Penh Boulevards  | Education   | 1080×1080 |
| Corporate Announcement | Corporate   | 1080×1350 |
| Social Media Post      | Social      | 1080×1080 |
| Business Infographic   | Infographic | 1080×1350 |
| Data Dashboard Poster  | Data        | 1200×1500 |
| Quote Poster           | Minimal     | 1080×1350 |
| Product Promotion      | Commerce    | 1080×1350 |
| Educational Poster     | Education   | 1080×1350 |
| Financial Report       | Data        | 2480×3508 |
| Cambodia Themed        | Featured    | 1080×1350 |

Loading a template replaces the editor buffer. If you have unsaved changes, a confirmation dialog appears.

To add a template, **prepend** it to the top of the `TEMPLATES` array in `src/data/templates.ts` (newest first) with `id`, `name`, `category`, `description`, `width`, `height`, and `code`. Do not append new templates at the end.

## 3D templates

3D posters may import `Canvas3D` from `@poster/core` plus allowlisted R3F packages (`three`, `@react-three/fiber`, `@react-three/drei`, …). The sandbox lazy-loads the Poster3D vendor bundle only when preprocess detects those imports.
