import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = await Promise.resolve(locale);

  let finalLocale = resolvedLocale;

  if (!finalLocale || !hasLocale(['pt', 'en'], finalLocale)) {
    finalLocale = 'pt';
  }

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default
  };
});