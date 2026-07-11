# Tailwind CSS Style & Architecture Guidelines

This document establishes the definitive structural and mathematical standards for utility class organization within the `@prostha/ui` ecosystem. Adherence to these rules ensures predictable rendering, performance efficiency, and clean scannability.

---

## 1. Utility Class Ordering Pipeline

When composing class strings inside components, utilities must be sorted from left to right flowing from the macro layout properties down to micro interactive states.

```text
[Layout] → [Spacing] → [Sizing] → [Typography] → [Visuals] → [Effects] → [Modifiers & States]