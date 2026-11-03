- no hagas absolutamente nada mas alla de lo que te pido explicitamente.

- siempre KISS, prohibido sobreingenieria y soluciones rebuscadas.

- mantente pegado a la plataforma, nunca jamas recomiendes paquetes externos para ninguna solucion.

- si tienes una duda, por mas minima que sea, me la consultas. no des absolutamente nada por sentado.

- deja constantemente comentarios cortos y explicativos SI O SI en absolutamente todos los archivos.

- usa absolutamente siempre async/await, nunca sintaxis *.then(...)

- skills "vercel-react-best-practices": solo React generico. prohibido next/dynamic, after() de next/server, SWR, better-all, el modelo de Server Actions de Next ni cualquier otra feature que dependa de directa o indirectamente de NextJS. Usa siempre alternativas de TanStack Start y/o TanStack Router.

- un solo componente de react por cada archivo *.tsx, solo puede habitar con funciones que no sean de JSX.

- en la carpeta /src/routes solo pueden ir archivos o carpetas especificas de enrutamiento de TanStack Start. Helpers, utils, funciones genericas y todo lo que no utilice nada del router debe ir fuera de /src/routes pero dentro de /src/... en donde corresponda segun su objetivo.
