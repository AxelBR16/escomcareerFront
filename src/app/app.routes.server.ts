import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
  ,
  {
    path: ':tipo/preguntas/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'instrucciones/:tipo',
    renderMode: RenderMode.Client
  },
  {
    path: 'carreras/:id',
    renderMode: RenderMode.Client
  },


];
