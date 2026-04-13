# Design System: AI Engineer Portfolio 3D

## Typography

**Primary Font:** Inter
- Used for body text, paragraphs, and general UI elements.
- Weights: Light (300), Regular (400), Medium (500), Semi-bold (600)

**Headline Font:** Space Grotesk
- Used for main headings, section titles, and strong typographic statements.
- Weights: Light (300), Regular (400), Medium (500), Semi-bold (600), Bold (700)

## Theming & Colors

The application supports a 3-way theme system managed via CSS variables and Data Attributes (`data-theme`).

### CSS Variables
- `--bg-primary`: Main background color of the application.
- `--bg-secondary`: Secondary, slightly elevated / contrasting background color (often for cards or nested areas).
- `--accent-primary`: The main accent color used for highlights, borders, and neon glow effects.
- `--text-main`: The primary text color for maximum readability on the respective background.
- `--text-muted`: Diminished text color for subtitles or less important info.

### Color Themes

1. **Default (Deep Space Dark)**
   - `data-theme="default"`
   - `--bg-primary`: `#121212`
   - `--bg-secondary`: `#1E1E1E`
   - `--accent-primary`: `#00FFCC` (Neon Cyan/Green blend, inspired by original #f3ffca)
   - `--text-main`: `#F3F4F6` (Gray 100)
   - `--text-muted`: `#9CA3AF` (Gray 400)

2. **Digital Lavender**
   - `data-theme="lavender"`
   - `--bg-primary`: `#A78BFA` (Digital Lavender)
   - `--bg-secondary`: `#8B5CF6` (Darker Lavender / Violet)
   - `--accent-primary`: `#4C1D95` (Deep Purple)
   - `--text-main`: `#FFFFFF`
   - `--text-muted`: `#EDE9FE`

3. **Terracotta**
   - `data-theme="terracotta"`
   - `--bg-primary`: `#E2725B` (Terracotta)
   - `--bg-secondary`: `#CB5A44` (Darker Terracotta)
   - `--accent-primary`: `#4A8F8F` (Muted Teal)
   - `--text-main`: `#FFF1F0`
   - `--text-muted`: `#FFD9D4`

## Spacing & Layout

- **Container Constraints:** Max-width of `80rem` (1280px) for standard sections, centered layout.
- **Section Padding:** Generous top and bottom paddings per section (e.g., `py-32` / 8rem).
- **Flex/Grid Gaps:** Gap values range extensively depending on component scale (e.g. `gap-24`, `gap-16`, `gap-8`, `gap-4`).
- **Rounded Corners:** Pill-shapes (`rounded-full`) for pills/buttons, soft medium radii (`rounded-2xl`, `rounded-3xl`) for cards and elevated components.
- **Borders:** Thin translucent borders `border-white/5` or `border-white/10` to define dark mode elements without stark contrast.

## Interactive States

- Hovering on interactable points generally introduces:
  - Text color transitions to the `--accent-primary`.
  - Filter dropshadow drop-shadows emitting the accent color (Neon Glow).
  - Subtle `scale(1.05)` transformations.
