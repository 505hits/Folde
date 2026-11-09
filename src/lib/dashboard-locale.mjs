const supported=new Set(['en','fr','es']);
export function dashboardLocale(routeLocale, details={}) {
 if(routeLocale && routeLocale!=='en' && supported.has(routeLocale))return routeLocale;
 const stored=details.dashboardLocale || details.locale;
 return supported.has(stored)?stored:'en';
}
