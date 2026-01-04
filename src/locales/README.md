# Translation Usage Guide

## How to use translations in components

1. Import the hook:
```tsx
import { useTranslation } from "../hooks/useTranslation";
```

2. Use in component:
```tsx
const { t } = useTranslation();
```

3. Replace hardcoded text with translation keys:
```tsx
// Before
<h1>Customers</h1>

// After
<h1>{t("customers.title")}</h1>
```

## Interpolation

For dynamic values, use interpolation:

```tsx
t("customers.deleteConfirm", { name: customer.fullName })
t("dashboard.welcome", { username: user?.username })
```

## Available Translation Keys

See `en.json` and `srb.json` for all available keys.
