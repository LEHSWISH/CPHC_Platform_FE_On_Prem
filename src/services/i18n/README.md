# How to use translations

-   Add your translation key value pairs in their respective files on path `src/assests/locale/{languageKey}` for example see below

```
{
    "home": {
        "welcomeMessage": "Hi how are you today"
    }
}
```

-   In your react component use the hook `useTranslation()` or component `Trans` as in example below

```
import { Trans, useTranslation } from 'react-i18next';

function App() {
    const { t } = useTranslation();

    return <div>
        {t('home.welcomeMessage')}
    </div>

}
```

-   For more information refer to [react-i18next](https://react.i18next.com/) documentation
