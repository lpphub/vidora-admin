# Migrate radix-ui to @radix-ui/react-* Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the `radix-ui` unified package and migrate all UI components to use standard shadcn/ui components with individual `@radix-ui/react-*` dependencies.

**Architecture:** Use shadcn CLI to re-add components, which automatically installs correct `@radix-ui/react-*` packages. Then restore custom styling patterns (rounded-none borders, custom colors) that were present in original components.

**Tech Stack:** React 19, shadcn/ui, @radix-ui/react-* packages, pnpm

---

## Components Affected

| Component | Current Import | Target |
|-----------|---------------|--------|
| avatar | `from 'radix-ui'` | shadcn CLI |
| badge | `from 'radix-ui'` | shadcn CLI |
| breadcrumb | `from 'radix-ui'` | shadcn CLI |
| button | `from 'radix-ui'` | shadcn CLI |
| checkbox | `from 'radix-ui'` | shadcn CLI |
| dialog | `from 'radix-ui'` | shadcn CLI |
| dropdown-menu | `from 'radix-ui'` | shadcn CLI |
| form | `from 'radix-ui'` | shadcn CLI |
| label | `from 'radix-ui'` | shadcn CLI |
| progress | `from 'radix-ui'` | shadcn CLI |
| scroll-area | `from 'radix-ui'` | shadcn CLI |
| select | `from 'radix-ui'` | shadcn CLI |
| separator | `from 'radix-ui'` | shadcn CLI |
| sheet | `from 'radix-ui'` | shadcn CLI |
| switch | `from '@radix-ui/react-switch'` | shadcn CLI |
| tabs | `from '@radix-ui/react-tabs'` | shadcn CLI |

**Components NOT affected:** card, input, textarea, table (no radix dependencies)

---

### Task 1: Remove old radix-ui dependencies

**Files:**
- Modify: `package.json`

**Step 1: Remove radix-ui packages from package.json**

Run:
```bash
pnpm remove radix-ui @radix-ui/react-switch @radix-ui/react-tabs
```

**Step 2: Verify packages removed**

Run:
```bash
grep -E "radix|@radix" package.json
```
Expected: No matches (or only @radix-ui packages added by other shadcn components)

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: remove radix-ui unified package and old @radix-ui/react-* deps"
```

---

### Task 2: Delete UI components using radix-ui

**Files:**
- Delete: `src/components/ui/avatar.tsx`
- Delete: `src/components/ui/badge.tsx`
- Delete: `src/components/ui/breadcrumb.tsx`
- Delete: `src/components/ui/button.tsx`
- Delete: `src/components/ui/checkbox.tsx`
- Delete: `src/components/ui/dialog.tsx`
- Delete: `src/components/ui/dropdown-menu.tsx`
- Delete: `src/components/ui/form.tsx`
- Delete: `src/components/ui/label.tsx`
- Delete: `src/components/ui/progress.tsx`
- Delete: `src/components/ui/scroll-area.tsx`
- Delete: `src/components/ui/select.tsx`
- Delete: `src/components/ui/separator.tsx`
- Delete: `src/components/ui/sheet.tsx`
- Delete: `src/components/ui/switch.tsx`
- Delete: `src/components/ui/tabs.tsx`

**Step 1: Delete all components that use radix-ui**

Run:
```bash
rm -f src/components/ui/avatar.tsx src/components/ui/badge.tsx src/components/ui/breadcrumb.tsx src/components/ui/button.tsx src/components/ui/checkbox.tsx src/components/ui/dialog.tsx src/components/ui/dropdown-menu.tsx src/components/ui/form.tsx src/components/ui/label.tsx src/components/ui/progress.tsx src/components/ui/scroll-area.tsx src/components/ui/select.tsx src/components/ui/separator.tsx src/components/ui/sheet.tsx src/components/ui/switch.tsx src/components/ui/tabs.tsx
```

**Step 2: Verify remaining components**

Run:
```bash
ls src/components/ui/
```
Expected: `card.tsx input.tsx textarea.tsx table.tsx`

**Step 3: Commit**

```bash
git add src/components/ui/
git commit -m "chore: remove UI components for shadcn CLI re-add"
```

---

### Task 3: Re-add components via shadcn CLI

**Files:**
- Create: `src/components/ui/avatar.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/breadcrumb.tsx`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/checkbox.tsx`
- Create: `src/components/ui/dialog.tsx`
- Create: `src/components/ui/dropdown-menu.tsx`
- Create: `src/components/ui/form.tsx`
- Create: `src/components/ui/label.tsx`
- Create: `src/components/ui/progress.tsx`
- Create: `src/components/ui/scroll-area.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/separator.tsx`
- Create: `src/components/ui/sheet.tsx`
- Create: `src/components/ui/switch.tsx`
- Create: `src/components/ui/tabs.tsx`

**Step 1: Run shadcn CLI to add all components**

Run:
```bash
npx shadcn@latest add avatar badge breadcrumb button checkbox dialog dropdown-menu form label progress scroll-area select separator sheet switch tabs --overwrite
```

Note: Answer prompts as needed (likely accept defaults for style/base color).

**Step 2: Verify components created**

Run:
```bash
ls src/components/ui/
```
Expected: All 20 component files present

**Step 3: Verify new imports use @radix-ui/react-***

Run:
```bash
grep -l "@radix-ui" src/components/ui/*.tsx | wc -l
```
Expected: Number of components using radix primitives

**Step 4: Verify no 'radix-ui' imports remain**

Run:
```bash
grep "from 'radix-ui'" src/components/ui/*.tsx
```
Expected: No output (no matches)

**Step 5: Commit**

```bash
git add src/components/ui/ package.json pnpm-lock.yaml
git commit -m "feat: re-add UI components via shadcn CLI with @radix-ui/react-* deps"
```

---

### Task 4: Verify build succeeds

**Step 1: Run TypeScript check**

Run:
```bash
pnpm build
```
Expected: Build succeeds without errors

**Step 2: If build fails, check for import errors**

Run:
```bash
pnpm lint
```
Expected: No lint errors

**Step 3: Commit any fixes**

```bash
git add .
git commit -m "fix: resolve build errors after radix migration"
```

---

### Task 5: Restore custom styles (rounded-none borders)

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/checkbox.tsx`
- Modify: `src/components/ui/select.tsx`
- And other components with custom rounded-none styling

**Step 1: Identify components with custom rounded styling**

Review original styling patterns (rounded-none was common).

**Step 2: Update button.tsx to use rounded-none**

Locate border-radius classes in button component and change to `rounded-none`.

**Step 3: Update checkbox.tsx to use rounded-none**

**Step 4: Update select.tsx to use rounded-none**

**Step 5: Update other components as needed**

**Step 6: Verify visually**

Run:
```bash
pnpm dev
```
Check UI in browser.

**Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "style: restore rounded-none custom styling"
```

---

### Task 6: Final verification

**Step 1: Run full build**

Run:
```bash
pnpm build
```
Expected: Success

**Step 2: Run lint**

Run:
```bash
pnpm lint
```
Expected: No errors

**Step 3: Start dev server and visually verify**

Run:
```bash
pnpm dev
```
Verify components render correctly in browser.

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete radix-ui to @radix-ui/react-* migration"
```

---

## Summary

After completion:
- `radix-ui` unified package removed
- All UI components use standard `@radix-ui/react-*` packages
- Custom styles restored
- Build passes
- Components render correctly