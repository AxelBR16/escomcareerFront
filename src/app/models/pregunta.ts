import { SafeUrl } from "@angular/platform-browser";

export interface Pregunta{
    id?: string;
    texto?: string;
    imagen_url?: SafeUrl | string;
}
