import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'details/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve([])
  },
  {
    path: 'update/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve([])
  },
  {
    path: 'delete/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve([])
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
